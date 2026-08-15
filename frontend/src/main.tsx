/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import aboutData from '../api/about.json'
import homeData from '../api/home.json'
import lifeRecordsData from '../api/life-records.json'
import navigationData from '../api/navigation.json'
import portfolioData from '../api/portfolio.json'
import { NavBar } from './components/NavBar'
import { HeroSection } from './components/HeroSection'
import { PortfolioPage } from './components/PortfolioPage'
import { LifeRecordsPage } from './components/LifeRecordsPage'
import { PhotoModal } from './components/PhotoModal'
import { AboutPage } from './components/AboutPage'
import type { Language, Home, Navigation, About, LifeRecords, Portfolio, LifePhoto } from './types'
import './index.css'

const APP_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')
const toAppPath = () => {
  const rawPath = window.location.pathname
  const appPath = APP_BASE_PATH && rawPath.startsWith(APP_BASE_PATH) ? rawPath.slice(APP_BASE_PATH.length) : rawPath
  return appPath.replace(/\/+$/, '') || '/'
}
const toAppHref = (path: string) => `${APP_BASE_PATH}${path}`

const allLifePhotos = [...((lifeRecordsData as LifeRecords | undefined)?.items ?? [])].sort((a, b) => {
  const parseDate = (value: string | null | undefined) => {
    if (!value) return Number.NEGATIVE_INFINITY
    const parsed = Date.parse(`${value}T00:00:00`)
    return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed
  }
  const dateA = parseDate(a.date.value)
  const dateB = parseDate(b.date.value)
  if (dateA === dateB) return 0
  return dateB - dateA
})

const EMPTY_IME_ANIME: Record<string, string> = {}

function App() {
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const [pathname, setPathname] = useState(toAppPath)
  const [language, setLanguage] = useState<Language>(() => {
    let savedLanguage: string | null
    try {
      savedLanguage = localStorage.getItem('preferred-language')
    } catch {
      savedLanguage = null
    }
    if (savedLanguage === 'zh' || savedLanguage === 'zh-TW') return 'zh-TW'
    return 'en-US'
  })
  const [selectedLifePhoto, setSelectedLifePhoto] = useState<LifePhoto | null>(null)

  const home = homeData as Home
  const navigation = navigationData as Navigation
  const about = aboutData as About
  const portfolio = portfolioData as Portfolio
  const content = home?.hero.content[language] ?? home?.hero.content['en-US']
  const imeAnime = home?.hero.content_ime_anime?.['zh-TW'] ?? EMPTY_IME_ANIME
  const heroButtons = home?.hero?.buttons?.items ?? []
  const navigationItems = navigation?.items ?? []

  useEffect(() => {
    try {
      localStorage.setItem('preferred-language', language)
    } catch {
      // storage unavailable (private mode / blocked cookies)
    }
  }, [language])

  useEffect(() => {
    const handlePopState = () => setPathname(toAppPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (pathname !== '/life-records') {
      setSelectedLifePhoto(null)
      return undefined
    }
  }, [pathname])

  useEffect(() => {
    if (!selectedLifePhoto) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedLifePhoto(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedLifePhoto])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cursorGlowRef.current?.style.setProperty('--cursor-x', `${event.clientX}px`)
      cursorGlowRef.current?.style.setProperty('--cursor-y', `${event.clientY}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const navigateToPath = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault()
    window.history.pushState({}, '', path === '/about' ? `${toAppHref(path)}#profile` : toAppHref(path))
    setPathname(path)
    if (path === '/about') window.scrollTo(0, 0)
  }

  return (
    <main className="site-shell page-enter min-h-screen px-6 py-8 text-white sm:px-12 sm:py-12">
      <div className="cursor-glow" ref={cursorGlowRef} aria-hidden="true" />
      <NavBar
        items={navigationItems}
        language={language}
        pathname={pathname}
        onNavigate={navigateToPath}
        onSelectLanguage={setLanguage}
        appHref={toAppHref}
      />

      {pathname === '/portfolio' ? (
        <PortfolioPage items={portfolio.items ?? []} language={language} />
      ) : pathname === '/life-records' ? (
        <LifeRecordsPage photos={allLifePhotos} language={language} onSelectPhoto={setSelectedLifePhoto} />
      ) : pathname === '/about' ? (
        <AboutPage about={about} language={language} pathname={pathname} appHref={toAppHref} imageUrl={home.hero.photo.imageUrl} />
      ) : (
        <HeroSection
          language={language}
          greeting={content?.greeting ?? ''}
          name={content?.name ?? ''}
          intro={content?.intro ?? ''}
          imeAnime={imeAnime}
          buttons={heroButtons}
          imageUrl={home.hero.photo.imageUrl}
          imageAlt={content?.name ?? ''}
        />
      )}

      {selectedLifePhoto && (
        <PhotoModal photo={selectedLifePhoto} language={language} onClose={() => setSelectedLifePhoto(null)} />
      )}
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)