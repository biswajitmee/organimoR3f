// assets/materials/StoneMaterial.js
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'

export const StoneMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#888888'),
    uLightDir: new THREE.Vector3(1, 1, 1),
  },
  // Vertex Shader
  glsl`
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewMatrix * vec4(vPosition, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    #pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

    varying vec3 vPosition;
    varying vec3 vNormal;

    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uLightDir;

    void main() {
      vec3 pos = vPosition * 0.5;
      float n = snoise3(pos + uTime * 0.05);

      float cracks = smoothstep(0.2, 0.4, abs(n));
      vec3 baseColor = mix(uColor * 0.9, uColor * 1.1, cracks);

      vec3 lightDir = normalize(uLightDir);
      float lighting = max(dot(normalize(vNormal), lightDir), 0.0);

      vec3 finalColor = baseColor * lighting;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)
