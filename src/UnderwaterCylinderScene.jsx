import * as THREE from 'three'
import React from 'react'

export default function UnderwaterCylinder({
  radius = 40,
  height = 100,
  color = '#224488',
  opacity = 0.5
}) {
  return (
    <mesh>
      <cylinderGeometry args={[radius, radius, height, 64, 1, true]} />
      <meshStandardMaterial
        color={color}
        side={THREE.BackSide}
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}
