import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Modelman(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/tesst.glb", {
    suspense: true,
  });
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="rp_nathan_animated_003_walking"
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        >
          <group name="rp_nathan_animated_003_walking_CTRL">
            <group name="Armature">
              <skinnedMesh
                name="rp_nathan_animated_003_walking_geo"
                geometry={nodes.rp_nathan_animated_003_walking_geo.geometry}
                material={materials.rp_nathan_animated_003_mat}
                skeleton={nodes.rp_nathan_animated_003_walking_geo.skeleton}
              />
              <primitive object={nodes.rp_nathan_animated_003_walking_root} />
            </group>
          </group>
          <group name="rp_nathan_animated_003_walking_geoGRP" />
        </group>
      </group>
    </group>
  );
}

// Only preload when this component is actually imported
useGLTF.preload("/tesst.glb");
