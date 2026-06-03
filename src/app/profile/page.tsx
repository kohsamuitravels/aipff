'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://ygzlvttolouwxddzqnie.supabase.co',
  'sb_publishable_JBM60jMgROMpj2kKcGmElQ_4-c8iu64'
)

function BottomNav({ active }: { active: string }) {
  return (
    <nav className="bottom-nav">
      <Link href="/profile" className={`nav-item ${active==='profile'?'active':''}`}>
        <span className="nav-icon">👤</span>
        <span>אזור אישי</span>
      </Link>
      <Link href="/games" className={`nav-item ${active==='games'?'active':''}`}>
        <span className="nav-icon">🃏</span>
        <span>משחקים פעילים</span>
      </Link>
      <Link href="/upcoming" className={`nav-item ${active==='upcoming'?'active':''}`}>
        <span className="nav-icon">📅</span>
        <span>משחקים קרובים</span>
      </Link>
    </nav>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [nickname, setNickname] = useState('')
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/'); return }
      setUser(data.user)
      setNickname(data.user.user_metadata?.nickname || data.user.user_metadata?.full_name?.split(' ')[0] || 'שחקן')
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    await sb.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl animate-pulse">🃏</div>
    </div>
  )

  const initials = (user?.user_metadata?.full_name || 'S').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2)

  return (
    <div className="page" style={{background:'var(--bg)'}}>
      {/* Header */}
      <div className="relative" style={{background:'linear-gradient(180deg,rgba(211,47,47,0.15) 0%,transparent 100%)',paddingTop:'env(safe-area-inset-top)'}}>
        <div className="flex items-center justify-between px-4 py-4">
          <div className="font-display text-2xl font-bold" style={{color:'var(--gold)'}}>AIPFF</div>
          <button onClick={handleLogout} className="text-sm px-3 py-1.5 rounded-lg" 
            style={{background:'var(--bg3)',color:'var(--text2)'}}>
            יציאה
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Profile card */}
        <div className="card-highlight p-5 mb-4 fade-up">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold font-display"
                style={{background:'linear-gradient(135deg,#d32f2f,#7b1a1a)',border:'2px solid rgba(255,215,0,0.3)'}}>
                {initials}
              </div>
              <button className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{background:'var(--gold)',color:'#000'}}>
                📷
              </button>
            </div>
            {/* Name */}
            <div className="flex-1">
              <div className="font-bold text-lg">{user?.user_metadata?.full_name || 'שחקן'}</div>
              <div className="text-sm mt-0.5" style={{color:'var(--gold)'}}>@{nickname}</div>
              <div className="text-xs mt-1" style={{color:'var(--text3)'}}>{user?.email}</div>
            </div>
            <button onClick={() => setEditing(!editing)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{background:'var(--bg3)'}}>
              ✏️
            </button>
          </div>

          {editing && (
            <div className="space-y-2 fade-up">
              <input className="input text-sm" placeholder="כינוי בשולחן"
                value={nickname} onChange={e => setNickname(e.target.value)} />
              <button onClick={() => setEditing(false)} className="btn btn-gold text-sm py-2.5">
                שמור שינויים
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 fade-up" style={{animationDelay:'0.1s'}}>
          {[
            { label: 'משחקים', value: '0', icon: '🎮' },
            { label: 'ניצחונות', value: '0%', icon: '🏆' },
            { label: 'רווח כולל', value: '₪0', icon: '💰' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-bold text-lg" style={{color:'var(--gold)'}}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{color:'var(--text3)'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Friends */}
        <div className="card p-4 mb-4 fade-up" style={{animationDelay:'0.15s'}}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">חברים</h3>
            <button className="text-sm font-semibold" style={{color:'var(--gold)'}}>+ הוסף</button>
          </div>
          <div className="text-center py-4" style={{color:'var(--text3)'}}>
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm">עדיין אין חברים — הזמן חברים לשחק!</p>
          </div>
        </div>

        {/* Recent games */}
        <div className="card p-4 fade-up" style={{animationDelay:'0.2s'}}>
          <h3 className="font-bold mb-3">משחקים אחרונים</h3>
          <div className="text-center py-4" style={{color:'var(--text3)'}}>
            <div className="text-3xl mb-2">🃏</div>
            <p className="text-sm">עדיין לא שיחקת — בוא נתחיל!</p>
            <Link href="/games">
              <button className="btn btn-red mt-3 text-sm py-2.5">
                פתח משחק חדש
              </button>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  )
}
