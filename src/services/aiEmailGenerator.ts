import { emailTemplates, type Email } from '../data/emailTemplates'

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

const SYSTEM_PROMPT = `You generate fictional emails for "Phish Fighter", a phishing awareness training game set at Nexus Solutions Inc.

Output ONE valid JSON object only — no prose, no markdown fences, no explanation.

Schema (all keys required unless noted):
{
  "from": string,           // realistic sender email
  "subject": string,        // brief
  "body": string,           // 1-3 short paragraphs, use \\n for newlines
  "type": "legit" | "phishing",
  "difficulty": "easy" | "medium" | "hard",
  "hint": string,           // SWEDISH, 1 short sentence explaining the giveaway
  "wrongFeedback": string,  // SWEDISH, 1 short sentence with dry humor about the consequence
  "link": string,           // optional, real URL the link goes to
  "displayLink": string,    // optional, the spoofed URL shown in tooltip
  "attachment": string      // optional, filename
}

Org members (use real address for legit, spoofed for phishing impersonations):
- Richard Calloway / CEO / r.calloway@nexus-solutions.com (loves "synergy", travels constantly)
- Marcus Osei / CTO / m.osei@nexus-solutions.com (terse short emails)
- Diana Chen / CFO / d.chen@nexus-solutions.com (says no to everything)
- Sandra Kowalski / HR Manager / s.kowalski@nexus-solutions.com (warm, holds office together)
- Priya Nair / Head of IT Security / p.nair@nexus-solutions.com (stern, never panics)
- Helena Voss / Legal / h.voss@nexus-solutions.com (very long signatures)

Phishing tricks: lookalike domains (l→I, micros0ft, extra suffixes like -support/-portal), urgency, fake gift card requests, fake invoices, .docm/.xlsm/.html attachments, fake password resets, AI scams, Nigerian prince, lottery wins, sextortion, fake delivery fees.

Legit emails can include funny relatable office content (toilet paper SOS from a colleague, cake reminders, fridge cleanup, Diana saying "no" again, Marcus terse 4-word messages).

Mix Swedish and English freely. Match the tone of the examples.`

let nextAiId = 1000

function fewShotMessages () {
  const legit = emailTemplates.find((e) => e.type === 'legit' && e.senderEmployeeId)
  const phish = emailTemplates.find((e) => e.type === 'phishing' && e.attachment)
  const messages: { role: string; content: string }[] = []
  if (legit) {
    const example = stripIdAndFlags(legit)
    messages.push({ role: 'user', content: 'Generate one new email.' })
    messages.push({ role: 'assistant', content: JSON.stringify(example) })
  }
  if (phish) {
    const example = stripIdAndFlags(phish)
    messages.push({ role: 'user', content: 'Generate one new email, different style.' })
    messages.push({ role: 'assistant', content: JSON.stringify(example) })
  }
  return messages
}

function stripIdAndFlags (email: Email) {
  const { id: _id, done: _done, read: _read, senderEmployeeId: _sid, ...rest } = email
  return rest
}

function isValidGenerated (raw: unknown): raw is {
  from: string
  subject: string
  body: string
  type: 'legit' | 'phishing'
  difficulty?: string
  hint: string
  wrongFeedback?: string
  link?: string
  displayLink?: string
  attachment?: string
} {
  if (!raw || typeof raw !== 'object') return false
  const r = raw as Record<string, unknown>
  return (
    typeof r.from === 'string' && r.from.length > 0 &&
    typeof r.subject === 'string' && r.subject.length > 0 &&
    typeof r.body === 'string' && r.body.length > 0 &&
    (r.type === 'legit' || r.type === 'phishing') &&
    typeof r.hint === 'string' && r.hint.length > 0
  )
}

function extractJson (raw: string): unknown | null {
  // Strip code fences if present, then parse
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    // Try to find a JSON object substring
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

export async function generateAiEmail (signal?: AbortSignal): Promise<Email | null> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const model = import.meta.env.VITE_OPENROUTER_MODEL || DEFAULT_MODEL
  if (!apiKey) {
    console.warn('[ai] no OpenRouter API key configured (VITE_OPENROUTER_API_KEY)')
    return null
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Phish Fighter',
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        temperature: 0.95,
        max_tokens: 700,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...fewShotMessages(),
          { role: 'user', content: 'Generate one new email — different from previous examples. Return ONLY the JSON object.' },
        ],
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      if (res.status === 429) {
        console.warn(`[ai] rate limited on "${model}" — using template fallback. Try a different free model in .env.local (see README for options).`)
      } else if (res.status === 401) {
        console.warn('[ai] auth failed — check VITE_OPENROUTER_API_KEY in .env.local and restart dev server.')
      } else {
        console.warn('[ai] response not ok:', res.status, body)
      }
      return null
    }

    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== 'string') return null

    const parsed = extractJson(content)
    if (!isValidGenerated(parsed)) {
      console.warn('[ai] invalid response shape:', content.slice(0, 200))
      return null
    }

    const difficulty = parsed.difficulty === 'easy' || parsed.difficulty === 'hard' ? parsed.difficulty : 'medium'

    return {
      id: nextAiId++,
      from: parsed.from,
      subject: parsed.subject,
      body: parsed.body,
      type: parsed.type,
      difficulty,
      hint: parsed.hint,
      wrongFeedback: parsed.wrongFeedback,
      link: parsed.link,
      displayLink: parsed.displayLink,
      attachment: parsed.attachment,
      done: false,
      read: false,
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') return null
    console.warn('[ai] request failed:', e)
    return null
  }
}

export function pickFallbackEmail (excludeIds: Set<number>): Email | null {
  const available = emailTemplates.filter((e) => !excludeIds.has(e.id))
  if (available.length === 0) return null
  const picked = available[Math.floor(Math.random() * available.length)]
  return { ...picked, done: false, read: false }
}
