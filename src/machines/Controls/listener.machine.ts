/* eslint-disable */
/**
 * @dev Work in progress machine to replace simple callback services with actual state machines
 * for the input handler. This would allow to spawn them with functions in the context that do
 * the actual input listening, while keeping the public API consistent through the machine
 * 
 * @dev if this file is committed either I had some proper reason to, or i fucked up :)
 */

import { createMachine, InvokeActionObject, InvokeCallback, InvokeConfig, InvokeCreator, sendParent, ServiceConfig } from 'xstate'
import { TControllerType } from '../configuration/configuration.types'
import { InputsConfiguration } from '../configuration/InputsConfiguration'
import { INPUT_RECEIVED, ControlsEvent } from './controls.types'

type ListenerEvents<Axis extends string> =
  | {type: 'START'}
  | {type: 'STOP'}
  | INPUT_RECEIVED<Axis>;

  type ListenerContext<
Configuration extends InputsConfiguration<Axis, Actions>,
Axis extends string,
Actions extends string,
> = {
  config: Configuration
}

export const createKeyboardMachine = <
Axis extends string,
Actions extends string,
Configuration extends InputsConfiguration<Axis, Actions> = InputsConfiguration<Axis, Actions>,
>(
    // for now these are just used for typing enforcing and required.
  // we'll put them to use soon enough.
  axis: readonly Axis[],
  actions: readonly Actions[],
  config: Configuration,
  controller: TControllerType,

  serviceFunction: InvokeCreator<ListenerContext<Configuration, Axis, Actions>, ListenerEvents<Axis>>
) => {

  const sendToParent = (event: ControlsEvent<Configuration, Axis, Actions>) => sendParent(event)


  return createMachine({
    id: `${controller}-service`,
    predictableActionArguments: true,
    tsTypes: {} as import('./listener.machine.typegen').Typegen0,
    initial: 'inactive',
    schema: {
      events: {} as ListenerEvents<Axis>,
      context: {} as ListenerContext<Configuration, Axis, Actions>,
    },
    context: { config },
    states: {
      inactive: {
        on: {
          START: 'active',
        }
      },
      active: {
        entry: sendToParent({type: 'CONTROLLER_STATUS_CHANGED', controller, status: true }),
        exit: sendToParent({type: 'CONTROLLER_STATUS_CHANGED', controller, status: false }),
        invoke: [{
          id: `${controller}-listener`,
          src: serviceFunction,
        }],
        on: {
          STOP: 'inactive',
          INPUT_RECEIVED: {
            actions: [
              (_, evt) => sendToParent({...evt, source: controller}),
            ]
          }
        }
      },
    }
  }, {
  })
}
