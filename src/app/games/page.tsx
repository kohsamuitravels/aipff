'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'

export default function GamesPage() {
  const router = useRouter()
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.push('/') })
  }, [])

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      <div style={{ background: 'linear-gradient(180deg,rgba(20,80,30,0.5) 0%,transparent 100%)' }}>
        <div className="px-4 py-4"><h1 className="font-display text-xl font-semibold">המשחקים שלי</h1></div>
      </div>
      <div className="px-4 pb-6 max-w-2xl mx-auto">
        <div className="text-center py-16" style={{ color: 'var(--text3)' }}>
          <div className="text-5xl mb-4">🃏</div>
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--text2)' }}>אין משחקים עדיין</p>
          <p className="text-sm mb-6">פתח שולחן חדש או הצטרף לאחד קיים</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/create-table')} className="btn btn-red w-auto px-6 py-2.5 text-sm">פתח שולחן</button>
            <button onClick={() => router.push('/join-table')} className="btn btn-green w-auto px-6 py-2.5 text-sm">הצטרף</button>
          </div>
        </div>
      </div>
      <BottomNav active="games"/>
    </div>
  )
}
