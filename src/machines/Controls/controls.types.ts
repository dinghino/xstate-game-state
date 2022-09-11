import { InputsConfiguration } from '../configuration/InputsConfiguration'

import {
  MouseAxisInputConfig,
  TControllerType,
  TInputType,
  TInputMode
} from '../configuration/configuration.types'

export type ControlsContext<
  Axis extends string,
  Actions extends string,
  Configuration extends InputsConfiguration<Axis, Actions> = InputsConfiguration<Axis, Actions>,
> = {
  config: Configuration;
  // {[string]: number } map of axis|actions configured and their values
  values: Record<Axis | Actions, number>;
  // actual InputConfiguration for each axis
  mouseAxis: {
    x?: MouseAxisInputConfig;
    y?: MouseAxisInputConfig;
  };
  controllers: {
    // map of actual active controllers and their current state
    [key in TControllerType]?: boolean;
  };
};

export type START = { type: 'START' };
export type STOP = { type: 'STOP' };

export type MOUSE_MOVED = {
  type: 'MOUSE_MOVED';
  value: { x: number; y: number };
};

export type INPUT_RECEIVED<
  Axis extends string,
> = {
  type: 'INPUT_RECEIVED';
  axis: Axis;
  source: TControllerType;
  activator: string;
  value: number;
  mode: TInputMode;
  _type: TInputType;
};

export type TOGGLE_CONTROLLER = {
  type: 'TOGGLE_CONTROLLER';
  value: boolean;
  controller: TControllerType;
};

export type CONTROLLER_STATUS_CHANGED = {
  type: 'CONTROLLER_STATUS_CHANGED',
  status: boolean;
  controller: TControllerType;
}

export type ControlsEvent<
  /**
   * @dev type is not used but left for backward compatibility for now
   * When things are finalized we'll do a pass for v1 and clean all types
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Configuration extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
> =
  | START
  | STOP
  | TOGGLE_CONTROLLER
  | CONTROLLER_STATUS_CHANGED
  | INPUT_RECEIVED<Axis>
  | MOUSE_MOVED;

type EventType<E extends { type: string }> = E extends { type: infer T }
  ? T
  : never;

export type ControlsEventTypes = EventType<ControlsEvent<any, any, any>>;
