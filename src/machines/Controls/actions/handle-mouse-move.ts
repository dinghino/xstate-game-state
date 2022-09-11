import type { ControlsContext, ControlsEvent } from '../controls.types'

import { isEventType } from '../../functions'
import { InputsConfiguration } from '../../configuration/InputsConfiguration'

export const mouseMoveHandler = <
  C extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
>(
  ctx: ControlsContext<C, Axis, Actions>,
  event: ControlsEvent<C, Axis, Actions>
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

export function handleMouseMove<
  C extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
>() {
  return (
    ctx: ControlsContext<C, Axis, Actions>,
    event: ControlsEvent<C, Axis, Actions>
  ) => mouseMoveHandler<C, Axis, Actions>(ctx, event)
}
