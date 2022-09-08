import { InputsConfiguration } from "../configuration/InputsConfiguration";

import {
  MouseAxisInputConfig,
  TControllerType,
  TInputType,
  TInputMode
} from "../configuration/configuration.types";

export type ControlsContext<
  Configuration extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
  // CT extends TControllerType = TControllerType,
  // IT extends TInputType = TInputType
> = {
  config: Configuration;
  active: boolean;
  // {[string]: number } map of axis|actions configured and their values
  values: { [key in Axis | Actions]: number };
  // actual InputConfiguration for each axis
  mouseAxis: {
    x?: MouseAxisInputConfig;
    y?: MouseAxisInputConfig;
  };
  // mouseAxis: {
  //   x: Names;
  //   y: Names;
  // };
  controllers: {
    // map of actual active controllers and their current state
    [key in TControllerType]?: boolean;
  };
};

export type START = { type: "START" };
export type STOP = { type: "STOP" };

export type MOUSE_MOVED<
  Config extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
> = {
  type: "MOUSE_MOVED";
  // axis: { x: Axis; y: Axis };
  value: { x: number; y: number };
};

export type INPUT_RECEIVED<
  Configuration extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
> = {
  type: "INPUT_RECEIVED";
  axis: Axis;
  source: TControllerType;
  activator: string;
  value: number;
  mode: TInputMode;
  _type: TInputType;
};

export type SET_CONTROLLER_STATUS = {
  type: "SET_CONTROLLER_STATUS";
  value: boolean;
  controller: TControllerType;
};

export type ControlsEvent<
  Configuration extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
> =
  | START
  | STOP
  | SET_CONTROLLER_STATUS
  | INPUT_RECEIVED<Configuration, Axis, Actions>
  | MOUSE_MOVED<Configuration, Axis, Actions>;

type EventType<E extends { type: string }> = E extends { type: infer T }
  ? T
  : never;

export type ControlsEventTypes = EventType<ControlsEvent<any, any, any>>;