'use client'
import Link from 'next/link'

function BottomNav({ active }: { active: string }) {
  return (
    <nav className="bottom-nav">
      <Link href="/profile" className={`nav-item ${active==='profile'?'active':''}`}>
        <span className="nav-icon">👤</span><span>אזור אישי</span>
      </Link>
      <Link href="/games" className={`nav-item ${active==='games'?'active':''}`}>
        <span className="nav-icon">🃏</span><span>משחקים פעילים</span>
      </Link>
      <Link href="/upcoming" className={`nav-item ${active==='upcoming'?'active':''}`}>
        <span className="nav-icon">📅</span><span>משחקים קרובים</span>
      </Link>
    </nav>
  )
}

export default function UpcomingPage() {
  return (
    <div className="page" style={{background:'var(--bg)'}}>
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold">משחקים קרובים</h1>
          <button className="btn btn-gold text-sm py-2 px-4 w-auto">+ קבע משחק</button>
        </div>

        <div className="text-center py-12" style={{color:'var(--text3)'}}>
          <div className="text-5xl mb-3">📅</div>
          <p className="font-bold text-lg mb-1">אין משחקים מתוכננים</p>
          <p className="text-sm">קבע משחק עם חברים</p>
        </div>
      </div>
      <BottomNav active="upcoming" />
    </div>
  )
}
