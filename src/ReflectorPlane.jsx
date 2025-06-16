import { Reflector } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'

export default function ReflectorPlane({ onReflectorReady }) {
  const reflectorRef = useRef()

  useEffect(() => {
    if (reflectorRef.current && onReflectorReady) {
      onReflectorReady(reflectorRef.current.renderTarget.texture)
    }
  }, [onReflectorReady])

  return (
    <Reflector
      ref={reflectorRef}
      args={[900, 900]}
      resolution={1024}
      mirror={1}
      mixBlur={0}
      mixStrength={1}
      depthScale={1}
      minDepthThreshold={0.8}
      maxDepthThreshold={1}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {(Material, props) => <Material transparent opacity={0} {...props} />}
    </Reflector>
  )
}
