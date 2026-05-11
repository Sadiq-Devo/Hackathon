export type LeaderboardEntry = {
  name: string
  score: number
  id: string
}

export type LeaderboardYou = LeaderboardEntry & { rank: number }

export type LeaderboardResponse = {
  top: LeaderboardEntry[]
  you?: LeaderboardYou | null
}

const ENDPOINT = '/api/leaderboard'

export async function fetchTopScores (): Promise<LeaderboardEntry[]> {
  const res = await fetch(ENDPOINT, { method: 'GET' })
  if (!res.ok) throw new Error(`leaderboard fetch failed (${res.status})`)
  const data = await res.json() as LeaderboardResponse
  return data.top ?? []
}

export async function submitScore (name: string, score: number): Promise<LeaderboardResponse> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score }),
  })
  if (!res.ok) throw new Error(`leaderboard submit failed (${res.status})`)
  return await res.json() as LeaderboardResponse
}
