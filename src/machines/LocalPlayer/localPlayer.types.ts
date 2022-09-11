import { InterpreterFrom } from 'xstate'
import { TControllerType } from '../configuration/configuration.types'
import type { InputsConfiguration } from '../configuration/InputsConfiguration'
import { createControlsMachine, TControlsMachine } from '../Controls'
import { createShipStateMachine, TStateMachine } from '../ShipState/shipState.machine'
import { StateTransform } from '../ShipState/shipState.types'

// Helpers --------------------------------------------------------------------

/**
 * Workaround type (Wrapper is at the bottom) to get a ReturnType
 * of a generic function such our factories
 */
export type GenericCollectionReturnType<
  K extends keyof Wrapper<Axis, Action, Config>,
  Axis extends string,
  Action extends string,
  Config extends InputsConfiguration<Axis, Action>
> = ReturnType<Wrapper<Axis, Action, Config>[K]>;

export class Wrapper<Ax extends string, Ac extends string, C extends InputsConfiguration<Ax, Ac>> {
  //HINT: do not forget to match arguments to your function
  createControlsMachine = (...args: any[]) =>
    // @ts-ignore
    createControlsMachine<Ax, Ac, C>(...args)
  createShipStateMachine = (...args: any[]) =>
    // @ts-ignore
    createShipStateMachine<Ax, Ac>(...args)
}

// Machine types --------------------------------------------------------------

export type LocalPlayerContext<
  Ax extends string,
  Ac extends string,
  C extends InputsConfiguration<Ax, Ac>
> = {
  values: InterpreterFrom<ReturnType<TStateMachine<Ax, Ac>>>;
  inputs: InterpreterFrom<ReturnType<TControlsMachine<Ax, Ac, C>>>;
};

// Return type extracting
// Used in conjunction with localPlayer.types::GenericCollectionReturnType to get
// the Return type of a generic function to properly type services

// Event types ----------------------------------------------------------------

/** start should send start to EVERY child machine */
export type START = { type: 'START' }
/** stop should send start to EVERY child machine */
export type STOP = { type: 'STOP' }
/**
 * right now UPDATE is only for the actual `state` machine that receives values
 * from the inputs machine. external calls should not need that and when
 * LocalPlayer receives an UPDATE event it should just takes the values from
 * `inputs.context.values` and send them to the state
 */
export type UPDATE = {type: 'UPDATE', payload?: {}}

/** these two are meant to start|stop the inputs machine
 * completely and authoritatively.
 * This is to stop ALL inputs regardless of what's going on (i.e. "pause")
 */
export type INPUTS_START = {
  type: 'INPUTS_START'
}
export type INPUTS_STOP = {
  type: 'INPUTS_STOP'
}
/**
 * These two are to programmatically tell the Controls machine to start|stop
 * one of the services
 */
export type INPUTS_START_CONTROLLER = {
  type: 'INPUTS_START_CONTROLLER'
  controller: TControllerType;
}
export type INPUTS_STOP_CONTROLLER = {
  type: 'INPUTS_STOP_CONTROLLER'
  controller: TControllerType;
}
/** This is a proxy event for the ControlsEvent TOGGLE_CONTROLLER */
export type INPUTS_TOGGLE = {
  type: 'INPUTS_TOGGLE';
  controller: TControllerType;
  value: boolean;
}

/**
 * Proxy event for ShipState UPDATE_TRANSFORM event.
 * @dev this SHOULD/COULD be a completely internal event BUT
 * right now we're computing the new transform inside the canvas and extracting
 * the values, so we need to fire two events each frame (sad):
 * 1 . UPDATE - triggers an update from the inputs -> values
 * 1a. compute new transform through threejs (webgl Canvas)
 * 2 . UPDATE_STATE - grabs the newly computed values from the scene and drops
 *    them in the state context
 */
export type UPDATE_STATE = StateTransform & {
  type: 'UPDATE_STATE';
}
/** Proxy for ShipState RESET event. */
export type RESET_STATE = { type: 'RESET_STATE' }

export type LocalPlayerEvent =
  | START
  | STOP
  | UPDATE
  // inputs
  | INPUTS_START
  | INPUTS_STOP
  | INPUTS_START_CONTROLLER
  | INPUTS_STOP_CONTROLLER
  | INPUTS_TOGGLE
  // state
  | UPDATE_STATE
  | RESET_STATE
