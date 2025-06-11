// CloudField.jsx
import CloudeShader from './CloudeShader'

export default function CloudField({ count = 800 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const xSpread = 2000         // Huge horizontal range
        const zDepth = 8000          // Deep into the scene

        return (
          <CloudeShader
            key={i}
            position={[
              (Math.random() - 0.5) * xSpread,       // X: wide scatter
              1000 + Math.random() * 1000,           // Y: tall sky
              -i * (zDepth / count) + Math.random() * 200 // Z: depth layers
            ]}
            scale={[
              800 + Math.random() * 600,   // HUGE width
              400 + Math.random() * 300,   // HUGE height
              1
            ]}
            opacity={0.15 + Math.random() * 0.2}     // Softer alpha
            speed={0.005 + Math.random() * 0.01}     // Slower motion
            contrast={1.4 + Math.random() * 0.4}     // Smooth contrast
          />
        )
      })}
    </>
  )
}
