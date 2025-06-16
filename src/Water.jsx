import React, { useRef, useMemo, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CubeTextureLoader } from 'three';
import waterVertexShader from './assets/shaders/water.vert?raw';
import waterFragmentShader from './assets/shaders/water.frag?raw';
import waterSettings from './waterSettings.json';
 

export default function Water({
  timeSpeed = 1,
  onMeshReady,
  position = [0, 0, 0],
  reflectionTexture // 👈 make sure you accept this prop
}) {
  const ref = useRef();
  const { gl, scene } = useThree();

  // Load cube environment map
  const envMap = useMemo(() => {
    const loader = new CubeTextureLoader();
    const texture = loader.load([
      '/env/px.png', '/env/nx.png',
      '/env/py.png', '/env/ny.png',
      '/env/pz.png', '/env/nz.png',
    ]);
    texture.encoding = gl.outputEncoding;
    return texture;
  }, [gl]);

  useEffect(() => {
    scene.environment = envMap;
  }, [envMap, scene]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWavesAmplitude: { value: waterSettings.uWavesAmplitude },
    uWavesSpeed: { value: waterSettings.uWavesSpeed },
    uWavesFrequency: { value: waterSettings.uWavesFrequency },
    uWavesPersistence: { value: waterSettings.uWavesPersistence },
    uWavesLacunarity: { value: waterSettings.uWavesLacunarity },
    uWavesIterations: { value: waterSettings.uWavesIterations },
    uOpacity: { value: waterSettings.uOpacity },
    uPeakColor: { value: new THREE.Color(...waterSettings.uPeakColor) },
    uSurfaceColor: { value: new THREE.Color(...waterSettings.uSurfaceColor) },
    uTroughColor: { value: new THREE.Color(...waterSettings.uTroughColor) },
    uPeakThreshold: { value: waterSettings.uPeakThreshold },
    uPeakTransition: { value: waterSettings.uPeakTransition },
    uTroughThreshold: { value: waterSettings.uTroughThreshold },
    uTroughTransition: { value: waterSettings.uTroughTransition },
    uFresnelScale: { value: waterSettings.uFresnelScale },
    uFresnelPower: { value: waterSettings.uFresnelPower },
    uEnvironmentMap: { value: envMap },
    uReflectionMap: { value: reflectionTexture || envMap },
  }), [envMap]);

  useEffect(() => {
    if (ref.current && onMeshReady) {
      onMeshReady(ref.current);
    }
  }, [ref, onMeshReady]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * timeSpeed;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={[900, 900, 512, 512]} />
      <shaderMaterial
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}