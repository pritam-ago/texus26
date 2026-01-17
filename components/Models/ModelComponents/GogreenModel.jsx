import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function GogreenModel(props) {
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.z -= 0.01; // Adjust speed here
    }
  });
  const { nodes, materials } = useGLTF("/gogreen.glb", { suspense: true });
  return (
    <group {...props} dispose={null}>
      <mesh
        ref={modelRef}
        castShadow
        receiveShadow
        geometry={nodes.Text.geometry}
        material={materials["Material.001"]}
        rotation={[1.276, 0.214, -0.157]}
      >
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

// Only preload when this component is actually imported
useGLTF.preload("/gogreen.glb");
