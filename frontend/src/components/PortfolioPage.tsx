import type { Language, PortfolioProject } from '../types'

type PortfolioPageProps = {
  items: PortfolioProject[]
  language: Language
}

export function PortfolioPage({ items, language }: PortfolioPageProps) {
  return (
    <section className="portfolio-page mx-auto min-h-[75vh] max-w-5xl py-20">
      <p className="eyebrow mb-5">Portfolio</p>
      <div className="life-title-row">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
          {language === 'zh-TW' ? '作品集' : 'Selected work'}
        </h1>
      </div>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
        {language === 'zh-TW' ? '這裡將展示我的作品與實作專案。' : 'A collection of projects, experiments, and thoughtful digital experiences.'}
      </p>
      <div className="portfolio-grid mt-14">
        {items.map((project, index) => (
          <article className="portfolio-card" key={project.id}>
            <div className="portfolio-card-topline">
              <span className="eyebrow">Project</span>
              <span className="portfolio-card-index">{String(index + 1).padStart(2, '0')}</span>
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
  )
}