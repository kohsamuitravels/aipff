'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://ygzlvttolouwxddzqnie.supabase.co',
  'sb_publishable_JBM60jMgROMpj2kKcGmElQ_4-c8iu64'
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) { setError('נא למלא אימייל וסיסמה'); return }
    setLoading(true); setError('')
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) setError('אימייל או סיסמה שגויים')
    else router.push('/profile')
    setLoading(false)
  }

  async function handleGoogle() {
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="auth-bg min-h-screen flex flex-col items-center justify-center p-5 relative">
      {/* Suits bg */}
      <div className="suits-bg">
        <span className="suit-item" style={{top:'-5%',right:'-5%',transform:'rotate(15deg)'}}>♠</span>
        <span className="suit-item" style={{bottom:'-5%',left:'-5%',transform:'rotate(-20deg)',color:'#d32f2f'}}>♥</span>
        <span className="suit-item" style={{top:'40%',left:'-8%',transform:'rotate(10deg)',color:'#d32f2f'}}>♦</span>
        <span className="suit-item" style={{top:'30%',right:'-8%',transform:'rotate(-10deg)'}}>♣</span>
      </div>

      {/* Logo */}
      <div className="text-center mb-8 fade-up relative z-10">
        <div className="font-display text-6xl font-bold mb-1"
          style={{background:'linear-gradient(135deg,#ffd700,#ff8f00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          AIPFF
        </div>
        <p className="text-xs tracking-[0.25em] uppercase" style={{color:'#666'}}>
          All In Poker For Friends
        </p>
      </div>

      {/* Card */}
      <div className="card-highlight w-full max-w-md p-6 fade-up relative z-10" style={{animationDelay:'0.1s'}}>
        <h2 className="font-display text-xl font-semibold mb-5 text-center tracking-wide">כניסה לחשבון</h2>

        {/* Google */}
        <button onClick={handleGoogle} className="btn btn-google mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          המשך עם Google
        </button>

        <div className="divider mb-4">או</div>

        {/* Form */}
        <div className="space-y-3">
          {error && (
            <div className="text-center text-sm py-2 px-3 rounded-xl"
              style={{background:'rgba(211,47,47,0.15)',color:'#ef5350',border:'1px solid rgba(211,47,47,0.3)'}}>
              {error}
            </div>
          )}
          <input className="input" type="email" placeholder="כתובת אימייל"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="סיסמה"
            value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin} disabled={loading} className="btn btn-red">
            {loading ? '...' : 'כניסה למשחק →'}
          </button>
        </div>

        <p className="text-center text-sm mt-5" style={{color:'#666'}}>
          שחקן חדש?{' '}
          <Link href="/auth/signup" style={{color:'var(--gold)',fontWeight:600}}>הרשם עכשיו</Link>
        </p>
      </div>
    </div>
  )
}
