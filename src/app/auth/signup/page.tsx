'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  async function handleSignup() {
    if (!fullName || !email || !password) { setError('נא למלא את כל השדות'); return }
    if (password.length < 6) { setError('סיסמה חייבת להיות לפחות 6 תווים'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/profile')
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="text-center mb-8 fade-up">
          <h1 className="font-display text-4xl font-bold tracking-wide mb-2">AIPFF</h1>
          <div className="pill mx-auto" style={{ width: 'fit-content' }}>הצטרף לשולחן</div>
        </div>

        <div className="card p-6 fade-up" style={{ animationDelay: '0.1s' }}>
          <button onClick={handleGoogle} className="btn btn-google mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            הרשם עם Google
          </button>

          <div className="divider mb-4">או</div>

          <div className="space-y-3 mb-4">
            {error && (
              <div className="text-sm text-center py-2 px-3 rounded-xl"
                style={{ background: 'rgba(220,38,38,0.12)', color: 'var(--red2)', border: '1px solid rgba(220,38,38,0.2)' }}>
                {error}
              </div>
            )}
            <input className="input" type="text" placeholder="שם מלא *" value={fullName} onChange={e => setFullName(e.target.value)}/>
            <input className="input" type="email" placeholder="אימייל *" value={email} onChange={e => setEmail(e.target.value)}/>
            <input className="input" type="password" placeholder="סיסמה (6+ תווים) *" value={password} onChange={e => setPassword(e.target.value)}/>
          </div>

          <button onClick={handleSignup} disabled={loading} className="btn btn-red">
            {loading ? '...יוצר חשבון' : 'יאללה נשחק 🚀'}
          </button>
        </div>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text3)' }}>
          יש לך חשבון?{' '}
          <Link href="/" style={{ color: 'var(--red2)', fontWeight: 600 }}>התחבר</Link>
        </p>
      </div>
    </div>
  )
}
