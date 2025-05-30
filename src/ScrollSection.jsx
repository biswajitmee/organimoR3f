import * as THREE from 'three'
import { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  useScroll,
  Scroll,
  Environment,
  Cloud,
  CubeCamera
} from '@react-three/drei'
import { getProject, val } from '@theatre/core'
import theatreeBBState from './theatreState.json'
import GroundWater from './GroundWater'
import Water from './Water'
import { setupWaterUI } from './ui'
import {
  editable as e,
  SheetProvider,
  PerspectiveCamera,
  useCurrentSheet
} from '@theatre/r3f'


import { FogWallCircle } from './FogWallCircle'
import RoundedImage from './RoundedImage'
import { CookieLight, CookieLightPlane } from './CookieLight'
//  import PostProcessing from './PostProcessing'
import UnderwaterCylinder from './UnderwaterCylinderScene'
import { RockStone } from './RockStone'
import { Product } from './Product'
import { MovingSpot } from './MovingSpot'
// import studio from '@theatre/studio'
// import extension from '@theatre/r3f/dist/extension'

//  studio.initialize()
//   studio.extend(extension)

export default function ScrollSection () {
  const sheet = getProject('myProject', { state: theatreeBBState }).sheet(
    'Scene'
  )
  const [mouse, setMouse] = useState([0, 0])
  const handleMouseMove = event => setMouse([event.clientX, event.clientY])

  const isMobile = window.innerWidth <= 768
  const pages = isMobile ? 9 : 8.5

  return (
    <div
      style={{ height: '100vh', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        onCreated={({ scene }) => {
          scene.fog = new THREE.Fog('#FA8999', 1200, 1500)
        }}
        style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ScrollControls pages={pages} distance={2} damping={0.5}>
          <SheetProvider sheet={sheet}>
            <Scene />
          </SheetProvider>
          <Scroll html style={{ position: 'absolute', width: '100vw' }} />
        </ScrollControls>
        {/* <PostProcessing />  */}
      </Canvas>
    </div>
  )
}

function Scene () {
  const sheet = useCurrentSheet()
  const scroll = useScroll()

  useFrame(() => {
    const sequenceLength = val(sheet.sequence.pointer.length)
    sheet.sequence.position = scroll.offset * sequenceLength
  })

  const cloudConfig = {
    seed: 3234,
    segments: 20,
    bounds: [2, 2, 2],
    concentrate: 'outside',
   scale: [26, 28, 26],
    volume: 8,
    smallestVolume: 0.3,
    growth: 2,
    speed: 0.2,
    fade: 15,
    opacity: 0.8,
    color: '#f1f1f1'
  }
  const cloudConfig2 = {
    seed: 2034,
    segments: 20,
    bounds: [2, 2, 2],
    concentrate: 'outside',
    scale: [16, 18,16],
    volume: 8,
    smallestVolume: 0.3,
    growth: 2,
    speed: 0.2,
     fade: 15,
    opacity: 0.8,
    color: '#f1f1f1'
  }

    const cloudConfig3 = {
    seed: 3034,
    segments: 20,
    bounds: [2, 2, 2],
    concentrate: 'outside',
    scale: [26, 28,26],
    volume: 8,
    smallestVolume: 0.3,
    growth: 2,
    speed: 0.2,
     fade: 15,
    opacity: 0.8,
    color: '#f1f1f1'
  }

  return (
    <>
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/*
      <e.pointLight theatreKey='LightBlue' position={[0, 0, 1]} />
      <e.pointLight theatreKey='LightPurple' position={[0, 0, -2]} />
      <e.pointLight theatreKey='LightWhite' position={[-1, 0, -1]} /> */}

      <e.mesh theatreKey='GroundWater' position={[0, -200, 0]}>
        <GroundWater />
      </e.mesh>

      <e.mesh theatreKey='Water' position={[0, -30, 0]}>
        <CubeCamera resolution={512} frames={1} near={0.1} far={1000}>
          {texture => (
            <Water
              reflectionTexture={texture}
              onMeshReady={mesh => setupWaterUI(mesh)}
            />
          )}
        </CubeCamera>
      </e.mesh>

      <e.mesh theatreKey='Cloude R3F' position={[0, 0, -1]}>
        <Cloud
          {...cloudConfig}
          position={[-4, -2, -25]}
          speed={0.3}
          opacity={1}
        />
      </e.mesh>

      <e.mesh theatreKey='Cloude R3F 2' position={[0, 0, -1]}>
        <Cloud
          {...cloudConfig2}
          speed={0.3}
          depthWrite={false}
          seed={2078}
          
        />
      </e.mesh>

       <e.mesh theatreKey='Cloude R3F 3' position={[0, 0, -1]}>
        <Cloud
          {...cloudConfig3}
          speed={0.3}
          depthWrite={false}
          seed={2078} 
        />
      </e.mesh>



      <PerspectiveCamera
        position={[0, 0, 0]}
        theatreKey='Camera'
        makeDefault
        near={5}
        far={700}
        fov={15}
      />

      <e.mesh theatreKey='RoundedImage' position={[0, 0, -1]}>
        <RoundedImage url='/topbackgrund.jpg' position={[0, 0, 0]} />
      </e.mesh>

      {/* <e.mesh theatreKey='FogWallCircle' position={[0, 0, -1]}>
        <FogWallCircle />
      </e.mesh> */}

      <e.mesh theatreKey='UnderwaterCylinderScene' position={[0, 0, -1]}>
        <UnderwaterCylinder />
      </e.mesh>

      <CookieLight position={[2, 6, 1]} />

<group>
  <e.mesh theatreKey='RockStone' position={[0, 0, -1]}>
    <RockStone scale={15} />
  </e.mesh>

  <e.mesh theatreKey='Product' position={[0, 0, -1]}>
    <Product scale={16} />
  </e.mesh>

  {/* Spotlight pointing to RockStone */}
  <MovingSpot position={[5, 5, 5]} targetPosition={[0, 0, -1]} color="#ffcc99" />
</group>

    </>
  )
}
