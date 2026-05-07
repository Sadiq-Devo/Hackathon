import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'

type Phase = 'off' | 'zooming' | 'menu'
type View = 'main' | 'leaderboard' | 'learn'

export type LeaderboardEntry = { name: string; score: number }

type Props = {
  position?: [number, number, number]
  phase: Phase
  startTransition: boolean
  leaderboard: LeaderboardEntry[]
  onPowerOn: () => void
  onStartGame: () => void
  musicOn: boolean
  onToggleMusic: () => void
}

export function Laptop ({
  position = [0, 0, 0],
  phase,
  startTransition,
  leaderboard,
  onPowerOn,
  onStartGame,
  musicOn,
  onToggleMusic,
}: Props) {
  const screenRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (screenRef.current) {
      const t = state.clock.elapsedTime
      const mat = screenRef.current.material as { emissiveIntensity?: number }
      if (mat.emissiveIntensity !== undefined) {
        const target = phase === 'off' ? 0.08 : 0.5 + 0.06 * Math.sin(t * 3)
        mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.1
      }
    }
  })

  const screenIsOn = phase !== 'off'

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.11, 1.05]} />
        <meshStandardMaterial color="#b8b8ad" roughness={0.74} />
      </mesh>
      <mesh position={[0, 0.058, -0.02]}>
        <boxGeometry args={[1.28, 0.01, 0.52]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.86} />
      </mesh>
      {Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: 13 }, (_, col) => (
          <mesh
            key={`key-${row}-${col}`}
            position={[-0.54 + col * 0.09, 0.067, -0.22 + row * 0.052]}
            castShadow
          >
            <boxGeometry args={[0.062, 0.012, 0.034]} />
            <meshStandardMaterial color="#262626" roughness={0.9} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.066, 0.38]}>
        <boxGeometry args={[0.48, 0.012, 0.22]} />
        <meshStandardMaterial color="#a6a69c" roughness={0.64} />
      </mesh>
      <mesh position={[-0.61, 0.067, 0.39]}>
        <boxGeometry args={[0.22, 0.011, 0.18]} />
        <meshStandardMaterial color="#c5c5bb" roughness={0.7} />
      </mesh>
      <mesh position={[0.62, 0.07, 0.39]}>
        <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
        <meshStandardMaterial
          color={screenIsOn ? '#22c55e' : '#7f1d1d'}
          emissive={screenIsOn ? '#16a34a' : '#000000'}
          emissiveIntensity={screenIsOn ? 0.55 : 0}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0.48, 0.071, 0.41]}>
        <cylinderGeometry args={[0.015, 0.015, 0.008, 16]} />
        <meshStandardMaterial
          color="#86efac"
          emissive={screenIsOn ? '#22c55e' : '#000000'}
          emissiveIntensity={screenIsOn ? 0.75 : 0}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.54, 0.071, 0.41]}>
        <cylinderGeometry args={[0.015, 0.015, 0.008, 16]} />
        <meshStandardMaterial
          color="#facc15"
          emissive={screenIsOn ? '#eab308' : '#000000'}
          emissiveIntensity={screenIsOn ? 0.5 : 0}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[-0.66, 0.072, -0.38]}>
        <boxGeometry args={[0.18, 0.008, 0.026]} />
        <meshStandardMaterial color="#756f60" roughness={0.8} />
      </mesh>
      <mesh position={[-0.42, 0.072, -0.38]}>
        <boxGeometry args={[0.18, 0.008, 0.026]} />
        <meshStandardMaterial color="#756f60" roughness={0.8} />
      </mesh>
      <mesh position={[0.42, 0.072, -0.38]}>
        <boxGeometry args={[0.18, 0.008, 0.026]} />
        <meshStandardMaterial color="#756f60" roughness={0.8} />
      </mesh>
      <mesh position={[0.66, 0.072, -0.38]}>
        <boxGeometry args={[0.18, 0.008, 0.026]} />
        <meshStandardMaterial color="#756f60" roughness={0.8} />
      </mesh>

      <group position={[0, 0.03, -0.45]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.58, 1.12, 0.08]} />
          <meshStandardMaterial color="#b8b8ad" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.5, 0.044]} castShadow>
          <boxGeometry args={[1.38, 0.94, 0.025]} />
          <meshStandardMaterial color="#a3a39a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, 0.061]} castShadow>
          <boxGeometry args={[1.2, 0.8, 0.018]} />
          <meshStandardMaterial color="#171717" roughness={0.84} />
        </mesh>
        <mesh position={[0, -0.07, 0.015]} castShadow>
          <boxGeometry args={[1.28, 0.08, 0.07]} />
          <meshStandardMaterial color="#9d9d94" roughness={0.76} />
        </mesh>
        <mesh position={[-0.58, -0.07, 0.058]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.01, 14]} />
          <meshStandardMaterial color="#16a34a" emissive="#16a34a" emissiveIntensity={screenIsOn ? 0.7 : 0} />
        </mesh>
        <mesh position={[-0.52, -0.07, 0.058]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.01, 14]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={screenIsOn ? 0.35 : 0} />
        </mesh>
        <mesh ref={screenRef} position={[0, 0.5, 0.071]}>
          <planeGeometry args={[1.04, 0.64]} />
          <meshStandardMaterial
            color={screenIsOn ? '#ffffff' : '#0a0a0a'}
            emissive={screenIsOn ? '#ffffff' : '#000000'}
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>

        <Html
          position={[0, 0.5, 0.073]}
          transform
          occlude="blending"
          distanceFactor={0.69}
          style={{
            width: '640px',
            height: '394px',
            userSelect: 'none',
          }}
        >
          {phase === 'off' && <PowerScreen onPowerOn={onPowerOn} />}
          {phase === 'zooming' && <BootScreen />}
          {phase === 'menu' && (
            <Win98Menu
              startTransition={startTransition}
              leaderboard={leaderboard}
              onStartGame={onStartGame}
              musicOn={musicOn}
              onToggleMusic={onToggleMusic}
            />
          )}
        </Html>
      </group>
    </group>
  )
}

function PowerScreen ({ onPowerOn }: { onPowerOn: () => void }) {
  return (
    <div className="crt-screen">
      <div className="crt-content">
        <div className="crt-header">PHISHFIGHTER 9000 BIOS v1.0</div>
        <div className="crt-line">Copyright (C) 1998 Tech Borås Industries</div>
        <div className="crt-line">─────────────────────────────────────────</div>
        <div className="crt-line">Memory check.................OK</div>
        <div className="crt-line">CMOS battery.................OK</div>
        <div className="crt-line">SYSTEM HALTED — awaiting input</div>
        <div className="crt-line">&nbsp;</div>
        <div className="crt-prompt">
          <span className="crt-cursor">█</span>
        </div>

        <button className="crt-power-btn" onClick={onPowerOn} type="button">
          ▶ POWER ON
        </button>

        <div className="crt-footer">PRESS BUTTON TO BOOT</div>
      </div>
      <div className="crt-led" />
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
    </div>
  )
}

function BootScreen () {
  return (
    <div className="crt-screen crt-booting">
      <div className="crt-content">
        <div className="crt-header">PHISHFIGHTER 9000 BIOS v1.0</div>
        <div className="crt-line">&nbsp;</div>
        <div className="crt-line">Booting from C:\WIN98\...</div>
        <div className="crt-line">Loading drivers..............OK</div>
        <div className="crt-line">Starting Phish Fighter.......</div>
        <div className="crt-line">&nbsp;</div>
        <div className="crt-progress">
          <div className="crt-progress-bar" />
        </div>
      </div>
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
    </div>
  )
}

function Win98Menu ({
  startTransition,
  leaderboard,
  onStartGame,
  musicOn,
  onToggleMusic,
}: {
  startTransition: boolean
  leaderboard: LeaderboardEntry[]
  onStartGame: () => void
  musicOn: boolean
  onToggleMusic: () => void
}) {
  const [view, setView] = useState<View>('main')

  return (
    <div className={`win98-desktop ${startTransition ? 'win98-desktop-launching' : ''}`}>
      <div className="win98-icons">
        <div className="win98-icon">
          <div className="win98-icon-img">🗑️</div>
          <span>Recycle Bin</span>
        </div>
        <div className="win98-icon">
          <div className="win98-icon-img">💻</div>
          <span>My Computer</span>
        </div>
        <div className="win98-icon">
          <div className="win98-icon-img">📧</div>
          <span>Inbox</span>
        </div>
        <div className="win98-icon">
          <div className="win98-icon-img">🌐</div>
          <span>Internet Explorer</span>
        </div>
        <div className="win98-icon suspicious">
          <div className="win98-icon-img">⚠️</div>
          <span>FREE_iPhone.exe</span>
        </div>
        <div className="win98-icon suspicious">
          <div className="win98-icon-img">💰</div>
          <span>BankLogin.html</span>
        </div>
      </div>

      {view === 'main' ? (
        <div className="win98-window win98-window-main">
          <div className="win98-titlebar">
            <div className="win98-titlebar-text">
              <span className="win98-titlebar-icon">🎯</span>
              Phish Fighter
            </div>
            <div className="win98-titlebar-buttons">
              <button className="win98-tb-btn" type="button" tabIndex={-1}>_</button>
              <button className="win98-tb-btn" type="button" tabIndex={-1}>□</button>
              <button className="win98-tb-btn win98-tb-close" type="button" tabIndex={-1}>×</button>
            </div>
          </div>
          <div className="win98-window-body">
            <p className="win98-window-tagline">Defend the inbox. Trust nothing.</p>
            <div className="win98-buttons">
              <button
                className="win98-btn win98-btn-primary"
                onClick={onStartGame}
                type="button"
                disabled={startTransition}
              >
                <span className="win98-btn-icon">▶</span>
                Start Game
              </button>
              <button
                className="win98-btn"
                onClick={onToggleMusic}
                type="button"
                disabled={startTransition}
              >
                <span className="win98-btn-icon">♪</span>
                Music: {musicOn ? 'On' : 'Off'}
              </button>
              <button
                className="win98-btn"
                onClick={() => setView('learn')}
                type="button"
                disabled={startTransition}
              >
                <span className="win98-btn-icon">?</span>
                Learn
              </button>
              <button
                className="win98-btn"
                onClick={() => setView('leaderboard')}
                type="button"
                disabled={startTransition}
              >
                <span className="win98-btn-icon">🏆</span>
                Leaderboard
              </button>
            </div>
            <div className="win98-window-footer">
              <span>v1.0</span>
              <span>© Hackathon Tech Borås</span>
            </div>
          </div>
        </div>
      ) : view === 'leaderboard' ? (
        <LeaderboardWindow leaderboard={leaderboard} onBack={() => setView('main')} />
      ) : (
        <LearnWindow onBack={() => setView('main')} />
      )}

      <div className="win98-taskbar">
        <button className="win98-start-btn" type="button" tabIndex={-1}>
          <span className="win98-start-flag" />
          Start
        </button>
        <div className="win98-taskbar-window">
          <span>{view === 'learn' ? '?' : view === 'leaderboard' ? '🏆' : '🎯'}</span>
          {view === 'learn' ? 'Learn.exe' : view === 'leaderboard' ? 'Leaderboard.exe' : 'Phish Fighter'}
        </div>
        <div className="win98-tray">
          <span className="win98-tray-icon">🔊</span>
          <span className="win98-tray-icon">📡</span>
          <span className="win98-clock">21:26</span>
        </div>
      </div>
    </div>
  )
}

function LearnWindow ({ onBack }: { onBack: () => void }) {
  const [slideIndex, setSlideIndex] = useState(0)
  const slides = [
    {
      title: 'What is phishing?',
      copy: 'A fake message that tries to make you click, sign in, pay, or share private information.',
      bullets: ['Looks like a trusted brand', 'Pushes you to act quickly', 'Usually includes a link or attachment'],
      tip: 'Goal: steal access, money, or data.',
    },
    {
      title: 'Check the sender',
      copy: 'Attackers often use lookalike names, strange domains, or tiny spelling changes.',
      bullets: ['support@paypaI.com uses a capital I', 'security-bank-login.com is not your bank', 'Display names can lie'],
      tip: 'Trust the domain, not the logo.',
    },
    {
      title: 'Inspect links',
      copy: 'Hover or long-press before clicking. The real destination matters more than the button text.',
      bullets: ['Short links hide the destination', 'Misspelled domains are suspicious', 'Login links from emails deserve caution'],
      tip: 'Open important sites yourself in the browser.',
    },
    {
      title: 'Pressure is a clue',
      copy: 'Phishing works by making your brain rush. Urgency, fear, prizes, and secrecy are common tricks.',
      bullets: ['Account closing today', 'Invoice overdue', 'You won a prize', 'Do not tell anyone'],
      tip: 'If it demands panic, slow down.',
    },
    {
      title: 'Safe response',
      copy: 'When something feels off, do not reply, download, or sign in from the message.',
      bullets: ['Verify through another channel', 'Report it to IT or a teacher', 'Delete it after reporting'],
      tip: 'In the game: read first, click second.',
    },
  ]
  const slide = slides[slideIndex]
  const isFirst = slideIndex === 0
  const isLast = slideIndex === slides.length - 1

  return (
    <div className="win98-window win98-window-learn">
      <div className="win98-titlebar">
        <div className="win98-titlebar-text">
          <span className="win98-titlebar-icon">?</span>
          Learn.exe
        </div>
        <div className="win98-titlebar-buttons">
          <button className="win98-tb-btn" type="button" tabIndex={-1}>_</button>
          <button className="win98-tb-btn" type="button" tabIndex={-1}>□</button>
          <button
            className="win98-tb-btn win98-tb-close"
            type="button"
            onClick={onBack}
          >×</button>
        </div>
      </div>
      <div className="win98-window-body">
        <div className="win98-learn-panel">
          <div className="win98-learn-slide-count">
            LESSON {slideIndex + 1} / {slides.length}
          </div>
          <h3>{slide.title}</h3>
          <p>{slide.copy}</p>
          <ul className="win98-learn-bullets">
            {slide.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="win98-learn-tip">
            {slide.tip}
          </div>
          <div className="win98-learn-dots" aria-hidden="true">
            {slides.map((_, i) => (
              <span
                key={i}
                className={i === slideIndex ? 'win98-learn-dot-active' : ''}
              />
            ))}
          </div>
        </div>
        <div className="win98-learn-actions">
          <button
            className="win98-btn"
            onClick={() => setSlideIndex((index) => Math.max(0, index - 1))}
            type="button"
            disabled={isFirst}
          >
            ◀ Prev
          </button>
          <button className="win98-btn" onClick={onBack} type="button">
            Back
          </button>
          <button
            className="win98-btn"
            onClick={() => setSlideIndex((index) => Math.min(slides.length - 1, index + 1))}
            type="button"
            disabled={isLast}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  )
}

function LeaderboardWindow ({
  leaderboard,
  onBack,
}: {
  leaderboard: LeaderboardEntry[]
  onBack: () => void
}) {
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 10)

  return (
    <div className="win98-window win98-window-lb">
      <div className="win98-titlebar">
        <div className="win98-titlebar-text">
          <span className="win98-titlebar-icon">🏆</span>
          Leaderboard.exe
        </div>
        <div className="win98-titlebar-buttons">
          <button className="win98-tb-btn" type="button" tabIndex={-1}>_</button>
          <button className="win98-tb-btn" type="button" tabIndex={-1}>□</button>
          <button
            className="win98-tb-btn win98-tb-close"
            type="button"
            onClick={onBack}
          >×</button>
        </div>
      </div>
      <div className="win98-window-body">
        <div className="win98-lb-header">
          <span className="win98-lb-rank-h">RANK</span>
          <span className="win98-lb-name-h">PLAYER</span>
          <span className="win98-lb-score-h">SCORE</span>
        </div>
        <div className="win98-lb-list">
          {sorted.length === 0 ? (
            <div className="win98-lb-empty">[ NO RECORDS FOUND ]</div>
          ) : (
            sorted.map((entry, i) => (
              <div key={i} className={`win98-lb-row ${i < 3 ? `win98-lb-top-${i + 1}` : ''}`}>
                <span className="win98-lb-rank">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <span className="win98-lb-name">{entry.name}</span>
                <span className="win98-lb-score">{entry.score}</span>
              </div>
            ))
          )}
        </div>
        <div className="win98-lb-actions">
          <button className="win98-btn" onClick={onBack} type="button">
            ◀ Back
          </button>
        </div>
      </div>
    </div>
  )
}
