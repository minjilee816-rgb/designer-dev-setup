import { useState } from 'react'
import type { Institution } from './products'
import styles from './InstitutionLogo.module.css'

interface InstitutionLogoProps {
  institution: Institution
  className?: string
}

export function InstitutionLogo({
  institution,
  className,
}: InstitutionLogoProps) {
  const [failed, setFailed] = useState(false)
  const initial = institution.name.trim().charAt(0).toUpperCase()
  const bg = failed
    ? institution.fallbackColor ?? institution.bgColor
    : institution.bgColor
  const isLightBg = bg === '#FFFFFF'

  return (
    <div
      className={`${styles.logo} ${className ?? ''}`}
      style={{
        backgroundColor: bg,
        border: isLightBg
          ? '1px solid var(--color-container-border-primary)'
          : 'none',
      }}
      aria-hidden="true"
    >
      {failed ? (
        <span
          className={styles.initial}
          style={{ color: isLightBg ? 'var(--color-text-primary)' : '#FFFFFF' }}
        >
          {initial}
        </span>
      ) : (
        <img
          src={institution.logoUrl}
          alt=""
          className={styles.img}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
