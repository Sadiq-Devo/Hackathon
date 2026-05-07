import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'

type Phase = 'off' | 'zooming' | 'menu'
type View = 'main' | 'leaderboard'

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
        <boxGeometry args={[1.4, 0.06, 0.95]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.032, 0.05]}>
        <boxGeometry args={[1.2, 0.005, 0.55]} />
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.032, 0.4]}>
        <boxGeometry args={[0.5, 0.003, 0.25]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.5} metalness={0.3} />
      </mesh>

      <group position={[0, 0.03, -0.45]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.4, 1.0, 0.04]} />
          <meshStandardMaterial color="#e4e4e7" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh ref={screenRef} position={[0, 0.5, 0.022]}>
          <planeGeometry args={[1.3, 0.9]} />
          <meshStandardMaterial
            color={screenIsOn ? '#ffffff' : '#0a0a0a'}
            emissive={screenIsOn ? '#ffffff' : '#000000'}
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>

        <Html
          position={[0, 0.5, 0.024]}
          transform
          occlude="blending"
          distanceFactor={0.85}
          style={{
            width: '720px',
            height: '500px',
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
        <div className="win98-window">
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
      ) : (
        <LeaderboardWindow leaderboard={leaderboard} onBack={() => setView('main')} />
      )}

      <div className="win98-taskbar">
        <button className="win98-start-btn" type="button" tabIndex={-1}>
          <span className="win98-start-flag" />
          Start
        </button>
        <div className="win98-taskbar-window">
          <span>🎯</span> Phish Fighter
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
