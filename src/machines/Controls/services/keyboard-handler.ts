import { Sender } from "xstate";
import { InputsConfiguration } from "../../configuration/InputsConfiguration";
import { forEachInputConfiguration } from "../../functions";
import { ControlsContext, ControlsEvent } from "../controls.types";

export const keyboardHandlerService = <
  C extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
>(
  ctx: ControlsContext<C, Axis, Actions>
) => (callback: Sender<ControlsEvent<C, Axis, Actions>>) => {
  if (!ctx.controllers.keyboard) return;
  const { config } = ctx;

  const handleKeyboardEvents = (e: KeyboardEvent) => {
    forEachInputConfiguration<Axis, Actions>(config, (axis, input) => {
      const { inputs, controller } = input;
      if (controller !== "keyboard" || !inputs.includes(e.code)) return;
      // TODO: check if this is needed with the "new" system
      const scale = "scale" in input ? input.scale : 1;
      const mode = "mode" in input ? input.mode : "digital";

      callback({
        axis: axis as Axis,
        type: "INPUT_RECEIVED",
        source: input.controller,
        activator: e.code,
        value: scale * (e.type === "keydown" ? 1 : -1),
        mode: mode,
        _type: input.type
      });
    });
  };
  console.info(ctx.controllers);
  callback({
    type: "SET_CONTROLLER_STATUS",
    controller: "keyboard",
    value: true
  });
  window!.addEventListener("keydown", handleKeyboardEvents);
  window!.addEventListener("keyup", handleKeyboardEvents);

  return () => {
    callback({
      type: "SET_CONTROLLER_STATUS",
      controller: "keyboard",
      value: false
    });
    window!.removeEventListener("keydown", handleKeyboardEvents);
    window!.removeEventListener("keyup", handleKeyboardEvents);
  };
};
