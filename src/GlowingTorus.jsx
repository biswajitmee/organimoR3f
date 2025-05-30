// GlowingTorus.jsx
import React from 'react'
import * as THREE from 'three'

export default function GlowingTorus() {
  return (
    <mesh position={[0, 0, 0]}>
      <torusGeometry args={[1, 0.3, 32, 64]} />
      <meshBasicMaterial
        color={'#00ffff'}
        toneMapped={false} // Necessary for bloom to work properly
      />
    </mesh>
  )
}
