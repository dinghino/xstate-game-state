import { assign, createMachine, spawn, send, InterpreterFrom } from 'xstate'

import type { InputsConfiguration } from '../configuration/InputsConfiguration'
import type { StateAxisSettings } from '../ShipState/shipState.types'

import { createControlsMachine } from '../Controls'
import { createShipStateMachine } from '../ShipState/shipState.machine'
import { LocalPlayerContext, LocalPlayerEvent } from './localPlayer.types'

export type TPlayerMachine<A extends string, B extends string> = typeof createLocalPlayerMachine<A,B>;
export type TPlayerService<A extends string, B extends string> = InterpreterFrom<TPlayerMachine<A,B>>;

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
  const inputs = createControlsMachine(axis, actions, inputConfig)
  const stateOpts = { id: 'local-player', axis, actions, settings }
  const state = createShipStateMachine(stateOpts)

  return createMachine(
    {
      id: 'local-player-machine',
      predictableActionArguments: true,
      tsTypes: {} as import('./localPlayer.machine.typegen').Typegen0,
      schema: {
        context: {} as LocalPlayerContext<Axis, Actions, Configuration>,
        events: {} as LocalPlayerEvent,
      },
      context: {
        values: null as any,
        inputs: null as any,
      },
      initial: 'idle',
      entry: [
        assign({ values: () => spawn(state, 'state') }),
        assign({ inputs: () => spawn(inputs, 'inputs') }),
      ],
      on: {
        // always fired, regardless of where we are, until this becomes an internal event
        UPDATE_STATE: { actions: 'updateStateTransform' },
        RESET_STATE: { actions: 'resetStateValues' }
      },
      states: {
        idle: {
          on: {
            START: {
              target: 'running',
            },
          },
        },
        running: {
          entry: ['startInputs', 'startState'],
          exit: ['stopInputs', 'stopState'],
          on: {
            STOP: 'idle',
            // inputs forwarders
            INPUTS_START: { actions: 'startInputs' },
            INPUTS_STOP: { actions: 'stopInputs' },
            INPUTS_TOGGLE: { actions: 'toggleController' },
            INPUTS_START_CONTROLLER: { actions: 'startController' },
            INPUTS_STOP_CONTROLLER: { actions: 'stopController' },
            // state forwarders
            UPDATE: { actions: 'updateValuesFromInputs', },
          },
        },
      },
    },
    {
      actions: {

        startInputs: send({ type: 'START' }, { to: (ctx) => ctx.inputs }),
        stopInputs: send({ type: 'STOP' }, { to: (ctx) => ctx.inputs }),

        startState: send({ type: 'START' }, { to: (ctx) => ctx.values }),
        stopState: send({ type: 'STOP' }, { to: (ctx) => ctx.values }),

        updateValuesFromInputs: send(
          ( {inputs }) => ({ type: 'UPDATE', values: inputs.getSnapshot().context.values }),
          { to: ctx => ctx.values }
        ),
        startController: send((_, { controller }) =>
          ({type: 'TOGGLE_CONTROLLER', controller, value: true }),
          { to: ctx => ctx.inputs }
        ),
        stopController: send((_, { controller }) =>
          ({type: 'TOGGLE_CONTROLLER', controller, value: false }),
          { to: ctx => ctx.inputs }
        ),
        toggleController: send((_, { controller, value }) =>
          ({type: 'TOGGLE_CONTROLLER', controller, value}),
          { to: ctx => ctx.inputs }
        ),
        updateStateTransform: send((_, { rotation, position }) =>
          ({ type: 'UPDATE_TRANSFORM', rotation, position }),
          {to: ctx => ctx.values }
        ),
        resetStateValues: send({ type: 'RESET' }, {to: ctx => ctx.values })
      },
    }
  )
}
