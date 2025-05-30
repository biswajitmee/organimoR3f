import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Stairs(props) {
  const { nodes, materials } = useGLTF('/stairs.glb')
  return (
    <group {...props} dispose={null} scale={0.5}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Stairs_LP_Staris_stone_0.geometry}
          material={materials.Staris_stone}
          scale={6.803}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/stairs.glb')
