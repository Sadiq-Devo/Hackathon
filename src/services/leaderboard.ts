import { createClient } from '@supabase/supabase-js'

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

const TABLE = 'leaderboard'
const TOP_LIMIT = 5
const MAX_NAME_LENGTH = 20
const MAX_SCORE = 99999

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export async function fetchTopScores (): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, score')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(TOP_LIMIT)
  if (error) throw new Error(`leaderboard fetch failed: ${error.message}`)
  return (data ?? []) as LeaderboardEntry[]
}

export async function submitScore (name: string, score: number): Promise<LeaderboardResponse> {
  const cleanName = name.trim().slice(0, MAX_NAME_LENGTH)
  const cleanScore = Math.max(0, Math.min(MAX_SCORE, Math.floor(Number(score) || 0)))
  if (!cleanName) throw new Error('name required')

  const { data: inserted, error: insertError } = await supabase
    .from(TABLE)
    .insert({ name: cleanName, score: cleanScore })
    .select('id, name, score')
    .single()
  if (insertError || !inserted) {
    throw new Error(`leaderboard submit failed: ${insertError?.message ?? 'unknown error'}`)
  }

  const top = await fetchTopScores()
  const isInTop = top.some((e) => e.id === inserted.id)
  let you: LeaderboardYou | null = null
  if (!isInTop) {
    const { count, error: rankError } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact', head: true })
      .gt('score', inserted.score)
    if (!rankError && count !== null) {
      you = { id: inserted.id, name: inserted.name, score: inserted.score, rank: count + 1 }
    }
  }
  return { top, you }
}
