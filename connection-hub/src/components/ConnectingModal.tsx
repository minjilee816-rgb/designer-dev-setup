import { useEffect, useState, type CSSProperties } from 'react'
import { B2 } from '@ids-ts/typography'
import type { Institution } from './products'
import styles from './ConnectingModal.module.css'

interface ConnectingModalProps {
  institution: Institution | null
  onComplete: () => void
  /** ms to remain on this state before triggering onComplete */
  duration?: number
}

export function ConnectingModal({
  institution,
  onComplete,
  duration = 1800,
}: ConnectingModalProps) {
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    if (!institution) {
      setLogoFailed(false)
      return
    }
    setLogoFailed(false)
    const timer = window.setTimeout(onComplete, duration)
    return () => window.clearTimeout(timer)
  }, [institution, onComplete, duration])

  if (!institution) return null

  const brandColor =
    institution.bgColor && institution.bgColor !== '#FFFFFF'
      ? institution.bgColor
      : institution.fallbackColor ?? '#0077C5'

  const cssVars: CSSProperties & Record<string, string> = {
    '--brand-color': brandColor,
    '--brand-bg':
      institution.bgColor && institution.bgColor !== '#FFFFFF'
        ? institution.bgColor
        : '#FFFFFF',
  }

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={`Connecting to ${institution.name}`}
    >
      <div className={styles.sheet} style={cssVars}>
        <div className={styles.logoStage}>
          <div
            className={styles.logoCenter}
            style={
              !institution.logoUrl || logoFailed
                ? { background: brandColor }
                : undefined
            }
          >
            {institution.logoUrl && !logoFailed ? (
              <img
                src={institution.logoUrl}
                alt=""
                className={styles.logoImg}
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className={styles.logoFallback}>
                {institution.name.charAt(0)}
              </span>
            )}
          </div>
          <div className={styles.spinner} aria-hidden="true" />
        </div>
        <B2 as="p" className={styles.label}>
          Connecting to{' '}
          <span className={styles.providerName}>{institution.name}</span>
        </B2>
      </div>
    </div>
  )
}
