import Link from 'next/link'

export default function GroupsPage() {
  const groups = [
    { id: '1', name: 'החבר׳ה מהצבא', members: 6, totalGames: 24, myResult: +2400, emoji: '🪖' },
    { id: '2', name: 'קבוצת העבודה', members: 4, totalGames: 11, myResult: -380, emoji: '💼' },
  ]

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <header className="flex items-center justify-between py-4 mb-6">
        <Link href="/dashboard" className="text-stone-400 hover:text-white">→</Link>
        <h1 className="font-bold text-lg">הקבוצות שלי</h1>
        <Link href="/groups/new" className="text-yellow-400 font-bold text-xl">+</Link>
      </header>

      <div className="space-y-4">
        {groups.map(g => (
          <Link key={g.id} href={`/groups/${g.id}`}>
            <div className="card p-5 hover:border-yellow-600/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-900/30 flex items-center justify-center text-2xl">
                  {g.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{g.name}</div>
                  <div className="text-stone-400 text-sm">{g.members} שחקנים · {g.totalGames} משחקים</div>
                </div>
                <div className={`font-bold text-lg ${g.myResult > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {g.myResult > 0 ? '+' : ''}{g.myResult}
                </div>
              </div>
              <button className="btn-primary text-sm py-2">פתח שולחן</button>
            </div>
          </Link>
        ))}

        <Link href="/groups/new">
          <div className="card p-5 border-dashed hover:border-yellow-600/40 transition-colors cursor-pointer text-center">
            <div className="text-3xl mb-2">➕</div>
            <div className="font-semibold">צור קבוצה חדשה</div>
            <div className="text-stone-400 text-sm mt-1">הזמן חברים ותתחילו לשחק</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
