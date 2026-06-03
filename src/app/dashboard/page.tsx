import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between py-4 mb-6">
        <div className="display text-3xl text-yellow-400">AIPFF</div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-900/50 border border-yellow-600/30 
            flex items-center justify-center text-sm font-bold text-yellow-400">
            א
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="card p-4 mb-5 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-yellow-400 font-bold text-xl">+1,240</div>
          <div className="text-stone-400 text-xs mt-0.5">רווח כולל</div>
        </div>
        <div className="border-x border-white/5">
          <div className="text-white font-bold text-xl">47</div>
          <div className="text-stone-400 text-xs mt-0.5">משחקים</div>
        </div>
        <div>
          <div className="text-green-400 font-bold text-xl">63%</div>
          <div className="text-stone-400 text-xs mt-0.5">אחוז ניצחון</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/groups/new" className="card p-4 text-center hover:border-yellow-600/40 transition-colors cursor-pointer">
          <div className="text-3xl mb-2">➕</div>
          <div className="font-semibold text-sm">צור קבוצה</div>
          <div className="text-stone-400 text-xs mt-0.5">פתח שולחן חדש</div>
        </Link>
        <Link href="/groups" className="card p-4 text-center hover:border-yellow-600/40 transition-colors cursor-pointer">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-semibold text-sm">הקבוצות שלי</div>
          <div className="text-stone-400 text-xs mt-0.5">2 קבוצות פעילות</div>
        </Link>
      </div>

      {/* Recent games */}
      <div className="mb-4">
        <h2 className="font-bold text-lg mb-3">משחקים אחרונים</h2>
        <div className="space-y-3">
          {[
            { group: 'החבר׳ה מהצבא', date: 'אתמול', result: +350, hands: 42 },
            { group: 'קבוצת העבודה', date: 'לפני 3 ימים', result: -120, hands: 28 },
            { group: 'החבר׳ה מהצבא', date: 'לפני שבוע', result: +890, hands: 67 },
          ].map((game, i) => (
            <div key={i} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{game.group}</div>
                <div className="text-stone-400 text-xs mt-0.5">{game.date} · {game.hands} ידיים</div>
              </div>
              <div className={`font-bold text-lg ${game.result > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {game.result > 0 ? '+' : ''}{game.result}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
