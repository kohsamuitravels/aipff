'use client'
import { useState, useCallback } from 'react'
import { calculateOdds, Card, ALL_RANKS, ALL_SUITS, cardKey } from '@/lib/poker-odds'

type Suit = '♠' | '♥' | '♦' | '♣'
type Rank = '2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'J'|'Q'|'K'|'A'

const RED_SUITS: Suit[] = ['♥', '♦']

function CardDisplay({ card, onClick, empty, label }: {
  card?: Card, onClick?: () => void, empty?: boolean, label?: string
}) {
  const isRed = card && RED_SUITS.includes(card.suit as Suit)
  return (
    <div onClick={onClick}
      className="flex items-center justify-center rounded-lg cursor-pointer select-none transition-all"
      style={{
        width: 48, height: 66,
        background: card ? '#fff' : 'rgba(255,255,255,0.04)',
        border: card ? 'none' : '1px dashed rgba(255,255,255,0.15)',
        color: card ? (isRed ? '#dc2626' : '#111') : 'var(--text3)',
        fontSize: card ? 15 : 11,
        fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
        boxShadow: card ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
        flexDirection: 'column',
        gap: 1,
      }}>
      {card ? (
        <>
          <span style={{ fontSize: 13, lineHeight: 1 }}>{card.rank}</span>
          <span style={{ fontSize: 16, lineHeight: 1 }}>{card.suit}</span>
        </>
      ) : (
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{label || '?'}</span>
      )}
    </div>
  )
}

function PctBar({ value, color }: { value: number, color: string }) {
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
    </div>
  )
}

function pctColor(v: number) {
  if (v >= 70) return '#22c55e'
  if (v >= 40) return '#f59e0b'
  return '#f87171'
}

type Slot = 'my1'|'my2'|'op1'|'op2'|'b1'|'b2'|'b3'|'b4'|'b5'

export default function CalculatorPage() {
  const [myCards, setMyCards] = useState<(Card|null)[]>([null, null])
  const [board, setBoard] = useState<(Card|null)[]>([null, null, null, null, null])
  const [oppCards, setOppCards] = useState<(Card|null)[]>([null, null])
  const [selecting, setSelecting] = useState<Slot|null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateOdds>|null>(null)

  const usedCards = [...myCards, ...board, ...oppCards].filter(Boolean) as Card[]

  function selectCard(slot: Slot) { setSelecting(slot) }

  function pickCard(card: Card) {
    if (!selecting) return
    const set = (arr: (Card|null)[], idx: number): (Card|null)[] => {
      const next = [...arr]; next[idx] = card; return next
    }
    if (selecting === 'my1') setMyCards(set(myCards, 0))
    else if (selecting === 'my2') setMyCards(set(myCards, 1))
    else if (selecting === 'op1') setOppCards(set(oppCards, 0))
    else if (selecting === 'op2') setOppCards(set(oppCards, 1))
    else if (selecting === 'b1') setBoard(set(board, 0))
    else if (selecting === 'b2') setBoard(set(board, 1))
    else if (selecting === 'b3') setBoard(set(board, 2))
    else if (selecting === 'b4') setBoard(set(board, 3))
    else if (selecting === 'b5') setBoard(set(board, 4))
    setSelecting(null)
  }

  function clearCard(slot: Slot) {
    const clr = (arr: (Card|null)[], idx: number): (Card|null)[] => {
      const next = [...arr]; next[idx] = null; return next
    }
    if (slot === 'my1') setMyCards(clr(myCards, 0))
    else if (slot === 'my2') setMyCards(clr(myCards, 1))
    else if (slot === 'op1') setOppCards(clr(oppCards, 0))
    else if (slot === 'op2') setOppCards(clr(oppCards, 1))
    else if (slot === 'b1') setBoard(clr(board, 0))
    else if (slot === 'b2') setBoard(clr(board, 1))
    else if (slot === 'b3') setBoard(clr(board, 2))
    else if (slot === 'b4') setBoard(clr(board, 3))
    else if (slot === 'b5') setBoard(clr(board, 4))
  }

  function calculate() {
    const mc = myCards.filter(Boolean) as Card[]
    const bc = board.filter(Boolean) as Card[]
    const oc = oppCards.filter(Boolean) as Card[]
    if (mc.length !== 2) return
    const res = calculateOdds(mc, bc, oc.length === 2 ? oc : undefined)
    setResult(res)
  }

  function reset() {
    setMyCards([null, null])
    setBoard([null, null, null, null, null])
    setOppCards([null, null])
    setResult(null)
    setSelecting(null)
  }

  const slots: { id: Slot; rank: Rank; suit: Suit }[] = ALL_RANKS.flatMap(rank =>
    ALL_SUITS.map(suit => ({ id: 'my1' as Slot, rank: rank as Rank, suit: suit as Suit }))
  )

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg,rgba(20,80,30,0.6) 0%,transparent 100%)', padding: '16px 20px' }}>
        <h1 className="font-display text-xl font-semibold">מחשבון אחוזי זכיה 🃏</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>בחר קלפים וחשב אחוזים בזמן אמת</p>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-4">

        {/* My cards */}
        <div className="card p-4">
          <div className="text-xs font-medium mb-3" style={{ color: 'var(--text3)' }}>הקלפים שלי</div>
          <div className="flex gap-3 items-center">
            <div onClick={() => myCards[0] ? clearCard('my1') : selectCard('my1')}
              style={{ border: selecting === 'my1' ? '2px solid #dc2626' : undefined, borderRadius: 8 }}>
              <CardDisplay card={myCards[0] || undefined} label="קלף 1" />
            </div>
            <div onClick={() => myCards[1] ? clearCard('my2') : selectCard('my2')}
              style={{ border: selecting === 'my2' ? '2px solid #dc2626' : undefined, borderRadius: 8 }}>
              <CardDisplay card={myCards[1] || undefined} label="קלף 2" />
            </div>
            {myCards[0] && myCards[1] && (
              <div className="text-sm font-medium" style={{ color: 'var(--text2)' }}>
                {myCards[0]?.suit === myCards[1]?.suit ? '✅ suited' : '❌ offsuit'}
              </div>
            )}
          </div>
        </div>

        {/* Board */}
        <div className="card p-4">
          <div className="text-xs font-medium mb-3" style={{ color: 'var(--text3)' }}>לוח המשחק</div>
          <div className="flex gap-2">
            {(['b1','b2','b3'] as Slot[]).map((slot, i) => (
              <div key={slot} onClick={() => board[i] ? clearCard(slot) : selectCard(slot)}
                style={{ border: selecting === slot ? '2px solid #dc2626' : undefined, borderRadius: 8 }}>
                <CardDisplay card={board[i] || undefined} label={['F1','F2','F3'][i]} />
              </div>
            ))}
            <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
            {(['b4','b5'] as Slot[]).map((slot, i) => (
              <div key={slot} onClick={() => board[i+3] ? clearCard(slot) : selectCard(slot)}
                style={{ border: selecting === slot ? '2px solid #dc2626' : undefined, borderRadius: 8 }}>
                <CardDisplay card={board[i+3] || undefined} label={['T','R'][i]} />
              </div>
            ))}
          </div>
        </div>

        {/* Opponent cards (optional) */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium" style={{ color: 'var(--text3)' }}>קלפי יריב (אם ידוע)</div>
            <span className="text-xs" style={{ color: 'var(--text3)' }}>אופציונלי</span>
          </div>
          <div className="flex gap-3">
            <div onClick={() => oppCards[0] ? clearCard('op1') : selectCard('op1')}
              style={{ border: selecting === 'op1' ? '2px solid #dc2626' : undefined, borderRadius: 8 }}>
              <CardDisplay card={oppCards[0] || undefined} label="קלף 1" />
            </div>
            <div onClick={() => oppCards[1] ? clearCard('op2') : selectCard('op2')}
              style={{ border: selecting === 'op2' ? '2px solid #dc2626' : undefined, borderRadius: 8 }}>
              <CardDisplay card={oppCards[1] || undefined} label="קלף 2" />
            </div>
          </div>
        </div>

        {/* Card picker */}
        {selecting && (
          <div className="card p-4">
            <div className="text-xs font-medium mb-3" style={{ color: 'var(--text3)' }}>
              בחר קלף — {selecting}
            </div>
            <div className="flex flex-wrap gap-1">
              {ALL_RANKS.slice().reverse().flatMap(rank =>
                ALL_SUITS.map(suit => {
                  const card: Card = { rank: rank as Rank, suit: suit as Suit }
                  const used = usedCards.some(c => cardKey(c) === cardKey(card))
                  const isRed = RED_SUITS.includes(suit as Suit)
                  return (
                    <button key={cardKey(card)} onClick={() => !used && pickCard(card)} disabled={used}
                      className="rounded font-display font-bold text-xs transition-all"
                      style={{
                        width: 38, height: 50,
                        background: used ? 'rgba(255,255,255,0.02)' : '#fff',
                        color: used ? '#333' : (isRed ? '#dc2626' : '#111'),
                        opacity: used ? 0.25 : 1,
                        cursor: used ? 'not-allowed' : 'pointer',
                        border: 'none',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 1,
                        padding: 0,
                      }}>
                      <span style={{ fontSize: 11, lineHeight: 1 }}>{rank}</span>
                      <span style={{ fontSize: 14, lineHeight: 1 }}>{suit}</span>
                    </button>
                  )
                })
              )}
            </div>
            <button onClick={() => setSelecting(null)} className="btn btn-ghost text-sm py-2 mt-3">ביטול</button>
          </div>
        )}

        {/* Calculate button */}
        <button onClick={calculate} disabled={myCards.filter(Boolean).length !== 2}
          className="btn btn-red text-base">
          חשב אחוזים 🎯
        </button>

        {/* Results */}
        {result && (
          <div className="card p-4 space-y-4">
            <div className="text-sm font-semibold">תוצאות</div>

            {[
              { label: 'לפני הפלופ (Pre-flop)', value: result.preFlopWin },
              { label: 'אחרי הפלופ', value: result.flopWin },
              { label: 'אחרי הטרן', value: result.turnWin },
              { label: 'אחרי הריבר', value: result.riverWin },
            ].map(({ label, value }) => value !== null && (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--text2)' }}>{label}</span>
                  <span className="font-display font-bold" style={{ color: pctColor(value), fontSize: 16 }}>{value}%</span>
                </div>
                <PctBar value={value} color={pctColor(value)} />
              </div>
            ))}

            {result.handName && (
              <div className="text-sm pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
                הציבוי שלך: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{result.handName}</span>
              </div>
            )}

            {result.outs > 0 && (
              <div className="text-sm" style={{ color: 'var(--text2)' }}>
                Outs לשיפור: <span style={{ color: '#f59e0b', fontWeight: 600 }}>{result.outs}</span>
                <span style={{ color: 'var(--text3)', fontSize: 11, marginRight: 4 }}>
                  (~{Math.round(result.outs * 2.2)}% טרן / ~{Math.round(result.outs * 4.4)}% טרן+ריבר)
                </span>
              </div>
            )}

            <button onClick={reset} className="btn btn-ghost text-sm py-2.5">איפוס</button>
          </div>
        )}
      </div>
    </div>
  )
}
