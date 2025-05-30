// TorusFog.jsx
import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function TorusFog({ position = [0, 0, 0], scale = 1 }) {
  const mesh = useRef()

  useFrame(({ clock }) => {
    mesh.current.material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[80, 80, 1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uScale: { value: scale },
          uColor: { value: new THREE.Color('#ffffff') },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform float uScale;
uniform vec3 uColor;

// Signed Distance Function (SDF) for a torus
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// Basic volumetric fog rendering
void main() {
  vec3 ro = vec3(0.0, 0.0, 3.0); // ray origin
  vec3 rd = normalize(vec3(vUv - 0.5, -1.0)); // ray direction

  float fog = 0.0;
  vec3 pos;
  float t = 0.0;

  for (int i = 0; i < 64; i++) {
    pos = ro + rd * t;
    float d = sdTorus(pos * uScale, vec2(1.0, 0.3)); // outer radius, tube radius
    if (d < 0.05) {
      fog += 0.05;
    }
    t += 0.05;
    if (t > 6.0) break;
  }

  fog = clamp(fog, 0.0, 1.0);
  gl_FragColor = vec4(uColor * fog, fog * 0.7);
}
`
