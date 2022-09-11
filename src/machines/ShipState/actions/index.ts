import { objKeys } from '../../../utils'
import { clamp, isEventType, isNearly } from '../../functions'
import type {
  ShipStateContext,
  ShipStateEvent,
  StateAxisSettings,
  InertialStateAxisSettings
} from '../shipState.types'

function isInertial(setting: StateAxisSettings): setting is InertialStateAxisSettings {
  return setting.inertial === true
}

function computeBreaks(current: number, acceleration: number, breaking: boolean|undefined):number {
  if (!breaking) return 0
  if (isNearly(current, 0, acceleration)) return -current
  return (current > 0 ? -acceleration : acceleration) * (3/2)

}

function computeSpeed(curr: number, acc: number, input: number, inertial?:boolean): number {
  if (inertial) return curr + acc * input
  return acc * input
}

export function updateVelocities<Axis extends string, Actions extends string>(
  ctx: ShipStateContext<Axis, Actions>,
  event: ShipStateEvent<Axis, Actions>,
  breaking?: boolean
): { velocity: Record<Axis, number> } | {} {
  if (!isEventType(event, 'UPDATE')) return {}

  const { velocity, settings } = ctx
  const out = {} as Record<Axis, number>

  for (let axis of objKeys(velocity)) {
    const current = velocity[axis]
    const config = settings[axis]
    const { max, acceleration, inertial } = config

    const input = event.values[axis]

    let value =
      computeSpeed(current, acceleration, input, inertial) +
      computeBreaks(current, acceleration, breaking)

    if (isInertial(config) && config.reset) {
      const noInput = isNearly(input, 0, 0.05)
      const isMoving = !isNearly(value, 0, 0.0005)
      const shouldReset = noInput && isMoving
      value += (shouldReset ? computeBreaks(current, acceleration / 2, true) : 0)
    }

    out[axis] = clamp(value, -max, max)
  }
  // console.info("updating ship state with", out);
  return { velocity: out }
}
