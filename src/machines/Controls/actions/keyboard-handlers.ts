import type { ControlsContext, ControlsEvent } from "../controls.types";

import { isEventType, clamp } from "../../functions";

import { InputsMachineError } from "../errors";
import { InputsConfiguration } from "../../configuration/InputsConfiguration";

export const keyboardAxisHandler = <
  C extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
>(
  ctx: ControlsContext<C, Axis, Actions>,
  event: Extract<ControlsEvent<C, Axis, Actions>, { type: "INPUT_RECEIVED" }>
) => {
  // type guard to fix
  let value = 0;
  if (event.mode === "digital") {
    value = ctx.values[event.axis] + event.value;
  } else {
    // analog input gets mapped natively
    value = event.value;
  }
  return value;

  // return clamp(value, -1, 1);
};

export const keyboardActionHandler = <
  C extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
>(
  _: ControlsContext<C, Axis, Actions>,
  event: Extract<ControlsEvent<C, Axis, Actions>, { type: "INPUT_RECEIVED" }>
) => {
  if (event.mode !== "digital") {
    throw new InputsMachineError("Actions cannot be digital.", event);
  }
  return event.value;
};

function clampValue(value: number, inputType: "action" | "axis"): number {
  let v = value;
  if (inputType === "axis") {
    v = clamp(v, -1, 1);
  } else if (inputType === "action") {
    v = clamp(v, 0, 1);
  }
  return v;
}

// closure system

/**
 * xstate action creator that waps a simple handler function to parse and
 * normalize the input values.
 * @param inputType type of input this closure should handle
 * @param handler actual handler callback to call when the function is called
 * @returns object to be used with xstate `assign` to trigger a context update.
 *        returned value can be an actual change or empty, depending on internal
 *        handler logic.
 */
export const inputEventHandler = <
  C extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
>(
  inputType: "axis" | "action",
  handler: (
    ctx: ControlsContext<C, Axis, Actions>,
    event: Extract<ControlsEvent<C, Axis, Actions>, { type: "INPUT_RECEIVED" }>
  ) => number
) => (
  ctx: ControlsContext<C, Axis, Actions>,
  event: ControlsEvent<C, Axis, Actions>
) => {
  // exclude all non input_received events and the
  if (!isEventType(event, "INPUT_RECEIVED") || event._type !== inputType)
    return {};

  const value = clampValue(handler(ctx, event), event._type);

  // don't send event if values didn't change to avoid spamming
  // with axis inputs this should capped [-1,1].
  if (value === ctx.values[event.axis]) return {};
  return {
    values: { ...ctx.values, [event.axis]: value }
  };
};
