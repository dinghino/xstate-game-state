import { Receiver, Sender } from 'xstate'
import { InputsConfiguration } from '../../configuration/InputsConfiguration'
import { centerNormalize, isEventType, isNearly } from '../../functions'
import { ControlsContext, ControlsEvent } from '../controls.types'

export const mouseHandlerService = <
  Config extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
>(
  ctx: ControlsContext<Config, Axis, Actions>
) => (
  callback: Sender<ControlsEvent<Config, Axis, Actions>>,
  onReceive: Receiver<ControlsEvent<Config, Axis, Actions>>
) => {
  if (!ctx.controllers.mouse) return
  if (!ctx.mouseAxis!.x && !ctx.mouseAxis!.y) return

  // mouse move callback
  const handleMouseMove = (mouse: MouseEvent) => {
    const { innerWidth, innerHeight } = window
    if (!ctx.mouseAxis!.x && !ctx.mouseAxis!.y) return
    const xConf = ctx.mouseAxis.x
    const yConf = ctx.mouseAxis.y

    let x = xConf
      ? centerNormalize(mouse.x, 0, innerWidth) * (xConf.scale ?? 1)
      : 0
    let y = yConf
      ? centerNormalize(mouse.y, 0, innerHeight) * (yConf.scale ?? 1)
      : 0

    // apply deadzone lock
    if (x && xConf?.deadzone) {
      x = isNearly(x, 0, xConf.deadzone) ? 0 : x
    }
    if (y && yConf?.deadzone) {
      y = isNearly(y, 0, yConf.deadzone) ? 0 : y
    }

    callback({
      type: 'MOUSE_MOVED',
      value: { x, y }
    })
  }
  const startService = () => {
    // notify listener service start and hook up events
    // console.info('🎮 ✔️ starting mouse handler')
    callback({
      type: 'CONTROLLER_STATUS_CHANGED',
      controller: 'mouse',
      status: true
    })
    window!.addEventListener('mousemove', handleMouseMove)
  }

  const stopService = () => {
    // console.info('🎮 🔴 stopping mouse handler')
    callback({
      type: 'CONTROLLER_STATUS_CHANGED',
      controller: 'mouse',
      status: false
    })
    window!.removeEventListener('mousemove', handleMouseMove)
  }

  onReceive(event => {
    if (!isEventType(event, 'TOGGLE_CONTROLLER')) return
    if (event.controller !== 'mouse') return
    if (event.value) return startService()
    return stopService()
  })

  startService()
  return () => {
    stopService()
  }
}
