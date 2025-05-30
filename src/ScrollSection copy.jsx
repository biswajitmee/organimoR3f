import { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Scroll, Environment , Cloud } from '@react-three/drei'
import { getProject, val } from '@theatre/core'
import theatreeBBState from './theatreState.json'
import GroundWater from './GroundWater'
import Water from './Water'
import { setupWaterUI } from './ui';

 
import {
  editable as e,
  SheetProvider,
  PerspectiveCamera,
  useCurrentSheet
} from '@theatre/r3f'

import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
 
studio.initialize()
studio.extend(extension)

export default function ScrollSection () {
  const sheet = getProject('myProject', { state: theatreeBBState }).sheet('Scene')
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
        style={{ width: '100vw', height: '100vh' }}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* ✅ Use ONLY ONE Environment, HDR */}
        <Environment
          background
          files="/env/sunset.hdr"
        />

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
    seed: 1234,
    segments: 60,
    bounds: [100, 2, 2],
    concentrate: 'inside',
    scale: [1, 1, 1],
    volume: 20,
    smallestVolume: 0.3,
    growth: 10,
    speed: 0.5,
    fade: 15,
    opacity: 0.8,
    color: 'red'
  }


  return (
    <>
      <e.pointLight theatreKey='LightBlue' position={[0, 0, 1]} />
      <e.pointLight theatreKey='LightPurple' position={[0, 0, -2]} />
      <e.pointLight theatreKey='LightWhite' position={[-1, 0, -1]} />

      <e.mesh theatreKey='GroundWater' position={[0, 0, -1]}>
        <GroundWater />
      </e.mesh>
      <e.mesh theatreKey='Water' position={[0, 0, -1]}>
        <Water onMeshReady={(mesh) => setupWaterUI(mesh)} />
      </e.mesh>



      <e.mesh theatreKey='Cloude' position={[0, 0, -1]}>
        <Cloud
          {...cloudConfig}
          position={[-4, -2, -25]}
          speed={0.2}
          opacity={1}
        />
      </e.mesh>


      <PerspectiveCamera
        position={[0, 0, 0]}
        theatreKey='Camera'
        makeDefault
        near={5}
        far={500}
        fov={15}
      />
    </>
  )
}

