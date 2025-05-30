import React, { useEffect, useRef } from 'react'
import { Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import Tweakpane from 'tweakpane'

export default function CloudScene() {
  // Config stored in a ref to avoid state-triggered re-renders
  const config = useRef({
    volume1: 10,
    volume2: 6,
    volume3: 5,
    opacity1: 0.8,
    opacity2: 0.6,
    opacity3: 0.9,
    fade1: 20,
    fade2: 100,
    fade3: 50,
    color1: '#ffa500',
    color2: '#ff69b4',
    color3: '#ffffff',
  })

  const paneRef = useRef()

  useEffect(() => {
    const pane = new Tweakpane({ title: 'Cloud Config' })
    paneRef.current = pane

    const f1 = pane.addFolder({ title: 'Cloud 1' })
    f1.addInput(config.current, 'volume1', { min: 0, max: 20 })
    f1.addInput(config.current, 'opacity1', { min: 0, max: 1 })
    f1.addInput(config.current, 'fade1', { min: 0, max: 200 })
    f1.addInput(config.current, 'color1')

    const f2 = pane.addFolder({ title: 'Cloud 2' })
    f2.addInput(config.current, 'volume2', { min: 0, max: 20 })
    f2.addInput(config.current, 'opacity2', { min: 0, max: 1 })
    f2.addInput(config.current, 'fade2', { min: 0, max: 200 })
    f2.addInput(config.current, 'color2')

    const f3 = pane.addFolder({ title: 'Cloud 3' })
    f3.addInput(config.current, 'volume3', { min: 0, max: 20 })
    f3.addInput(config.current, 'opacity3', { min: 0, max: 1 })
    f3.addInput(config.current, 'fade3', { min: 0, max: 200 })
    f3.addInput(config.current, 'color3')

    // Mount to a specific div to avoid clutter
    const container = document.getElementById('tweakpane')
    if (container) container.appendChild(pane.element)

    return () => {
      pane.dispose()
    }
  }, [])

  const cfg = config.current

  return (
    <>
      <group position={[0, 5, -10]}>
        <Clouds
          material={THREE.MeshBasicMaterial}
          limit={200}
          frustumCulled={false}
        >
          <Cloud
            segments={40}
            bounds={[10, 2, 2]}
            volume={cfg.volume1}
            color={cfg.color1}
            opacity={cfg.opacity1}
            fade={cfg.fade1}
          />
          <Cloud
            seed={1}
            scale={[2, 1.5, 1]}
            volume={cfg.volume2}
            color={cfg.color2}
            opacity={cfg.opacity2}
            fade={cfg.fade2}
          />
          <Cloud
            seed={2}
            segments={30}
            bounds={[5, 1.5, 1]}
            volume={cfg.volume3}
            color={cfg.color3}
            opacity={cfg.opacity3}
            fade={cfg.fade3}
          />
        </Clouds>
      </group>
    </>
  )
}
