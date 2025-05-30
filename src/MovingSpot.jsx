import { useRef } from 'react'
import { SpotLight, useDepthBuffer } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

export function MovingSpot({ color = '#ffffff', targetPosition = [0, 0, 0], ...props }) {
  const light = useRef()
  const target = useRef()
  const depthBuffer = useDepthBuffer({ frames: 1 })
  const { viewport } = useThree()
  const vec = new Vector3()

  useFrame((state) => {
    vec.set(...targetPosition)
    light.current.target.position.lerp(vec, 0.1)
    light.current.target.updateMatrixWorld()
  })

  return (
    <>
      <SpotLight
        ref={light}
        castShadow
        color={color}
        penumbra={0.5}
        distance={10}
        angle={0.3}
        attenuation={5}
        anglePower={4}
        intensity={2}
        depthBuffer={depthBuffer}
        {...props}
      />
    </>
  )
}
