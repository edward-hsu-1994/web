import { Fragment } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import type { Language, NavigationItem } from '../types'

type NavBarProps = {
  items: NavigationItem[]
  language: Language
  pathname: string
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => void
  onSelectLanguage: (language: Language) => void
  appHref: (path: string) => string
}

export function NavBar({ items, language, pathname, onNavigate, onSelectLanguage, appHref }: NavBarProps) {
  const isChinese = language === 'zh-TW'
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between">
      <span className="brand-mark">EH<span>.</span></span>
      <div className="nav-links flex items-center gap-3 text-sm text-slate-300">
        {items.map((item, index) => (
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
                href={appHref(item.path)}
                onClick={(event) => onNavigate(event, item.path!)}
              >
                {typeof item.text === 'string' ? item.text : item.text[language]}
              </a>
            )}
          </Fragment>
        ))}
        <span className="nav-divider" aria-hidden="true">|</span>
        <div className="language-switcher" aria-label="Language selector">
          <button className={isChinese ? 'language-option active' : 'language-option'} type="button" onClick={() => onSelectLanguage('zh-TW')}>
            中文
          </button>
          <span aria-hidden="true">/</span>
          <button className={!isChinese ? 'language-option active' : 'language-option'} type="button" onClick={() => onSelectLanguage('en-US')}>
            English
          </button>
        </div>
      </div>
    </nav>
  )
}
