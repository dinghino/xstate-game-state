import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh, Object3D, Vector3 } from "three";

// import { rotateOnWorldAxisWithInputs } from "../../functions/three";

import { Cube } from "./Cube";
import { useControlsModal } from "../../hooks/use-controls-modal";

import { /*inputService */ playerService } from "../../state";
import { useSelector } from "@xstate/react";
import { PerspectiveCamera } from "@react-three/drei";
import { useWindowEvent } from "@mantine/hooks";

const AX = new Vector3(1, 0, 0);
const AY = new Vector3(0, 1, 0);
const AZ = new Vector3(0, 0, 1);

// const state = interpret(stateMachine);

interface Values {
  yaw: number;
  pitch: number;
  roll: number;
  forward: number;
  left: number;
  up: number;
}

function updateObjectTransform(object: Object3D, inputs: Values, dt: number) {
  if (!object) return;
  object.rotateOnWorldAxis(AY, inputs.yaw * dt);
  object.rotateOnWorldAxis(AX, inputs.pitch * dt);
  object.rotateOnWorldAxis(AZ, (Math.PI / 2) * inputs.roll * dt);
  object.translateX(inputs.left * dt);
  object.translateY(inputs.up * dt);
  object.translateZ(inputs.forward * dt);
}

function centerObject(object: Object3D) {
  if (!object) return;
  object.position.x = 0;
  object.position.y = 0;
  object.position.z = 0;
  object.rotation.x = 0;
  object.rotation.y = 0;
  object.rotation.z = 0;
}

// function parseTransform(values: Vector3|Euler): [number, number, number] {
function parseTransform(obj: Object3D): {position: [number, number, number], rotation: [number, number, number]} {
  const p = obj.position;
  const r = obj.rotation;
  return { position: [p.x, p.y, p.z], rotation: [r.x, r.y, r.z] }
}

function Scene() {
  const cube = React.useRef<Mesh>(null!);

  const inputs = useSelector(playerService, ({ context }) => context.inputs);
  const state = useSelector(playerService, ({ context }) => context.values);

  const values = useSelector(inputs, ({ context }) => context.values);
  const velocity = useSelector(state, ({ context }) => context.velocity);

  useFrame((_, dt) => {
    const obj = cube.current;
    state.send({ type: "UPDATE", values });
    updateObjectTransform(obj, velocity, dt);
    state.send({ type: 'UPDATE_TRANSFORM', ...parseTransform(obj) });
  });

  useWindowEvent("keypress", (e) => {
    if (e.code === "KeyT") {
      centerObject(cube!.current);
      state.send("RESET");
    }
    if (e.code === "KeyZ") {
      state.send("DEBUG");
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight color="red" position={[1, 3, 5]} intensity={2} />
      <Cube ref={cube} />
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
        gl.setClearColor("#000");
        showControlsModal();
      }}
    >
      <PerspectiveCamera position={[0, 3, 5]} ref={camera} fov={45} />
      <gridHelper />
      <axesHelper />
      <Scene />
    </Canvas>
  );
};
