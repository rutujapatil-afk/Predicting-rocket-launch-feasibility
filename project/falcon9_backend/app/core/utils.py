import numpy as np
import pandas as pd

def simulate_falcon9_trajectory(payload_mass_kg: float, target_altitude_km: float, stages: int = 2) -> pd.DataFrame:
    """
    Simulates Falcon 9 trajectory using basic physics approximations.

    Args:
        payload_mass_kg (float): Payload mass in kilograms.
        target_altitude_km (float): Target altitude in kilometers.
        stages (int): Number of rocket stages (default 2).

    Returns:
        pd.DataFrame: DataFrame with columns: time_s, altitude_m, velocity_m_s, acceleration_m_s2
    """

    G = 9.81  # gravitational acceleration (m/s²)
    initial_mass = 549_054  # full mass (kg)
    dry_mass = 25_600       # dry mass (kg)
    thrust = 7_607_000      # N (thrust)
    burn_time = 162         # seconds

    # Simulation resolution
    dt = 1  # time step
    time_series = np.arange(0, burn_time, dt)

    altitudes = []
    velocities = []
    accelerations = []

    mass = initial_mass
    velocity = 0
    altitude = 0
    fuel_burn_rate = (initial_mass - dry_mass) / burn_time

    for t in time_series:
        acc = (thrust - mass * G) / mass
        velocity += acc * dt
        altitude += velocity * dt

        # Log state
        altitudes.append(round(altitude, 4))
        velocities.append(round(velocity, 4))
        accelerations.append(round(acc, 4))

        # Burn fuel and cap at dry_mass
        mass -= fuel_burn_rate * dt
        mass = max(mass, dry_mass)

        if altitude >= target_altitude_km * 1_000:
            break

    df = pd.DataFrame({
        "time_s": time_series[:len(altitudes)],
        "altitude_m": altitudes,
        "velocity_m_s": velocities,
        "acceleration_m_s2": accelerations
    })

    # Drop NaN rows if any and reset index
    df.dropna(inplace=True)
    df.reset_index(drop=True, inplace=True)

    return df
