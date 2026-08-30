export type Language = 'en-US' | 'zh-TW'

export type TypingStage = 'waiting' | 'greeting' | 'name' | 'intro' | 'done'

export type HeroContent = {
  greeting: string
  name: string
  title: string
  intro: string
}

export type HeroButton = {
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

export type Home = {
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

export type NavigationItem = {
  text: string | {
    'en-US': string
    'zh-TW': string
  }
  type: 'link' | 'path'
  link?: string
  path?: string
  l10n_supported_fields?: string[]
}

export type Navigation = {
  l10n_supported_fields: string[]
  items: NavigationItem[]
}

export type AboutFact = {
  label: Record<Language, string>
  value: Record<Language, string>
}

export type AboutJob = {
  company: Record<Language, string>
  role: Record<Language, string>
  period: Record<Language, string>
  responsibilities: Record<Language, string>
}

export type AboutEducation = {
  institution: Record<Language, string>
  degree: Record<Language, string>
  period: Record<Language, string>
}

export type About = {
  l10n_supported_fields: string[]
  eyebrow: Record<Language, string>
  title: Record<Language, string>
  intro: Record<Language, string>
  facts: AboutFact[]
  sections: AboutSection[]
}

export type AboutSection = {
  id: string
  label: Record<Language, string>
  kicker: Record<Language, string>
  title: Record<Language, string>
  description: Record<Language, string>
  items: AboutFact[]
  jobs?: AboutJob[]
  education?: AboutEducation[]
}

export type LifePhoto = {
  src: string
  place: Record<Language, string>
  date: Record<Language, string> & { value: string | null }
  l10n_supported_fields?: string[]
}

export type LifeRecords = {
  l10n_supported_fields: string[]
  items: LifePhoto[]
}

export type PortfolioProject = {
  id: string
  title: Record<Language, string>
  description: Record<Language, string>
  about: Record<Language, string>
  tags: string[]
  link: string
  link_label: Record<Language, string>
  l10n_supported_fields?: string[]
}

export type Portfolio = {
  l10n_supported_fields: string[]
  items: PortfolioProject[]
}
