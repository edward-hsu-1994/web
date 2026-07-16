import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function App() {
  return (
    <main className="site-shell page-enter min-h-screen px-6 py-8 text-white sm:px-12 sm:py-12">
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="brand-mark">EH<span>.</span></span>
        <div className="nav-links flex gap-3 text-sm text-slate-300">
          <a className="nav-link" href="https://github.com/edward-hsu-1994" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="nav-link" href="https://gravatar.com/edwardhsu1994" target="_blank" rel="noreferrer">
            Gravatar
          </a>
        </div>
      </nav>

      <section className="hero mx-auto grid min-h-[75vh] max-w-5xl items-center gap-12 py-20 lg:grid-cols-[1fr_280px]">
        <div className="hero-copy">
          <p className="eyebrow mb-5">Personal website</p>
          <h1 className="hero-title max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
            Hi, I&apos;m <span className="text-cyan-300">Edward Hsu.</span>
          </h1>
          <p className="hero-intro mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Software developer focused on building thoughtful digital experiences and useful products.
          </p>
          <div className="hero-actions mt-9 flex flex-wrap gap-4">
            <a className="primary-button" href="https://github.com/edward-hsu-1994" target="_blank" rel="noreferrer">
              Explore my GitHub <span aria-hidden="true">↗</span>
            </a>
            <a className="secondary-button" href="https://gravatar.com/edwardhsu1994" target="_blank" rel="noreferrer">
              View profile
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
