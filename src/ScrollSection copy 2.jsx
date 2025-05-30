import * as THREE from 'three'

import { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PlaneGeometry } from 'three'

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
// import { EffectComposer, Bloom } from '@react-three/postprocessing'
// import GlowingTorus  from './GlowingTorus'
// import TorusFog from './TorusFog'
//  import ReflectiveCubeCamera from './ReflectiveCubeCamera'

// import { UnderwaterRectangle } from './UnderwaterRectangle'
import {
  editable as e,
  SheetProvider,
  PerspectiveCamera,
  useCurrentSheet
} from '@theatre/r3f'

import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
// import { Iland } from './Iland'
// import { Stairs } from './Stairs'
  import { BlenderStone } from './blenderStone'
import { FogWallCircle } from './FogWallCircle'
studio.initialize()
studio.extend(extension)

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
          scene.fog = new THREE.Fog('#87ceeb', 40, 120) // sky-blue fog
        }}
        style={{ width: '100vw', height: '100vh', backgroundColor:'#000' }}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* ✅ Use ONLY ONE Environment, HDR */}
        {/* <Environment background files='/env/sunset.hdr' /> */}

        <ScrollControls pages={pages} distance={2} damping={0.5}>
          <SheetProvider sheet={sheet}>
            <Scene />
          </SheetProvider>

          <Scroll html style={{ position: 'absolute', width: '100vw' }} />
        </ScrollControls>
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
    seed: 1,
    segments: 1,
    bounds: [100, 20, 20],
    concentrate: 'inside',
    scale: [1, 1, 1],
    volume: 20,
    smallestVolume: 0.3,
    growth: 5,
    speed: 'none',
    fade: 25,
    opacity: 0.8,
    color: 'f1f1f1'
  }

  return (
    <>
      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <e.pointLight theatreKey='LightBlue' position={[0, 0, 1]} />
      <e.pointLight theatreKey='LightPurple' position={[0, 0, -2]} />
      <e.pointLight theatreKey='LightWhite' position={[-1, 0, -1]} />

      <e.mesh theatreKey='GroundWater' position={[0, 0, -1]}>
        <GroundWater />
      </e.mesh>

      {/* 
      <e.mesh theatreKey='mesh' position={[0, 0, -1]}>
        <mesh position={[0, 1, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      </e.mesh> */}

      <e.mesh theatreKey='Water' position={[0, 0, -1]}>
        <CubeCamera resolution={512} frames={1} near={0.1} far={1000}>
          {texture => (
            <Water
              reflectionTexture={texture}
              onMeshReady={mesh => setupWaterUI(mesh)}
            />
          )}
        </CubeCamera>
      </e.mesh>

      {/* <Water /> */}

      <e.mesh theatreKey='Cloude' position={[0, 0, -1]}>
        <Cloud
          {...cloudConfig}
          position={[-4, -2, -25]}
          speed={0}
          opacity={1}
        />
      </e.mesh>

      {/*       <e.mesh theatreKey='GlowingLine' position={[0, 0, -1]}>
        <GlowingTorus  />

<EffectComposer>
  <Bloom
    intensity={1.5}
    luminanceThreshold={0}
    luminanceSmoothing={0.5}
  />
</EffectComposer> 

      </e.mesh>
*/}

      <PerspectiveCamera
        position={[0, 0, 0]}
        theatreKey='Camera'
        makeDefault
        near={5}
        far={700}
        fov={15}
      />

      {/* <e.mesh theatreKey='FogTorus' position={[0, 0, -1]}>
  <TorusFog position={[0, 0, -1]} scale={1.5} />
</e.mesh> */}

      <e.mesh theatreKey='BlenderStone' position={[0, 0, -1]}>
        <BlenderStone />
      </e.mesh>
  <e.mesh theatreKey='FogWallCircle' position={[0, 0, -1]}>
        <FogWallCircle/>
      </e.mesh>
      {/* <e.mesh theatreKey='UnderwaterRectangle' position={[0, 0, -1]}>
        <UnderwaterRectangle />
      </e.mesh> */}

      {/* <e.mesh theatreKey='Iland' position={[0, 0, -1]}>
 <Iland/>
</e.mesh>

   <e.mesh theatreKey='Stairs' position={[0, 0, -1]}>
 <Stairs/>
</e.mesh> */}

      {/* <PerspectiveCamera
  position={[0, 0, 10]} // move camera back
  theatreKey='Camera'
  makeDefault
  near={0.1} // allow close objects
  far={500}
  fov={30}
/> */}
    </>
  )
}
