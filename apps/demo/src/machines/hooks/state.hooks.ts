import { useSelector } from '@xstate/react'

import * as state from '../ShipState/shipState.selectors'

import { TPlayerService } from '../LocalPlayer'
import { usePlayerState } from './internals.hooks'


/**
 * Returns current parsed input values
 * @dev this access the `state` statemachine context.transform 
 */
export const usePlayerTransform = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerState(service), state.transform)
}

/**
 * Returns the current delta to apply to the transform
 * @dev this access the `state` statemachine context.velocity (axis deltas)
 */
export const usePlayerVelocity = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerState(service), state.velocity)
}

/**
 * Returns the current delta to apply to the transform
 * @dev this access the `state` statemachine context.actions (actions state)
 */
export const usePlayerActions = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerState(service), state.actions)
}
