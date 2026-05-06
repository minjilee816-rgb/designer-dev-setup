import type { ReactNode } from 'react'

interface Props {
  title: string
  activeNav: string
  children: ReactNode
}

const navItems = ['Dashboard', 'Documents', 'Review Cycles', 'Comment Queue', 'Team']

export default function Shell({ title, activeNav, children }: Props) {
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
        <header className="main__header">{title}</header>
        <div className="main__body">{children}</div>
      </div>
    </div>
  )
}
