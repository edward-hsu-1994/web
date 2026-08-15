type AvatarCardProps = {
  href: string
  ariaLabel: string
  imageUrl: string
  imageAlt: string
  caption: string
  captionSuffix?: string
}

export function AvatarCard({ href, ariaLabel, imageUrl, imageAlt, caption, captionSuffix = '↗' }: AvatarCardProps) {
  return (
    <a className="avatar-card" href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
      <span className="border-glow-frame">
        <img src={imageUrl} alt={imageAlt} />
      </span>
      <span>
        {caption} <span aria-hidden="true">{captionSuffix}</span>
      </span>
    </a>
  )
}
