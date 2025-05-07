from pydantic import BaseModel, Field
from typing import List

class TrajectoryInput(BaseModel):
    launch_site: str = Field(..., description="Launch site name")
    payload_mass_kg: float = Field(..., gt=0, description="Payload mass in kilograms")
    orbit_type: str = Field(..., description="Orbit type such as LEO, SSO, GEO, MEO, Polar")
    stages: int = Field(2, ge=1, le=3, description="Number of rocket stages (default 2)")

class TelemetryPoint(BaseModel):
    time: float
    latitude: float
    longitude: float
    altitude_m: float
    velocity_m_s: float
    trajectory_angle_deg: float

class OrbitSummary(BaseModel):
    inclination: float
    apoapsis_km: float
    periapsis_km: float
    eccentricity: float
    achieved: bool
    recommendations: List[str]

class TrajectoryResponse(BaseModel):
    telemetry: List[TelemetryPoint]
    orbit_summary: OrbitSummary
