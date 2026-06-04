'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'

const TABLES = [
  { id:'1', name:'משחק של יום שישי 🃏', host:'Eitan A.', buyin:200, sb:1, bb:2, type:'קאש', players:5, max:9, status:'open', ago:'12 דקות' },
  { id:'2', name:'טורניר שבועי 🏆', host:'Moshe K.', buyin:100, sb:5, bb:10, type:'טורניר', players:7, max:9, status:'open', ago:'45 דקות' },
  { id:'3', name:'קאש ביג בויז 💰', host:'Rina K.', buyin:500, sb:5, bb:10, type:'קאש', players:9, max:9, status:'full', ago:'2 שעות' },
]
const COLORS = ['#dc2626','#166534','#1d4ed8','#7c3aed','#b45309']

export default function JoinTablePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.push('/') })
  }, [])

  const filtered = TABLES.filter(t => {
    if (search && !t.name.includes(search)) return false
    if (filter === 'cash' && t.type !== 'קאש') return false
    if (filter === 'tournament' && t.type !== 'טורניר') return false
    return true
  })

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      <div style={{ background: 'linear-gradient(180deg,rgba(20,80,30,0.5) 0%,transparent 100%)' }}>
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>←</button>
          <h1 className="font-display text-lg font-semibold">הצטרפות לשולחן</h1>
        </div>
      </div>

      <div className="px-4 pb-6 max-w-2xl mx-auto">
        <div className="card p-3 flex items-center gap-2 mb-4">
          <span style={{ color: 'var(--text3)' }}>🔍</span>
          <input className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--text)', direction: 'rtl' }}
            placeholder="חפש שולחן או הכנס קוד..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {[['all','הכל'],['cash','קאש'],['tournament','טורניר'],['friends','של חברים']].map(([val,label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filter===val ? 'rgba(220,38,38,0.12)' : 'var(--surface)',
                border: `1px solid ${filter===val ? 'rgba(220,38,38,0.3)' : 'var(--border)'}`,
                color: filter===val ? 'var(--red2)' : 'var(--text3)'
              }}>{label}</button>
          ))}
        </div>

        <p className="text-xs mb-3" style={{ color: 'var(--text3)' }}>{filtered.length} שולחנות פעילים</p>

        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} className="card p-4"
              style={{ opacity: t.status==='full' ? 0.5 : 1, borderColor: t.status==='open' ? 'rgba(220,38,38,0.15)' : 'var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold mb-1">{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text3)' }}>נפתח לפני {t.ago} · {t.host}</div>
                </div>
                <span className={`badge ${t.status==='open'?'badge-green':'badge-gray'}`}>{t.status==='open'?'פתוח':'מלא'}</span>
              </div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="card px-2 py-1 text-xs">Buy-in <strong style={{color:'var(--red2)'}}>₪{t.buyin}</strong></span>
                <span className="card px-2 py-1 text-xs">Blinds <strong style={{color:'var(--red2)'}}>{t.sb}/{t.bb}</strong></span>
                <span className="card px-2 py-1 text-xs">{t.type}</span>
                <span className="card px-2 py-1 text-xs">{t.players}/{t.max}</span>
              </div>
              {t.status==='open' && (
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {Array.from({length:Math.min(t.players,4)}).map((_,i) => (
                      <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{background:`linear-gradient(135deg,${COLORS[i%COLORS.length]},${COLORS[i%COLORS.length]}88)`,border:'2px solid var(--bg)',marginRight:i>0?'-8px':'0',fontSize:'9px'}}>
                        {String.fromCharCode(65+i)}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => router.push(`/table/${t.id}`)} className="btn btn-red py-2 px-4 w-auto text-sm">הצטרף →</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="join"/>
    </div>
  )
}
