from pydantic import BaseModel

class WeatherRequest(BaseModel):
    site: str
    date: str

class WeatherPrediction(BaseModel):
    suitable: bool
    confidence: float
    conditions: dict  # You can further define temperature, wind, precipitation if needed
