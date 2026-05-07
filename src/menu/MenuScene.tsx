import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { interpolate, Easing } from 'remotion'
import { Vector3 } from 'three'
import { Laptop } from './Laptop'
import { Desk } from './Desk'
import { Plant } from './Plant'

type Props = {
  onStartGame: () => void
  onShowLeaderboard: () => void
  musicOn: boolean
  onToggleMusic: () => void
}

const ZOOM_DURATION_FRAMES = 90
const FPS = 60

const IDLE_CAM_POS = new Vector3(2.4, 1.3, 2.8)
const IDLE_CAM_TARGET = new Vector3(0, 0.45, -0.2)

const ZOOMED_CAM_POS = new Vector3(0, 0.68, -0.03)
const ZOOMED_CAM_TARGET = new Vector3(0, 0.49, -0.55)

function CameraRig ({
  zoomFrame,
  isZooming,
}: {
  zoomFrame: number
  isZooming: boolean
}) {
  const { camera } = useThree()
  const targetRef = useRef(new Vector3())

  useFrame((state) => {
    const t = state.clock.elapsedTime

    const progress = isZooming
      ? interpolate(zoomFrame, [0, ZOOM_DURATION_FRAMES], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        })
      : 0

    const swayX = Math.sin(t * 0.35) * 0.12 * (1 - progress)
    const swayY = Math.sin(t * 0.25) * 0.06 * (1 - progress)

    const camPos = new Vector3().lerpVectors(IDLE_CAM_POS, ZOOMED_CAM_POS, progress)
    camPos.x += swayX
    camPos.y += swayY
    camera.position.copy(camPos)

    targetRef.current.lerpVectors(IDLE_CAM_TARGET, ZOOMED_CAM_TARGET, progress)
    camera.lookAt(targetRef.current)

    const fov = interpolate(progress, [0, 1], [50, 28])
    if ('fov' in camera) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  })

  return null
}

export function MenuScene ({ onStartGame, onShowLeaderboard, musicOn, onToggleMusic }: Props) {
  const [zoomFrame, setZoomFrame] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const triggerStart = () => {
    if (isZooming) return
    setIsZooming(true)
    startTimeRef.current = performance.now()

    const tick = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000
      const frame = Math.min(elapsed * FPS, ZOOM_DURATION_FRAMES)
      setZoomFrame(frame)

      if (frame >= ZOOM_DURATION_FRAMES) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        window.setTimeout(() => onStartGame(), 150)
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="menu-scene-root">
      <Canvas
        shadows
        camera={{ position: [2.4, 1.3, 2.8], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#f5f1e8']} />

        <ambientLight intensity={1.1} />
        <hemisphereLight args={['#ffffff', '#d4c8a8', 0.6]} />
        <directionalLight
          position={[4, 8, 4]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={20}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <pointLight position={[0, 0.8, 0.5]} intensity={0.25} color="#dbeafe" distance={2.5} />

        <CameraRig zoomFrame={zoomFrame} isZooming={isZooming} />

        <group position={[0, -0.05, 0]}>
          <Desk />
          <Laptop
            position={[0, 0.03, 0.05]}
            onStartGame={triggerStart}
            onShowLeaderboard={onShowLeaderboard}
            musicOn={musicOn}
            onToggleMusic={onToggleMusic}
            fading={isZooming}
          />
          <Plant position={[1.2, 0, -0.2]} />
        </group>
      </Canvas>
    </div>
  )
}
