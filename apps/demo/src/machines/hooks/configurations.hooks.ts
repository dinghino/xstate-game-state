
import { useSelector } from '@xstate/react'

import * as state from '../ShipState/shipState.selectors'
import * as controls from '../Controls/controls.selectors'
import { TPlayerService } from '../LocalPlayer'

import { usePlayerInputs, usePlayerState } from './internals.hooks'

/**
 * Inputs configuration object
 * @dev returns the parsed `InputConfiguration` object provided when creating
 * the state machine
 */
export const useInputsConfiguration = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerInputs(service), controls.config)
}

/**
 * Axis settings object
 * @dev returns the current `AxisSettings` object provided when creating the
 * state machine
 */
export const useAxisConfigurations = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerState(service), state.settings)
}
