import { Text } from '@react-three/drei'

export function Desk () {
  return (
    <group>
      {/* Floor — light oak / off-white */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#ede4d3" roughness={0.85} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <planeGeometry args={[40, 14]} />
        <meshStandardMaterial color="#f5f1e8" roughness={0.95} />
      </mesh>

      {/* Side walls (subtle, just to anchor space) */}
      <mesh position={[-8, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#efe8db" roughness={0.95} />
      </mesh>
      <mesh position={[8, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#efe8db" roughness={0.95} />
      </mesh>

      {/* Desk surface — light wood */}
      <mesh position={[0, -0.05, 0.3]} receiveShadow castShadow>
        <boxGeometry args={[3.6, 0.1, 1.6]} />
        <meshStandardMaterial color="#c9a474" roughness={0.55} />
      </mesh>

      {/* Desk legs */}
      <mesh position={[-1.65, -0.7, 0.95]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#a07a4f" roughness={0.65} />
      </mesh>
      <mesh position={[1.65, -0.7, 0.95]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#a07a4f" roughness={0.65} />
      </mesh>
      <mesh position={[-1.65, -0.7, -0.4]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#a07a4f" roughness={0.65} />
      </mesh>
      <mesh position={[1.65, -0.7, -0.4]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#a07a4f" roughness={0.65} />
      </mesh>

      {/* Coffee mug */}
      <group position={[-1.34, -0.02, 0.46]} rotation={[0, 0.18, 0]}>
        <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.024, 28]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.108, 0.095, 0.24, 28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.263, 0]}>
          <cylinderGeometry args={[0.096, 0.096, 0.014, 28]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.272, 0]}>
          <cylinderGeometry args={[0.082, 0.082, 0.01, 28]} />
          <meshStandardMaterial color="#3f2415" roughness={0.7} />
        </mesh>
        <mesh position={[0.108, 0.15, 0]} rotation={[0, 0, -0.08]}>
          <torusGeometry args={[0.064, 0.012, 10, 24, Math.PI * 1.55]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.48} />
        </mesh>
      </group>

      {/* Notebook and pencil */}
      <group position={[-1.08, 0.015, -0.32]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.024, 0.62]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.68} />
        </mesh>
        <mesh position={[0.02, 0.028, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.012, 0.58]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.58} />
        </mesh>
        <mesh position={[-0.19, 0.04, 0.02]}>
          <boxGeometry args={[0.028, 0.012, 0.58]} />
          <meshStandardMaterial color="#1e40af" roughness={0.6} />
        </mesh>
        <mesh position={[0.06, 0.068, -0.02]} rotation={[Math.PI / 2, 0, 0.55]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.52, 12]} />
          <meshStandardMaterial color="#facc15" roughness={0.52} />
        </mesh>
        <mesh position={[0.275, 0.068, 0.13]} rotation={[Math.PI / 2, 0, 0.55]} castShadow>
          <coneGeometry args={[0.017, 0.055, 12]} />
          <meshStandardMaterial color="#292524" roughness={0.6} />
        </mesh>
      </group>

      {/* Game Boy */}
      <group position={[1.02, 0.032, 0.62]} rotation={[0, -0.28, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.064, 0.72]} />
          <meshStandardMaterial color="#dddacf" roughness={0.82} />
        </mesh>
        <mesh position={[-0.12, 0.038, -0.34]} castShadow>
          <boxGeometry args={[0.19, 0.006, 0.024]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.78} />
        </mesh>
        <mesh position={[0.13, 0.038, -0.34]} castShadow>
          <boxGeometry args={[0.16, 0.006, 0.024]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.04, -0.14]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.012, 0.27]} />
          <meshStandardMaterial color="#89898f" roughness={0.72} />
        </mesh>
        <mesh position={[0.015, 0.048, -0.13]}>
          <boxGeometry args={[0.245, 0.007, 0.15]} />
          <meshStandardMaterial color="#b3bc93" roughness={0.55} />
        </mesh>
        <mesh position={[-0.168, 0.049, -0.14]}>
          <cylinderGeometry args={[0.01, 0.01, 0.006, 16]} />
          <meshStandardMaterial color="#2f3338" roughness={0.6} />
        </mesh>
        <mesh position={[-0.145, 0.052, 0.18]}>
          <boxGeometry args={[0.13, 0.011, 0.032]} />
          <meshStandardMaterial color="#2d3034" roughness={0.7} />
        </mesh>
        <mesh position={[-0.145, 0.053, 0.18]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.13, 0.011, 0.032]} />
          <meshStandardMaterial color="#2d3034" roughness={0.7} />
        </mesh>
        <mesh position={[0.115, 0.046, 0.135]} rotation={[0, -0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.19, 0.008, 0.09]} />
          <meshStandardMaterial color="#d1cdc2" roughness={0.78} />
        </mesh>
        <mesh position={[0.075, 0.055, 0.15]}>
          <cylinderGeometry args={[0.034, 0.034, 0.01, 28]} />
          <meshStandardMaterial color="#d5589b" roughness={0.42} />
        </mesh>
        <mesh position={[0.165, 0.055, 0.095]}>
          <cylinderGeometry args={[0.034, 0.034, 0.01, 28]} />
          <meshStandardMaterial color="#d5589b" roughness={0.42} />
        </mesh>
        <mesh position={[-0.065, 0.05, 0.31]} rotation={[0, 0.28, 0]}>
          <boxGeometry args={[0.085, 0.006, 0.018]} />
          <meshStandardMaterial color="#b9b5aa" roughness={0.72} />
        </mesh>
        <mesh position={[0.07, 0.05, 0.31]} rotation={[0, 0.28, 0]}>
          <boxGeometry args={[0.085, 0.006, 0.018]} />
          <meshStandardMaterial color="#b9b5aa" roughness={0.72} />
        </mesh>
        <mesh position={[0.145, 0.05, 0.25]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.105, 0.006, 0.012]} />
          <meshStandardMaterial color="#aaa69c" roughness={0.76} />
        </mesh>
        <mesh position={[0.15, 0.05, 0.29]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.105, 0.006, 0.012]} />
          <meshStandardMaterial color="#aaa69c" roughness={0.76} />
        </mesh>
        <mesh position={[0.155, 0.05, 0.33]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.105, 0.006, 0.012]} />
          <meshStandardMaterial color="#aaa69c" roughness={0.76} />
        </mesh>
        <Text
          position={[0.02, 0.053, -0.262]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.011}
          color="#d9d9d9"
          anchorX="center"
          anchorY="middle"
        >
          DOT MATRIX
        </Text>
        <Text
          position={[-0.055, 0.052, 0.025]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.022}
          color="#315db8"
          anchorX="center"
          anchorY="middle"
        >
          GAME BOY
        </Text>
        <Text
          position={[-0.065, 0.053, 0.35]}
          rotation={[-Math.PI / 2, 0, 0.28]}
          fontSize={0.012}
          color="#315db8"
          anchorX="center"
          anchorY="middle"
        >
          SELECT
        </Text>
        <Text
          position={[0.07, 0.053, 0.35]}
          rotation={[-Math.PI / 2, 0, 0.28]}
          fontSize={0.012}
          color="#315db8"
          anchorX="center"
          anchorY="middle"
        >
          START
        </Text>
      </group>
    </group>
  )
}
