import { InterpreterFrom } from 'xstate'
import type { InputsConfiguration } from '../configuration/InputsConfiguration'
import { createControlsMachine } from '../Controls'
// import { createControlsMachine as controlsMachineFactory } from "../Controls";
import { createShipStateMachine } from '../ShipState/shipState.machine'
// import { createShipStateMachine as shipStateMachineFactory } from "../ShipState/shipState.machine";

// import type { Wrapper } from "./localPlayer.helpers";
/** Workaround type (Wrapper is at the bottom) to get a ReturnType of a generic function such our factories */
export type GenericCollectionReturnType<
  K extends keyof Wrapper<Axis, Action, Config>,
  Axis extends string,
  Action extends string,
  Config extends InputsConfiguration<Axis, Action>
> = ReturnType<Wrapper<Axis, Action, Config>[K]>;

// Machine types --------------------------------------------------------------

export type LocalPlayerContext<
  Ax extends string,
  Ac extends string,
  C extends InputsConfiguration<Ax, Ac>
> = {
  values: InterpreterFrom<GenericCollectionReturnType<'createShipStateMachine', Ax, Ac, C>>;
  inputs: InterpreterFrom<GenericCollectionReturnType<'createControlsMachine', Ax, Ac, C>>;
};

// Return type extracting
// Used in conjunction with localPlayer.types::GenericCollectionReturnType to get
// the Return type of a generic function to properly type services

export class Wrapper<Ax extends string, Ac extends string, C extends InputsConfiguration<Ax, Ac>> {
  //HINT: do not forget to match arguments to your function
  createControlsMachine = (...args: any[]) =>
    // @ts-ignore
    createControlsMachine<Ax, Ac, C>(...args)
  createShipStateMachine = (...args: any[]) =>
    // @ts-ignore
    createShipStateMachine<Ax, Ac>(...args)
}
