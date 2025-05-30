import { useVideoTexture } from '@react-three/drei'

export function CookieLight(props) {
  return (
    <spotLight
      castShadow
      angle={0.6}
      penumbra={1}
      intensity={15}
      decay={0}
      distance={100}
      {...props}
    />
  )
}

export function CookieLightPlane({ position = [0, 0.01, 0], scale = [10, 10], opacity = 0.6 }) {
  const texture = useVideoTexture('/caustics.mp4')
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  )
}
