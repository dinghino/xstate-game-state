
import { TControllerType } from '../configuration/configuration.types'
import type { TPlayerService, UPDATE_STATE } from '../LocalPlayer'

type Target = 'player'|'controls'

/** Toggle the whole player controller service, the controls service or an individual inputs manager on or off depending on the `action` value */
export function toggle<A extends string, B extends string>(service: TPlayerService<A,B>, toggled: boolean, target?: Target, controller?: TControllerType) {
  const OPT = toggled ? 'START' : 'STOP'
  if (!target || target === 'player') return service.send(OPT)
  if (target === 'controls' && controller) {
    return service.send({type: `INPUTS_${OPT}_CONTROLLER`, controller, value: toggled })
  }
  return service.send({ type: `INPUTS_${OPT}` })
}

/** Starts the player controller service, controls service or an invidual inputs manager */
export function start<A extends string, B extends string>(service: TPlayerService<A,B>, target?: Target, controller?: TControllerType) {
  return toggle(service, true, target, controller)
}
/** Stops the player controller service, controls service or an invidual inputs manager */
export function pause<A extends string, B extends string>(service: TPlayerService<A,B>, target?: Target, controller?: TControllerType) {
  return toggle(service, false, target, controller)
}

// Update actions

export function update<A extends string, B extends string>(service: TPlayerService<A,B>) {
  service.send('UPDATE')
}
export function updateState<A extends string, B extends string>(service: TPlayerService<A,B>, options: Omit<UPDATE_STATE, 'type'>) {
  service.send({type: 'UPDATE_STATE', ...options })
}
export function resetState<A extends string, B extends string>(service: TPlayerService<A,B>) {
  service.send({type: 'RESET_STATE' })
}
