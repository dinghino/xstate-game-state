import { assign, createMachine } from 'xstate'
import { objKeys } from '../../utils'
import { isEventType } from '../functions'
import { updateVelocities } from './actions'
import type { ShipStateContext, ShipStateEvent, StateAxisSettings } from './shipState.types'

export type AxisSettings<Axis extends string = string> = Record<Axis, StateAxisSettings>;

export interface ShipStateFactoryOptions<
  Axis extends string = string,
  Actions extends string = string
> {
  id: string;
  axis: readonly Axis[];
  actions: readonly Actions[];
  settings: AxisSettings<Axis>;
}

// Helper functions ////////////////////////////////////////////////////////////

function setupInitials<T extends string>(arr: readonly T[], v = 0) {
  return arr.reduce((p, k) => ({ ...p, [k]: v }), {} as { [k in T]: number })
}

type Values = [x:number, y:number, z:number]
function updateTransformValues(current:Values, next:Values): [boolean, Values] {
  if (current.every((v, i) => v === next[i])) {
    return [false, current]
  }
  return [true, next]
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
    }
  })

  // Machine definition =======================================================
  return createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import('./shipState.machine.typegen').Typegen0,
      initial: 'active',
      id: `ship-${id}-state`,
      schema: {
        context: {} as ShipStateContext<Axis, Actions>,
        events: {} as ShipStateEvent<Axis, Actions>,
      },
      context: getInitialContext(),
      // global events
      on: {
        RESET: {
          actions: ['resetContext', (c, e) => console.info('ship state', e)],
        },
      },
      // states definition
      states: {
        active: {
          on: {
            UPDATE: {
              actions: ['processInputs'],
            },
            STOP: 'inactive',
            UPDATE_TRANSFORM: {
              actions: 'onUpdateTransform',
            }
          },
        },
        inactive: {
          on: {
            START: 'active',
          },
        },
      },
    },
    {
      actions: {
        processInputs: assign((ctx, event) => {
          if (!isEventType(event, 'UPDATE')) return {}

          /**
           * FIXME: Actions should be handled through configuration completetly
           * since the name of the actions and what they do are user defined.
           * Ideally we would need to set up a bunch of "dynamic" actions event
           * like `actions.map(a => `on${a}`) on the on.UPDATE event actions
           * and leave them blank, so that they become required when creating
           * the service.
           * 
           * Problems are
           * - this specific service is managed inside the LocalPlayer
           *   machine, so we would have to add a new argument that gets forwarded
           *   with the type of xstate "missing action definitions" (whatever that is)
           *   and forward it here IF IT IS POSSIBLE AT ALL.
           * - Some actions (like breaking in this specific case) require to
           *   be either handled BEFORE the axis or to after, receiving the new
           *   axis values to do stuff with/on them too.
           * - Since all the typings are dynamic, even checking if a value is
           *   in the actions object is a bit of a mess. We may need to add some
           *   custom extra types to handle the actual actions.
           * @dev fix this hack
           */
          const newActions = objKeys(ctx.actions)
            .reduce((p, key) => ({ ...p, [key]: event.values[key] }), {}) as Record<Actions,number> & { break?:number}
          let breaking = false
          if ('break' in newActions) {
            breaking = !!newActions.break
          }
          // TODO: Invert actions and velocities so we can pass down
          // the actions to the function and use them to do stuff (break/jump)
          const velocity = updateVelocities(ctx, event, breaking)
          return {
            ...velocity,
            actions: newActions
          }
        }),
        onUpdateTransform: assign((context, event) => {
          if (!isEventType(event, 'UPDATE_TRANSFORM')) return {}
          const current = context.transform
          const [pChanged, position] = updateTransformValues(current.position, event.position)
          const [rChanged, rotation] = updateTransformValues(current.rotation, event.rotation)
          // nothing changed. do not update the context.
          if (!pChanged && !rChanged) return {}
          return { transform: { position, rotation, } }
        }),

        resetContext: assign((_) => ({
          velocity: setupInitials(axis),
          actions: setupInitials(actions),
        })),
      },
    }
  )
}
