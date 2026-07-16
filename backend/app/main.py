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
            "content_ime_anime": {
                "zh-TW": {
                    "你": "ㄋ一ˇ",
                    "好": "ㄏㄠˇ",
                    "我": "ㄨㄛˇ",
                    "是": "ㄕˋ",
                    "專": "ㄓㄨㄢ",
                    "注": "ㄓㄨˋ",
                    "於": "ㄩˊ",
                    "打": "ㄉㄚˇ",
                    "造": "ㄗㄠˋ",
                    "周": "ㄓㄡ",
                    "到": "ㄉㄠˋ",
                    "的": "ㄉㄜ˙",
                    "軟": "ㄖㄨㄢˇ",
                    "體": "ㄊㄧˇ",
                    "開": "ㄎㄞ",
                    "發": "ㄈㄚ",
                    "者": "ㄓㄜˇ",
                    "數": "ㄕㄨˋ",
                    "位": "ㄨㄟˋ",
                    "驗": "ㄧㄢˋ",
                    "與": "ㄩˇ",
                    "實": "ㄕˊ",
                    "用": "ㄩㄥˋ",
                    "產": "ㄔㄢˇ",
                    "品": "ㄆㄧㄣˇ",
                    "，": "，",
                    "。": "。",
                },
            },
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
