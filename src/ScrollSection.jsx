import * as THREE from 'three'
import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ScrollControls,
  useScroll,
  Scroll,
  Environment,
  Cloud,
  CubeCamera,
  Reflector
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
import CloudShader from './CloudeShader'
import CloudeGradiantShader from './CloudeGradiantShader'
import InnerShaderCloude from './InnerShaderCloude'
import { Seashell } from './Seashell'
import CloudMountain from './CloudMountain'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import NewWater from './NewWater'
studio.initialize()
studio.extend(extension)

export default function ScrollSection () {
  const sheet = getProject('myProject', { state: theatreeBBState }).sheet(
    'Scene'
  )
  const [mouse, setMouse] = useState([0, 0])
  const handleMouseMove = event => setMouse([event.clientX, event.clientY])
  const canvasHovered = useRef(false)
  const isMobile = window.innerWidth <= 768
  const pages = isMobile ? 9 : 8.5

  return (
    <div
      style={{ height: '100vh', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => (canvasHovered.current = true)}
      onMouseLeave={() => (canvasHovered.current = false)}
    >
      <Canvas
        onCreated={({ scene }) => {
          scene.fog = new THREE.Fog('#FA8999', 10000, 10050)
        }}
        style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ScrollControls pages={pages} distance={2} damping={0.8}>
          <SheetProvider sheet={sheet}>
            <Scene canvasHovered={canvasHovered} />
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
    seed: 3400,
    segments: 20,
    bounds: [6, 2, 4],
    concentrate: 'outside',
    scale: [30, 20, 10],
    volume: 10,
    smallestVolume: 0.2,
    growth: 30,
    speed: 0.05,
    fade: 10,
    opacity: 0.7,
    color: '#f3f0ee'
  }

  const cloudConfig4 = {
    seed: 5000,
    segments: 30,
    bounds: [4, 4, 4],
    concentrate: 'outside',
    scale: [40, 10, 5],
    volume: 10,
    smallestVolume: 0.3,
    growth: 5,
    speed: 0,
    fade: 0,
    opacity: 0.4,
    color: '#ffffff'
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
 

      <e.mesh theatreKey='GroundWater' position={[0, -200, 0]}>
        <GroundWater />
      </e.mesh>

      <e.mesh theatreKey='Water' position={[0, -200, 0]}>
        <Water />
      </e.mesh>

      <e.mesh theatreKey='Cloude shader' position={[0, 0, -1]}>
        <CloudeGradiantShader scale={[620, 200, 1]} opacity={0.95} />
      </e.mesh>

      <e.mesh theatreKey='Cloude shader back' position={[0, 0, -1]}>
<CloudMountain position={[0,12,0]} color1="#ecd8eb" color2="#fff" opacity={0.18} puffCount={120} seed={1}/>
<CloudMountain position={[3,11,2]} color1="#faf4ff" color2="#eee" opacity={0.13} puffCount={75} seed={2}/>
<CloudMountain position={[-2,13,-3]} color1="#e5f6ff" color2="#fff" opacity={0.11} puffCount={60} seed={3}/>
<CloudMountain position={[1,10,-1]} color1="#fff" color2="#eee" opacity={0.09} puffCount={30} seed={4}/>



      </e.mesh>

      <e.mesh theatreKey='Cloude shader front' position={[0, 0, -1]}>
        <CloudShader scale={[240, 120, 1]} opacity={0.5} />
      </e.mesh>

      <e.mesh theatreKey='InnerShaderCloude' position={[0, 0, -1]}>
        <InnerShaderCloude scale={[240, 120, 1]} opacity={0.5} />
      </e.mesh>

      <e.mesh theatreKey='Cloude shader WaterUpper' position={[0, 0, -1]}>
        <CloudeGradiantShader
          position={[0, 0, -1]}
          scale={[100, 10, 2]} // Wide cloud
          opacity={1}
          color={'#FA8999'}
        />
      </e.mesh>

      

      <PerspectiveCamera
        position={[0, 370, 475]}
        theatreKey='Camera'
        makeDefault
        near={5}
        far={2000}
        fov={15}
      />

      <e.mesh theatreKey='Seashell' position={[0, 0, -1]}>
        <Seashell scale={10} />
      </e.mesh>

      <e.mesh theatreKey='RoundedImage' position={[0, 0, -1]}>
        <RoundedImage url='/topbackgrund.jpg' position={[0, 0, 0]} />
      </e.mesh>

      <e.mesh theatreKey='FogWallCircle' position={[0, 0, -1]}>
        <FogWallCircle />
      </e.mesh>

      <e.mesh theatreKey='UnderwaterCylinderScene' position={[0, 0, -1]}>
        <UnderwaterCylinder />
      </e.mesh>

 

      <group>
        <e.mesh theatreKey='RockStone' position={[-24, 100, -49]}>
          <RockStone scale={15} />
        </e.mesh>

        <e.mesh theatreKey='Product' position={[0, 0, -1]}>
          <Product scale={16} />
        </e.mesh>

      
      </group>
    </>
  )
}
