import type { Language, LifePhoto } from '../types'

type PhotoModalProps = {
  photo: LifePhoto
  language: Language
  onClose: () => void
}

export function PhotoModal({ photo, language, onClose }: PhotoModalProps) {
  return (
    <div
      className="life-modal"
      role="dialog"
      aria-modal="true"
      aria-label={photo.place[language]}
      onClick={onClose}
    >
      <div className="life-modal-content" onClick={(event) => event.stopPropagation()}>
        <button className="life-modal-close" type="button" onClick={onClose} aria-label={language === 'zh-TW' ? '關閉照片' : 'Close photo'}>
          <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <img src={photo.src} alt="" />
        <div className="life-modal-caption">
          <div>
            <strong>{photo.place[language]}</strong>
            <span>{photo.date[language]}</span>
          </div>
          <span className="life-modal-hint">{language === 'zh-TW' ? '點擊背景或按 Esc 關閉' : 'Click outside or press Esc to close'}</span>
        </div>
      </div>
    </div>
  )
}