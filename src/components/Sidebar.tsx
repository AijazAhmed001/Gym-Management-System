'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { getInitials } from '@/lib/utils'
import { useState, useEffect } from 'react'

type NavItem = { href: string; label: string; icon: string; badge?: number }

type Props = {
  user: { name?: string | null; email?: string | null; role?: string }
  navItems: NavItem[]
  bottomItems?: NavItem[]
}

export default function Sidebar({ user, navItems, bottomItems }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const NavLinks = () => (
    <>
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
          onClick={() => setOpen(false)}
        >
          <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
          <span>{item.label}</span>
          {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
        </Link>
      ))}

      {bottomItems && bottomItems.length > 0 && (
        <>
          <div style={{ height: 1, background: 'var(--border)', margin: '0.75rem 0' }} />
          {bottomItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </>
      )}
    </>
  )

  return (
    <>
      {/* ── Mobile Top Bar ────────────────────────────────────────────── */}
      <header className="mobile-topbar">
        <button
          className="hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${open ? 'open-1' : ''}`} />
          <span className={`hamburger-line ${open ? 'open-2' : ''}`} />
          <span className={`hamburger-line ${open ? 'open-3' : ''}`} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="sidebar-logo-icon" style={{ width: 32, height: 32, borderRadius: 8, fontSize: '1rem' }}>🏋️</div>
          <span className="sidebar-logo-text" style={{ fontSize: '1rem' }}>IronPeak</span>
        </div>

        <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
          {getInitials(user.name || 'U')}
        </div>
      </header>

      {/* ── Overlay (mobile) ─────────────────────────────────────────── */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏋️</div>
          <div>
            <div className="sidebar-logo-text">IronPeak</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '-2px' }}>
              {user.role === 'ADMIN' ? 'Admin Portal' : 'Member Portal'}
            </div>
          </div>
          {/* Close button (mobile) */}
          <button
            className="sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >✕</button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavLinks />
        </nav>

        {/* User / Sign out */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{getInitials(user.name || 'U')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem', borderRadius: '6px', transition: 'color 0.2s' }}
              title="Sign out"
            >🚪</button>
          </div>
        </div>
      </aside>
    </>
  )
}
