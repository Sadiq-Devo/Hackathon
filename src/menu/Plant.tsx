import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

export function Plant ({ position = [0, 0, 0] as [number, number, number] }) {
  const leavesRef = useRef<Group>(null)

  useFrame((state) => {
    if (leavesRef.current) {
      const t = state.clock.elapsedTime
      leavesRef.current.rotation.z = 0.04 * Math.sin(t * 0.8)
      leavesRef.current.rotation.x = 0.03 * Math.sin(t * 0.6 + 1)
    }
  })

  const potColor = '#b45309'
  const soilColor = '#3a1f0a'
  const leafColor = '#15803d'
  const leafColorDark = '#166534'

  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.13, 0.24, 16]} />
        <meshStandardMaterial color={potColor} roughness={0.7} />
      </mesh>

      {/* Pot rim */}
      <mesh position={[0, 0.245, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.16, 0.03, 16]} />
        <meshStandardMaterial color="#92400e" roughness={0.65} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.255, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.02, 16]} />
        <meshStandardMaterial color={soilColor} roughness={0.95} />
      </mesh>

      {/* Leaves group (sways gently) */}
      <group ref={leavesRef} position={[0, 0.27, 0]}>
        {/* Center stem */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <coneGeometry args={[0.12, 0.65, 8]} />
          <meshStandardMaterial color={leafColor} roughness={0.7} />
        </mesh>

        {/* Side leaves — taller fronds */}
        <mesh position={[0.14, 0.22, 0.05]} rotation={[0.2, 0, -0.6]} castShadow>
          <coneGeometry args={[0.08, 0.5, 8]} />
          <meshStandardMaterial color={leafColorDark} roughness={0.75} />
        </mesh>
        <mesh position={[-0.14, 0.22, 0.05]} rotation={[0.2, 0, 0.6]} castShadow>
          <coneGeometry args={[0.08, 0.5, 8]} />
          <meshStandardMaterial color={leafColorDark} roughness={0.75} />
        </mesh>
        <mesh position={[0.05, 0.18, -0.13]} rotation={[-0.5, 0, -0.3]} castShadow>
          <coneGeometry args={[0.07, 0.42, 8]} />
          <meshStandardMaterial color={leafColor} roughness={0.75} />
        </mesh>
        <mesh position={[-0.06, 0.18, 0.13]} rotation={[0.5, 0, 0.3]} castShadow>
          <coneGeometry args={[0.07, 0.42, 8]} />
          <meshStandardMaterial color={leafColor} roughness={0.75} />
        </mesh>
      </group>
    </group>
  )
}
