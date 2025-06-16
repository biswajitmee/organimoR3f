import * as THREE from 'three'
import { useLoader, extend } from '@react-three/fiber'
import { RoundedPlaneGeometry } from 'maath/geometry'
import { useTexture } from '@react-three/drei'

// Extend so you can use <roundedPlaneGeometry /> in JSX
extend({ RoundedPlaneGeometry })

export default function RoundedImage({ url = '/file.jpg', ...props }) {
  const texture = useTexture(url)

  return (
    <mesh {...props}>
      <roundedPlaneGeometry args={[900, 600, 10]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}
