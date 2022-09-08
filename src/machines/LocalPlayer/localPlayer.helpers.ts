import type { InputsConfiguration } from "../configuration/InputsConfiguration";
import { createControlsMachine } from "../Controls";
// import { createControlsMachine as controlsMachineFactory } from "../Controls";
import { createShipStateMachine } from "../ShipState/shipState.machine";
// import { createShipStateMachine as shipStateMachineFactory } from "../ShipState/shipState.machine";
// Return type extracting
// Used in conjunction with localPlayer.types::GenericCollectionReturnType to get
// the Return type of a generic function to properly type services

export class Wrapper<Ax extends string, Ac extends string, C extends InputsConfiguration<Ax, Ac>> {
  //HINT: do not forget to match arguments to your function
  createControlsMachine = (...args: any[]) =>
    // @ts-ignore
    createControlsMachine<Ax, Ac, C>(...args);
  createShipStateMachine = (...args: any[]) =>
    // @ts-ignore
    createShipStateMachine<Ax, Ac>(...args);
}
