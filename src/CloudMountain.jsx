// CloudMountain.jsx
import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- Shader code ---
const vertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec3 vPosition;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  uniform float uOpacity;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.123))) * 43758.5453);
  }
  float noise(vec3 p){
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = mix(
      mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
      f.z);
    return n;
  }

  void main() {
    float r = length(vPosition.xy);
    float n = noise(vPosition * 2.8 + uTime * 0.1);
    float edge = smoothstep(0.62 + n * 0.13, 0.31 + n * 0.15, r + n * 0.09);
    float shade = mix(0.68, 1.07, r + n * 0.13);
    float holes = smoothstep(0.08, 0.97, n * 1.2);
    vec3 color = mix(uColor1, uColor2, 0.5 + 0.5 * r) * shade;
    float alpha = edge * uOpacity * holes;
    if (alpha < 0.045) discard;
    gl_FragColor = vec4(color, alpha);
  }
`

// --- Cloud Puff Mesh ---
function CloudPuff({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color1 = '#ecd8eb',
  color2 = '#fff',
  opacity = 0.5
}) {
  const materialRef = React.useRef()
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(color1) },
          uColor2: { value: new THREE.Color(color2) },
          uOpacity: { value: opacity }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

// --- Main Cloud Mountain ---
export default function CloudMountain({
  position = [0, 12, 0],
  color1 = '#ecd8eb',
  color2 = '#fff',
  opacity = 0.19,
  puffCount = 120,
  seed = 1,
  ySpread = 5,
  zSpread = 7,
  baseSize = 4.5
}) {
  function rand(i, n = 1) {
    let x = Math.sin(i * 119.9 + seed * 17.7 + n * 7.1) * 10000
    return x - Math.floor(x)
  }
  const puffs = useMemo(() => {
    const arr = []
    for (let i = 0; i < puffCount; i++) {
      const t = i / puffCount
      const angle = rand(i, 4) * Math.PI * 2
      const radius = Math.pow(rand(i, 7), 1.15) * zSpread * (0.7 + 0.8 * (1-t))
      const x = Math.cos(angle) * radius + rand(i, 3) * 1.8
      const z = Math.sin(angle) * radius + rand(i, 2) * 1.9
      const y =
        (1 - Math.pow(radius / (zSpread + 2), 2)) * ySpread +
        rand(i, 6) * 1.3 -
        t * rand(i, 8) * 1.3

      // Central puffs are bigger, edges are small/wispy
      const size = baseSize + (1-t) * baseSize * 2.2 * rand(i, 5)
      const edgeScale = 0.74 + t * 0.43 + rand(i, 1) * 0.66
      arr.push({
        key: i,
        position: [x, y, z],
        scale: [
          size * edgeScale * (0.92 + rand(i, 10) * 0.22),
          size * (0.63 + t * 0.5) * (0.95 + rand(i, 11) * 0.18),
          size * (0.6 + t * 0.55) * (0.94 + rand(i, 12) * 0.2)
        ],
        opacity:
          opacity *
          (0.83 + (1-t) * 0.75) *
          (0.62 + rand(i, 13) * 0.5)
      })
    }
    return arr
  }, [opacity, puffCount, seed, ySpread, zSpread, baseSize])
  return (
    <group position={position}>
      {puffs.map(({ key, position, scale, opacity }) => (
        <CloudPuff
          key={key}
          position={position}
          scale={scale}
          color1={color1}
          color2={color2}
          opacity={opacity}
        />
      ))}
    </group>
  )
}
