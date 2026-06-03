import Link from 'next/link'

export default function NewGroupPage() {
  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <header className="flex items-center gap-3 py-4 mb-6">
        <Link href="/groups" className="text-stone-400 hover:text-white">→</Link>
        <h1 className="font-bold text-lg">קבוצה חדשה</h1>
      </header>

      <div className="card p-6 space-y-5">
        {/* Group emoji picker */}
        <div>
          <label className="block text-sm text-stone-400 mb-2">אייקון קבוצה</label>
          <div className="flex gap-3 flex-wrap">
            {['🃏','🎰','🪖','💼','🏠','⚡','🔥','👑'].map(e => (
              <button key={e} className="w-12 h-12 rounded-xl border border-white/10 
                hover:border-yellow-600/50 text-2xl transition-colors">
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-stone-400 mb-2">שם הקבוצה</label>
          <input className="input" placeholder="למשל: החבר׳ה מהצבא" />
        </div>

        <div>
          <label className="block text-sm text-stone-400 mb-2">תיאור (אופציונלי)</label>
          <input className="input" placeholder="קבוצת פוקר שבועית..." />
        </div>

        <div>
          <label className="block text-sm text-stone-400 mb-2">הזמן שחקנים</label>
          <input className="input" placeholder="אימייל או שם משתמש" />
          <button className="btn-secondary mt-2 py-2 text-sm">+ הוסף שחקן</button>
        </div>

        <button className="btn-primary">צור קבוצה 🚀</button>
      </div>
    </div>
  )
}
