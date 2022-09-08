import { objKeys } from "../../../utils";
import { clamp, isEventType } from "../../functions";
import type { ShipStateContext, ShipStateEvent } from "../shipState.types";

function computeInertialVelocity(
  current: number,
  max: number,
  acceleration: number,
  input: number,
  inertial?: boolean
): number {
  const newValue = inertial
    ? current + acceleration * input
    : acceleration * input;

  const out = clamp(newValue, -max, max);
  return out;
}

export function updateVelocities<Axis extends string, Actions extends string>(
  ctx: ShipStateContext<Axis, Actions>,
  event: ShipStateEvent<Axis, Actions>
): { velocity: Record<Axis, number> } | {} {
  if (!isEventType(event, "UPDATE")) return {};

  const { velocity, settings } = ctx;
  const out = {} as Record<Axis, number>;

  for (let axis of objKeys(velocity)) {
    const curr = velocity[axis];
    const { max, acceleration, inertial } = settings[axis];
    const input = event.values[axis];
    out[axis] = computeInertialVelocity(
      curr,
      max,
      acceleration,
      input,
      inertial
    );
  }
  // console.info("updating ship state with", out);
  return { velocity: out };
}
