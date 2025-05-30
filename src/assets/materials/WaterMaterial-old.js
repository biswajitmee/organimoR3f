// WaterMaterial.js
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

const WaterShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uReflectionMap: null,
    uResolution: new THREE.Vector2(1, 1),
  },
  /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */`
    uniform sampler2D uReflectionMap;
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec2 distortedUv = vUv;
      distortedUv.y += sin(vUv.x * 20.0 + uTime * 2.0) * 0.01;
      distortedUv.x += cos(vUv.y * 20.0 + uTime * 2.0) * 0.01;
      vec3 reflectionColor = texture2D(uReflectionMap, distortedUv).rgb;
      gl_FragColor = vec4(reflectionColor, 1.0);
    }
  `
)

extend({ WaterShaderMaterial })

export function WaterMaterial({ reflectionMap }) {
  const ref = useRef()

  useFrame(({ clock, size }) => {
    if (ref.current) {
      ref.current.uTime = clock.getElapsedTime()
      ref.current.uResolution.set(size.width, size.height)
      ref.current.uReflectionMap = reflectionMap
    }
  })

  return <waterShaderMaterial ref={ref} transparent />
}
