'use client'
import { useState } from 'react'
import BottomNav from '@/components/BottomNav'

type Suit = 'c'|'d'|'h'|'s'
type Rank = '2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'T'|'J'|'Q'|'K'|'A'
interface Card { rank: Rank; suit: Suit }

const RANKS: Rank[] = ['2','3','4','5','6','7','8','9','T','J','Q','K','A']
const SUITS: Suit[] = ['c','d','h','s']
const RD: Record<string,string> = {'2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','T':'10','J':'J','Q':'Q','K':'K','A':'A'}
const SD: Record<Suit,{s:string,c:string}> = {
  c:{s:'♣',c:'#1a1a1a'}, d:{s:'♦',c:'#dc2626'},
  h:{s:'♥',c:'#dc2626'}, s:{s:'♠',c:'#1a1a1a'}
}
const RV: Record<string,number> = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'T':10,'J':11,'Q':12,'K':13,'A':14}
const HAND_NAMES = ['High Card','One Pair','Two Pair','Three of a Kind','Straight','Flush','Full House','Four of a Kind','Straight Flush']
const OUTS_DATA = [
  [1,2.1,4.3],[2,4.3,8.4],[3,6.4,12.5],[4,8.5,16.5],[5,10.6,20.3],
  [6,12.8,24.1],[7,14.9,27.8],[8,17.0,31.5],[9,19.1,35.0],[10,21.3,38.4],
  [11,23.4,41.7],[12,25.5,45.0],[13,27.7,48.1],[14,29.8,51.2],[15,31.9,54.1]
]
const OUTS_EXAMPLES = ['','','','Gutshot','Gutshot','Overcards','Overcards','Open Straight','Flush Draw','','','','','','Flush+Straight']

function ck(c: Card) { return c.rank + c.suit }
function fullDeck(): Card[] { return RANKS.flatMap(r => SUITS.map(s => ({ rank: r as Rank, suit: s }))) }

function e5(cards: Card[]): number {
  const v = cards.map(c => RV[c.rank]).sort((a, b) => b - a)
  const su = cards.map(c => c.suit)
  const fl = su.every(s => s === su[0])
  const st = v[0] - v[4] === 4 && new Set(v).size === 5
  const wh = v[0] === 14 && v[1] === 5 && v[2] === 4 && v[3] === 3 && v[4] === 2
  const cn: Record<number, number> = {}
  v.forEach(x => cn[x] = (cn[x] || 0) + 1)
  const g = Object.entries(cn).map(([x, c]) => [+x, +c]).sort((a, b) => b[1] - a[1] || b[0] - a[0])
  if ((st || wh) && fl) return 8e7 + (wh ? 5 : v[0]) * 1e5
  if (g[0][1] === 4) return 7e7 + g[0][0] * 1e5 + (g[1]?.[0] || 0) * 1e3
  if (g[0][1] === 3 && g[1]?.[1] === 2) return 6e7 + g[0][0] * 1e5 + (g[1]?.[0] || 0) * 1e3
  if (fl) return 5e7 + v[0] * 1e5 + v[1] * 1e3 + v[2] * 100 + v[3] * 10 + v[4]
  if (st || wh) return 4e7 + (wh ? 5 : v[0]) * 1e5
  if (g[0][1] === 3) return 3e7 + g[0][0] * 1e5 + Math.max(...v.filter(x => x !== g[0][0])) * 1e3
  if (g[0][1] === 2 && g[1]?.[1] === 2) return 2e7 + Math.max(g[0][0], g[1][0]) * 1e5 + Math.min(g[0][0], g[1][0]) * 1e3 + (g.find(x => x[1] === 1)?.[0] || 0) * 10
  if (g[0][1] === 2) return 1e7 + g[0][0] * 1e5 + v.filter(x => x !== g[0][0]).slice(0, 3).reduce((a, x, i) => a + x * Math.pow(10, 2 - i), 0)
  return v.reduce((a, x, i) => a + x * Math.pow(10, 4 - i), 0)
}

function bestOf(cards: Card[]): number {
  if (cards.length < 5) return 0
  let best = 0
  const n = cards.length
  for (let a = 0; a < n - 4; a++) for (let b = a + 1; b < n - 3; b++) for (let c = b + 1; c < n - 2; c++) for (let d = c + 1; d < n - 1; d++) for (let e = d + 1; e < n; e++) {
    const s = e5([cards[a], cards[b], cards[c], cards[d], cards[e]])
    if (s > best) best = s
  }
  return best
}

function handName(score: number): string {
  if (!score) return ''
  const h = Math.floor(score / 1e7)
  const n = HAND_NAMES[h] || ''
  if (h === 8) { const v = Math.floor((score % 1e7) / 1e5); return v === 14 ? 'Royal Flush' : n }
  if (h === 1) { const v = Math.floor((score % 1e7) / 1e5); return `זוג ${RD[RANKS.find(r => RV[r] === v) || 'A']}ים` }
  if (h === 2) {
    const v1 = Math.floor((score % 1e7) / 1e5), v2 = Math.floor((score % 1e5) / 1e3)
    return `שני זוגות — ${RD[RANKS.find(r => RV[r] === v1) || 'A']}/${RD[RANKS.find(r => RV[r] === v2) || 'K']}`
  }
  if (h === 6) return 'Full House'
  if (h === 5) return 'Flush — צבע'
  if (h === 4) return 'Straight — רצף'
  if (h === 3) return 'Three of a Kind — שלישייה'
  if (h === 7) return 'Four of a Kind — פוקר'
  return n
}

function simulate(hero: Card[], board: Card[], numOpps: number, N: number) {
  const used = new Set([...hero, ...board].map(ck))
  const dk = fullDeck().filter(c => !used.has(ck(c)))
  let wins = 0, ties = 0, losses = 0
  for (let i = 0; i < N; i++) {
    const sh = [...dk].sort(() => Math.random() - 0.5)
    let idx = 0
    const opps = Array(numOpps).fill(null).map(() => [sh[idx++], sh[idx++]])
    const run = sh.slice(idx, idx + (5 - board.length))
    const fb = [...board, ...run]
    const hs = bestOf([...hero, ...fb])
    const os = opps.map(oc => bestOf([...oc, ...fb]))
    const mx = Math.max(...os, 0)
    if (hs > mx) wins++
    else if (hs === mx) ties++
    else losses++
  }
  return { wins, ties, losses, total: N }
}

function detectOuts(hero: Card[], board: Card[]) {
  if (board.length < 3 || board.length >= 5) return []
  const all = [...hero, ...board]
  const suits = all.map(c => c.suit)
  const vals = all.map(c => RV[c.rank])
  const outs: { name: string; count: number }[] = []
  const sc: Record<string, number> = {}
  suits.forEach(s => sc[s] = (sc[s] || 0) + 1)
  if (Object.values(sc).some(n => n >= 4)) outs.push({ name: 'Flush Draw', count: 9 })
  const uv = [...new Set(vals)].sort((a, b) => a - b)
  for (let i = 0; i <= uv.length - 4; i++) {
    if (uv[i + 3] - uv[i] === 3) { outs.push({ name: 'Open Straight Draw', count: 8 }); break }
  }
  for (let i = 0; i <= uv.length - 4; i++) {
    if (uv[i + 3] - uv[i] === 4 && uv[i + 3] - uv[i + 2] > 1) { outs.push({ name: 'Gutshot Straight', count: 4 }); break }
  }
  if (hero[0].rank === hero[1].rank) outs.push({ name: 'Pair → Trips', count: 2 })
  return outs.slice(0, 3)
}

function CardSlot({ card, onClick, label, active }: { card?: Card; onClick: () => void; label?: string; active?: boolean }) {
  const sd = card ? SD[card.suit] : null
  return (
    <div onClick={onClick} style={{
      width: 46, height: 64, borderRadius: 8, cursor: 'pointer', flexShrink: 0,
      background: card ? '#fff' : 'rgba(255,255,255,0.04)',
      border: active ? '2px solid #dc2626' : '1.5px dashed rgba(255,255,255,0.15)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
      boxShadow: card ? '0 2px 8px rgba(0,0,0,0.4)' : 'none', transition: 'all 0.15s'
    }}>
      {card ? (<>
        <span style={{ fontSize: 12, fontWeight: 700, color: sd!.c, lineHeight: 1, fontFamily: "'Space Grotesk',sans-serif" }}>{RD[card.rank]}</span>
        <span style={{ fontSize: 16, color: sd!.c, lineHeight: 1 }}>{sd!.s}</span>
      </>) : <span style={{ fontSize: 10, color: 'var(--text3)' }}>{label || '?'}</span>}
    </div>
  )
}

function CardPicker({ used, onPick, onClose }: { used: Card[]; onPick: (c: Card) => void; onClose: () => void }) {
  const usedSet = new Set(used.map(ck))
  return (
    <div className="card p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs" style={{ color: 'var(--text3)' }}>בחר קלף</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {[...RANKS].reverse().flatMap(rank => SUITS.map(suit => {
          const card = { rank: rank as Rank, suit }
          const isUsed = usedSet.has(ck(card))
          const sd = SD[suit]
          return (
            <button key={ck(card)} onClick={() => !isUsed && onPick(card)} disabled={isUsed}
              style={{
                width: 36, height: 50, borderRadius: 5,
                background: isUsed ? 'rgba(255,255,255,0.02)' : '#fff',
                border: 'none', cursor: isUsed ? 'not-allowed' : 'pointer', opacity: isUsed ? 0.15 : 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, padding: 0
              }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: sd.c, lineHeight: 1, fontFamily: "'Space Grotesk',sans-serif" }}>{RD[rank]}</span>
              <span style={{ fontSize: 13, color: sd.c, lineHeight: 1 }}>{sd.s}</span>
            </button>
          )
        }))}
      </div>
    </div>
  )
}

function Bar({ v, color }: { v: number; color: string }) {
  return (
    <div style={{ height: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ width: `${v}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.7s ease' }} />
    </div>
  )
}

function pc(v: number) { return v >= 65 ? '#22c55e' : v >= 40 ? '#f59e0b' : '#f87171' }

const HAND_RANKINGS = [
  { rank: 1, name: 'Royal Flush', ex: 'A♠ K♠ Q♠ J♠ 10♠', desc: 'היד הכי חזקה בפוקר', color: '#ffd700', icon: '👑' },
  { rank: 2, name: 'Straight Flush', ex: '9♥ 8♥ 7♥ 6♥ 5♥', desc: 'חמישה קלפים ברצף מאותו סוג', color: '#f87171' },
  { rank: 3, name: 'Four of a Kind', ex: 'A♠ A♥ A♦ A♣ 7', desc: 'ארבעה קלפים באותו ערך', color: '#f87171' },
  { rank: 4, name: 'Full House', ex: 'K♠ K♥ K♦ 9♠ 9♥', desc: 'שלישייה + זוג', color: '#c084fc' },
  { rank: 5, name: 'Flush', ex: 'A♥ J♥ 8♥ 6♥ 2♥', desc: 'חמישה קלפים מאותו סוג', color: '#93c5fd' },
  { rank: 6, name: 'Straight', ex: '10 9 8 7 6', desc: 'חמישה ברצף, לא חייב אותו סוג', color: '#4ade80' },
  { rank: 7, name: 'Three of a Kind', ex: 'Q♠ Q♥ Q♦ 8 3', desc: 'שלושה קלפים באותו ערך', color: '#fbbf24' },
  { rank: 8, name: 'Two Pair', ex: 'J♠ J♥ 7♠ 7♥ 2', desc: 'שני זוגות שונים', color: '#9ca3af' },
  { rank: 9, name: 'One Pair', ex: 'A♠ A♥ 10 6 3', desc: 'שני קלפים באותו ערך', color: '#9ca3af' },
  { rank: 10, name: 'High Card', ex: 'A 10 8 5 2', desc: 'אין קומבינציה', color: '#6b7280' },
]

const PREFLOP = [
  { hand: 'A♠A♥', strength: 'מפלצת', note: 'היד הכי חזקה לפני הפלופ', color: '#ffd700' },
  { hand: 'K♠K♥', strength: 'מפלצת', note: 'כמעט תמיד יד חזקה מאוד', color: '#ffd700' },
  { hand: 'Q♠Q♥', strength: 'חזקה מאוד', note: 'היזהר אם יוצא A או K', color: '#f87171' },
  { hand: 'AK suited', strength: 'חזקה מאוד', note: 'פרימיום — סיכוי לצבע ורצף', color: '#f87171' },
  { hand: 'J♠J♥', strength: 'חזקה', note: 'רגישה לקלפים גבוהים', color: '#fb923c' },
  { hand: 'AQ suited', strength: 'חזקה', note: 'טובה במיוחד מאותו סוג', color: '#fb923c' },
  { hand: '10♠10♥', strength: 'חזקה', note: 'זוג בינוני-גבוה', color: '#fb923c' },
  { hand: 'AK off', strength: 'חזקה', note: 'עדיין A high אם לא פגעה', color: '#fb923c' },
  { hand: '9♠9♥', strength: 'בינונית', note: 'טובה מול מעט שחקנים', color: '#fbbf24' },
  { hand: 'KQ suited', strength: 'בינונית', note: 'יפה אבל לא פרימיום', color: '#fbbf24' },
  { hand: '88-22', strength: 'ספקולטיבית', note: 'נסה לפגוע שלישייה בפלופ', color: '#9ca3af' },
  { hand: 'A low suited', strength: 'ספקולטיבית', note: 'טובה בעיקר לצבע', color: '#9ca3af' },
  { hand: 'קלפים נמוכים', strength: 'חלשה', note: 'לרוב יד בעייתית', color: '#6b7280' },
]

export default function GuidePage() {
  const [tab, setTab] = useState<'hands'|'preflop'|'odds'|'outs'|'calc'>('calc')
  const [heroCards, setHeroCards] = useState<(Card | null)[]>([null, null])
  const [boardCards, setBoardCards] = useState<(Card | null)[]>([null, null, null, null, null])
  const [stage, setStage] = useState<'pre'|'flop'|'turn'|'river'>('pre')
  const [totalPlayers, setTotalPlayers] = useState(4)
  const [foldedSeats, setFoldedSeats] = useState<Set<number>>(new Set())
  const [pot, setPot] = useState('')
  const [callAmt, setCallAmt] = useState('')
  const [accurateMode, setAccurateMode] = useState(false)
  const [picking, setPicking] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [outsCount, setOutsCount] = useState(9)
  const [outsStage, setOutsStage] = useState<'flop'|'turn'>('flop')

  const activePlayers = totalPlayers - foldedSeats.size
  const usedCards = [...heroCards, ...boardCards].filter(Boolean) as Card[]
  const boardSlotCount = stage === 'pre' ? 0 : stage === 'flop' ? 3 : stage === 'turn' ? 4 : 5

  function toggleFold(i: number) {
    if (i === 0) return
    const next = new Set(foldedSeats)
    if (next.has(i)) next.delete(i); else next.add(i)
    setFoldedSeats(next)
  }

  function pickCard(card: Card) {
    if (!picking) return
    if (picking.startsWith('h')) {
      const next = [...heroCards]; next[+picking[1]] = card; setHeroCards(next)
    } else {
      const next = [...boardCards]; next[+picking[1]] = card; setBoardCards(next)
    }
    setPicking(null); setResult(null)
  }

  function clearCard(type: 'h' | 'b', idx: number) {
    if (type === 'h') { const n = [...heroCards]; n[idx] = null; setHeroCards(n) }
    else { const n = [...boardCards]; n[idx] = null; setBoardCards(n) }
    setResult(null)
  }

  function calculate() {
    const hero = heroCards.filter(Boolean) as Card[]
    if (hero.length < 2) return
    setLoading(true)
    const board = boardCards.slice(0, boardSlotCount).filter(Boolean) as Card[]
    const numOpps = Math.max(activePlayers - 1, 1)
    const N = accurateMode ? 10000 : 2000
    setTimeout(() => {
      const { wins, ties, losses, total } = simulate(hero, board, numOpps, N)
      const wp = Math.round(wins / total * 1000) / 10
      const tp = Math.round(ties / total * 1000) / 10
      const lp = Math.round(losses / total * 1000) / 10
      const eq = Math.round((wins + ties / 2) / total * 1000) / 10
      const score = board.length >= 3 ? bestOf([...hero, ...board]) : 0
      const hn = score ? handName(score) : stage === 'pre' ? 'לפני הפלופ' : ''
      const potN = +pot || 0
      const callN = +callAmt || 0
      const potOdds = callN > 0 && potN > 0 ? Math.round(callN / (potN + callN) * 1000) / 10 : null
      const outs = detectOuts(hero, board)
      setResult({ wp, tp, lp, eq, hn, potOdds, potN, callN, outs, numOpps, N })
      setLoading(false)
    }, 50)
  }

  const STAGE_LABELS = { pre: 'לפני פלופ', flop: 'פלופ', turn: 'טרן', river: 'ריבר' }

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      <div style={{ background: 'linear-gradient(180deg,rgba(20,80,30,0.6) 0%,transparent 100%)', padding: '16px 20px 8px' }}>
        <h1 className="font-display text-xl font-semibold">מדריך פוקר</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>מחשבון · מדריך · Texas Hold'em</p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto', background: 'var(--bg)' }}>
        {([['calc','מחשבון'],['hands','דירוג ידיים'],['preflop','פתיחה'],['odds','הסתברויות'],['outs','Outs']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-shrink-0 py-2.5 px-4 text-xs font-medium transition-colors"
            style={{ color: tab === key ? 'var(--red2)' : 'var(--text3)', borderBottom: tab === key ? '2px solid var(--red)' : '2px solid transparent', background: 'none', border: 'none', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-24 max-w-2xl mx-auto">

        {tab === 'calc' && (
          <div className="pt-4 space-y-3">
            <div className="flex gap-2 items-center">
              {(['pre','flop','turn','river'] as const).map(s => (
                <button key={s} onClick={() => setStage(s)} className="flex-1 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: stage === s ? 'rgba(220,38,38,0.15)' : 'var(--surface)', border: `1px solid ${stage === s ? 'rgba(220,38,38,0.35)' : 'var(--border)'}`, color: stage === s ? 'var(--red2)' : 'var(--text3)', cursor: 'pointer' }}>
                  {STAGE_LABELS[s]}
                </button>
              ))}
              <button onClick={() => setAccurateMode(!accurateMode)} className="flex-shrink-0 text-xs px-3 py-2 rounded-xl"
                style={{ background: accurateMode ? 'rgba(34,197,94,0.1)' : 'var(--surface)', border: `1px solid ${accurateMode ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`, color: accurateMode ? 'var(--green)' : 'var(--text3)', cursor: 'pointer' }}>
                {accurateMode ? 'מדויק' : 'מהיר'}
              </button>
            </div>

            <div className="card p-4">
              <div style={{ position: 'relative', background: 'linear-gradient(135deg,#0f3d18,#1a5c2a,#0a2d12)', borderRadius: '50%', aspectRatio: '2/1', border: '4px solid #0a2610', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Array.from({ length: totalPlayers }).map((_, i) => {
                  const angle = (i / totalPlayers) * Math.PI * 2 - Math.PI / 2
                  const cx = 50 + 46 * Math.cos(angle), cy = 50 + 40 * Math.sin(angle)
                  const isHero = i === 0, folded = foldedSeats.has(i)
                  return (
                    <div key={i} onClick={() => toggleFold(i)}
                      style={{ position: 'absolute', left: `${cx}%`, top: `${cy}%`, transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: isHero ? 'default' : 'pointer', border: `2px solid ${isHero ? '#dc2626' : folded ? '#374151' : '#22c55e'}`, background: isHero ? 'rgba(220,38,38,0.2)' : folded ? 'rgba(55,65,81,0.2)' : 'rgba(34,197,94,0.15)', opacity: folded && !isHero ? 0.4 : 1, transition: 'all 0.2s' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: isHero ? '#f87171' : folded ? '#4b5563' : '#4ade80' }}>
                        {isHero ? 'אני' : folded ? 'פרש' : 'פעיל'}
                      </span>
                    </div>
                  )
                })}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>קופה</div>
                  <div className="font-display font-bold" style={{ fontSize: 18, color: '#ecfdf5' }}>{pot ? `₪${(+pot).toLocaleString()}` : '₪0'}</div>
                  <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                    {boardCards.filter(Boolean).map((c, i) => {
                      const sd = SD[c!.suit]
                      return (
                        <div key={i} style={{ width: 26, height: 36, borderRadius: 4, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: sd.c, lineHeight: 1, fontFamily: "'Space Grotesk',sans-serif" }}>{RD[c!.rank]}</span>
                          <span style={{ fontSize: 11, color: sd.c, lineHeight: 1 }}>{sd.s}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-xs" style={{ color: 'var(--text3)' }}>לחץ על שחקן כדי לסמן כפרש · {activePlayers} פעילים</div>
            </div>

            <div className="card p-3">
              <div className="text-xs mb-2" style={{ color: 'var(--text3)' }}>שחקנים בשולחן</div>
              <div className="flex gap-2 flex-wrap">
                {[2,3,4,5,6,7,8,9].map(n => (
                  <button key={n} onClick={() => { setTotalPlayers(n); setFoldedSeats(new Set()) }}
                    style={{ padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, border: `1px solid ${totalPlayers === n ? 'rgba(220,38,38,0.4)' : 'var(--border)'}`, background: totalPlayers === n ? 'rgba(220,38,38,0.15)' : 'var(--surface)', color: totalPlayers === n ? 'var(--red2)' : 'var(--text2)' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <div className="text-xs mb-3" style={{ color: 'var(--text3)' }}>הקלפים שלי</div>
              <div className="flex gap-3 items-center">
                {[0, 1].map(ci => (
                  <div key={ci}>
                    {heroCards[ci]
                      ? <CardSlot card={heroCards[ci]!} onClick={() => clearCard('h', ci)} active={picking === `h${ci}`} />
                      : <CardSlot label={`קלף ${ci + 1}`} onClick={() => setPicking(`h${ci}`)} active={picking === `h${ci}`} />
                    }
                  </div>
                ))}
                {heroCards[0] && heroCards[1] && (
                  <div className="flex-1 text-sm rounded-xl px-3 py-2" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: 'var(--text2)' }}>
                    {heroCards[0].suit === heroCards[1].suit ? '✅ suited' : '❌ offsuit'}{' · '}{RD[heroCards[0].rank]}-{RD[heroCards[1].rank]}
                  </div>
                )}
              </div>
            </div>

            {stage !== 'pre' && (
              <div className="card p-4">
                <div className="text-xs mb-3" style={{ color: 'var(--text3)' }}>קלפי השולחן</div>
                <div className="flex gap-2 items-center flex-wrap">
                  {Array.from({ length: boardSlotCount }).map((_, ci) => (
                    <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: ci === 3 ? 8 : 0 }}>
                      {ci === 3 && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)', marginLeft: 4 }} />}
                      {boardCards[ci]
                        ? <CardSlot card={boardCards[ci]!} onClick={() => clearCard('b', ci)} active={picking === `b${ci}`} />
                        : <CardSlot label={['F1','F2','F3','Turn','River'][ci]} onClick={() => setPicking(`b${ci}`)} active={picking === `b${ci}`} />
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {picking && <CardPicker used={usedCards} onPick={pickCard} onClose={() => setPicking(null)} />}

            <div className="grid grid-cols-2 gap-3">
              <div className="card p-3">
                <div className="text-xs mb-2" style={{ color: 'var(--text3)' }}>גודל הקופה (₪)</div>
                <input className="input text-sm" type="number" placeholder="0" value={pot} onChange={e => setPot(e.target.value)} />
              </div>
              <div className="card p-3">
                <div className="text-xs mb-2" style={{ color: 'var(--text3)' }}>כמה לשלם (₪)</div>
                <input className="input text-sm" type="number" placeholder="0" value={callAmt} onChange={e => setCallAmt(e.target.value)} />
              </div>
            </div>

            <button onClick={calculate} disabled={heroCards.filter(Boolean).length < 2 || loading} className="btn btn-red py-4 text-base">
              {loading ? `מחשב ${accurateMode ? '10,000' : '2,000'} סימולציות...` : 'חשב אחוזים 🎯'}
            </button>

            {result && (
              <div className="space-y-3">
                <div className="card p-4" style={{ borderColor: `${pc(result.eq)}44` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold">הסיכוי שלי לנצח</div>
                      {result.hn && <div className="text-sm mt-1" style={{ color: 'var(--text2)' }}>{result.hn}</div>}
                      <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{result.N.toLocaleString()} סימולציות · {result.numOpps} יריבים</div>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div className="font-display font-bold" style={{ fontSize: 36, color: pc(result.eq), lineHeight: 1 }}>{result.eq}%</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>equity</div>
                    </div>
                  </div>
                  <Bar v={result.eq} color={pc(result.eq)} />
                  <div className="flex gap-4 mt-2 text-xs" style={{ color: 'var(--text3)' }}>
                    <span>זכיה: <strong style={{ color: '#22c55e' }}>{result.wp}%</strong></span>
                    <span>תיקו: <strong style={{ color: '#f59e0b' }}>{result.tp}%</strong></span>
                    <span>הפסד: <strong style={{ color: '#f87171' }}>{result.lp}%</strong></span>
                  </div>
                </div>

                {result.potOdds !== null && (
                  <div className="card p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-sm">יחס קופה (Pot Odds)</div>
                      <div className="font-display font-bold" style={{ fontSize: 20, color: '#f59e0b' }}>{result.potOdds}%</div>
                    </div>
                    <Bar v={result.potOdds} color="#f59e0b" />
                    <div className="text-xs mt-2" style={{ color: 'var(--text2)' }}>צריך לשלם ₪{result.callN} כדי לזכות בקופה של ₪{result.potN + result.callN} — יחס {result.potOdds}%</div>
                    <div className="mt-2 rounded-xl p-2 text-xs font-medium" style={{
                      background: result.eq > result.potOdds + 5 ? 'rgba(34,197,94,0.1)' : result.eq < result.potOdds - 5 ? 'rgba(220,38,38,0.08)' : 'rgba(245,158,11,0.08)',
                      color: result.eq > result.potOdds + 5 ? '#4ade80' : result.eq < result.potOdds - 5 ? '#f87171' : '#fbbf24'
                    }}>
                      {result.eq > result.potOdds + 5 ? 'מתמטית הסיכוי שלך גבוה מיחס הקופה — התשלום נראה משתלם' :
                       result.eq < result.potOdds - 5 ? 'הסיכון גבוה ביחס לקופה — מתמטית זה גבולי' :
                       'מצב גבולי — התחשב בסגנון השחקנים ובתמונה הכוללת'}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text3)' }}>זו לא המלצה מוחלטת — צריך להתחשב גם בסגנון השחקנים</div>
                  </div>
                )}

                {result.outs.length > 0 && (
                  <div className="card p-4" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                    <div className="font-semibold text-sm mb-3">Outs — קלפים שיעזרו לך</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {result.outs.map((o: any, i: number) => (
                        <div key={i} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
                          {o.name}: {o.count} outs
                        </div>
                      ))}
                    </div>
                    {(() => {
                      const total = result.outs.reduce((s: number, o: any) => s + o.count, 0)
                      const deck = 47 - boardCards.filter(Boolean).length
                      const t = Math.round(total / deck * 100)
                      const tr2 = Math.round((1 - (1 - total / deck) * (1 - total / Math.max(deck - 1, 1))) * 100)
                      return (
                        <div className="text-sm" style={{ color: 'var(--text2)' }}>
                          {boardSlotCount === 3 ? <>טרן: <strong style={{ color: '#f59e0b' }}>{t}%</strong> · עד ריבר: <strong style={{ color: '#f59e0b' }}>{tr2}%</strong></> : <>קלף הבא: <strong style={{ color: '#f59e0b' }}>{t}%</strong></>}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'hands' && (
          <div className="pt-4">
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {HAND_RANKINGS.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-4" style={{ borderBottom: i < HAND_RANKINGS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: `${h.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: h.color, flexShrink: 0 }}>{h.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{h.name}</span>
                      {h.icon && <span>{h.icon}</span>}
                    </div>
                    <div className="text-xs mb-1" style={{ color: 'var(--text3)' }}>{h.ex}</div>
                    <div className="text-xs" style={{ color: 'var(--text2)' }}>{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'preflop' && (
          <div className="pt-4">
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'right', padding: '10px 14px', color: 'var(--text3)', fontWeight: 600 }}>יד</th>
                    <th style={{ textAlign: 'right', padding: '10px 14px', color: 'var(--text3)', fontWeight: 600 }}>חוזק</th>
                    <th style={{ textAlign: 'right', padding: '10px 14px', color: 'var(--text3)', fontWeight: 600 }}>הערה</th>
                  </tr>
                </thead>
                <tbody>
                  {PREFLOP.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < PREFLOP.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: row.color }}>{row.hand}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ background: `${row.color}22`, color: row.color, borderRadius: 10, padding: '2px 8px', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>{row.strength}</span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text2)', fontSize: 11 }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'odds' && (
          <div className="pt-4 space-y-3">
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'right', padding: '10px 14px', color: 'var(--text3)' }}>מצב</th>
                  <th style={{ textAlign: 'right', padding: '10px 14px', color: 'var(--text3)' }}>סיכוי</th>
                  <th style={{ textAlign: 'right', padding: '10px 14px', color: 'var(--text3)' }}>כלומר</th>
                </tr></thead>
                <tbody>
                  {[['לקבל A♥A♠','0.45%','פעם ב-221 ידיים'],['לקבל זוג כלשהו','5.9%','פעם ב-17 ידיים'],['לקבל AK','1.2%','suited או off'],['Suited → Flush בפלופ','0.84%','נדיר מאוד'],['Suited → Flush Draw','10.9%','4 קלפים מאותו סוג'],['זוג → שלישייה בפלופ','11.8%','Set mining']].map(([m,p,n],i,arr) => (
                    <tr key={i} style={{ borderBottom: i<arr.length-1?'1px solid var(--border)':'none' }}>
                      <td style={{ padding: '10px 14px', color: 'var(--text2)' }}>{m}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--red2)' }}>{p}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text3)', fontSize: 11 }}>{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card p-4" style={{ background: 'rgba(220,38,38,0.06)', borderColor: 'rgba(220,38,38,0.2)' }}>
              <div className="font-semibold text-sm mb-2" style={{ color: 'var(--red2)' }}>חוק 2 ו-4</div>
              <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>אחרי הפלופ: <strong>outs × 4</strong> ≈ סיכוי עד ריבר</div>
              <div className="text-sm" style={{ color: 'var(--text2)' }}>אחרי הטרן: <strong>outs × 2</strong> ≈ סיכוי בקלף הבא</div>
              <div className="text-xs mt-2" style={{ color: 'var(--text3)' }}>דוגמה: 9 outs × 4 = 36% (האמיתי ~35%)</div>
            </div>
          </div>
        )}

        {tab === 'outs' && (
          <div className="pt-4 space-y-3">
            <div className="card p-4" style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.2)' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}><strong>Outs</strong> = קלפים שיכולים לשפר את היד שלך.</div>
              <div className="text-xs" style={{ color: 'var(--text3)' }}>Flush Draw = 9 outs · Open Straight = 8 outs · Gutshot = 4 outs</div>
            </div>
            <div className="card p-4">
              <div className="text-sm font-semibold mb-3">מחשבון מהיר</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-xs mb-2" style={{ color: 'var(--text3)' }}>כמה Outs?</div>
                  <select className="input text-sm" value={outsCount} onChange={e => setOutsCount(+e.target.value)}>
                    {OUTS_DATA.map(([o]) => <option key={o} value={o}>{o} outs{OUTS_EXAMPLES[+o-1]?' — '+OUTS_EXAMPLES[+o-1]:''}</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-xs mb-2" style={{ color: 'var(--text3)' }}>שלב</div>
                  <select className="input text-sm" value={outsStage} onChange={e => setOutsStage(e.target.value as 'flop'|'turn')}>
                    <option value="flop">אחרי הפלופ</option>
                    <option value="turn">אחרי הטרן</option>
                  </select>
                </div>
              </div>
              {(() => {
                const row = OUTS_DATA[outsCount - 1]
                const [,next,river] = row
                return (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span style={{ color: 'var(--text2)' }}>בקלף הבא</span>
                        <strong style={{ color: '#22c55e' }}>{next}%</strong>
                      </div>
                      <Bar v={next} color="#22c55e" />
                    </div>
                    {outsStage === 'flop' && (
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span style={{ color: 'var(--text2)' }}>עד הריבר</span>
                          <strong style={{ color: '#f59e0b' }}>{river}%</strong>
                        </div>
                        <Bar v={river} color="#f59e0b" />
                      </div>
                    )}
                    <div className="text-xs p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text3)' }}>
                      חוק מהיר: {outsCount} × {outsStage === 'flop' ? '4' : '2'} = {outsCount * (outsStage === 'flop' ? 4 : 2)}% (האמיתי: {outsStage === 'flop' ? river : next}%)
                    </div>
                  </div>
                )
              })()}
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text3)' }}>Outs</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text3)' }}>בקלף הבא</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text3)' }}>עד ריבר</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text3)' }}>דוגמה</th>
                </tr></thead>
                <tbody>
                  {OUTS_DATA.map(([o, n, r], i) => (
                    <tr key={i} style={{ borderBottom: i < OUTS_DATA.length - 1 ? '1px solid var(--border)' : 'none', background: +o === outsCount ? 'rgba(220,38,38,0.06)' : 'transparent' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--text)' }}>{o}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text2)' }}>{n}%</td>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: +r >= 35 ? '#22c55e' : +r >= 20 ? '#fbbf24' : '#f87171' }}>{r}%</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text3)', fontSize: 11 }}>{OUTS_EXAMPLES[i] || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <BottomNav active="guide" />
    </div>
  )
}
