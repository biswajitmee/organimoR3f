import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';
import causticsVertexShader from './assets/shaders/caustics.vert?raw';
import causticsFragmentShader from './assets/shaders/caustics.frag?raw';
import textureUrl from './assets/shaders/ocean_floor.png'; // Replace with your texture path
 

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
        uCausticsIntensity: { value: 0.20 },
        uCausticsScale: { value: 20.0 },
        uCausticsSpeed: { value: 1.0 },
        uCausticsThickness: { value: 0.40 },
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
      position={[0, -5, 0]}
    >
      {/* <planeGeometry args={[10, 10]} /> */}
       <planeGeometry args={[20, 10, 512, 512]} />
    </mesh>
  );
}
