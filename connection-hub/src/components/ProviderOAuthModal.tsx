import { useEffect, useState, type CSSProperties } from 'react'
import { Menu, ChevronRight, Search } from '@design-systems/icons'
import type { Institution } from './products'
import styles from './ProviderOAuthModal.module.css'

interface ProviderOAuthModalProps {
  institution: Institution | null
  onClose: () => void
  onSuccess: () => void
}

export function ProviderOAuthModal({
  institution,
  onClose,
  onSuccess,
}: ProviderOAuthModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    if (!institution) {
      setUsername('')
      setPassword('')
      setRemember(false)
      setLogoFailed(false)
      return
    }
    setLogoFailed(false)
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [institution, onClose])

  if (!institution) return null

  const brandColor =
    institution.bgColor && institution.bgColor !== '#FFFFFF'
      ? institution.bgColor
      : institution.fallbackColor ?? '#1A1A1A'

  const cssVars: CSSProperties & Record<string, string> = {
    '--brand-color': brandColor,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess()
  }

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.window}
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-oauth-title"
        onClick={(e) => e.stopPropagation()}
        style={cssVars}
      >
        <div className={styles.titleBar}>
          <div className={styles.trafficLights}>
            <button
              type="button"
              className={`${styles.trafficDot} ${styles.trafficRed}`}
              aria-label="Close"
              onClick={onClose}
            />
            <span
              className={`${styles.trafficDot} ${styles.trafficYellow}`}
              aria-hidden="true"
            />
            <span
              className={`${styles.trafficDot} ${styles.trafficGreen}`}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className={styles.brandBar} style={{ background: brandColor }}>
          <button
            type="button"
            className={styles.brandIconBtn}
            aria-label="Menu"
          >
            <Menu size="small" />
          </button>
          {institution.logoUrl && !logoFailed ? (
            <div className={styles.brandLogo}>
              <img
                src={institution.logoUrl}
                alt=""
                className={styles.brandLogoImg}
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <span className={styles.brandWordmark}>{institution.name}</span>
          )}
          <button
            type="button"
            className={styles.brandIconBtn}
            aria-label="Search"
          >
            <Search size="small" />
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit}>
          <h1 id="provider-oauth-title" className={styles.title}>
            Welcome
          </h1>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <input
                type="text"
                className={styles.input}
                placeholder="Username"
                aria-label="Username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                aria-label="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className={styles.tokenLink}>
              Use token <ChevronRight size="small" />
            </button>
          </div>

          <button type="submit" className={styles.signInBtn}>
            Sign in
          </button>

          <div className={styles.helpLinks}>
            <button type="button" className={styles.helpLink}>
              Forgot username/password? <ChevronRight size="small" />
            </button>
            <button type="button" className={styles.helpLink}>
              Not enrolled? Sign up now. <ChevronRight size="small" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
