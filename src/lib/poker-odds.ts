export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank = '2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'J'|'Q'|'K'|'A'
export interface Card { rank: Rank; suit: Suit }

const RANKS: Rank[] = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
const SUITS: Suit[] = ['♠','♥','♦','♣']
const RANK_VAL: Record<Rank, number> = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14}

export function cardKey(c: Card) { return `${c.rank}${c.suit}` }

function fullDeck(): Card[] {
  return RANKS.flatMap(rank => SUITS.map(suit => ({ rank, suit })))
}

function remainingDeck(used: Card[]): Card[] {
  const usedSet = new Set(used.map(cardKey))
  return fullDeck().filter(c => !usedSet.has(cardKey(c)))
}

// Hand evaluation (returns score 0-8, higher is better)
function evalHand(cards: Card[]): number {
  const all = [...cards]
  if (all.length < 5) return 0

  // Get all 5-card combos from up to 7 cards
  const combos = getCombos(all, 5)
  return Math.max(...combos.map(eval5))
}

function getCombos(arr: Card[], k: number): Card[][] {
  if (k === 0) return [[]]
  if (arr.length < k) return []
  const [first, ...rest] = arr
  const withFirst = getCombos(rest, k-1).map(c => [first, ...c])
  const withoutFirst = getCombos(rest, k)
  return [...withFirst, ...withoutFirst]
}

function eval5(cards: Card[]): number {
  const vals = cards.map(c => RANK_VAL[c.rank]).sort((a,b) => b-a)
  const suits = cards.map(c => c.suit)
  const flush = suits.every(s => s === suits[0])
  const sorted = vals
  const straight = sorted[0] - sorted[4] === 4 && new Set(sorted).size === 5
  const wheel = sorted[0] === 14 && sorted[1] === 5 && sorted[2] === 4 && sorted[3] === 3 && sorted[4] === 2

  const counts: Record<number,number> = {}
  vals.forEach(v => counts[v] = (counts[v]||0)+1)
  const countVals = Object.values(counts).sort((a,b) => b-a)

  if ((straight || wheel) && flush) return 800 + (wheel ? 5 : sorted[0])
  if (countVals[0] === 4) return 700 + Object.keys(counts).find(k => counts[+k] === 4)! as any
  if (countVals[0] === 3 && countVals[1] === 2) return 600
  if (flush) return 500 + sorted[0]
  if (straight || wheel) return 400 + (wheel ? 5 : sorted[0])
  if (countVals[0] === 3) return 300
  if (countVals[0] === 2 && countVals[1] === 2) return 200
  if (countVals[0] === 2) return 100
  return sorted[0]
}

export interface OddsResult {
  preFlopWin: number
  flopWin: number | null
  turnWin: number | null
  riverWin: number | null
  handName: string
  outs: number
}

export function calculateOdds(
  myCards: Card[],
  board: Card[],
  opponentCards?: Card[]
): OddsResult {
  if (myCards.length !== 2) return { preFlopWin: 0, flopWin: null, turnWin: null, riverWin: null, handName: '', outs: 0 }

  const used = [...myCards, ...board, ...(opponentCards || [])]
  const deck = remainingDeck(used)

  // Pre-flop equity via Monte Carlo (1000 simulations)
  const preFlopWin = monteCarlo(myCards, board, opponentCards, deck, 1000)

  // Post-flop
  const flopWin = board.length >= 3 ? monteCarlo(myCards, board, opponentCards, remainingDeck([...myCards, ...board, ...(opponentCards||[])]), 1000) : null
  const turnWin = board.length >= 4 ? monteCarlo(myCards, board, opponentCards, remainingDeck([...myCards, ...board, ...(opponentCards||[])]), 1000) : null
  const riverWin = board.length >= 5 ? (evalHand([...myCards, ...board]) > evalHand([...(opponentCards||[]), ...board]) ? 100 : 0) : null

  const handName = board.length >= 3 ? getHandName(evalHand([...myCards, ...board])) : getHandName(0)
  const outs = board.length >= 3 && board.length < 5 ? calcOuts(myCards, board) : 0

  return { preFlopWin: Math.round(preFlopWin), flopWin: flopWin ? Math.round(flopWin) : null, turnWin: turnWin ? Math.round(turnWin) : null, riverWin, handName, outs }
}

function monteCarlo(myCards: Card[], board: Card[], oppCards: Card[] | undefined, deck: Card[], n: number): number {
  let wins = 0
  const boardNeeded = 5 - board.length
  const oppNeeded = oppCards ? 0 : 2

  for (let i = 0; i < n; i++) {
    const shuffled = shuffle([...deck])
    let idx = 0
    const opp = oppCards || [shuffled[idx++], shuffled[idx++]]
    const extra: Card[] = []
    for (let j = 0; j < boardNeeded; j++) extra.push(shuffled[idx++])
    const fullBoard = [...board, ...extra]
    const myScore = evalHand([...myCards, ...fullBoard])
    const oppScore = evalHand([...opp, ...fullBoard])
    if (myScore >= oppScore) wins++
  }
  return (wins / n) * 100
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function calcOuts(myCards: Card[], board: Card[]): number {
  const score = evalHand([...myCards, ...board])
  const deck = remainingDeck([...myCards, ...board])
  return deck.filter(c => evalHand([...myCards, ...board, c]) > score).length
}

function getHandName(score: number): string {
  if (score >= 800) return 'Straight Flush / Royal Flush'
  if (score >= 700) return 'Four of a Kind — פוקר'
  if (score >= 600) return 'Full House'
  if (score >= 500) return 'Flush — צבע'
  if (score >= 400) return 'Straight — סטרייט'
  if (score >= 300) return 'Three of a Kind — שלישייה'
  if (score >= 200) return 'Two Pair — שני זוגות'
  if (score >= 100) return 'One Pair — זוג'
  if (score > 0)    return 'High Card — גבוה'
  return ''
}

export const ALL_RANKS = RANKS
export const ALL_SUITS = SUITS
