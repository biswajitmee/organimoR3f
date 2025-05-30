import React from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
export default function App () {
  return (
    <Canvas
      style={{ width: '100vw', height: '100vh', backgroundColor:'#000000' }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial emissive='hotpink' />
      </mesh>
      <EffectComposer>
        <Bloom intensity={2.5} luminanceThreshold={0.1} />
      </EffectComposer>
      <OrbitControls />
    </Canvas>
  )
}
