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
                    "en-US": "Life records",
                    "zh-TW": "生活記錄",
                },
                "type": "path",
                "path": "/life-records",
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
        "title": {"en-US": "I turn curious ideas into useful things.", "zh-TW": "好奇心，是我前進的方向。"},
        "intro": {
            "en-US": "I'm Edward, a backend engineer focused on AI Agents, AI-powered applications, and reliable Web APIs.",
            "zh-TW": "我是 Edward，一名專注於 AI Agent、AI 應用與可靠 Web API 開發的後端工程師。",
        },
        "facts": [
            {"label": {"en-US": "Role", "zh-TW": "角色"}, "value": {"en-US": "Backend Engineer", "zh-TW": "後端工程師"}},
            {"label": {"en-US": "Focus", "zh-TW": "專注領域"}, "value": {"en-US": "AI Agents · Web APIs", "zh-TW": "AI Agent · Web API"}},
            {"label": {"en-US": "Based in", "zh-TW": "所在位置"}, "value": {"en-US": "Taiwan · UTC+8", "zh-TW": "台灣 · UTC+8"}},
        ],
        "sections": [
            {
                "id": "profile",
                "label": {"en-US": "Profile", "zh-TW": "個人簡介"},
                "kicker": {"en-US": "01 / Profile", "zh-TW": "01 / 個人簡介"},
                "title": {"en-US": "Turning ideas into dependable systems.", "zh-TW": "用工程，讓想法落地。"},
                "description": {
                    "en-US": "I'm Edward, a backend engineer focused on building AI Agents, AI-powered applications, and reliable Web APIs. I enjoy turning complex ideas into useful, maintainable products.",
                    "zh-TW": "我是 Edward，一名專注於 AI Agent、AI 應用與可靠 Web API 開發的後端工程師。我喜歡把複雜的想法，轉化成實用且容易維護的產品。",
                },
                "items": [],
            },
            {
                "id": "experience",
                "label": {"en-US": "Experience", "zh-TW": "工作經歷"},
                "kicker": {"en-US": "02 / Experience", "zh-TW": "02 / 工作經歷"},
                "title": {"en-US": "Building products from the inside out.", "zh-TW": "從工程核心，打造好用的產品。"},
                "description": {
                    "en-US": "As a backend engineer, I develop AI Agents and related applications, while designing and implementing Web APIs.",
                    "zh-TW": "目前主要負責 AI Agent 與相關應用開發，同時設計與實作 Web API。",
                },
                "items": [],
                "jobs": [
                    {
                        "company": {"en-US": "Trend Micro", "zh-TW": "趨勢科技股份有限公司 (Trend Micro)"},
                        "role": {"en-US": "Senior Engineer", "zh-TW": "資深工程師"},
                        "period": {"en-US": "Jan 2021 — Present", "zh-TW": "2021/01 — 至今"},
                        "responsibilities": {"en-US": "AI Agent development · Web API development", "zh-TW": "AI Agent 開發 · Web API 開發"},
                    },
                    {
                        "company": {"en-US": "Hamasen Technology Co., Ltd.", "zh-TW": "哈瑪星科技股份有限公司"},
                        "role": {"en-US": "Senior Engineer", "zh-TW": "資深工程師"},
                        "period": {"en-US": "Oct 2017 — Dec 2020", "zh-TW": "2017/10 — 2020/12"},
                        "responsibilities": {"en-US": "Web API development", "zh-TW": "Web API 開發"},
                    },
                ],
            },
            {
                "id": "education",
                "label": {"en-US": "Education", "zh-TW": "學歷"},
                "kicker": {"en-US": "03 / Education", "zh-TW": "03 / 學歷"},
                "title": {"en-US": "Always learning, always shipping.", "zh-TW": "持續學習，也持續做出成果。"},
                "description": {
                    "en-US": "My education gave me a foundation in structured thinking, while hands-on projects taught me how to learn quickly and make ideas tangible.",
                    "zh-TW": "學習讓我建立結構化思考的基礎，而實作專案則教會我快速學習，並把想法落地。",
                },
                "items": [
                ],
                "education": [
                    {
                        "institution": {"en-US": "National Kaohsiung First University of Science and Technology", "zh-TW": "國立高雄第一科技大學資訊管理系"},
                        "degree": {"en-US": "Bachelor's Degree", "zh-TW": "學士"},
                        "period": {"en-US": "2012 — 2016", "zh-TW": "2012 — 2016"},
                    },
                    {
                        "institution": {"en-US": "National Tson Wen Home Economics & Commercial Vocational High School", "zh-TW": "國立曾文家事商業職業學校資料處理科"},
                        "degree": {"en-US": "Department of Data Processing", "zh-TW": "資料處理科"},
                        "period": {"en-US": "2009 — 2012", "zh-TW": "2009 — 2012"},
                    },
                ],
            },
            {
                "id": "skills",
                "label": {"en-US": "Skills", "zh-TW": "技術能力"},
                "kicker": {"en-US": "04 / Skills", "zh-TW": "04 / 技術能力"},
                "title": {"en-US": "From AI Agents to cloud-native systems.", "zh-TW": "從 AI Agent 到雲原生架構。"},
                "description": {
                    "en-US": "",
                    "zh-TW": "",
                },
                "items": [
                    {"label": {"en-US": "AI / Agent", "zh-TW": "AI／Agent"}, "value": {"en-US": "A2A · LangGraph · AG-UI", "zh-TW": "A2A · LangGraph · AG-UI"}},
                    {"label": {"en-US": "Backend", "zh-TW": "後端"}, "value": {"en-US": "FastAPI (Python) · ASP.NET (C#) · Fiber (Go)", "zh-TW": "FastAPI (Python) · ASP.NET (C#) · Fiber (Go)"}},
                    {"label": {"en-US": "Frontend / Client", "zh-TW": "前端／Client"}, "value": {"en-US": "React · Angular · Swift", "zh-TW": "React · Angular · Swift"}},
                    {"label": {"en-US": "Data / Infrastructure", "zh-TW": "資料／基礎架構"}, "value": {"en-US": "PostgreSQL · Docker · Kubernetes · Helm · Git", "zh-TW": "PostgreSQL · Docker · K8s · Helm · Git"}},
                ],
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
