import { Pane } from 'tweakpane';
import * as THREE from 'three';

export function setupWaterUI(mesh) {
  const uniforms = mesh.material.uniforms;
  const pane = new Pane({ title: 'Water Shader' });

  pane.addBinding(uniforms.uWavesAmplitude, 'value', { label: 'Amplitude', min: 0, max: 0.2 });
  pane.addBinding(uniforms.uWavesSpeed, 'value', { label: 'Speed', min: 0, max: 2 });
  pane.addBinding(uniforms.uWavesFrequency, 'value', { label: 'Frequency', min: 0, max: 5 });
  pane.addBinding(uniforms.uWavesPersistence, 'value', { label: 'Persistence', min: 0, max: 1 });
  pane.addBinding(uniforms.uWavesLacunarity, 'value', { label: 'Lacunarity', min: 0, max: 5 });
  pane.addBinding(uniforms.uWavesIterations, 'value', { label: 'Iterations', min: 1, max: 10, step: 1 });

  pane.addBinding(uniforms.uOpacity, 'value', { label: 'Opacity', min: 0, max: 1 });
  pane.addBinding(uniforms.uPeakThreshold, 'value', { label: 'PeakThreshold', min: 0, max: 1 });
  pane.addBinding(uniforms.uPeakTransition, 'value', { label: 'PeakTransition', min: 0, max: 1 });
  pane.addBinding(uniforms.uTroughThreshold, 'value', { label: 'TroughThreshold', min: -1, max: 0 });
  pane.addBinding(uniforms.uTroughTransition, 'value', { label: 'TroughTransition', min: 0, max: 1 });
  pane.addBinding(uniforms.uFresnelScale, 'value', { label: 'FresnelScale', min: 0, max: 2 });
  pane.addBinding(uniforms.uFresnelPower, 'value', { label: 'FresnelPower', min: 0, max: 2 });

  pane.addBinding(uniforms.uPeakColor, 'value', { label: 'PeakColor' });
  pane.addBinding(uniforms.uSurfaceColor, 'value', { label: 'SurfaceColor' });
  pane.addBinding(uniforms.uTroughColor, 'value', { label: 'TroughColor' });

  pane.on('change', () => {
    console.log('Updated Water Settings:', Object.fromEntries(
      Object.entries(uniforms).map(([k, v]) =>
        [k, v.value instanceof THREE.Color ? [v.value.r, v.value.g, v.value.b] : v.value]
      )
    ));
  });
}
