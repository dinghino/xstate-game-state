import type {
  ActionInputConfig,
  KeyboardAxisConfig,
  MouseAxisInputConfig,
  TActionInputConfig,
  TKeyboardAxisConfig,
  TMouseAxisInputConfig,
  TInputType
} from './configuration.types'

/** TODO: Fix Type of `type` for all parsers so that casts to the correct type and doesn't type error */

export function parseKeyboardAxis<N extends string>(
  ref: N,
  type: TInputType,
  conf: TKeyboardAxisConfig
): KeyboardAxisConfig {
  return {
    scale: 1,
    mode: 'digital',
    ...conf,
    ref,
    type: 'axis'
  }
}

export function parseMouseAxis<N extends string>(
  ref: N,
  type: TInputType,
  conf: TMouseAxisInputConfig
): MouseAxisInputConfig {
  return {
    scale: 1,
    mode: 'analog',
    deadzone: 0.05,
    ...conf,
    type: 'axis',
    ref
  }
}

export function parseAction<N extends string>(
  ref: N,
  type: TInputType,
  conf: TActionInputConfig
): ActionInputConfig {
  return {
    name: ref,
    mode: 'digital',
    ...conf,
    type: 'action',
    ref
  }
}
