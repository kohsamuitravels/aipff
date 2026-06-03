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

export default function GamesPage() {
  return (
    <div className="page" style={{background:'var(--bg)'}}>
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold">משחקים פעילים</h1>
        </div>

        {/* New game buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="card p-4 text-center fade-up" style={{border:'1px solid rgba(255,215,0,0.2)'}}>
            <div className="text-3xl mb-2">💵</div>
            <div className="font-bold text-sm">קאש</div>
            <div className="text-xs mt-1" style={{color:'var(--text3)'}}>משחק פתוח</div>
          </button>
          <button className="card p-4 text-center fade-up" style={{animationDelay:'0.05s',border:'1px solid rgba(211,47,47,0.2)'}}>
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold text-sm">טורניר</div>
            <div className="text-xs mt-1" style={{color:'var(--text3)'}}>עם דרגות</div>
          </button>
        </div>

        <div className="text-center py-12" style={{color:'var(--text3)'}}>
          <div className="text-5xl mb-3">🃏</div>
          <p className="font-bold text-lg mb-1">אין משחקים פעילים</p>
          <p className="text-sm">בחר סוג משחק למעלה כדי להתחיל</p>
        </div>
      </div>
      <BottomNav active="games" />
    </div>
  )
}
