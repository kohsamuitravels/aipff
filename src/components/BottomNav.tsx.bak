'use client'
import Link from 'next/link'

export default function BottomNav({ active }: { active: string }) {
  return (
    <nav className="bottom-nav">
      <Link href="/profile" className={`nav-item ${active === 'profile' ? 'active' : ''}`}>
        <span className="nav-icon">👤</span>
        <span>פרופיל</span>
      </Link>
      <Link href="/join-table" className={`nav-item ${active === 'join' ? 'active' : ''}`}>
        <span className="nav-icon">🃏</span>
        <span>הצטרף</span>
      </Link>
      <Link href="/create-table" className={`nav-item ${active === 'create' ? 'active' : ''}`}>
        <span className="nav-icon">➕</span>
        <span>פתח שולחן</span>
      </Link>
      <Link href="/games" className={`nav-item ${active === 'games' ? 'active' : ''}`}>
        <span className="nav-icon">📅</span>
        <span>המשחקים שלי</span>
      </Link>
    </nav>
  )
}
