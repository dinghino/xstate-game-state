import { Receiver, Sender } from 'xstate'
import { centerNormalize, isEventType, isNearly } from '../../functions'
import { ControlsContext, ControlsEvent } from '../controls.types'

export const mouseHandlerService = <
  Axis extends string,
  Actions extends string
>(
  ctx: ControlsContext<Axis, Actions>
) => (
  callback: Sender<ControlsEvent<Axis, Actions>>,
  onReceive: Receiver<ControlsEvent<Axis, Actions>>
) => {
  if (!ctx.controllers.mouse) return
  if (!ctx.mouseAxis!.x && !ctx.mouseAxis!.y) return
  let isRunning = false

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
    if (isRunning) return

    // notify listener service start and hook up events
    // console.info('🎮 ✔️ starting mouse handler')
    callback({
      type: 'CONTROLLER_STATUS_CHANGED',
      controller: 'mouse',
      status: true
    })
    window!.addEventListener('mousemove', handleMouseMove)
    isRunning = true
  }

  const stopService = () => {
    if (!isRunning) return

    // console.info('🎮 🔴 stopping mouse handler')
    callback({
      type: 'CONTROLLER_STATUS_CHANGED',
      controller: 'mouse',
      status: false
    })
    window!.removeEventListener('mousemove', handleMouseMove)
    isRunning = false
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
