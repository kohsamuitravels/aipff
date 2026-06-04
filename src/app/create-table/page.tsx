'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'

export default function CreateTablePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [buyin, setBuyin] = useState('200')
  const [smallBlind, setSmallBlind] = useState('1')
  const [bigBlind, setBigBlind] = useState('2')
  const [gameType, setGameType] = useState<'cash'|'tournament'>('cash')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.push('/') })
  }, [])

  async function handleCreate() {
    if (!name) { alert('נא להוסיף שם לשולחן'); return }
    setLoading(true)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const link = `${window.location.origin}/join-table?code=${code}`
    setShareLink(link)
    setLoading(false)
    router.push('/games')
  }

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      <div style={{ background: 'linear-gradient(180deg,rgba(20,80,30,0.5) 0%,transparent 100%)' }}>
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>←</button>
          <h1 className="font-display text-lg font-semibold">פתיחת שולחן חדש</h1>
        </div>
      </div>

      <div className="px-4 pb-6 max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text3)' }}>שם השולחן</label>
          <input className="input" placeholder="משחק של יום שישי 🃏" value={name} onChange={e => setName(e.target.value)}/>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text3)' }}>Buy-in (₪)</label>
            <input className="input" type="number" placeholder="200" value={buyin} onChange={e => setBuyin(e.target.value)}/>
          </div>
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text3)' }}>בליינדים</label>
            <div className="flex gap-2 items-center">
              <input className="input text-center" type="number" value={smallBlind} onChange={e => setSmallBlind(e.target.value)}/>
              <span style={{ color: 'var(--text3)' }}>/</span>
              <input className="input text-center" type="number" value={bigBlind} onChange={e => setBigBlind(e.target.value)}/>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text3)' }}>סוג משחק</label>
          <div className="flex gap-3">
            {(['cash','tournament'] as const).map(type => (
              <button key={type} onClick={() => setGameType(type)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: gameType === type ? 'rgba(220,38,38,0.12)' : 'var(--surface)',
                  border: `1px solid ${gameType === type ? 'rgba(220,38,38,0.3)' : 'var(--border)'}`,
                  color: gameType === type ? 'var(--red2)' : 'var(--text2)'
                }}>{type === 'cash' ? 'קאש' : 'טורניר'}</button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text3)' }}>הערות חופשיות</label>
          <textarea className="input" rows={3} placeholder="מגיעים ב-21:00..." value={notes}
            onChange={e => setNotes(e.target.value)} style={{ resize: 'none', height: 'auto' }}/>
        </div>

        <div className="card p-3 mb-3 text-center text-sm" style={{ color: 'var(--text3)' }}>
          {name || 'שולחן חדש'} · Buy-in ₪{buyin} · {smallBlind}/{bigBlind} ₪ · {gameType === 'cash' ? 'קאש' : 'טורניר'}
        </div>

        <button onClick={handleCreate} disabled={loading} className="btn btn-red text-base">
          {loading ? '...יוצר' : 'יצירת שולחן →'}
        </button>
      </div>
      <BottomNav active="create"/>
    </div>
  )
}
