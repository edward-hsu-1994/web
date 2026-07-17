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
                    "en-US": "Home",
                    "zh-TW": "首頁",
                },
                "type": "path",
                "path": "/",
                "l10n_supported_fields": ["text"],
            },
            {
                "text": {
                    "en-US": "About me",
                    "zh-TW": "關於我",
                },
                "type": "path",
                "path": "/about",
                "l10n_supported_fields": ["text"],
            },
            {
                "text": {
                    "en-US": "Portfolio",
                    "zh-TW": "作品集",
                },
                "type": "path",
                "path": "/portfolio",
                "l10n_supported_fields": ["text"],
            },
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
                "text": "LinkedIn",
                "type": "link",
                "link": "https://www.linkedin.com/in/edwardhsu1994/",
            },
        ],
    }


@app.get("/api/about", tags=["about"])
def get_about() -> dict[str, object]:
    return {
        "eyebrow": {"en-US": "A little more about me", "zh-TW": "多認識我一點"},
        "title": {"en-US": "I turn curious ideas into useful things.", "zh-TW": "我把好奇的想法，變成實用的作品。"},
        "intro": {
            "en-US": "I'm Edward, a software developer who enjoys connecting thoughtful design with dependable engineering. I care about the details that make a product feel clear, calm, and genuinely helpful.",
            "zh-TW": "我是 Edward，一名喜歡把細膩設計與可靠工程結合在一起的軟體開發者。我在意那些讓產品變得清楚、舒服，而且真正有幫助的細節。",
        },
        "facts": [
            {"label": {"en-US": "Focus", "zh-TW": "專注領域"}, "value": {"en-US": "Product-minded engineering", "zh-TW": "以產品思維打造工程"}},
            {"label": {"en-US": "Based in", "zh-TW": "所在位置"}, "value": {"en-US": "Taiwan · UTC+8", "zh-TW": "台灣 · UTC+8"}},
            {"label": {"en-US": "Currently learning", "zh-TW": "正在探索"}, "value": {"en-US": "Better ways to build for people", "zh-TW": "更貼近人的創作方式"}},
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
                            "en-US": "View LinkedIn",
                            "zh-TW": "查看 LinkedIn",
                        },
                        "type": "link",
                        "link": "https://www.linkedin.com/in/edwardhsu1994/",
                        "class": "secondary-button",
                        "l10n_supported_fields": ["text"],
                    },
                ],
            },
        },
    }
