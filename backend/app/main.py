from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/api/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/profile", tags=["profile"])
def get_profile() -> dict[str, object]:
    return {
        "en-US": {
            "name": "Edward Hsu",
            "title": "Software Developer",
            "intro": "Software developer focused on building thoughtful digital experiences and useful products.",
            "github": "https://github.com/edward-hsu-1994",
            "gravatar": "https://gravatar.com/edwardhsu1994",
        },
        "zh-TW": {
            "name": "Edward Hsu",
            "title": "軟體開發者",
            "intro": "專注於打造周到的數位體驗與實用產品的軟體開發者。",
            "github": "https://github.com/edward-hsu-1994",
            "gravatar": "https://gravatar.com/edwardhsu1994",
        },
        "default_lang": "en-US",
    }
