import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';
import causticsVertexShader from '../shaders/groundWater.vert?raw';
import causticsFragmentShader from '../shaders/groundWater.frag?raw';
import textureUrl from '../assets/ground.jpg'; // Replace with your texture path

export default function GroundWater() {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  const shaderMaterial = useRef(
    new THREE.ShaderMaterial({
      vertexShader: causticsVertexShader,
      fragmentShader: causticsFragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uCausticsColor: { value: new THREE.Color('#ffffff') },
        uCausticsIntensity: { value: 0.2 },
        uCausticsScale: { value: 20.0 },
        uCausticsSpeed: { value: 1.0 },
        uCausticsThickness: { value: 0.4 },
        uCausticsOffset: { value: 0.75 },
      },
    })
  ).current;

  useFrame(({ clock }) => {
    shaderMaterial.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh
      ref={meshRef}
      material={shaderMaterial}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.12, 0]}
    >
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
}
