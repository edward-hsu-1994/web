from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import content

app = FastAPI(
    title="Personal Website API",
    version="0.1.0",
    description="Backend API for a personal portfolio website.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/navigation", tags=["navigation"])
def get_navigation() -> dict[str, object]:
    return content.NAVIGATION


@app.get("/api/about", tags=["about"])
def get_about() -> dict[str, object]:
    return content.ABOUT


@app.get("/api/health", tags=["system"])
def health_check() -> dict[str, str]:
    return content.HEALTH


@app.get("/api/home", tags=["home"])
def get_home() -> dict[str, object]:
    return content.HOME
