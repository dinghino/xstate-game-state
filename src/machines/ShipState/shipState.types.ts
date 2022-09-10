export interface StateAxisSettings {
  max: number;
  acceleration: number;
  inertial?: boolean;
}

export interface ShipStateContext<Axis extends string, Actions extends string> {
  id: string;
  velocity: Record<Axis, number>;
  actions: Record<Actions, number>;
  settings: Record<Axis, StateAxisSettings>;
  transform: {
    position: [x:number, y:number, z:number];
    rotation: [x:number, y:number, z:number];
  };
  debugging?: boolean;
}

// Event types ////////////////////////////////////////////////////////////////

export type UPDATE<Axis extends string, Actions extends string> = {
  type: "UPDATE";
  values: { [key in Axis | Actions]: number };
};
export type PAUSE = { type: "STOP" };
export type RESUME = { type: "START" };
export type DEBUG = { type: "DEBUG" };
export type RESET = { type: "RESET" };
export type UPDATE_TRANSFORM = {
  type: "UPDATE_TRANSFORM",
  position: [x:number, y:number, z:number]
  rotation: [x:number, y:number, z:number]
}

export type ShipStateEvent<Axis extends string, Actions extends string> =
  | UPDATE<Axis, Actions>
  | PAUSE
  | RESUME
  | RESET
  | DEBUG
  | UPDATE_TRANSFORM;
