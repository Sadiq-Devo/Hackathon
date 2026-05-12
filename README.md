# Phish Fighter

A retro phishing-awareness training game built for Hackathon Tech Borås. You play an office worker at Nexus Solutions Inc. — your inbox is under attack, and you have to keep it clean while the timer runs out. Get phishing wrong three times and your system gets hacked.

The whole experience is wrapped in a 90s aesthetic: a 3D scene of a laptop on a desk, a CRT-style BIOS power-on screen, a Windows-98-styled menu running on the laptop, a chunky pixel-art trash icon, and a Game Over dialog over a Bliss-style desktop wallpaper.

## Quickstart

```bash
npm install
cp .env.local.example .env.local   # then fill in your OpenRouter + Supabase keys
npm run dev
```

The dev server prints a local URL (typically `http://localhost:5173`).

## How to play

1. **Power on the laptop.** The opening screen is a 3D laptop sitting on a desk. The screen renders a CRT-style fake BIOS with a green-phosphor `▶ POWER ON` button. Click it.
2. **Boot animation.** A boot chime plays (synthesized via Web Audio API), the BIOS shows a loading bar, and the camera flies straight into the laptop screen.
3. **Win98 desktop loads.** The screen now shows a Bliss-style wallpaper with desktop icons and a centered Phish Fighter dialog window. Three options:
   - **Start Game** — fades the desktop, then drops you into the email client behind the laptop bezel.
   - **Music** — toggle background music.
   - **Leaderboard** — opens a Win98 `Leaderboard.exe` window with your top 10 saved scores.
4. **Play the inbox.** You have 45 seconds. Each email is either legitimate or phishing.
   - **Reply** to a legit email (chunky retro reply form, send a templated response).
   - **Trash** a phishing email using the pixel-art red trash icon in the email header.
   - Use the **Organization** tab to look up senders against the company directory.
5. **Outcome:**
   - **Time runs out:** the **Game Over** dialog opens — Win98-styled, lists final score / accuracy / correct / wrong, lets you save your name to the leaderboard, and gives you **Play Again** + **Quit Game**.
   - **Three mistakes — system hacked:** the screen glitches, popups invade. Click **Clean System** and you land on the **System Compromised** dialog with three options: **Play Again**, **See Your Mistakes** (walks through every email you misjudged with the giveaway and the hint), or **Return to Lobby** (back to the 3D laptop).

## Features

- **3D menu scene** — Three.js (`@react-three/fiber` + `@react-three/drei`) rendering a desk + laptop + plant. The laptop screen is a real HTML `<Html transform>` portal projected onto the screen mesh in world space.
- **Cinematic zoom** — driven by Remotion's `interpolate` + bezier easing. Camera flies from a 3/4 idle shot to a perpendicular landing dead-center on the laptop screen.
- **Retro CRT BIOS** — green phosphor monospace text, blinking cursor, scanlines, a flickering vignette, a red blinking power LED in the corner.
- **Synthesized boot audio** — CRT thunk + ascending F-major arpeggio chime + sustained PSU hum, all generated at runtime via the Web Audio API. No audio file needed.
- **Win98-styled UI** — chunky raised/sunken bevels, navy gradient title bars, Tahoma typography. Used for the menu popup, leaderboard window, hacked recovery dialog, mistake review window, and Game Over dialog.
- **Laptop bezel POV** — once the camera lands, a CSS bezel overlay (top + sides + bottom + simulated webcam dot + hinge accent) frames the entire game so it always feels like you're staring at the laptop.
- **AI-generated emails** — every fresh email after the initial inbox is generated on the fly via OpenRouter (Llama 3.3 70B by default) using a strict JSON schema. Emails impersonate real members of the Nexus Solutions org chart, with Swedish hints and dry-humor wrong-answer feedback. If the API call fails it gracefully falls back to a curated email template.
- **Streak feedback** — random celebration sound (Cash, Great, Holy Cow, Legendary, Phenomenal, Splendid, Wow, Oh Yeah) and a streak burst image when you chain correct answers.
- **Mistake review** — every wrong email is collected into a Win98 list. Each card shows the actual classification, what you treated it as, the `wrongFeedback` callout, and the educational `hint`.
- **Global leaderboard** — saves scores to Supabase and shows the top players with gold/silver/bronze gradients on rank 1-3.

## Tech stack

| Library | Purpose |
|---|---|
| React 19 + TypeScript | App framework |
| Vite 8 | Bundler / dev server |
| `three`, `@react-three/fiber`, `@react-three/drei` | 3D laptop scene + Html portal |
| `remotion` | `interpolate` + easing for the camera zoom animation |
| Web Audio API | Synthesized boot chime |
| OpenRouter API | AI email generation (Llama 3.3 70B by default, model is configurable) |
| Supabase | Hosted database for the global leaderboard |

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Purpose | Default if unset |
|---|---|---|
| `VITE_OPENROUTER_API_KEY` | Your OpenRouter API key (get one at [openrouter.ai/keys](https://openrouter.ai/keys)) | AI generation disabled, falls back to curated templates |
| `VITE_OPENROUTER_MODEL` | OpenRouter model slug | `meta-llama/llama-3.3-70b-instruct:free` |
| `VITE_SUPABASE_URL` | Supabase project URL | Leaderboard requests fail |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public API key | Leaderboard requests fail |

`.env.local` is in `.gitignore` — never commit it. If you ever paste a key into a tracked file by mistake, rotate it on OpenRouter immediately.

## Database

The global leaderboard uses Supabase with a `leaderboard` table:

```sql
create table public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 20),
  score integer not null check (score >= 0 and score <= 99999),
  created_at timestamptz not null default now()
);

create index leaderboard_score_created_at_idx
  on public.leaderboard (score desc, created_at asc);
```

Enable insert/select access for the anon key according to your Supabase Row Level Security policy. The app reads `id`, `name`, and `score`, orders by `score` descending then `created_at` ascending, and inserts new score rows.

## Project structure

```
src/
  App.tsx                 - main game state machine (start / game / hacked / hacked-menu / mistakes / end)
  App.css                 - all styling: game UI, Win98 windows, laptop bezel, BIOS, animations
  data/
    emailTemplates.ts     - curated email pool (used as initial inbox + fallback)
    employees.ts          - Nexus Solutions org chart (CEO, CTO, CFO, etc.)
  services/
    aiEmailGenerator.ts   - OpenRouter client + JSON schema validation + fallback
    leaderboard.ts        - Supabase leaderboard client
  menu/
    MenuScene.tsx         - R3F Canvas, lighting, camera rig, zoom animation
    Laptop.tsx            - laptop geometry + Html portal (BIOS / Win98 menu / Win98 leaderboard)
    Desk.tsx              - desk + room
    Plant.tsx             - potted plant with idle sway
    bootAudio.ts          - Web Audio synthesized power-on sound
  assets/
    audio/                - background music, sfx, streak shouts
    effects/              - hearts, popup ad images, streak bursts, lost screen
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Credits

Built at Hackathon Tech Borås. The phishing emails, BIOS copy, and dry humor are part of the educational gimmick — every mistake screen exists so the player walks away knowing what to look out for next time.
