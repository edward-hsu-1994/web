import { AvatarCard } from './AvatarCard'
import { useTypingEffect } from '../hooks/useTypingEffect'
import type { HeroButton, Language } from '../types'

type HeroSectionProps = {
  language: Language
  greeting: string
  name: string
  intro: string
  imeAnime: Record<string, string>
  buttons: HeroButton[]
  imageUrl: string
  imageAlt: string
}

export function HeroSection({
  language,
  greeting,
  name,
  intro,
  imeAnime,
  buttons,
  imageUrl,
  imageAlt,
}: HeroSectionProps) {
  const { typedGreeting, typedName, typedIntro, typingStage } = useTypingEffect({
    enabled: true,
    greeting,
    name,
    intro,
    imeAnime,
    resetKey: language,
  })

  return (
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
          {buttons.map((button) => (
            button.type === 'link' && (
              <a className={button.class} href={button.link} target="_blank" rel="noreferrer" key={button.link}>
                {button.text[language]}{button.class === 'primary-button' && <span aria-hidden="true"> ↗</span>}
              </a>
            )
          ))}
        </div>
      </div>

      <AvatarCard
        href="https://gravatar.com/edwardhsu1994"
        ariaLabel="View Edward Hsu's Gravatar profile"
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        caption="Find me online"
      />
    </section>
  )
}
