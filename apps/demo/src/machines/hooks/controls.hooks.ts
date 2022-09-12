import { useSelector } from '@xstate/react'

import * as controls from '../Controls/controls.selectors'
import { usePlayerInputs } from './internals.hooks'

import { TPlayerService } from '../LocalPlayer'

/**
 * Returns the current delta to apply to the transform
 * @dev this access the `controls` statemachine context.controllers { [controller]: boolean }
 */
export const useControllersStatus = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerInputs(service), controls.controllers)
}
/**
 * Returns true if the `controls` state machine is in `active` state
 * @dev this uses the `state.matches` of the `controls` state machine state (`active` state)
 */
export const useInputsActive= <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerInputs(service), state => state.matches('active'))
}

/**
 * Returns current parsed input values
 * @dev this access the `controls` statemachine context.inputs
 */
export const usePlayerInputValues = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerInputs(service), controls.inputs)
}
