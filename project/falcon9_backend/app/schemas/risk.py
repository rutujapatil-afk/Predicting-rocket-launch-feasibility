from pydantic import BaseModel, Field
from typing import Literal, Optional, Dict


class RiskInput(BaseModel):
    Flights: int = Field(..., ge=0, description="Total number of flights")
    Block: int = Field(..., ge=0, description="Block version number")
    ReusedCount: int = Field(..., ge=0, description="Number of reused components")
    Serial: str = Field(..., description="Rocket serial number (e.g., B1049)")
    LandingPad: str = Field(..., description="Landing pad ID (e.g., 5e9e3032383ecb6bb234e7ca)")
    EstimatedLaunchCost_MillionUSD: float = Field(..., gt=0, description="Estimated launch cost in millions USD")
    Location: Literal["Cape Canaveral", "Kennedy Space Center", "Vandenberg"] = Field(..., description="Launch site")


class RiskPrediction(BaseModel):
    risk_level: Literal["LowRisk", "MediumRisk", "HighRisk"]
    confidence: float = Field(..., ge=0, le=1, description="Confidence score of predicted risk level")
    probabilities: Dict[str, float] = Field(..., description="Probabilities for each risk class")
