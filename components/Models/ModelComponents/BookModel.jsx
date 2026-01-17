import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function BookModel(props) {
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01; // Adjust speed here
    }
  });
  const { nodes, materials } = useGLTF("/book.glb", { suspense: true });
  return (
    <group {...props} dispose={null}>
      <mesh
        ref={modelRef}
        castShadow
        receiveShadow
        geometry={nodes.OldBook001.geometry}
        material={materials.Material}
        rotation={[0, -0.5, 0.15]}
      />
    </group>
  );
}

// Only preload when this component is actually imported
useGLTF.preload("/book.glb");
