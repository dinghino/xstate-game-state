
import { TControllerType } from '../configuration/configuration.types'
import { TPlayerService } from '../LocalPlayer'

type Target = 'player'|'controls'
type _ActionType = 'START' | 'STOP'

export function toggle<A extends string, B extends string>(service: TPlayerService<A,B>, action: _ActionType, target?: Target, controller?: TControllerType) {
  if (!target || target === 'player') return service.send(action)
  if (target === 'controls' && controller) {
    return service.send({type: `INPUTS_${action}_CONTROLLER`, controller })
  }
  return service.send({ type: `INPUTS_${action}` })
}

export function start<A extends string, B extends string>(service: TPlayerService<A,B>, target?: Target, controller?: TControllerType) {
  return toggle(service, 'START', target, controller)
}
export function pause<A extends string, B extends string>(service: TPlayerService<A,B>, target?: Target, controller?: TControllerType) {
  return toggle(service, 'STOP', target, controller)
}
