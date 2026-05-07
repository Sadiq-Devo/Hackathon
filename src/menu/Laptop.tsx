import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'

type MenuProps = {
  onStartGame: () => void
  onShowLeaderboard: () => void
  musicOn: boolean
  onToggleMusic: () => void
  fading: boolean
}

type Props = MenuProps & {
  position?: [number, number, number]
}

export function Laptop ({
  position = [0, 0, 0],
  onStartGame,
  onShowLeaderboard,
  musicOn,
  onToggleMusic,
  fading,
}: Props) {
  const screenRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (screenRef.current) {
      const t = state.clock.elapsedTime
      const mat = screenRef.current.material as { emissiveIntensity?: number }
      if (mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = 0.5 + 0.06 * Math.sin(t * 3)
      }
    }
  })

  return (
    <group position={position}>
      {/* Base / keyboard deck */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.06, 0.95]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Keyboard area */}
      <mesh position={[0, 0.032, 0.05]}>
        <boxGeometry args={[1.2, 0.005, 0.55]} />
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.032, 0.4]}>
        <boxGeometry args={[0.5, 0.003, 0.25]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Screen hinge pivot */}
      <group position={[0, 0.03, -0.45]} rotation={[-0.35, 0, 0]}>
        {/* Screen back / lid */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.4, 1.0, 0.04]} />
          <meshStandardMaterial color="#e4e4e7" metalness={0.6} roughness={0.35} />
        </mesh>

        {/* Screen face base (subtle glow behind UI) */}
        <mesh ref={screenRef} position={[0, 0.5, 0.022]}>
          <planeGeometry args={[1.3, 0.9]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Live menu UI projected onto the screen */}
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
          <LaptopMenu
            onStartGame={onStartGame}
            onShowLeaderboard={onShowLeaderboard}
            musicOn={musicOn}
            onToggleMusic={onToggleMusic}
            fading={fading}
          />
        </Html>
      </group>
    </group>
  )
}

function LaptopMenu ({
  onStartGame,
  onShowLeaderboard,
  musicOn,
  onToggleMusic,
  fading,
}: MenuProps) {
  return (
    <div className={`laptop-menu ${fading ? 'laptop-menu-fading' : ''}`}>
      <div className="laptop-menu-topbar">
        <div className="laptop-menu-dots">
          <span /><span /><span />
        </div>
        <div className="laptop-menu-url">phishfighter.app</div>
      </div>

      <div className="laptop-menu-body">
        <div className="laptop-menu-title-block">
          <h1 className="laptop-menu-title">PHISH FIGHTER</h1>
          <p className="laptop-menu-subtitle">Defend the inbox. Trust nothing.</p>
        </div>

        <div className="laptop-menu-buttons">
          <button
            className="laptop-menu-btn laptop-menu-btn-primary"
            onClick={onStartGame}
            disabled={fading}
            type="button"
          >
            <span className="laptop-menu-btn-icon">▶</span>
            <span>Start Game</span>
          </button>

          <button
            className="laptop-menu-btn"
            onClick={onToggleMusic}
            disabled={fading}
            type="button"
          >
            <span className="laptop-menu-btn-icon">♪</span>
            <span>Music: {musicOn ? 'On' : 'Off'}</span>
          </button>

          <button
            className="laptop-menu-btn"
            onClick={onShowLeaderboard}
            disabled={fading}
            type="button"
          >
            <span className="laptop-menu-btn-icon">🏆</span>
            <span>Leaderboard</span>
          </button>
        </div>

        <div className="laptop-menu-footer">v1.0 — Hackathon Tech Borås</div>
      </div>
    </div>
  )
}
