import React from "react";
import {
  Mesh
  // Euler,
} from "three";
// import { degToRad } from "three/src/math/MathUtils";

// export const initialRotation = new Euler(degToRad(45), 0, degToRad(45));

export const Cube = React.forwardRef<Mesh>((props, ref) => {
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
});
