import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Iland(props) {
  const { nodes, materials } = useGLTF('/Iland.glb')
  return (
    <group {...props} dispose={null} scale={0.01}>
      <group position={[17.117, 218.356, 23.591]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <group position={[33.745, 38.713, -60.289]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_16.geometry}
            material={materials.Environment}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_10.geometry}
            material={materials.Fortress}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_12.geometry}
            material={materials.Fortress}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_14.geometry}
            material={materials.Fortress}
          />
        </group>
      </group>
      <group position={[-1.388, 326.224, 14.92]} rotation={[-Math.PI / 2, 0, 0]} />
      <group rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/Iland.glb')