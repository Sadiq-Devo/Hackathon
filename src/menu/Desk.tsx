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
    </group>
  )
}
