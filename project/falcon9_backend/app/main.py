from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import weather, cost, risk, trajectory

app = FastAPI(
    title="SpaceX Falcon 9 Prediction API",
    version="1.0.0"
)

# ✅ CORS setup (this allows your React frontend to access this backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://localhost:3000"] to be more strict if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API routes with prefix
app.include_router(weather.router, prefix="/predict", tags=["Weather"])
app.include_router(cost.router, prefix="/predict", tags=["Cost"])
app.include_router(risk.router, prefix="/predict", tags=["Risk"])  # ← this is critical
app.include_router(trajectory.router, prefix="/predict", tags=["Trajectory"])

# ✅ Root check endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the Falcon 9 Prediction API"}
