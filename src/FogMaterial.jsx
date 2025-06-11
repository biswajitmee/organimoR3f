import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'

export default function FogFlyPlane() {
  const meshRef = useRef()

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        }
      },
      vertexShader: glsl`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: glsl`
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float smoothNoise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
          vec2 st = gl_FragCoord.xy / uResolution.xy;
          st.x *= uResolution.x / uResolution.y;

          float t = uTime * 0.05;
          float n = smoothNoise(st * 5.0 + vec2(t, t));
          float fog = smoothstep(0.3, 0.7, n);

          vec3 fogColor = mix(vec3(0.7, 0.7, 0.8), vec3(0.9, 0.9, 1.0), fog);
          gl_FragColor = vec4(fogColor, fog * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false
    })
  }, [])

  useFrame(({ clock }) => {
    shaderMaterial.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={meshRef} position={[0, 50, -100]} scale={[500, 300, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  )
}
