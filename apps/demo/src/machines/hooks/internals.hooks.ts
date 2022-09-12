
import { useSelector } from '@xstate/react'

import * as player from '../LocalPlayer/localPlayer.selectors'
import { TPlayerService } from '../LocalPlayer'


/**
 * Gives access to the controls machine
 * @dev access to the internal `controls` state machine, used to grab all the other
 * properties in the "generic" hooks
 * */
export const usePlayerInputs = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(service, player.controls)
}
/**
 * Gives access to the player internal state machine
 * @dev access to the internal `values` state machine, used to grab all the other
 * properties in the "generic" hooks
 */
export const usePlayerState = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(service, player.state)
}
