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
    position: [number, number, number];
    rotation: [number, number, number];
  };
  debugging?: boolean;
}

// Event types ////////////////////////////////////////////////////////////////

export type UPDATE<Axis extends string, Actions extends string> = {
  type: "UPDATE";
  values: { [key in Axis | Actions]: number };
};
export type TEST_EVENT = { type: "TEST_EVENT" };
export type PAUSE = { type: "STOP" };
export type RESUME = { type: "START" };
export type DEBUG = { type: "DEBUG" };
export type RESET = { type: "RESET" };

export type ShipStateEvent<Axis extends string, Actions extends string> =
  | UPDATE<Axis, Actions>
  | TEST_EVENT
  | PAUSE
  | RESUME
  | RESET
  | DEBUG;
