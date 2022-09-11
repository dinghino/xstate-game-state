import type { Equal, WithOptional } from '../types'

// import { Expect, Equal, ExpectTrue } from "@type-challenges/utils";
export type TControllerType = 'keyboard' | 'mouse';
export type TInputMode = 'analog' | 'digital';
export type TInputType = 'axis' | 'action';

// Generic base types ///////////////////////////////////////////////////////////////////

export interface GenericInputConfig {
  controller: TControllerType;
  inputs: string[];
  ref: string; // TODO: generic keyof available axis
  name: string; // displayName - either given or evaluated as axis
  type: TInputType;
}
export interface GenericAxisConfig {
  scale: 1 | -1;
  mode: TInputMode;
  type: 'axis';
}

// Generic per controller type //////////////////////////////////////////////////////////

export type KeyboardConfig = GenericInputConfig & {
  controller: 'keyboard';
  mode: 'digital';
};

export type MouseConfig = GenericInputConfig & {
  controller: 'mouse';
  mode: 'analog';
};

// Actual (finalized) input configuration types /////////////////////////////////////////

export type KeyboardAxisConfig = KeyboardConfig &
  GenericAxisConfig & {
    inputs: string[];
  };

export type MouseAxisInputConfig = MouseConfig &
  GenericAxisConfig & {
    mode: 'analog';
    inputs: ['x' | 'y'];
    deadzone: number;
  };

export type ActionInputConfig = Omit<
  KeyboardConfig | MouseConfig,
  'scale' | 'deadzone'
> & {
  controller: TControllerType;
  inputs: string[];
  mode: 'digital';
  type: 'action';
};

export type InputConfiguration =
  | KeyboardAxisConfig
  | MouseAxisInputConfig
  | ActionInputConfig;

// Configuration object types ///////////////////////////////////////////////////////////

// types that do not have to be set or can be omitted
type ExcludeDefaults<T extends {}, Extras extends keyof T = never> = Omit<
  T,
  'mode' | 'type' | 'ref' | Extras
>;

/** mode is omitted and scale is optional (will default to 1 if not passed) */

export type TKeyboardAxisConfig = ExcludeDefaults<
  WithOptional<KeyboardAxisConfig, 'scale'>
>;

export type TMouseAxisInputConfig = ExcludeDefaults<
  WithOptional<MouseAxisInputConfig, 'deadzone' | 'scale'>
>;

export type TActionInputConfig = ExcludeDefaults<
  WithOptional<ActionInputConfig, 'name'>
>;

export type TInputConfiguration =
  | TKeyboardAxisConfig
  | TMouseAxisInputConfig
  | TActionInputConfig;

// Helper types for construction ////////////////////////////////////////////////////////

/**
 * type definition for what the default values that should/can be defined are
 * based on all the other input types.
 *
 * TODO: This SHOULD be a generic that is embedded in the createConfiguration function
 * and uses the types that are evaluated from the mappings object to add/remove required
 * values. This should be done when/if the inputs configuration becomes extensive enough
 * that the defaults object might become bloated with values that we know won't be used
 */
export type DefaultableOptions = Omit<
  TKeyboardAxisConfig | TActionInputConfig | TMouseAxisInputConfig,
  'controller' | 'inputs' | 'name' | 'axis' | 'ref'
>;

export type ConfigurationInputMappings<
  Axis extends string,
  Actions extends string
  // > = AxisMappings<Axis> & ActionMappings<Actions>;
> = {
  [key in Axis | Actions]: key extends Axis
    ? {
        type: 'axis';
        bindings: (TKeyboardAxisConfig | TMouseAxisInputConfig)[];
      }
    : {
        type: 'action';
        bindings: TActionInputConfig[];
      };
};

// Generic shapes of a configuration object /////////////////////////////////////////////

type ConfigurationShape<Axis extends string, Actions extends string> = {
  axis?: readonly Axis[];
  actions?: readonly Actions[];
  mappings: ConfigurationInputMappings<Axis, Actions>;
};

// exclude defaults if defaultable options type is empty
export type TConfigurationSetup<
  Axis extends string,
  Actions extends string
> = Equal<DefaultableOptions, {}> extends true
  ? ConfigurationShape<Axis, Actions>
  : ConfigurationShape<Axis, Actions> & {
      defaults: DefaultableOptions;
    };

export type InputMapping =
  | KeyboardAxisConfig
  | MouseAxisInputConfig
  | ActionInputConfig;

export type FinalizedInputs<Axis extends string, Actions extends string> = Record<Axis | Actions, Array<InputMapping>>;
