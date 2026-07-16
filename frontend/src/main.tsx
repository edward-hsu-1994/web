import { Fragment, StrictMode, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

type Language = 'en-US' | 'zh-TW'
type TypingStage = 'waiting' | 'greeting' | 'name' | 'intro' | 'done'
const EMPTY_IME_ANIME: Record<string, string> = {}
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
  type: 'link' | 'path'
  link?: string
  path?: string
  class: string
  l10n_supported_fields: string[]
}
type Home = {
  hero: {
    l10n_supported_fields: string[]
    content_ime_anime?: {
      'zh-TW': Record<string, string>
    }
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
  type: 'link' | 'path'
  link?: string
  path?: string
  l10n_supported_fields?: string[]
}
type Navigation = {
  l10n_supported_fields: string[]
  items: NavigationItem[]
}

function App() {
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const initialTypingRef = useRef(true)
  const [pathname, setPathname] = useState(window.location.pathname)
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage === 'zh' || savedLanguage === 'zh-TW') return 'zh-TW'
    return 'en-US'
  })
  const [home, setHome] = useState<Home | null>(null)
  const [navigation, setNavigation] = useState<Navigation | null>(null)
  const isChinese = language === 'zh-TW'
  const content = home?.hero.content[language] ?? home?.hero.content['en-US']
  const imeAnime = home?.hero.content_ime_anime?.['zh-TW'] ?? EMPTY_IME_ANIME
  const heroButtons = home?.hero.buttons.items ?? []
  const navigationItems = navigation?.items ?? []
  const [typedGreeting, setTypedGreeting] = useState('')
  const [typedName, setTypedName] = useState('')
  const [typedIntro, setTypedIntro] = useState('')
  const [typingStage, setTypingStage] = useState<TypingStage>('waiting')

  useEffect(() => {
    localStorage.setItem('preferred-language', language)
  }, [language])

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!content) return undefined

    const timers: number[] = []
    const typingDuration = (text: string, speed?: number) => {
      const usesIme = [...text].some((character) => imeAnime[character])
      return text.length * (speed ?? (usesIme ? 160 : 48))
    }
    const typeText = (text: string, setter: (value: string) => void, startAt: number, speed?: number) => {
      const usesIme = [...text].some((character) => imeAnime[character])
      const characterDelay = speed ?? (usesIme ? 160 : 48)
      for (let index = 0; index < text.length; index += 1) {
        const character = text[index]
        const pronunciation = usesIme ? imeAnime[character] : undefined
        const characterStart = startAt + index * characterDelay
        timers.push(window.setTimeout(() => setter(text.slice(0, index) + (pronunciation ?? character)), characterStart))
        timers.push(window.setTimeout(() => setter(text.slice(0, index + 1)), characterStart + (pronunciation ? Math.min(95, characterDelay - 20) : 0)))
      }
    }

    setTypedGreeting('')
    setTypedName('')
    setTypedIntro('')
    setTypingStage('waiting')

    const typingDelay = initialTypingRef.current ? 1000 : 0
    initialTypingRef.current = false
    const nameStart = typingDelay + typingDuration(content.greeting)
    const introStart = nameStart + typingDuration(content.name) + 280
    const introSpeed = 40
    const doneAt = introStart + typingDuration(content.intro, introSpeed)
    timers.push(window.setTimeout(() => setTypingStage('greeting'), typingDelay))
    timers.push(window.setTimeout(() => setTypingStage('name'), nameStart))
    timers.push(window.setTimeout(() => setTypingStage('intro'), introStart))
    timers.push(window.setTimeout(() => setTypingStage('done'), doneAt))
    typeText(content.greeting, setTypedGreeting, typingDelay)
    typeText(content.name, setTypedName, nameStart)
    typeText(content.intro, setTypedIntro, introStart, introSpeed)

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [content?.greeting, content?.name, content?.intro, imeAnime, language])

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

  if (!home || !navigation || !content) {
    return (
      <main className="site-shell min-h-screen px-6 py-8 text-white sm:px-12 sm:py-12">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center text-sm text-slate-400">
          Loading...
        </div>
      </main>
    )
  }

  const navigateToPath = (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault()
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  return (
    <main className="site-shell page-enter min-h-screen px-6 py-8 text-white sm:px-12 sm:py-12">
      <div className="cursor-glow" ref={cursorGlowRef} aria-hidden="true" />
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="brand-mark">EH<span>.</span></span>
        <div className="nav-links flex items-center gap-3 text-sm text-slate-300">
          {navigationItems.map((item, index) => (
            <Fragment key={item.path ?? item.link ?? index}>
              {index > 0 && <span className="nav-divider" aria-hidden="true">|</span>}
              {item.type === 'link' && (
                <a className="nav-link" href={item.link} target="_blank" rel="noreferrer">
                  {typeof item.text === 'string' ? item.text : item.text[language]}
                </a>
              )}
              {item.type === 'path' && item.path && (
                <a
                  className={pathname === item.path ? 'nav-link active' : 'nav-link'}
                  href={item.path}
                  onClick={(event) => navigateToPath(event, item.path!)}
                >
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

      {pathname === '/portfolio' ? (
        <section className="portfolio-page mx-auto min-h-[75vh] max-w-5xl py-20">
          <p className="eyebrow mb-5">Portfolio</p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
            {isChinese ? '作品集' : 'Selected work'}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {isChinese ? '這裡將展示我的作品與實作專案。' : 'A collection of projects, experiments, and thoughtful digital experiences.'}
          </p>
        </section>
      ) : (
      <section className="hero mx-auto grid min-h-[75vh] max-w-5xl items-center gap-12 py-20 lg:grid-cols-[1fr_280px]">
        <div className="hero-copy">
          <p className="eyebrow mb-5">Personal website</p>
          <h1 className="hero-title max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
            {typedGreeting}{typingStage === 'greeting' && <span className="typing-cursor" aria-hidden="true" />}
            <span className="name-gradient">{typedName}</span>
            {typingStage === 'name' && <span className="typing-cursor" aria-hidden="true" />}
          </h1>
          <p className="hero-intro mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {typedIntro}{typingStage === 'intro' && <span className="typing-cursor" aria-hidden="true" />}
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
      )}
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
