import { assign, createMachine, spawn, send } from "xstate";

import type { InputsConfiguration } from "../configuration/InputsConfiguration";
import type { StateAxisSettings } from "../ShipState/shipState.types";

import { createControlsMachine } from "../Controls";
import { createShipStateMachine } from "../ShipState/shipState.machine";
import { LocalPlayerContext } from "./localPlayer.types";

export function createLocalPlayerMachine<
  Axis extends string,
  Actions extends string,
  Configuration extends InputsConfiguration<Axis, Actions> = InputsConfiguration<Axis, Actions>
>(
  axis: readonly Axis[],
  actions: readonly Actions[],
  inputConfig: Configuration,
  settings: Record<Axis, StateAxisSettings>
) {
  const inputs = createControlsMachine(axis, actions, inputConfig);
  const stateOpts = { id: "local-player", axis, actions, settings };
  const state = createShipStateMachine(stateOpts);

  return createMachine(
    {
      id: "local-player-machine",
      predictableActionArguments: true,
      tsTypes: {} as import("./localPlayer.machine.typegen").Typegen0,
      schema: {
        context: {} as LocalPlayerContext<Axis, Actions, Configuration>,
      },
      context: {
        values: null as any,
        inputs: null as any,
      },
      initial: "idle",
      entry: [
        assign({ values: () => spawn(state, "state") }),
        assign({ inputs: () => spawn(inputs, "inputs") }),
      ],
      states: {
        idle: {
          on: {
            START: {
              target: "running",
            },
          },
        },
        running: {
          entry: ["startInputs", "startState"],
          exit: ["stopInputs", "stopState"],
          on: {
            UPDATE: {
              actions: ["updateValuesFromInputs"],
            },
            STOP: "idle",
          },
        },
      },
    },
    {
      actions: {
        startInputs: send({ type: "START" }, { to: (ctx) => ctx.inputs }),
        stopInputs: send({ type: "STOP" }, { to: (ctx) => ctx.inputs }),
        startState: send({ type: "RESUME" }, { to: (ctx) => ctx.values }),
        stopState: send({ type: "PAUSE" }, { to: (ctx) => ctx.values }),
        updateValuesFromInputs: ({ inputs }) =>
          send(
            {
              type: "UPDATE",
              values: inputs.state.context.values,
            },
            { to: "state" }
          ),
      },
    }
  );
}
