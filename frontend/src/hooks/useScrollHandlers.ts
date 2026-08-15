import { useRef } from 'react'
import type { WheelEvent as ReactWheelEvent } from 'react'
import type { About } from '../types'

export type UseScrollHandlersParams = {
  about: About
  aboutSectionIndex: number
  experienceIndex: number
  educationIndex: number
  selectAboutSection: (index: number) => void
  selectExperience: (index: number) => void
  selectEducation: (index: number) => void
}

export type ScrollHandlers = {
  handleAboutWheel: (event: ReactWheelEvent<HTMLDivElement>) => void
  handleExperienceWheel: (event: ReactWheelEvent<HTMLDivElement>) => void
  handleEducationWheel: (event: ReactWheelEvent<HTMLDivElement>) => void
}

export function useScrollHandlers({
  about,
  aboutSectionIndex,
  experienceIndex,
  educationIndex,
  selectAboutSection,
  selectExperience,
  selectEducation,
}: UseScrollHandlersParams): ScrollHandlers {
  const aboutWheelCooldownRef = useRef(0)
  const experienceWheelCooldownRef = useRef(0)
  const educationWheelCooldownRef = useRef(0)

  const handleAboutWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 4 || !about || about.sections.length === 0) return
    if (window.innerWidth < 640) return
    const now = Date.now()
    if (now - aboutWheelCooldownRef.current < 300) return
    aboutWheelCooldownRef.current = now
    event.preventDefault()
    selectAboutSection(aboutSectionIndex + (event.deltaY > 0 ? 1 : -1))
  }

  const handleExperienceWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 4 || !about || about.sections.length === 0) return
    const jobs = about.sections[aboutSectionIndex].jobs ?? []
    if (jobs.length < 2) return
    event.preventDefault()
    event.stopPropagation()
    const now = Date.now()
    if (now - experienceWheelCooldownRef.current < 300) return
    experienceWheelCooldownRef.current = now
    selectExperience(experienceIndex + (event.deltaY > 0 ? 1 : -1))
  }

  const handleEducationWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 4 || !about || about.sections.length === 0) return
    const education = about.sections[aboutSectionIndex].education ?? []
    if (education.length < 2) return
    event.preventDefault()
    event.stopPropagation()
    const now = Date.now()
    if (now - educationWheelCooldownRef.current < 300) return
    educationWheelCooldownRef.current = now
    selectEducation(educationIndex + (event.deltaY > 0 ? 1 : -1))
  }

  return { handleAboutWheel, handleExperienceWheel, handleEducationWheel }
}