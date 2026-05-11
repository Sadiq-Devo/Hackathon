import { Redis } from '@upstash/redis'

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

const KEY = 'leaderboard:v1'
const MAX_ENTRIES = 500
const TOP_LIMIT = 5

type StoredEntry = { name: string; score: number; ts: number; id: string }
type PublicEntry = { name: string; score: number; id: string }

function corsHeaders () {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function json (data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  })
}

async function readTop (limit: number): Promise<PublicEntry[]> {
  if (!redis) return []
  const raw = await redis.zrange(KEY, 0, limit - 1, { rev: true, withScores: true }) as (string | number)[]
  const out: PublicEntry[] = []
  for (let i = 0; i < raw.length; i += 2) {
    try {
      const parsed = JSON.parse(String(raw[i])) as StoredEntry
      out.push({ name: parsed.name, score: Number(raw[i + 1]), id: parsed.id })
    } catch {
      // skip corrupted entry
    }
  }
  return out
}

async function descendingRank (member: string): Promise<number | null> {
  if (!redis) return null
  const asc = await redis.zrank(KEY, member)
  if (asc === null) return null
  const total = await redis.zcard(KEY)
  return total - asc
}

export default async function handler (req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }
  if (!redis) {
    return json({ error: 'leaderboard storage not configured' }, 503)
  }

  try {
    if (req.method === 'GET') {
      return json({ top: await readTop(TOP_LIMIT) })
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => null) as { name?: unknown; score?: unknown } | null
      const name = String(body?.name ?? '').trim().slice(0, 20)
      const rawScore = Number(body?.score)
      if (!name) return json({ error: 'name required' }, 400)
      if (!Number.isFinite(rawScore)) return json({ error: 'score must be a number' }, 400)
      const score = Math.max(0, Math.min(99999, Math.floor(rawScore)))

      const entry: StoredEntry = { name, score, ts: Date.now(), id: crypto.randomUUID() }
      const member = JSON.stringify(entry)
      await redis.zadd(KEY, { score, member })

      const total = await redis.zcard(KEY)
      if (total > MAX_ENTRIES) {
        await redis.zremrangebyrank(KEY, 0, total - MAX_ENTRIES - 1)
      }

      const top = await readTop(TOP_LIMIT)
      const isInTop = top.some((e) => e.id === entry.id)
      let you: { name: string; score: number; id: string; rank: number } | null = null
      if (!isInTop) {
        const rank = await descendingRank(member)
        if (rank !== null) you = { name: entry.name, score: entry.score, id: entry.id, rank }
      }
      return json({ top, you })
    }

    return json({ error: 'method not allowed' }, 405)
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
}
