import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import GroundMaterial from '../assets/materials/GroundMaterial';

export default function Ground({ timeSpeed = 1 }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current?.material?.uniforms?.uTime) {
      ref.current.material.uniforms.uTime.value += delta * timeSpeed;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 512, 512]} />
      <GroundMaterial />
    </mesh>
  );
}
