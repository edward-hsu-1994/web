import { Fragment, StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

type Language = 'en-US' | 'zh-TW'
type HeroContent = {
  greeting: string
  name: string
  title: string
  intro: string
}
type HeroButton = {
  text: {
    'en-US': string
    'zh-TW': string
  }
  type: 'link'
  link: string
  class: string
  l10n_supported_fields: string[]
}
type Home = {
  hero: {
    l10n_supported_fields: string[]
    content: {
      'en-US': HeroContent
      'zh-TW': HeroContent
    }
    photo: {
      imageUrl: string
    }
    buttons: {
      items: HeroButton[]
    }
  }
}
type NavigationItem = {
  text: string | {
    'en-US': string
    'zh-TW': string
  }
  type: 'link'
  link: string
  l10n_supported_fields?: string[]
}
type Navigation = {
  l10n_supported_fields: string[]
  items: NavigationItem[]
}

function App() {
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage === 'zh' || savedLanguage === 'zh-TW') return 'zh-TW'
    return 'en-US'
  })
  const [home, setHome] = useState<Home>({
    hero: {
      l10n_supported_fields: ['content'],
      content: {
        'en-US': {
          greeting: 'Hi, I\'m ',
          name: 'Edward Hsu',
          title: 'Software Developer',
          intro: 'Software developer focused on building thoughtful digital experiences and useful products.',
        },
        'zh-TW': {
          greeting: '你好，我是 ',
          name: 'Edward Hsu',
          title: '軟體開發者',
          intro: '專注於打造周到的數位體驗與實用產品的軟體開發者。',
        },
      },
      photo: {
        imageUrl: 'https://github.com/edward-hsu-1994.png?size=512',
      },
      buttons: {
        items: [
          {
            text: { 'en-US': 'Explore my GitHub', 'zh-TW': '瀏覽我的 GitHub' },
            type: 'link',
            link: 'https://github.com/edward-hsu-1994',
            class: 'primary-button',
            l10n_supported_fields: ['text'],
          },
          {
            text: { 'en-US': 'View profile', 'zh-TW': '查看個人資料' },
            type: 'link',
            link: 'https://gravatar.com/edwardhsu1994',
            class: 'secondary-button',
            l10n_supported_fields: ['text'],
          },
        ],
      },
    },
  })
  const [navigation, setNavigation] = useState<Navigation>({
    l10n_supported_fields: ['items'],
    items: [
      {
        text: { 'en-US': 'GitHub', 'zh-TW': 'GitHub' },
        type: 'link',
        link: 'https://github.com/edward-hsu-1994',
        l10n_supported_fields: ['text'],
      },
      {
        text: 'Gravatar',
        type: 'link',
        link: 'https://gravatar.com/edwardhsu1994',
      },
    ],
  })
  const isChinese = language === 'zh-TW'
  const content = home.hero.content[language] ?? home.hero.content['en-US']
  const heroButtons = home.hero.buttons.items
  const navigationItems = navigation.items

  useEffect(() => {
    localStorage.setItem('preferred-language', language)
  }, [language])

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    fetch(`${apiUrl}/api/home`)
      .then((response) => response.json())
      .then((data: Home) => setHome(data))
      .catch(() => undefined)

    fetch(`${apiUrl}/api/navigation`)
      .then((response) => response.json())
      .then((data: Navigation) => setNavigation(data))
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cursorGlowRef.current?.style.setProperty('--cursor-x', `${event.clientX}px`)
      cursorGlowRef.current?.style.setProperty('--cursor-y', `${event.clientY}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className="site-shell page-enter min-h-screen px-6 py-8 text-white sm:px-12 sm:py-12">
      <div className="cursor-glow" ref={cursorGlowRef} aria-hidden="true" />
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="brand-mark">EH<span>.</span></span>
        <div className="nav-links flex items-center gap-3 text-sm text-slate-300">
          {navigationItems.map((item, index) => (
            <Fragment key={item.link}>
              {index > 0 && <span className="nav-divider" aria-hidden="true">|</span>}
              {item.type === 'link' && (
                <a className="nav-link" href={item.link} target="_blank" rel="noreferrer">
                  {typeof item.text === 'string' ? item.text : item.text[language]}
                </a>
              )}
            </Fragment>
          ))}
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
            {content.greeting}<span className="name-gradient">{content.name}</span>
          </h1>
          <p className="hero-intro mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {content.intro}
          </p>
          <div className="hero-actions mt-9 flex flex-wrap gap-4">
            {heroButtons.map((button) => (
              button.type === 'link' && (
                <a className={button.class} href={button.link} target="_blank" rel="noreferrer" key={button.link}>
                  {button.text[language]}{button.class === 'primary-button' && <span aria-hidden="true"> ↗</span>}
                </a>
              )
            ))}
          </div>
        </div>

        <a className="avatar-card" href="https://gravatar.com/edwardhsu1994" target="_blank" rel="noreferrer" aria-label="View Edward Hsu's Gravatar profile">
          <img src={home.hero.photo.imageUrl} alt={content.name} />
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
