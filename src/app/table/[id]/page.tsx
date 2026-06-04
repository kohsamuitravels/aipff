'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const PLAYERS = [
  { id:'1', name:'Eitan Avraham', nick:'eitan_poker', chips:580, invested:50, color:'#dc2626', initials:'EA', role:'admin', action:null },
  { id:'2', name:'Yoni Levi', nick:'yoni_l', chips:420, invested:80, color:'#166534', initials:'YL', role:null, action:'raise' },
  { id:'3', name:'Moshe Cohen', nick:'moshek', chips:200, invested:0, color:'#1d4ed8', initials:'MK', role:null, action:'fold' },
  { id:'4', name:'Rina Katz', nick:'rina_k', chips:750, invested:50, color:'#7c3aed', initials:'RK', role:null, action:'call' },
  { id:'5', name:'Shlomi Bar', nick:'shlomi_b', chips:290, invested:50, color:'#b45309', initials:'SL', role:null, action:null },
]

const ACTION_STYLE: Record<string,{label:string,color:string,bg:string}> = {
  raise: { label:'RAISE ↑', color:'#f59e0b', bg:'rgba(245,158,11,0.15)' },
  fold:  { label:'FOLD',    color:'#6b7280', bg:'rgba(107,114,128,0.12)' },
  call:  { label:'CALL',    color:'#22c55e', bg:'rgba(34,197,94,0.12)' },
}

export default function TablePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tab, setTab] = useState<'players'|'chat'|'info'>('players')
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState([
    { from:'Yoni', color:'#166534', initials:'YL', text:'מי מביא אוכל? 🍕', time:'21:14' },
    { from:'Eitan', color:'#dc2626', initials:'EA', text:'אני כבר הזמנתי 😄', time:'21:15' },
    { from:'Rina', color:'#7c3aed', initials:'RK', text:'All in! 😈', time:'21:16' },
  ])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.push('/') })
  }, [])

  function sendMsg() {
    if (!chatMsg.trim()) return
    setMessages(prev => [...prev, {
      from:'אתה', color:'#dc2626', initials:'EA', text:chatMsg,
      time: new Date().toLocaleTimeString('he',{hour:'2-digit',minute:'2-digit'})
    }])
    setChatMsg('')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }}></div>
          <span className="font-display font-semibold">משחק של יום שישי</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="badge badge-gray text-xs">1/2 ₪</span>
          <span className="badge badge-red text-xs">Buy-in ₪200</span>
          <button onClick={() => router.push('/join-table')} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>←</button>
        </div>
      </div>

      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {[['players','שחקנים'],['chat','צ\'אט 💬'],['info','פרטי שולחן']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key as any)}
            className="flex-1 py-3 text-sm font-medium transition-colors"
            style={{ color: tab===key ? 'var(--red2)' : 'var(--text3)', borderBottom: tab===key ? '2px solid var(--red)' : '2px solid transparent' }}>
            {label}
          </button>
        ))}
      </div>

      {tab==='players' && (
        <div className="flex-1 px-4 pb-6 max-w-2xl mx-auto w-full">
          {PLAYERS.map(p => (
            <div key={p.id} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-display flex-shrink-0"
                style={{ background:`linear-gradient(135deg,${p.color},${p.color}88)`, border: p.action==='raise' ? '2px solid #f59e0b' : '2px solid transparent' }}>
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{p.name}</span>
                  {p.role==='admin' && <span className="badge badge-red" style={{fontSize:'10px',padding:'2px 6px'}}>מנהל</span>}
                  {p.action && (
                    <span className="badge" style={{fontSize:'10px',padding:'2px 6px',background:ACTION_STYLE[p.action].bg,color:ACTION_STYLE[p.action].color,border:'none'}}>
                      {ACTION_STYLE[p.action].label}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>@{p.nick} · הימר ₪{p.invested}</div>
              </div>
              <div className="text-left flex-shrink-0">
                <div className="font-display font-bold" style={{ color: p.action==='fold' ? 'var(--text2)' : 'var(--green)', opacity: p.action==='fold' ? 0.4 : 1 }}>₪{p.chips}</div>
                <div className="text-xs" style={{ color: 'var(--text3)' }}>ציפים</div>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button className="btn btn-ghost text-sm py-2.5">+ הוסף שחקן</button>
            <button onClick={() => router.push('/profile')} className="btn py-2.5 text-sm"
              style={{ background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', color:'var(--red2)' }}>
              סגור שולחן
            </button>
          </div>
        </div>
      )}

      {tab==='chat' && (
        <div className="flex flex-col flex-1" style={{ height: 0, minHeight: '400px' }}>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg,i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background:`linear-gradient(135deg,${msg.color},${msg.color}88)` }}>{msg.initials}</div>
                  <span className="text-xs font-medium">{msg.from}</span>
                  <span className="text-xs" style={{ color: 'var(--text3)' }}>{msg.time}</span>
                </div>
                <p className="text-sm pr-8">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
            <input className="input flex-1 text-sm py-2.5" placeholder="הקלד הודעה..."
              value={chatMsg} onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key==='Enter' && sendMsg()}/>
            <button onClick={sendMsg} className="btn btn-red w-auto px-4 py-2.5 text-sm">שלח</button>
          </div>
        </div>
      )}

      {tab==='info' && (
        <div className="px-4 py-4 space-y-2 max-w-2xl mx-auto w-full">
          {[['שם השולחן','משחק של יום שישי'],['Buy-in','₪200'],['בליינדים','₪1 / ₪2'],['סוג','קאש'],['שחקנים','5 / 9']].map(([label,value]) => (
            <div key={label} className="card px-4 py-3 flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--text3)' }}>{label}</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
          <div className="card px-4 py-3">
            <div className="text-sm mb-1" style={{ color: 'var(--text3)' }}>קישור שיתוף</div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs truncate" style={{ color:'var(--text2)', direction:'ltr' }}>aipff.app/join/friday-x7k2</span>
              <button onClick={() => navigator.clipboard.writeText('aipff.app/join/friday-x7k2')}
                className="badge badge-red text-xs cursor-pointer flex-shrink-0">העתק</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
