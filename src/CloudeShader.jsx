import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CloudShader ({
  position = [0, 10, 0],
  scale = [5, 5, 5],
  color = '#f1f1f1',
  opacity = 0.5,
  speed = 0.9
}) {
  const mesh = useRef()
  const shaderMaterial = useRef()

  useFrame(({ clock }) => {
    if (shaderMaterial.current) {
      shaderMaterial.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <planeGeometry args={[5, 5, 128, 128]} />

      <shaderMaterial
        ref={shaderMaterial}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color('#f1f1f1') }, // Top color (pinkish)
          uColor2: { value: new THREE.Color('#ffffff') }, // Bottom color (white)
          uOpacity: { value: opacity },
          uSpeed: { value: speed }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Fragment Shader with depth fading
const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uOpacity;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    total += noise(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return total;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float dist = length(uv);

  vec2 offset = vec2(uTime * 0.02, uTime * 0.015);
  float fbmNoise = fbm(uv * 3.0 + offset);

  // Shape: soft round blobs around center
  float blobShape = smoothstep(0.6, 0.0, dist - fbmNoise * 0.6);

  // Extra edge softening
  float edgeSoft = smoothstep(0.8, 1.1, dist + fbmNoise * 0.3);

  // Final alpha
  float alpha = blobShape * (1.0 - edgeSoft) * uOpacity;

  if (alpha < 0.01) discard;

  vec3 color = mix(uColor1, uColor2, vUv.y);
  gl_FragColor = vec4(color, alpha);
}


`
