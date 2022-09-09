import { assign, createMachine } from "xstate";
import type { ControlsContext, ControlsEvent } from "./controls.types";
import type { MouseAxisInputConfig } from "../configuration/configuration.types";
import { keyboardHandlerService, mouseHandlerService } from "./services";
import {
  handleMouseMove,
  inputEventHandler,
  keyboardAxisHandler,
  keyboardActionHandler,
} from "./actions";

import { InputsConfiguration } from "../configuration/InputsConfiguration";

import { isEventType } from "../functions";

export const createControlsMachine = <
  Axis extends string,
  Actions extends string,
  Configuration extends InputsConfiguration<Axis, Actions> = InputsConfiguration<Axis, Actions>
>(
  // for now these are just used for typing enforcing and required.
  // we'll put them to use soon enough.
  axis: readonly Axis[],
  actions: readonly Actions[],
  config: Configuration
) => {
  const mouseInputs = config.getAllBindings().filter((binding) => binding.controller === "mouse");
  function getMouseAxis(a: "x" | "y") {
    return mouseInputs.find(
      (i) => i.inputs.includes(a) && i.mode === "analog" && i.deadzone
      // )?.ref as Names;
    ) as MouseAxisInputConfig;
  }

  const getInitialValues = () => {
    return config.refs.reduce((p, key) => ({ ...p, [key]: 0 }), {}) as {
      [k in Axis | Actions]: number;
    };
  };

  const getMouseAxisObject = () => ({
    x: getMouseAxis("x"),
    y: getMouseAxis("y"),
  });

  // Setup initial context
  const initialContext: ControlsContext<Configuration, Axis, Actions> = {
    config,
    active: false,
    values: getInitialValues(),
    // controllers enabled by the configuration.
    // we could use these to either toggle individual controllers if needed
    // or to validate configuration against this machine (i.e. check if we can
    // handle certain types of controllers or input types)
    controllers: config.controllers.reduce((p, v) => ({ ...p, [v]: true }), {}),
    mouseAxis: getMouseAxisObject(),
  };

  return createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import("./controls.machine.typegen").Typegen0,
      context: initialContext,
      initial: "idle",
      id: "input-controller",
      schema: {
        context: {} as ControlsContext<Configuration, Axis, Actions>,
        events: {} as ControlsEvent<Configuration, Axis, Actions>,
      },
      on: {
        SET_CONTROLLER_STATUS: {
          actions: ["updateControllerStatus"],
        },
      },
      states: {
        idle: {
          entry: ["_resetValues", assign({ active: false })],
          on: {
            START: {
              target: "running",
            },
          },
        },
        running: {
          entry: ["_setupMouseAxis", assign({ active: true })],
          invoke: [
            { id: "keyboard-service", src: "keyboardHandlerService" },
            { id: "mouse-service", src: "mouseHandlerService" },
          ],
          on: {
            INPUT_RECEIVED: {
              actions: ["onKeyboardAxisReceived", "onKeyboardActionReceived"],
            },
            MOUSE_MOVED: {
              actions: ["onMouseAxisReceived"],
            },
            STOP: {
              target: "idle",
            },
          },
        },
      },
    },
    {
      services: {
        keyboardHandlerService,
        mouseHandlerService,
      },
      actions: {
        onKeyboardAxisReceived: assign(
          inputEventHandler<Configuration, Axis, Actions>("axis", keyboardAxisHandler)
        ),
        onKeyboardActionReceived: assign(
          inputEventHandler<Configuration, Axis, Actions>("action", keyboardActionHandler)
        ),
        onMouseAxisReceived: assign(handleMouseMove<Configuration, Axis, Actions>()),
        updateControllerStatus: (ctx, event) => {
          if (!isEventType(event, "SET_CONTROLLER_STATUS")) return {};
          return assign({
            controllers: { ...ctx.controllers, [event.controller]: event.value },
          });
        },
        // internals -------------------------------------------------------------------
        _resetValues: assign((_) => ({
          values: getInitialValues(),
        })),
        _setupMouseAxis: assign((ctx) => {
          return {
            mouseAxis: getMouseAxisObject(),
          };
        }),
      },
    }
  );
};
