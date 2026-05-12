import type { ReactNode } from 'react'

interface Props {
  title: string
  activeNav: string
  headerRight?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

const navItems = ['Dashboard', 'Documents', 'Review Cycles', 'Comment Queue', 'Team']

export default function Shell({ title, activeNav, headerRight, footer, children }: Props) {
  return (
    <div className="screen">
      <aside className="sidebar">
        <div className="sidebar__brand">MedWrite AI</div>
        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item}
              className={`sidebar__item${item === activeNav ? ' sidebar__item--active' : ''}`}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="main__header">
          <span className="main__title">{title}</span>
          {headerRight && <div className="main__header-right">{headerRight}</div>}
        </header>
        <div className="main__body">{children}</div>
        {footer && <footer className="main__footer">{footer}</footer>}
      </div>
    </div>
  )
}
