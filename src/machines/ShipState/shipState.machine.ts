import { assign, createMachine } from "xstate";
import { objKeys } from "../../utils";
import { isEventType } from "../functions";
import { updateVelocities } from "./actions";
import type { ShipStateContext, ShipStateEvent, StateAxisSettings } from "./shipState.types";

export interface ShipStateFactoryOptions<
  Axis extends string = string,
  Actions extends string = string
> {
  id: string;
  axis: readonly Axis[];
  actions: readonly Actions[];
  settings: Record<Axis, StateAxisSettings>;
}

// Helper functions ////////////////////////////////////////////////////////////

function setupInitials<T extends string>(arr: readonly T[], v = 0) {
  return arr.reduce((p, k) => ({ ...p, [k]: v }), {} as { [k in T]: number });
}

// State machine factory //////////////////////////////////////////////////////
export const createShipStateMachine = <Axis extends string, Actions extends string>({
  id,
  axis,
  actions,
  settings,
}: ShipStateFactoryOptions<Axis, Actions>) => {
  // Initial context
  const getInitialContext = (): ShipStateContext<Axis, Actions> => ({
    id: id,
    settings,
    velocity: setupInitials(axis),
    actions: setupInitials(actions),
    transform: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
    },
    debugging: false,
  });

  // Machine definition =======================================================
  return createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import("./shipState.machine.typegen").Typegen0,
      initial: "active",
      id: `ship-${id}-state`,
      schema: {
        context: {} as ShipStateContext<Axis, Actions>,
        events: {} as ShipStateEvent<Axis, Actions>,
      },
      context: getInitialContext(),
      // global events
      on: {
        DEBUG: {
          actions: [],
        },
        RESET: {
          actions: ["resetContext", (c, e) => console.info("ship state", e)],
        },
      },
      // states definition
      states: {
        active: {
          on: {
            UPDATE: {
              actions: ["processInputs", "updateTransform"],
            },
          },
        },
        paused: {
          on: {
            RESUME: "active",
          },
        },
      },
    },
    {
      actions: {
        processInputs: assign((ctx, event) => {
          if (!isEventType(event, "UPDATE")) return {};
          const velocity = updateVelocities(ctx, event);
          const actions = objKeys(ctx.actions)
            .reduce((p, key) => ({ ...p, [key]: event.values[key] }), {});
            
        

          return { ...velocity, actions };
        }),
        updateTransform: () => {},
        resetContext: assign((_) => ({
          velocity: setupInitials(axis),
          actions: setupInitials(actions),
        })),
      },
    }
  );
};
