import React from 'react'
 
import CloudShader from './CloudeShader'

// Number of layers and spread config
const NUM_PLANES = 400         // more layers for smoother look
const X_SPREAD = 500          // double (previously 90)
const Y_SPREAD = 60           // double (previously 9)
const Z_SPREAD = 100           // double (previously 7)
const BASE_SCALE = 70         // double (previously 18)




function rand(min, max) {
  return Math.random() * (max - min) + min
}

export default function CloudMountain({
  position = [0, 8, 0],
  color = '#ecd8eb',
  opacity = 0.2,
  speed = 1.6
}) {
  // Layer config (generate only once)
  const layers = React.useMemo(() => (
    Array.from({ length: NUM_PLANES }).map((_, i) => {
      const t = i / (NUM_PLANES - 1) // bottom=0, top=1
      // Bell-curve for mountain
      const x = rand(-1, 1)
      const yBell = 1 - Math.pow(x, 2) // bell for Y shape
      const peak = Math.sin(Math.PI * (1 - t)) // sharper peak in center

      // Wider at bottom, tighter at top, bell curve for "mountain"
      const xSpread = X_SPREAD * (0.7 + 0.3 * yBell) * (1 - t * 0.72)
      const zSpread = Z_SPREAD * (0.45 + 0.55 * t)

      return {
        key: i,
        position: [
          x * xSpread,
          Y_SPREAD * yBell * peak + rand(-0.7, 0.7),
          rand(-zSpread, zSpread)
        ],
        scale: [
          BASE_SCALE * (1.13 - t * 0.8) * rand(0.84, 1.13) * (0.8 + 0.4 * yBell),
          BASE_SCALE * (0.59 + t * 1.19) * rand(0.82, 1.14) * (0.6 + 0.7 * yBell),
          1
        ],
        rotation: [0, 0, rand(-0.12, 0.12)],
        opacity: opacity * (1 - t * t) * (0.9 + 0.15 * yBell) * rand(0.82, 1.13), // top is more transparent
        speed: speed * rand(0.88, 1.11)
      }
    })
  ), [opacity, speed])

  return (
    <group position={position}>
      {layers.map(cfg => (
        <CloudShader
          key={cfg.key}
          position={cfg.position}
          scale={cfg.scale}
          rotation={cfg.rotation}
          color={color}
          opacity={cfg.opacity}
          speed={cfg.speed}
        />
      ))}
    </group>
  )
}
