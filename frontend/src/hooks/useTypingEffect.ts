import { useEffect, useRef, useState } from 'react'
import type { TypingStage } from '../types'

type UseTypingEffectParams = {
  enabled: boolean
  greeting: string
  name: string
  intro: string
  imeAnime: Record<string, string>
  resetKey: string
}

type TypingResult = {
  typedGreeting: string
  typedName: string
  typedIntro: string
  typingStage: TypingStage
}

export function useTypingEffect({
  enabled,
  greeting,
  name,
  intro,
  imeAnime,
  resetKey,
}: UseTypingEffectParams): TypingResult {
  const initialTypingRef = useRef(true)
  const [typedGreeting, setTypedGreeting] = useState('')
  const [typedName, setTypedName] = useState('')
  const [typedIntro, setTypedIntro] = useState('')
  const [typingStage, setTypingStage] = useState<TypingStage>('waiting')

  useEffect(() => {
    if (!enabled) return undefined

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
    const nameStart = typingDelay + typingDuration(greeting)
    const introStart = nameStart + typingDuration(name) + 280
    const introSpeed = 40
    const doneAt = introStart + typingDuration(intro, introSpeed)
    timers.push(window.setTimeout(() => setTypingStage('greeting'), typingDelay))
    timers.push(window.setTimeout(() => setTypingStage('name'), nameStart))
    timers.push(window.setTimeout(() => setTypingStage('intro'), introStart))
    timers.push(window.setTimeout(() => setTypingStage('done'), doneAt))
    typeText(greeting, setTypedGreeting, typingDelay)
    typeText(name, setTypedName, nameStart)
    typeText(intro, setTypedIntro, introStart, introSpeed)

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [greeting, name, intro, imeAnime, enabled, resetKey])

  return { typedGreeting, typedName, typedIntro, typingStage }
}
