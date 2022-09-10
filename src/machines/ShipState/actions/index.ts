import { objKeys } from "../../../utils";
import { clamp, isEventType, isNearly } from "../../functions";
import type { ShipStateContext, ShipStateEvent } from "../shipState.types";


function handleBreaking(current: number, acceleration: number, breaking: boolean|undefined):number {
  if (!breaking) return 0;
  if (isNearly(current, 0, acceleration)) return -current;
  return (current > 0 ? -acceleration : acceleration) * (3/2);

}

function compute(curr: number, acc: number, input: number, inertial?:boolean): number {
  if (inertial) return curr + acc * input;
  return acc * input;
}

export function updateVelocities<Axis extends string, Actions extends string>(
  ctx: ShipStateContext<Axis, Actions>,
  event: ShipStateEvent<Axis, Actions>,
  breaking?: boolean
): { velocity: Record<Axis, number> } | {} {
  if (!isEventType(event, "UPDATE")) return {};

  const { velocity, settings } = ctx;
  const out = {} as Record<Axis, number>;

  for (let axis of objKeys(velocity)) {
    const current = velocity[axis];
    const { max, acceleration, inertial } = settings[axis];
    const input = event.values[axis];

    const newValue =
      compute(current, acceleration, input, inertial) +
      handleBreaking(current, acceleration, breaking);

    out[axis] = clamp(newValue, -max, max);
    
  }
  // console.info("updating ship state with", out);
  return { velocity: out };
}
