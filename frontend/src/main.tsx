import { Fragment, StrictMode, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type WheelEvent as ReactWheelEvent } from 'react'
import { createRoot } from 'react-dom/client'
import aboutData from '../api/about.json'
import homeData from '../api/home.json'
import lifeRecordsData from '../api/life-records.json'
import navigationData from '../api/navigation.json'
import portfolioData from '../api/portfolio.json'
import './index.css'

type Language = 'en-US' | 'zh-TW'
type TypingStage = 'waiting' | 'greeting' | 'name' | 'intro' | 'done'
const EMPTY_IME_ANIME: Record<string, string> = {}
const LIFE_PAGE_SIZE = 20
const APP_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')
const toAppPath = () => {
  const rawPath = window.location.pathname
  if (APP_BASE_PATH && rawPath.startsWith(APP_BASE_PATH)) return rawPath.slice(APP_BASE_PATH.length) || '/'
  return rawPath
}
const toAppHref = (path: string) => `${APP_BASE_PATH}${path}`
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
type About = {
  l10n_supported_fields: string[]
  eyebrow: Record<Language, string>
  title: Record<Language, string>
  intro: Record<Language, string>
  facts: Array<{ label: Record<Language, string>; value: Record<Language, string> }>
  sections: AboutSection[]
}
type AboutSection = {
  id: string
  label: Record<Language, string>
  kicker: Record<Language, string>
  title: Record<Language, string>
  description: Record<Language, string>
  items: Array<{ label: Record<Language, string>; value: Record<Language, string> }>
  jobs?: Array<{
    company: Record<Language, string>
    role: Record<Language, string>
    period: Record<Language, string>
    responsibilities: Record<Language, string>
  }>
  education?: Array<{
    institution: Record<Language, string>
    degree: Record<Language, string>
    period: Record<Language, string>
  }>
}

type LifePhoto = {
  src: string
  place: Record<Language, string>
  date: Record<Language, string> & { value: string | null }
  l10n_supported_fields?: string[]
}
type LifeRecords = {
  l10n_supported_fields: string[]
  items: LifePhoto[]
}
type PortfolioProject = {
  id: string
  title: Record<Language, string>
  description: Record<Language, string>
  about: Record<Language, string>
  tags: string[]
  link: string
  link_label: Record<Language, string>
  l10n_supported_fields?: string[]
}
type Portfolio = {
  l10n_supported_fields: string[]
  items: PortfolioProject[]
}

function getLifeMasonryColumnCount() {
  if (typeof window === 'undefined' || window.innerWidth < 640) return 1
  if (window.innerWidth < 900) return 2
  return 3
}

const allLifePhotos = [...(lifeRecordsData as LifeRecords).items].sort((a, b) => {
  const dateA = a.date.value ? Date.parse(`${a.date.value}T00:00:00`) : Number.NEGATIVE_INFINITY
  const dateB = b.date.value ? Date.parse(`${b.date.value}T00:00:00`) : Number.NEGATIVE_INFINITY
  return dateB - dateA
})

function App() {
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const initialTypingRef = useRef(true)
  const [pathname, setPathname] = useState(toAppPath)
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage === 'zh' || savedLanguage === 'zh-TW') return 'zh-TW'
    return 'en-US'
  })
  const home = homeData as Home
  const navigation = navigationData as Navigation
  const about = aboutData as About
  const portfolio = portfolioData as Portfolio
  const [loadedLifePhotos, setLoadedLifePhotos] = useState(() => allLifePhotos.slice(0, LIFE_PAGE_SIZE))
  const [lifeMasonryColumnCount, setLifeMasonryColumnCount] = useState(getLifeMasonryColumnCount)
  const lifeLoadMoreRef = useRef<HTMLDivElement>(null)
  const lifeMasonryColumns = Array.from({ length: lifeMasonryColumnCount }, () => [] as Array<{ photo: LifePhoto; index: number }>)
  loadedLifePhotos.forEach((photo, index) => {
    lifeMasonryColumns[index % lifeMasonryColumnCount].push({ photo, index })
  })
  const [aboutSectionIndex, setAboutSectionIndex] = useState(0)
  const [experienceIndex, setExperienceIndex] = useState(0)
  const [educationIndex, setEducationIndex] = useState(0)
  const [selectedLifePhoto, setSelectedLifePhoto] = useState<LifePhoto | null>(null)
  const isChinese = language === 'zh-TW'
  const content = home?.hero.content[language] ?? home?.hero.content['en-US']
  const imeAnime = home?.hero.content_ime_anime?.['zh-TW'] ?? EMPTY_IME_ANIME
  const heroButtons = home?.hero.buttons.items ?? []
  const navigationItems = navigation?.items ?? []
  const [typedGreeting, setTypedGreeting] = useState('')
  const [typedName, setTypedName] = useState('')

  useEffect(() => {
    const handleResize = () => setLifeMasonryColumnCount(getLifeMasonryColumnCount())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (pathname !== '/life-records') return undefined
    setLoadedLifePhotos(allLifePhotos.slice(0, LIFE_PAGE_SIZE))
    return undefined
  }, [pathname])

  useEffect(() => {
    if (pathname !== '/life-records' || loadedLifePhotos.length >= allLifePhotos.length) return undefined
    const sentinel = lifeLoadMoreRef.current
    if (!sentinel) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setLoadedLifePhotos((currentPhotos) => [
        ...currentPhotos,
        ...allLifePhotos.slice(currentPhotos.length, currentPhotos.length + LIFE_PAGE_SIZE),
      ])
    }, { rootMargin: '320px 0px' })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [pathname, loadedLifePhotos.length])
  const [typedIntro, setTypedIntro] = useState('')
  const [typingStage, setTypingStage] = useState<TypingStage>('waiting')

  useEffect(() => {
    localStorage.setItem('preferred-language', language)
  }, [language])

  useEffect(() => {
    const handlePopState = () => setPathname(toAppPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!about) return undefined

    const syncSectionFromHash = () => {
      const sectionId = window.location.hash.replace(/^#/, '')
      if (toAppPath() === '/about' && !sectionId) {
        window.history.replaceState({}, '', `${toAppHref('/about')}#${about.sections[0].id}`)
        setAboutSectionIndex(0)
        return
      }
      const sectionIndex = about.sections.findIndex((section) => section.id === sectionId)
      if (sectionIndex >= 0) setAboutSectionIndex(sectionIndex)
    }

    syncSectionFromHash()
    window.addEventListener('hashchange', syncSectionFromHash)
    window.addEventListener('popstate', syncSectionFromHash)
    return () => {
      window.removeEventListener('hashchange', syncSectionFromHash)
      window.removeEventListener('popstate', syncSectionFromHash)
    }
  }, [about])

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
    const handleMouseMove = (event: MouseEvent) => {
      cursorGlowRef.current?.style.setProperty('--cursor-x', `${event.clientX}px`)
      cursorGlowRef.current?.style.setProperty('--cursor-y', `${event.clientY}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!selectedLifePhoto) return undefined
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedLifePhoto(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedLifePhoto])

  useEffect(() => {
    if (!about || pathname !== '/about') return undefined

    const handleGlobalAboutKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return

      let nextIndex: number | null = null
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = Math.min(aboutSectionIndex + 1, about.sections.length - 1)
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = Math.max(aboutSectionIndex - 1, 0)
      if (nextIndex === null || nextIndex === aboutSectionIndex) return

      event.preventDefault()
      setAboutSectionIndex(nextIndex)
      const sectionId = about.sections[nextIndex].id
      window.history.pushState({}, '', `${toAppHref(toAppPath())}#${sectionId}`)
    }

    window.addEventListener('keydown', handleGlobalAboutKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalAboutKeyDown)
  }, [about, aboutSectionIndex, pathname])

  useEffect(() => {
    setExperienceIndex(0)
    setEducationIndex(0)
  }, [aboutSectionIndex])

  const navigateToPath = (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault()
    window.history.pushState({}, '', path === '/about' ? `${toAppHref(path)}#profile` : toAppHref(path))
    setPathname(path)
    if (path === '/about') setAboutSectionIndex(0)
  }

  const selectAboutSection = (index: number) => {
    if (!about) return
    const nextIndex = Math.max(0, Math.min(index, about.sections.length - 1))
    setAboutSectionIndex(nextIndex)
    const sectionId = about.sections[nextIndex].id
    if (window.location.hash !== `#${sectionId}`) {
      window.history.pushState({}, '', `${toAppHref(toAppPath())}#${sectionId}`)
    }
  }

  const handleAboutKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!about) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      selectAboutSection(aboutSectionIndex + 1)
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      selectAboutSection(aboutSectionIndex - 1)
    }
  }

  const handleAboutWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 4 || !about) return
    event.preventDefault()
    selectAboutSection(aboutSectionIndex + (event.deltaY > 0 ? 1 : -1))
  }

  const selectExperience = (index: number) => {
    if (!about) return
    const jobs = about.sections[aboutSectionIndex].jobs ?? []
    setExperienceIndex(Math.max(0, Math.min(index, jobs.length - 1)))
  }

  const handleExperienceWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 4 || !about) return
    const jobs = about.sections[aboutSectionIndex].jobs ?? []
    if (jobs.length < 2) return
    event.preventDefault()
    event.stopPropagation()
    selectExperience(experienceIndex + (event.deltaY > 0 ? 1 : -1))
  }

  const selectEducation = (index: number) => {
    if (!about) return
    const education = about.sections[aboutSectionIndex].education ?? []
    setEducationIndex(Math.max(0, Math.min(index, education.length - 1)))
  }

  const handleEducationWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 4 || !about) return
    const education = about.sections[aboutSectionIndex].education ?? []
    if (education.length < 2) return
    event.preventDefault()
    event.stopPropagation()
    selectEducation(educationIndex + (event.deltaY > 0 ? 1 : -1))
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
                  href={toAppHref(item.path)}
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
          <div className="life-title-row">
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
              {isChinese ? '作品集' : 'Selected work'}
            </h1>
          </div>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {isChinese ? '這裡將展示我的作品與實作專案。' : 'A collection of projects, experiments, and thoughtful digital experiences.'}
          </p>
          <div className="portfolio-grid mt-14">
            {portfolio.items.map((project) => (
              <article className="portfolio-card" key={project.id}>
                <div className="portfolio-card-topline">
                  <span className="eyebrow">Project</span>
                  <span className="portfolio-card-index">01</span>
                </div>
                <h2>{project.title[language]}</h2>
                <p className="portfolio-card-description">{project.description[language]}</p>
                <p className="portfolio-card-about">{project.about[language]}</p>
                <div className="portfolio-tags">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <a className="portfolio-card-link" href={project.link} target="_blank" rel="noreferrer">
                  {project.link_label[language]} <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : pathname === '/life-records' ? (
        <section className="life-page mx-auto min-h-[75vh] max-w-5xl py-16 sm:py-20">
          <div className="life-heading max-w-3xl">
            <p className="eyebrow mb-5">Life records</p>
            <div className="life-title-row">
              <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
                {isChinese ? '生活記錄' : 'Life records'}
              </h1>
            </div>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              {isChinese ? '把路上遇見的光、風景與片刻，留在這裡。' : 'A collection of light, places, and little moments found along the way.'}
            </p>
          </div>
          <div className="life-masonry mt-14" aria-label={isChinese ? '生活照片' : 'Life photos'}>
            {lifeMasonryColumns.map((column, columnIndex) => (
              <div className="life-masonry-column" key={columnIndex}>
                {column.map(({ photo, index }) => (
                  <button
                    className="life-photo"
                    type="button"
                    onClick={() => setSelectedLifePhoto(photo)}
                    aria-label={isChinese ? `查看${photo.place[language]}照片` : `View photo from ${photo.place[language]}`}
                    key={photo.src}
                  >
                    <img src={photo.src} alt="" loading={index < 3 ? 'eager' : 'lazy'} />
                    <span className="life-photo-overlay">
                      <span>
                        <strong>{photo.place[language]}</strong>
                        <small>{photo.date[language]}</small>
                      </span>
                      <span className="life-photo-arrow" aria-hidden="true">↗</span>
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          {loadedLifePhotos.length < allLifePhotos.length && (
            <div ref={lifeLoadMoreRef} className="life-load-more-sentinel" aria-hidden="true" />
          )}
        </section>
      ) : pathname === '/about' ? (
        <section className="about-page mx-auto min-h-[75vh] max-w-5xl pt-16 pb-0 sm:pt-20">
          <div className="about-header grid items-start gap-8 lg:grid-cols-[1fr_280px]">
            <div className="about-heading max-w-3xl">
              <p className="eyebrow mb-5">{about.eyebrow[language]}</p>
              <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">{about.title[language]}</h1>
            </div>
            <a className="about-photo-card" href="https://www.linkedin.com/in/edwardhsu1994/" target="_blank" rel="noreferrer" aria-label="View Edward Hsu's LinkedIn profile">
              <span className="border-glow-frame">
                <img src={home.hero.photo.imageUrl} alt={content.name} />
              </span>
              <span>Edward Hsu <span aria-hidden="true">↗</span></span>
            </a>
          </div>
          <div className="about-wheel-layout mt-[20px] grid items-center gap-10 lg:grid-cols-[1fr_250px] lg:gap-20" onWheel={handleAboutWheel}>
            <div
              className="option-wheel lg:order-2"
              role="tablist"
              aria-label={isChinese ? '關於我的章節' : 'About me sections'}
              tabIndex={0}
              onKeyDown={handleAboutKeyDown}
            >
              <div className="wheel-viewport">
                {about.sections.map((section, index) => {
                  const distance = index - aboutSectionIndex
                  const absoluteDistance = Math.abs(distance)
                  const style = {
                    '--wheel-offset': `${distance * 4}rem`,
                    '--wheel-rotation': `${distance * -6}deg`,
                    '--wheel-scale': Math.max(0.72, 1 - absoluteDistance * 0.08),
                    '--wheel-opacity': Math.max(0.08, 1 - absoluteDistance * 0.26),
                    '--wheel-blur': `${absoluteDistance * 1.5}px`,
                  } as CSSProperties
                  return (
                    <button
                      className={index === aboutSectionIndex ? 'wheel-option selected' : 'wheel-option'}
                      key={section.id}
                      role="tab"
                      aria-selected={index === aboutSectionIndex}
                      style={style}
                      onClick={() => selectAboutSection(index)}
                    >
                      {section.label[language]}
                    </button>
                  )
                })}
              </div>
              <p className="wheel-hint">{isChinese ? '滾動或使用方向鍵' : 'Scroll or use arrow keys'}</p>
            </div>
            <article className="about-content lg:order-1" key={about.sections[aboutSectionIndex].id}>
              <p className="fact-label">{about.sections[aboutSectionIndex].kicker[language]}</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">{about.sections[aboutSectionIndex].title[language]}</h2>
              {about.sections[aboutSectionIndex].description[language] && (
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{about.sections[aboutSectionIndex].description[language]}</p>
              )}
              {about.sections[aboutSectionIndex].jobs && (
                <div className="experience-carousel mt-10" onWheel={handleExperienceWheel}>
                  <div className="experience-list">
                    {(() => {
                      const jobs = about.sections[aboutSectionIndex].jobs ?? []
                      const job = jobs[experienceIndex]
                      if (!job) return null
                      return (
                        <article className="experience-item" key={job.company[language]}>
                          <div className="experience-period">{job.period[language]}</div>
                          <div>
                            <h3 className="experience-company">{job.company[language]}</h3>
                            <p className="experience-role">{job.role[language]}</p>
                            <p className="mt-3 text-slate-300">{job.responsibilities[language]}</p>
                          </div>
                        </article>
                      )
                    })()}
                  </div>
                  <div className="experience-dots" role="tablist" aria-label={isChinese ? '工作經歷列表' : 'Work experience list'}>
                    {(about.sections[aboutSectionIndex].jobs ?? []).map((job, index) => (
                      <button
                        className={index === experienceIndex ? 'experience-dot active' : 'experience-dot'}
                        key={job.company[language]}
                        type="button"
                        role="tab"
                        aria-label={job.company[language]}
                        aria-selected={index === experienceIndex}
                        onClick={() => selectExperience(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {!about.sections[aboutSectionIndex].jobs && about.sections[aboutSectionIndex].items.length > 0 && (
                <div className="about-detail-grid mt-10 grid gap-4 sm:grid-cols-2">
                  {about.sections[aboutSectionIndex].items.map((item) => (
                    <div className="about-detail" key={item.label[language]}>
                      <p className="fact-label">{item.label[language]}</p>
                      <p className="mt-3 text-slate-200">{item.value[language]}</p>
                    </div>
                  ))}
                </div>
              )}
              {about.sections[aboutSectionIndex].education && (
                <div className="experience-carousel mt-10" onWheel={handleEducationWheel}>
                  <div className="experience-list">
                    {(() => {
                      const education = about.sections[aboutSectionIndex].education ?? []
                      const record = education[educationIndex]
                      if (!record) return null
                      return (
                        <article className="experience-item" key={record.institution[language]}>
                          <div className="experience-period">{record.period[language]}</div>
                          <div>
                            <h3 className="experience-company">{record.institution[language]}</h3>
                            <p className="experience-role">{record.degree[language]}</p>
                          </div>
                        </article>
                      )
                    })()}
                  </div>
                  <div className="experience-dots" role="tablist" aria-label={isChinese ? '學歷列表' : 'Education list'}>
                    {(about.sections[aboutSectionIndex].education ?? []).map((record, index) => (
                      <button
                        className={index === educationIndex ? 'experience-dot active' : 'experience-dot'}
                        key={record.institution[language]}
                        type="button"
                        role="tab"
                        aria-label={record.institution[language]}
                        aria-selected={index === educationIndex}
                        onClick={() => selectEducation(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
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
          <span className="border-glow-frame">
            <img src={home.hero.photo.imageUrl} alt={content.name} />
          </span>
          <span>Find me online <span aria-hidden="true">↗</span></span>
        </a>
      </section>
      )}
      {selectedLifePhoto && (
        <div
          className="life-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selectedLifePhoto.place[language]}
          onClick={() => setSelectedLifePhoto(null)}
        >
          <div className="life-modal-content" onClick={(event) => event.stopPropagation()}>
            <button className="life-modal-close" type="button" onClick={() => setSelectedLifePhoto(null)} aria-label={isChinese ? '關閉照片' : 'Close photo'}>
              <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <img src={selectedLifePhoto.src} alt="" />
            <div className="life-modal-caption">
              <div>
                <strong>{selectedLifePhoto.place[language]}</strong>
                <span>{selectedLifePhoto.date[language]}</span>
              </div>
              <span className="life-modal-hint">{isChinese ? '點擊背景或按 Esc 關閉' : 'Click outside or press Esc to close'}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
