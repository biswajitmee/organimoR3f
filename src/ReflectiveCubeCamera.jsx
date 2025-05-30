import { useThree, useFrame } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function ReflectiveCubeCamera({ children, position = [0, 5, 0], resolution = 256 }) {
  const { scene, gl } = useThree();
  const cubeCamera = useRef();
  const [texture, setTexture] = useState();

  const fbo = useFBO(resolution, resolution, { type: THREE.HalfFloatType });

  useFrame(() => {
    if (cubeCamera.current) {
      cubeCamera.current.update(gl, scene);
      setTexture(cubeCamera.current.renderTarget.texture);
    }
  });

  return (
    <>
      <cubeCamera
        ref={cubeCamera}
        args={[0.1, 1000, resolution]}
        position={position}
      />
      {texture && children(texture)}
    </>
  );
}
