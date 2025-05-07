from fastapi import APIRouter, HTTPException
from app.schemas.trajectory import TrajectoryInput, TrajectoryResponse, TelemetryPoint, OrbitSummary
from typing import List
import numpy as np
import pandas as pd

router = APIRouter()

# Launch site coordinates
LAUNCH_SITES = {
    'Kennedy': (28.5618571, -80.577366),
    'Vandenberg': (34.742, -120.5724),
    'Cape Canaveral': (28.3922, -80.6077)
}

# Orbit preset altitudes (in km)
ORBIT_PRESETS = {
    'LEO': 300,
    'SSO': 600,
    'GEO': 35786,
    'MEO': 20000,
    'Polar': 800
}

@router.post("/trajectory", response_model=TrajectoryResponse)
def simulate_orbital_trajectory(input_data: TrajectoryInput):
    try:
        # --- Constants ---
        G = 6.67430e-11
        M_EARTH = 5.972e24
        R_EARTH = 6371000
        g0 = 9.80665
        EARTH_ROTATION_RATE = 7.2921159e-5

        def geodetic_to_ecef(lat, lon, alt):
            a = 6378137.0
            e = 8.1819190842622e-2
            lat, lon = np.radians(lat), np.radians(lon)
            N = a / np.sqrt(1 - e**2 * np.sin(lat)**2)
            x = (N + alt) * np.cos(lat) * np.cos(lon)
            y = (N + alt) * np.cos(lat) * np.sin(lon)
            z = (N * (1 - e**2) + alt) * np.sin(lat)
            return np.array([x, y, z])

        def ecef_to_geodetic(x, y, z):
            a = 6378137.0
            e = 8.1819190842622e-2
            b = np.sqrt(a**2 * (1 - e**2))
            ep = np.sqrt((a**2 - b**2) / b**2)
            p = np.sqrt(x**2 + y**2)
            th = np.arctan2(a * z, b * p)
            lon = np.arctan2(y, x)
            lat = np.arctan2(z + ep**2 * b * np.sin(th)**3, p - e**2 * a * np.cos(th)**3)
            N = a / np.sqrt(1 - e**2 * np.sin(lat)**2)
            alt = p / np.cos(lat) - N
            return np.degrees(lat), np.degrees(lon), alt

        def air_density(altitude):
            return 1.225 * np.exp(-altitude / 8500.0)

        def gravity_turn_pitch(time, max_time=250):
            if time < max_time:
                angle_deg = 90 - 75 * (0.5 - 0.5 * np.cos(np.pi * time / max_time))
                return np.radians(max(angle_deg, 5))
            return np.radians(5)

        def speed_of_sound(altitude):
            return 340.29 - 0.003 * altitude if altitude < 11000 else 295.0

        def drag_coefficient(mach):
            if mach < 0.8: return 0.3
            elif mach < 1.2: return 0.5
            elif mach < 5: return 0.4
            return 0.2

        def target_orbital_velocity(altitude):
            r = R_EARTH + altitude
            return np.sqrt(G * M_EARTH / r)

        # --- Unpack Input ---
        lat, lon = LAUNCH_SITES[input_data.launch_site]
        position = geodetic_to_ecef(lat, lon, 0)
        earth_vel = EARTH_ROTATION_RATE * R_EARTH * np.cos(np.radians(lat))
        velocity = np.array([-earth_vel * np.sin(np.radians(lon)),
                             earth_vel * np.cos(np.radians(lon)), 0.0])

        alt_km = ORBIT_PRESETS.get(input_data.orbit_type.upper(), 300)
        mass = input_data.payload_mass_kg * 25
        stage1_thrust = 1.3 * mass * g0
        stage2_thrust = 1.0 * mass * g0
        stage1_isp = 282
        stage2_isp = 348
        flow1 = stage1_thrust / (stage1_isp * g0)
        flow2 = stage2_thrust / (stage2_isp * g0)
        burn1 = (mass * 0.75 * 0.92) / flow1
        burn2 = (mass * 0.25 * 0.93) / flow2
        sim_time = burn1 + burn2 + 400
        dt = 0.5

        telemetry = []
        stage_separated = False
        target_velocity = target_orbital_velocity(alt_km * 1000)

        for step in range(int(sim_time / dt)):
            t = step * dt
            altitude = np.linalg.norm(position) - R_EARTH
            rho = air_density(altitude)
            pitch = gravity_turn_pitch(t)

            if t < burn1:
                thrust = stage1_thrust
                flow = flow1
            elif t < burn1 + burn2:
                if not stage_separated:
                    mass *= 0.92
                    stage_separated = True
                thrust = stage2_thrust
                flow = flow2
            else:
                thrust = flow = 0

            up = position / np.linalg.norm(position)
            east = np.cross([0, 0, 1], up)
            east /= np.linalg.norm(east)
            thrust_direction = np.cos(pitch) * east + np.sin(pitch) * up

            speed = np.linalg.norm(velocity)
            mach = speed / speed_of_sound(altitude)
            Cd = drag_coefficient(mach)
            drag = -0.5 * rho * Cd * (10 if altitude < 100e3 else 4.0) * speed * velocity

            gravity = -G * M_EARTH * mass / np.linalg.norm(position)**3 * position
            acceleration = (gravity + thrust * thrust_direction + drag) / mass

            velocity += acceleration * dt
            position += velocity * dt
            mass = max(mass - flow * dt, input_data.payload_mass_kg)

            lat_, lon_, alt_ = ecef_to_geodetic(*position)
            angle = np.degrees(np.arccos(np.clip(np.dot(velocity, up) / np.linalg.norm(velocity), -1, 1)))
            telemetry.append(TelemetryPoint(time=t, latitude=lat_, longitude=lon_, altitude_m=alt_,
                                            velocity_m_s=speed, trajectory_angle_deg=angle))

            if speed >= target_velocity and altitude >= alt_km * 1000:
                break

        altitudes = [p.altitude_m for p in telemetry]
        achieved = max(altitudes) >= alt_km * 1000

        orbit_summary = OrbitSummary(
            inclination=np.mean([p.trajectory_angle_deg for p in telemetry]),
            apoapsis_km=max(altitudes) / 1000,
            periapsis_km=min(altitudes) / 1000,
            eccentricity=0.05 if achieved else 0.25,
            achieved=achieved,
            recommendations=[] if achieved else ["Increase thrust", "Reduce payload mass", "Use higher ISP engine"]
        )

        return TrajectoryResponse(telemetry=telemetry, orbit_summary=orbit_summary)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trajectory simulation failed: {e}")