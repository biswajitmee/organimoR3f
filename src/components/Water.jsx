import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import WaterMaterial from '../assets/materials/WaterMaterial';

export default function Water({ timeSpeed = 1 }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current?.material?.uniforms?.uTime) {
      ref.current.material.uniforms.uTime.value += delta * timeSpeed;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 512, 512]} />
      <WaterMaterial />
    </mesh>
  );
}
