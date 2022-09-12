export interface BaseStateAxisSettings {
  max: number;
  acceleration: number;
  inertial?: false;
}
export interface InertialStateAxisSettings {
  max: number;
  acceleration: number;
  inertial: true;
  reset?: boolean;
}

export type StateAxisSettings = BaseStateAxisSettings | InertialStateAxisSettings;

export type StateTransform = {
  position: [x:number, y:number, z:number];
  rotation: [x:number, y:number, z:number];
}
export interface ShipStateContext<Axis extends string, Actions extends string> {
  id: string;
  velocity: Record<Axis, number>;
  actions: Record<Actions, number>;
  settings: Record<Axis, StateAxisSettings>;
  transform: StateTransform;
}

// Event types ////////////////////////////////////////////////////////////////

export type UPDATE<Axis extends string, Actions extends string> = {
  type: 'UPDATE';
  values: Record<Axis | Actions, number>;
};
export type START = { type: 'START' };
export type STOP = { type: 'STOP' };
export type RESET = { type: 'RESET' };
export type UPDATE_TRANSFORM = StateTransform & {
  type: 'UPDATE_TRANSFORM';
}

export type ShipStateEvent<Axis extends string, Actions extends string> =
  | UPDATE<Axis, Actions>
  | STOP
  | START
  | RESET
  | UPDATE_TRANSFORM;
