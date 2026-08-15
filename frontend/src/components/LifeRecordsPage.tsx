import { useEffect, useRef, useState } from 'react'
import type { Language, LifePhoto } from '../types'

const LIFE_PAGE_SIZE = 20

type LifeRecordsPageProps = {
  photos: LifePhoto[]
  language: Language
  onSelectPhoto: (photo: LifePhoto) => void
}

function getLifeMasonryColumnCount() {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth < 640) return 2
  if (window.innerWidth < 900) return 2
  return 3
}

export function LifeRecordsPage({ photos, language, onSelectPhoto }: LifeRecordsPageProps) {
  const [loadedPhotos, setLoadedPhotos] = useState(() => photos.slice(0, LIFE_PAGE_SIZE))
  const [columnCount, setColumnCount] = useState(getLifeMasonryColumnCount)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => setColumnCount(getLifeMasonryColumnCount())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (loadedPhotos.length >= photos.length) return undefined
    const sentinel = loadMoreRef.current
    if (!sentinel) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setLoadedPhotos((current) => [
        ...current,
        ...photos.slice(current.length, current.length + LIFE_PAGE_SIZE),
      ])
    }, { rootMargin: '320px 0px' })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadedPhotos.length, photos])

  const columns = Array.from({ length: columnCount }, () => [] as Array<{ photo: LifePhoto; index: number }>)
  loadedPhotos.forEach((photo, index) => {
    columns[index % columnCount].push({ photo, index })
  })

  return (
    <section className="life-page mx-auto min-h-[75vh] max-w-5xl py-16 sm:py-20">
      <div className="life-heading max-w-3xl">
        <p className="eyebrow mb-5">Life records</p>
        <div className="life-title-row">
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl">
            {language === 'zh-TW' ? '生活記錄' : 'Life records'}
          </h1>
        </div>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
          {language === 'zh-TW' ? '把路上遇見的光、風景與片刻，留在這裡。' : 'A collection of light, places, and little moments found along the way.'}
        </p>
      </div>
      <div className="life-masonry mt-14" aria-label={language === 'zh-TW' ? '生活照片' : 'Life photos'}>
        {columns.map((column, columnIndex) => (
          <div className="life-masonry-column" key={columnIndex}>
            {column.map(({ photo, index }) => (
              <button
                className="life-photo"
                type="button"
                onClick={() => onSelectPhoto(photo)}
                aria-label={language === 'zh-TW' ? `查看${photo.place[language]}照片` : `View photo from ${photo.place[language]}`}
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
      {loadedPhotos.length < photos.length && (
        <div ref={loadMoreRef} className="life-load-more-sentinel" aria-hidden="true" />
      )}
    </section>
  )
}