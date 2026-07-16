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


@app.get("/api/navigation", tags=["navigation"])
def get_navigation() -> dict[str, object]:
    return {
        "l10n_supported_fields": ["items"],
        "items": [
            {
                "text": {
                    "en-US": "GitHub",
                    "zh-TW": "GitHub",
                },
                "type": "link",
                "link": "https://github.com/edward-hsu-1994",
                "l10n_supported_fields": ["text"],
            },
            {
                "text": "Gravatar",
                "type": "link",
                "link": "https://gravatar.com/edwardhsu1994",
            },
        ],
    }


@app.get("/api/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/home", tags=["home"])
def get_home() -> dict[str, object]:
    return {
        "hero": {
            "l10n_supported_fields": ["content"],
            "content": {
                "en-US": {
                    "greeting": "Hi, I'm ",
                    "name": "Edward Hsu",
                    "title": "Software Developer",
                    "intro": "Software developer focused on building thoughtful digital experiences and useful products.",
                },
                "zh-TW": {
                    "greeting": "你好，我是 ",
                    "name": "Edward Hsu",
                    "title": "軟體開發者",
                    "intro": "專注於打造周到的數位體驗與實用產品的軟體開發者。",
                },
            },
            "photo": {
                "imageUrl": "https://github.com/edward-hsu-1994.png?size=512",
            },
            "buttons": {
                "items": [
                    {
                        "text": {
                            "en-US": "Explore my GitHub",
                            "zh-TW": "瀏覽我的 GitHub",
                        },
                        "type": "link",
                        "link": "https://github.com/edward-hsu-1994",
                        "class": "primary-button",
                        "l10n_supported_fields": ["text"],
                    },
                    {
                        "text": {
                            "en-US": "View profile",
                            "zh-TW": "查看個人資料",
                        },
                        "type": "link",
                        "link": "https://gravatar.com/edwardhsu1994",
                        "class": "secondary-button",
                        "l10n_supported_fields": ["text"],
                    },
                ],
            },
        },
    }
