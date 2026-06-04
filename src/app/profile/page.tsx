'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'

const MOCK_STATS = {
  hands: 247,
  winRate: 34,
  profit: 840,
  maxLoss: 320,
  vpip: 28,
  pfr: 18,
  af: 2.4,
  nemesis: { name: 'Yoni Levi', initials: 'YL', color: '#166534', games: 14, loss: 480 },
  topHands: [
    { name: 'A-A (Pocket Aces)', hands: 8, wins: 7, pct: 87 },
    { name: 'K-K (Pocket Kings)', hands: 11, wins: 8, pct: 72 },
    { name: 'A-K suited', hands: 15, wins: 9, pct: 60 },
    { name: 'Q-Q (Pocket Queens)', hands: 9, wins: 5, pct: 55 },
    { name: '7-2 offsuit 😅', hands: 3, wins: 0, pct: 0 },
  ]
}

const FRIENDS = [
  { name: 'Yoni Levi', nick: 'yoni_l', initials: 'YL', color: '#166534', online: true },
  { name: 'Moshe Cohen', nick: 'moshek', initials: 'MK', color: '#1d4ed8', online: true },
  { name: 'Rina Katz', nick: 'rina_k', initials: 'RK', color: '#7c3aed', online: false },
]

function PctBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s' }} />
    </div>
  )
}

function pctColor(v: number) {
  if (v >= 60) return '#22c55e'
  if (v >= 35) return '#f59e0b'
  return '#f87171'
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'profile'|'stats'|'friends'|'edit'>('profile')
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [friendInput, setFriendInput] = useState('')

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
        window.history.replaceState({}, '', '/profile')
      }
      const { data } = await supabase.auth.getUser()
      if (!data.user) { router.push('/'); return }
      setUser(data.user)
      setNickname(data.user.user_metadata?.nickname || data.user.user_metadata?.full_name?.split(' ')[0] || 'שחקן')
      setBio(data.user.user_metadata?.bio || '')
      setLoading(false)
    }
    init()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function saveProfile() {
    await supabase.auth.updateUser({ data: { nickname, bio } })
    alert('נשמר!')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="font-display text-4xl animate-pulse">🃏</div>
    </div>
  )

  const initials = (user?.user_metadata?.full_name || 'S')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const onlineFriends = FRIENDS.filter(f => f.online)
  const offlineFriends = FRIENDS.filter(f => !f.online)

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      {/* Cover */}
      <div style={{ height: 110, background: 'linear-gradient(135deg,#0f3d18,#1a5c2a,#0a2d12)', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -38, right: 20 }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%',
            background: 'linear-gradient(135deg,#dc2626,#991b1b)',
            border: '3px solid var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
            position: 'relative'
          }}>
            {initials}
            <div style={{ position: 'absolute', bottom: 2, left: 2, width: 14, height: 14, borderRadius: '50%', background: '#22c55e', border: '2px solid var(--bg)' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: 12, left: 16 }}>
          <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
            יציאה
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-display text-xl font-bold">{user?.user_metadata?.full_name || 'שחקן'}</div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--red2)' }}>@{nickname}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{user?.email}</div>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#22c55e', fontWeight: 500 }}>
            🟢 אונליין
          </div>
        </div>
        {bio && <div className="text-sm mt-2" style={{ color: 'var(--text2)' }}>{bio}</div>}
      </div>

      {/* Tabs */}
      <div className="flex border-b px-2" style={{ borderColor: 'var(--border)' }}>
        {([['profile','פרופיל'],['stats','סטטיסטיקות'],['friends','חברים'],['edit','עריכה']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2.5 text-xs font-medium transition-colors"
            style={{ color: tab === key ? 'var(--red2)' : 'var(--text3)', borderBottom: tab === key ? '2px solid var(--red)' : '2px solid transparent' }}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4 max-w-2xl mx-auto">

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="space-y-3 pt-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'ידיים', value: MOCK_STATS.hands.toString(), icon: '🎮' },
                { label: '% זכיה', value: `${MOCK_STATS.winRate}%`, icon: '🏆', green: true },
                { label: 'רווח', value: `₪${MOCK_STATS.profit}`, icon: '💰', green: true },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="font-display font-bold text-lg" style={{ color: s.green ? 'var(--green)' : 'var(--red2)' }}>{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => router.push('/create-table')} className="btn btn-red py-3 text-sm">➕ פתח שולחן</button>
              <button onClick={() => router.push('/join-table')} className="btn btn-green py-3 text-sm">🃏 הצטרף</button>
            </div>

            <button onClick={() => router.push('/guide')}
              className="w-full py-3 rounded-xl text-sm font-semibold text-center transition-all"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}>
              🎯 מחשבון אחוזי זכיה
            </button>

            <div className="card p-4">
              <h3 className="font-bold mb-3 text-sm">משחקים אחרונים</h3>
              <div className="text-center py-4" style={{ color: 'var(--text3)', fontSize: 13 }}>
                <div className="text-3xl mb-2">🃏</div>
                עדיין לא שיחקת — בוא נתחיל!
              </div>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && (
          <div className="space-y-3 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'ידיים שיחקתי', value: MOCK_STATS.hands },
                { label: '% זכיה', value: `${MOCK_STATS.winRate}%`, green: true },
                { label: 'סה"כ רווח', value: `+₪${MOCK_STATS.profit}`, green: true },
                { label: 'הפסד מקס\'', value: `-₪${MOCK_STATS.maxLoss}`, red: true },
              ].map((s, i) => (
                <div key={i} className="card p-3 text-center">
                  <div className="text-xs mb-1" style={{ color: 'var(--text3)' }}>{s.label}</div>
                  <div className="font-display font-bold text-xl" style={{ color: s.green ? 'var(--green)' : s.red ? 'var(--red2)' : 'var(--text)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Style */}
            <div className="card p-4">
              <div className="text-sm font-semibold mb-3">סגנון משחק</div>
              {[
                { label: 'VPIP (% כניסה לסיר)', value: MOCK_STATS.vpip, color: '#dc2626' },
                { label: 'PFR (% הגדלה לפני פלופ)', value: MOCK_STATS.pfr, color: '#f59e0b' },
                { label: 'Aggression Factor', value: Math.round(MOCK_STATS.af * 20), color: '#22c55e', display: MOCK_STATS.af.toString() },
              ].map(s => (
                <div key={s.label} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text3)' }}>{s.label}</span>
                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.display || `${s.value}%`}</span>
                  </div>
                  <PctBar value={s.value} color={s.color} />
                </div>
              ))}
            </div>

            {/* Top hands */}
            <div className="card p-4">
              <div className="text-sm font-semibold mb-3">ידיים חזקות שלך</div>
              <div className="space-y-3">
                {MOCK_STATS.topHands.map(h => (
                  <div key={h.name} className="flex items-center gap-3">
                    <div style={{ flex: 1 }}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">{h.name}</span>
                        <span className="text-xs font-bold" style={{ color: pctColor(h.pct) }}>{h.pct}%</span>
                      </div>
                      <PctBar value={h.pct} color={pctColor(h.pct)} />
                      <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{h.hands} ידיים · {h.wins} ניצחונות</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nemesis */}
            <div className="card p-4" style={{ borderColor: 'rgba(220,38,38,0.2)' }}>
              <div className="text-sm font-semibold mb-3">😈 השחקן שגורם לך הכי הרבה נזק</div>
              <div className="flex items-center gap-3">
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${MOCK_STATS.nemesis.color},${MOCK_STATS.nemesis.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 }}>
                  {MOCK_STATS.nemesis.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-medium">{MOCK_STATS.nemesis.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{MOCK_STATS.nemesis.games} משחקים ביחד</div>
                </div>
                <div className="text-left">
                  <div className="font-display font-bold" style={{ color: 'var(--red2)', fontSize: 16 }}>-₪{MOCK_STATS.nemesis.loss}</div>
                  <div className="text-xs" style={{ color: 'var(--text3)' }}>סה"כ הפסד</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FRIENDS TAB */}
        {tab === 'friends' && (
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{FRIENDS.length} חברים · {onlineFriends.length} אונליין</span>
            </div>

            {onlineFriends.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: '#22c55e', letterSpacing: '0.5px' }}>מחוברים עכשיו</div>
                {onlineFriends.map(f => (
                  <div key={f.nick} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${f.color},${f.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {f.initials}
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: '#22c55e', border: '2px solid var(--bg)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-medium text-sm">{f.name}</div>
                      <div className="text-xs" style={{ color: '#22c55e' }}>@{f.nick} · מחובר</div>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: 'var(--red2)' }}
                      onClick={() => router.push('/create-table')}>
                      הזמן
                    </button>
                  </div>
                ))}
              </div>
            )}

            {offlineFriends.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--text3)', letterSpacing: '0.5px' }}>לא מחוברים</div>
                {offlineFriends.map(f => (
                  <div key={f.nick} className="flex items-center gap-3 py-3" style={{ opacity: 0.55 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${f.color},${f.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {f.initials}
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: '#4b5563', border: '2px solid var(--bg)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-medium text-sm">{f.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text3)' }}>@{f.nick} · לא מחובר</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add friend */}
            <div className="card p-3 flex gap-2">
              <input className="input flex-1 text-sm py-2.5" placeholder="הכנס אימייל או שם משתמש..."
                value={friendInput} onChange={e => setFriendInput(e.target.value)} />
              <button className="btn btn-red w-auto px-4 py-2.5 text-sm">+ הוסף</button>
            </div>
          </div>
        )}

        {/* EDIT TAB */}
        {tab === 'edit' && (
          <div className="pt-4 space-y-4">
            {/* Avatar */}
            <div className="text-center">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#991b1b)', border: '3px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", margin: '0 auto' }}>
                  {initials}
                </div>
                <label style={{ position: 'absolute', bottom: 0, left: 0, width: 26, height: 26, borderRadius: '50%', background: 'var(--red)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12 }}>
                  📷
                  <input type="file" accept="image/*" style={{ display: 'none' }} />
                </label>
              </div>
              <div className="text-xs mt-2" style={{ color: 'var(--text3)' }}>לחץ לשינוי תמונה</div>
            </div>

            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text3)' }}>שם מלא</label>
              <input className="input" defaultValue={user?.user_metadata?.full_name || ''} readOnly style={{ opacity: 0.6 }} />
            </div>

            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text3)' }}>כינוי בשולחן</label>
              <input className="input" placeholder="eitan_poker"
                value={nickname} onChange={e => setNickname(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text3)' }}>ביו קצר</label>
              <textarea className="input" rows={3} placeholder="ספר קצת על עצמך..."
                value={bio} onChange={e => setBio(e.target.value)}
                style={{ resize: 'none', height: 'auto' }} />
            </div>

            <button onClick={saveProfile} className="btn btn-red">שמור שינויים</button>

            <button onClick={handleLogout} className="btn btn-ghost text-sm py-3"
              style={{ color: 'var(--red2)', borderColor: 'rgba(220,38,38,0.2)' }}>
              התנתק
            </button>
          </div>
        )}
      </div>

      <BottomNav active="profile" />
    </div>
  )
}
