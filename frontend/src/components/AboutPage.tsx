import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import type { WheelEvent as ReactWheelEvent } from 'react'
import type { About, AboutEducation, AboutFact, AboutJob, Language } from '../types'
import { useScrollHandlers } from '../hooks/useScrollHandlers'

type AboutPageProps = {
  about: About
  language: Language
  pathname: string
  appHref: (path: string) => string
  imageUrl: string
}

function ExperienceItem({ job, language }: { job: AboutJob; language: Language }) {
  return (
    <article className="experience-item">
      <div className="experience-period">{job.period[language]}</div>
      <div>
        <h3 className="experience-company">{job.company[language]}</h3>
        <p className="experience-role">{job.role[language]}</p>
        <p className="mt-3 text-slate-300">{job.responsibilities[language]}</p>
      </div>
    </article>
  )
}

function EducationItem({ record, language }: { record: AboutEducation; language: Language }) {
  return (
    <article className="experience-item">
      <div className="experience-period">{record.period[language]}</div>
      <div>
        <h3 className="experience-company">{record.institution[language]}</h3>
        <p className="experience-role">{record.degree[language]}</p>
      </div>
    </article>
  )
}

function AboutDetailGrid({ items, language, variant }: { items: AboutFact[]; language: Language; variant: 'desktop' | 'mobile' }) {
  const layoutClass = variant === 'desktop' ? 'mt-10 sm:grid-cols-2' : 'mt-8'
  return (
    <div className={`about-detail-grid grid gap-4 ${layoutClass}`}>
      {items.map((item) => (
        <div className="about-detail" key={item.label[language]}>
          <p className="fact-label">{item.label[language]}</p>
          <p className="mt-3 text-slate-200">{item.value[language]}</p>
        </div>
      ))}
    </div>
  )
}

type RecordCarouselProps<T> = {
  ariaLabel: string
  items: T[]
  selectedIndex: number
  itemLabel: (item: T) => string
  renderItem: (item: T) => ReactNode
  onSelect: (index: number) => void
  onWheel: (event: ReactWheelEvent<HTMLDivElement>) => void
}

function RecordCarousel<T>({
  ariaLabel,
  items,
  selectedIndex,
  itemLabel,
  renderItem,
  onSelect,
  onWheel,
}: RecordCarouselProps<T>) {
  const currentItem = items[selectedIndex]
  return (
    <div className="experience-carousel mt-10" onWheel={onWheel}>
      <div className="experience-list">
        {currentItem ? <Fragment key={itemLabel(currentItem)}>{renderItem(currentItem)}</Fragment> : null}
      </div>
      <div className="experience-dots" role="tablist" aria-label={ariaLabel}>
        {items.map((item, index) => (
          <button
            className={index === selectedIndex ? 'experience-dot active' : 'experience-dot'}
            key={itemLabel(item)}
            type="button"
            role="tab"
            aria-label={itemLabel(item)}
            aria-selected={index === selectedIndex}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  )
}

export function AboutPage({ about, language, pathname, appHref, imageUrl }: AboutPageProps) {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [experienceIndex, setExperienceIndex] = useState(0)
  const [educationIndex, setEducationIndex] = useState(0)

  const isChinese = language === 'zh-TW'

  useEffect(() => {
    setExperienceIndex(0)
    setEducationIndex(0)
  }, [sectionIndex])

  const selectSection = (index: number) => {
    if (!about || about.sections.length === 0) return
    const nextIndex = Math.max(0, Math.min(index, about.sections.length - 1))
    setSectionIndex(nextIndex)
    setExperienceIndex(0)
    setEducationIndex(0)
    const sectionId = about.sections[nextIndex].id
    if (window.location.hash !== `#${sectionId}`) {
      window.history.pushState({}, '', `${appHref(pathname)}#${sectionId}`)
    }
  }

  const selectExperience = (index: number) => {
    if (!about || about.sections.length === 0) return
    const jobs = about.sections[sectionIndex].jobs ?? []
    setExperienceIndex(Math.max(0, Math.min(index, jobs.length - 1)))
  }

  const selectEducation = (index: number) => {
    if (!about || about.sections.length === 0) return
    const education = about.sections[sectionIndex].education ?? []
    setEducationIndex(Math.max(0, Math.min(index, education.length - 1)))
  }

  const { handleAboutWheel, handleExperienceWheel, handleEducationWheel } = useScrollHandlers({
    about,
    aboutSectionIndex: sectionIndex,
    experienceIndex,
    educationIndex,
    selectAboutSection: selectSection,
    selectExperience,
    selectEducation,
  })

  // Sync section from hash
  useEffect(() => {
    if (!about || about.sections.length === 0) return undefined

    const syncSectionFromHash = () => {
      const sectionId = window.location.hash.replace(/^#/, '')
      if (pathname === '/about' && !sectionId) {
        window.history.replaceState({}, '', `${appHref('/about')}#${about.sections[0].id}`)
        setSectionIndex(0)
        return
      }
      const found = about.sections.findIndex((section) => section.id === sectionId)
      if (found >= 0) setSectionIndex(found)
    }

    syncSectionFromHash()
    window.addEventListener('hashchange', syncSectionFromHash)
    window.addEventListener('popstate', syncSectionFromHash)
    return () => {
      window.removeEventListener('hashchange', syncSectionFromHash)
      window.removeEventListener('popstate', syncSectionFromHash)
    }
  }, [about, appHref, pathname])

  // Keyboard navigation
  useEffect(() => {
    if (!about || about.sections.length === 0 || pathname !== '/about') return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return

      let nextIndex: number | null = null
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = Math.min(sectionIndex + 1, about.sections.length - 1)
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = Math.max(sectionIndex - 1, 0)
      if (nextIndex === null || nextIndex === sectionIndex) return

      event.preventDefault()
      setSectionIndex(nextIndex)
      const sectionId = about.sections[nextIndex].id
      window.history.pushState({}, '', `${appHref(pathname)}#${sectionId}`)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [about, sectionIndex, pathname, appHref])

  const currentSection = about?.sections?.[sectionIndex]

  return (
    <section className="about-page mx-auto min-h-[75vh] max-w-5xl pt-16 pb-0 sm:pt-20">
      <div className="about-header grid items-start gap-8 lg:grid-cols-[1fr_280px]">
        <div className="about-heading max-w-3xl">
          <p className="eyebrow mb-5">{about.eyebrow[language]}</p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">{about.title[language]}</h1>
        </div>
        <a className="about-photo-card" href="https://www.linkedin.com/in/edwardhsu1994/" target="_blank" rel="noreferrer" aria-label="View Edward Hsu's LinkedIn profile">
          <span className="border-glow-frame">
            <img src={imageUrl} alt="Edward Hsu" />
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
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
              event.preventDefault()
              selectSection(sectionIndex + 1)
            }
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
              event.preventDefault()
              selectSection(sectionIndex - 1)
            }
          }}
        >
          <div className="wheel-viewport">
            {about.sections.map((section, index) => {
              const distance = index - sectionIndex
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
                  className={index === sectionIndex ? 'wheel-option selected' : 'wheel-option'}
                  key={section.id}
                  role="tab"
                  aria-selected={index === sectionIndex}
                  style={style}
                  onClick={() => selectSection(index)}
                >
                  {section.label[language]}
                </button>
              )
            })}
          </div>
          <p className="wheel-hint">{isChinese ? '滾動或使用方向鍵' : 'Scroll or use arrow keys'}</p>
        </div>
        {currentSection && (
          <article className="about-content lg:order-1" key={currentSection.id}>
            <p className="fact-label">{currentSection.kicker[language]}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">{currentSection.title[language]}</h2>
            {currentSection.description[language] && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{currentSection.description[language]}</p>
            )}
            {currentSection.jobs && (
              <RecordCarousel
                ariaLabel={isChinese ? '工作經歷列表' : 'Work experience list'}
                items={currentSection.jobs}
                selectedIndex={experienceIndex}
                itemLabel={(job) => job.company[language]}
                renderItem={(job) => <ExperienceItem job={job} language={language} />}
                onSelect={selectExperience}
                onWheel={handleExperienceWheel}
              />
            )}
            {!currentSection.jobs && currentSection.items.length > 0 && (
              <AboutDetailGrid items={currentSection.items} language={language} variant="desktop" />
            )}
            {currentSection.education && (
              <RecordCarousel
                ariaLabel={isChinese ? '學歷列表' : 'Education list'}
                items={currentSection.education}
                selectedIndex={educationIndex}
                itemLabel={(record) => record.institution[language]}
                renderItem={(record) => <EducationItem record={record} language={language} />}
                onSelect={selectEducation}
                onWheel={handleEducationWheel}
              />
            )}
          </article>
        )}
        <div className="about-mobile-sections">
          {about.sections.map((section) => (
            <article className="about-mobile-section" key={section.id}>
              <p className="fact-label">{section.kicker[language]}</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white">{section.title[language]}</h2>
              {section.description[language] && (
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{section.description[language]}</p>
              )}
              {section.jobs && (
                <div className="about-mobile-records mt-8">
                  {section.jobs.map((job) => (
                    <ExperienceItem key={job.company[language]} job={job} language={language} />
                  ))}
                </div>
              )}
              {!section.jobs && section.items.length > 0 && (
                <AboutDetailGrid items={section.items} language={language} variant="mobile" />
              )}
              {section.education && (
                <div className="about-mobile-records mt-8">
                  {section.education.map((record) => (
                    <EducationItem key={record.institution[language]} record={record} language={language} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
