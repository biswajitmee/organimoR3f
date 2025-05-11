import { ShaderMaterial } from 'three';
import { extend } from '@react-three/fiber';
import { useMemo } from 'react';
import waterVertex from '../shaders/water.vert?raw';
import waterFragment from '../shaders/water.frag?raw';

class WaterMaterialImpl extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: waterVertex,
      fragmentShader: waterFragment,
      uniforms: {
        uTime: { value: 0 },
      },
    });
  }
}

extend({ WaterMaterial: WaterMaterialImpl });

export default function WaterMaterial() {
  return <waterMaterial attach="material" />;
}
