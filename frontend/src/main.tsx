import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

type Language = 'en-US' | 'zh-TW'
type ProfileContent = {
  name: string
  title: string
  intro: string
  github: string
  gravatar: string
}
type Profile = {
  'en-US': ProfileContent
  'zh-TW': ProfileContent
  default_lang: Language
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage === 'zh' || savedLanguage === 'zh-TW') return 'zh-TW'
    return 'en-US'
  })
  const [profile, setProfile] = useState<Profile>({
    'en-US': {
      name: 'Edward Hsu',
      title: 'Software Developer',
      intro: 'Software developer focused on building thoughtful digital experiences and useful products.',
      github: 'https://github.com/edward-hsu-1994',
      gravatar: 'https://gravatar.com/edwardhsu1994',
    },
    'zh-TW': {
      name: 'Edward Hsu',
      title: '軟體開發者',
      intro: '專注於打造周到的數位體驗與實用產品的軟體開發者。',
      github: 'https://github.com/edward-hsu-1994',
      gravatar: 'https://gravatar.com/edwardhsu1994',
    },
    default_lang: 'en-US',
  })
  const isChinese = language === 'zh-TW'
  const content = profile[language] ?? profile[profile.default_lang]

  useEffect(() => {
    localStorage.setItem('preferred-language', language)
  }, [language])

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    fetch(`${apiUrl}/api/home`)
      .then((response) => response.json())
      .then((data: Profile) => setProfile(data))
      .catch(() => undefined)
  }, [])

  return (
    <main className="site-shell page-enter min-h-screen px-6 py-8 text-white sm:px-12 sm:py-12">
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="brand-mark">EH<span>.</span></span>
        <div className="nav-links flex items-center gap-3 text-sm text-slate-300">
          <a className="nav-link" href="https://github.com/edward-hsu-1994" target="_blank" rel="noreferrer">
            {isChinese ? 'GitHub' : 'GitHub'}
          </a>
          <span className="nav-divider" aria-hidden="true">|</span>
          <a className="nav-link" href="https://gravatar.com/edwardhsu1994" target="_blank" rel="noreferrer">
            Gravatar
          </a>
          <span className="nav-divider" aria-hidden="true">|</span>
          <div className="language-switcher" aria-label="Language selector">
            <button className={isChinese ? 'language-option active' : 'language-option'} type="button" onClick={() => setLanguage('zh-TW')}>
              中文
            </button>
            <span aria-hidden="true">/</span>
            <button className={!isChinese ? 'language-option active' : 'language-option'} type="button" onClick={() => setLanguage('en-US')}>
              English
            </button>
          </div>
        </div>
      </nav>

      <section className="hero mx-auto grid min-h-[75vh] max-w-5xl items-center gap-12 py-20 lg:grid-cols-[1fr_280px]">
        <div className="hero-copy">
          <p className="eyebrow mb-5">Personal website</p>
          <h1 className="hero-title max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
            {isChinese ? '你好，我是 ' : 'Hi, I\'m '}<span className="name-gradient">Edward Hsu.</span>
          </h1>
          <p className="hero-intro mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {content.intro}
          </p>
          <div className="hero-actions mt-9 flex flex-wrap gap-4">
            <a className="primary-button" href="https://github.com/edward-hsu-1994" target="_blank" rel="noreferrer">
              {isChinese ? '瀏覽我的 GitHub' : 'Explore my GitHub'} <span aria-hidden="true">↗</span>
            </a>
            <a className="secondary-button" href="https://gravatar.com/edwardhsu1994" target="_blank" rel="noreferrer">
              {isChinese ? '查看個人資料' : 'View profile'}
            </a>
          </div>
        </div>

        <a className="avatar-card" href="https://gravatar.com/edwardhsu1994" target="_blank" rel="noreferrer" aria-label="View Edward Hsu's Gravatar profile">
          <img src="https://github.com/edward-hsu-1994.png?size=512" alt="Edward Hsu" />
          <span>Find me online <span aria-hidden="true">↗</span></span>
        </a>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
