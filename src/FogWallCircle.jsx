// FogWallCircle.jsx
import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function FogWallCircle({ radius = 300, height = 1000, color = '#ffffff', opacity = 0.95 }) {
  const wallRef = useRef()

  useFrame(() => {
    // Optional: slowly rotate for effect
    wallRef.current.rotation.y += 0.0005
  })

  return (
    <mesh ref={wallRef} position={[0, height / 2, 0]}>
      <cylinderGeometry args={[radius, radius, height, 64, 1, true]} />
        {/* <cylinderGeometry args={[20, 20, 5, 64, 1, true]} /> */}

      <meshStandardMaterial
        side={THREE.BackSide}
        color={color}
        transparent
        opacity={opacity}
        fog={true}
      />
    </mesh>
  )
}
