from pydantic import BaseModel, Field
from typing import Literal


class CostInput(BaseModel):
    PayloadMass: float = Field(..., gt=0, description="Payload mass in kg")
    ReusedBooster: Literal["Yes", "No"]
    GridFins: Literal["Yes", "No"]
    Legs: Literal["Yes", "No"]
    Orbit: Literal["LEO", "GTO", "SSO", "ISS"]
    Block: int = Field(..., ge=0, description="Block version number")
    ReusedCount: int = Field(..., ge=0, description="Number of times reused")
    LandingType: Literal["RTLS", "ASDS", "Ocean"]
    LandingSuccess: Literal["Yes", "No"]


class CostBreakdown(BaseModel):
    vehicle: float = Field(..., description="Vehicle cost in USD")
    operations: float = Field(..., description="Operational cost in USD")
    insurance: float = Field(..., description="Insurance cost in USD")


class CostPrediction(BaseModel):
    total: float = Field(..., description="Total estimated launch cost")
    breakdown: CostBreakdown
