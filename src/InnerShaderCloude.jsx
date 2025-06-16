import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function InnerShaderCloude ({
  position = [0, 10, 0],
  scale = [5, 5, 5],
  color = '#f1f1f1',
  opacity = 0.5,
  speed = 1.9
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
uniform vec3 uColor1; // top (pink)
uniform vec3 uColor2; // bottom (peach)
uniform float uOpacity;

float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
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
    for(int i = 0; i < 4; i++) {
        total += noise(p) * amplitude;
        p *= 2.0;
        amplitude *= 0.5;
    }
    return total;
}

void main() {
    vec2 uv = vUv;

    // Stretch horizontally
    uv.x *= 2.0;

    // Move noise over time
    vec2 movement = vec2(uTime * 0.01, uTime * 0.005);
    float n = fbm(uv * 1.5 + movement); // low freq = soft smooth

    // Vertical fade (top and bottom)
    float verticalFade = smoothstep(0.0, 0.2, uv.y) * (1.0 - smoothstep(0.7, 1.0, uv.y));

    // Final density with noise
    float density = n * verticalFade;

    // Soft edge threshold
    float alpha = density * uOpacity;
    if(alpha < 0.01) discard;

    // Color blend: pink (top) to peach (bottom)
    vec3 color = mix(uColor2, uColor1, uv.y);

    gl_FragColor = vec4(color, alpha);
}



`
