
import { TControllerType } from '../configuration/configuration.types'
import type { RESET_STATE, TPlayerService, UPDATE_STATE } from '../LocalPlayer'

type Target = 'player'|'controls'
type _ActionType = 'START' | 'STOP'

/** Toggle the whole player controller service, the controls service or an individual inputs manager on or off depending on the `action` value */
export function toggle<A extends string, B extends string>(service: TPlayerService<A,B>, action: _ActionType, target?: Target, controller?: TControllerType) {
  if (!target || target === 'player') return service.send(action)
  if (target === 'controls' && controller) {
    return service.send({type: `INPUTS_${action}_CONTROLLER`, controller })
  }
  return service.send({ type: `INPUTS_${action}` })
}

/** Starts the player controller service, controls service or an invidual inputs manager */
export function start<A extends string, B extends string>(service: TPlayerService<A,B>, target?: Target, controller?: TControllerType) {
  return toggle(service, 'START', target, controller)
}
/** Stops the player controller service, controls service or an invidual inputs manager */
export function pause<A extends string, B extends string>(service: TPlayerService<A,B>, target?: Target, controller?: TControllerType) {
  return toggle(service, 'STOP', target, controller)
}

// Update actions

export function update<A extends string, B extends string>(service: TPlayerService<A,B>) {
  service.send('UPDATE')
}
export function updateState<A extends string, B extends string>(service: TPlayerService<A,B>, options: Omit<UPDATE_STATE, 'type'>) {
  service.send({type: 'UPDATE_STATE', ...options })
}
export function resetState<A extends string, B extends string>(service: TPlayerService<A,B>, options: Omit<RESET_STATE, 'type'> = {}) {
  service.send({type: 'RESET_STATE', ...options })
}
