import type { ControlsContext, ControlsEvent } from '../controls.types'
import { isEventType } from '../../functions'

export const mouseMoveHandler = <Axis extends string, Actions extends string>(
  ctx: ControlsContext<Axis, Actions>,
  event: ControlsEvent<Axis, Actions>
) => {
  if (!isEventType(event, 'MOUSE_MOVED')) return {}
  let values = { ...ctx.values }
  const { config } = ctx
  const xAxis = config.keybindings['mouse.x']
  const yAxis = config.keybindings['mouse.y']

  if (xAxis in values) {
    values[xAxis] = event.value.x
  }
  if (yAxis in values) {
    values[yAxis] = event.value.y
  }
  return { values }
}

export function handleMouseMove<Axis extends string,Actions extends string>() {
  return (
    ctx: ControlsContext<Axis, Actions>,
    event: ControlsEvent<Axis, Actions>
  ) => mouseMoveHandler<Axis, Actions>(ctx, event)
}
