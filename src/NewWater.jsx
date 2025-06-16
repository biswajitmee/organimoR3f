import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;

  // 4 layers of sine waves for complexity
  float wave(vec2 pos, float freq, float speed, float amp, float timeOffset) {
    return sin(dot(pos, vec2(freq)) + uTime * speed + timeOffset) * amp;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Apply multiple waves
    float wave1 = wave(pos.xz, 0.1, 0.5, 0.2, 0.0);
    float wave2 = wave(pos.xz, 0.2, 0.8, 0.1, 1.0);
    float wave3 = wave(pos.xz, 0.3, 0.3, 0.15, 2.0);
    float wave4 = wave(pos.xz, 0.15, 1.0, 0.05, 3.0);

    float elevation = wave1 + wave2 + wave3 + wave4;
    pos.y += elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;

  void main() {
    vec3 deepColor = vec3(0.1, 0.2, 0.4);
    vec3 shallowColor = vec3(0.4, 0.6, 0.8);

    // vertical gradient based on vUv.y
    vec3 color = mix(deepColor, shallowColor, vUv.y);

    // slight UV ripple effect for subtle detail
    float ripple = sin(vUv.x * 50.0) * 0.02;
    color += ripple;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function NewWater({
  size = 500,
  segments = 256
}) {
  const ref = useRef();
  const uniforms = useRef({
    uTime: { value: 0 }
  });

  useFrame((state, delta) => {
    uniforms.current.uTime.value += delta;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, segments, segments]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
