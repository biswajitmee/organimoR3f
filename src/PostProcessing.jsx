// PostProcessing.jsx
import {
 EffectComposer,
  Bloom,
  HueSaturation,
  BrightnessContrast,
  ToneMapping,
  Vignette
} from '@react-three/postprocessing'

export default function PostProcessing() {
  return (
      <EffectComposer disableNormalPass>
        <HueSaturation saturation={-0.5} />
        <BrightnessContrast brightness={0} contrast={0.25} />
        <Bloom luminanceThreshold={0} intensity={0.5} />
        <Vignette eskil={false} offset={0.1} darkness={0.01} />
        <ToneMapping />
      </EffectComposer>  
  )
}
