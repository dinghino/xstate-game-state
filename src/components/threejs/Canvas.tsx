import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

// import { rotateOnWorldAxisWithInputs } from "../../functions/three";

import { Player } from "./Player.mesh";
import { useControlsModal } from "../../hooks/use-controls-modal";

import { /*inputService */ playerService } from "../../state";
import { useSelector } from "@xstate/react";
import { PerspectiveCamera } from "@react-three/drei";

function Scene() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight color="red" position={[1, 3, 5]} intensity={2} />
      <Player />
    </>
  );
}

export const CanvasRoot: React.FC = () => {
  const camera = React.useRef(null!);
  const inputs = useSelector(playerService, ({ context }) => context.inputs);

  const showControlsModal = useControlsModal(inputs as any);

  return (
    <Canvas
      camera={{ position: [0, 1, 3] }}
      style={{
        width: "100%",
        height: "100%",
      }}
      onCreated={({ gl }) => {
        // gl.setClearColor("#000");
        showControlsModal();
      }}
    >
      <PerspectiveCamera position={[0, 3, 5]} ref={camera} fov={90} />
      <gridHelper />
      <axesHelper />
      <Scene />
    </Canvas>
  );
};

/** Demo for remote player client receiving transform.
 * In this example the position is evaluated directly from the player's inputs
 * plus some shift. In a real context the values are received through websocket,
 * either directly in the component or through a state service (clientsMachine?)
 * and handled with a player/client id as a ref.
 */
const OtherPlayer = () => {
  const player = React.useRef<Mesh>(null!);

  const state = useSelector(playerService, ({ context }) => context.values);
  const { position, rotation } = useSelector(state, ({ context }) => context.transform);
  useFrame(() => {
    const obj = player.current;
    if (!obj) return;
    obj.position.x = position[0];
    obj.position.y = position[1] + 0.5;
    obj.position.z = position[2] + 1;
    obj.rotation.x = rotation[0]
    obj.rotation.y = rotation[1]
    obj.rotation.z = rotation[2]
  });
  return (
    <mesh ref={player} position={[0,0,0]} scale={0.5}>
      <boxGeometry />
      <meshBasicMaterial color="#33ffff"/>
    </mesh>
  )
}
