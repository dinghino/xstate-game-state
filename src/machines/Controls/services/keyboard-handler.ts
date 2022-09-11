import { Receiver, Sender } from 'xstate'
import { InputsConfiguration } from '../../configuration/InputsConfiguration'
import { forEachInputConfiguration, isEventType } from '../../functions'
import { ControlsContext, ControlsEvent } from '../controls.types'

// export function makeInputCallbackService<
//   C extends InputsConfiguration<Ax, Ac>,
//   Ax extends string,
//   Ac extends string
// >(): InvokeCreator<ControlsContext<C, Ax, Ac>, ControlsEvent<C, Ax, Ac>> {
//   return (ctx, evt) => (send, receive) => {}
// }

export const keyboardHandlerService = <
  C extends InputsConfiguration<Axis, Actions>,
  Axis extends string,
  Actions extends string
>(
  ctx: ControlsContext<C, Axis, Actions>
) => (
  callback: Sender<ControlsEvent<C, Axis, Actions>>,
  onReceive: Receiver<ControlsEvent<C, Axis, Actions>>
) => {
  if (!ctx.controllers.keyboard) return
  const { config } = ctx
  let isRunning = false

  const handleKeyboardEvents = (e: KeyboardEvent) => {
    forEachInputConfiguration<Axis, Actions>(config, (axis, input) => {
      const { inputs, controller } = input
      if (controller !== 'keyboard' || !inputs.includes(e.code)) return
      // TODO: check if this is needed with the "new" system
      const scale = 'scale' in input ? input.scale : 1
      const mode = 'mode' in input ? input.mode : 'digital'

      callback({
        axis: axis as Axis,
        type: 'INPUT_RECEIVED',
        source: input.controller,
        activator: e.code,
        value: scale * (e.type === 'keydown' ? 1 : -1),
        mode: mode,
        _type: input.type
      })
    })
  }

  const startService = () => {
    if (isRunning) return
    // console.info('🎮 ✔️ starting keyboard handler')
    callback({
      type: 'CONTROLLER_STATUS_CHANGED',
      controller: 'keyboard',
      status: true
    })
    window!.addEventListener('keydown', handleKeyboardEvents)
    window!.addEventListener('keyup', handleKeyboardEvents)
    isRunning = true
  }

  const stopService = () => {
    if (!isRunning) return
    // console.info('🎮 🔴 stopping keyboard handler')
    callback({
      type: 'CONTROLLER_STATUS_CHANGED',
      controller: 'keyboard',
      status: false
    })
    window!.removeEventListener('keydown', handleKeyboardEvents)
    window!.removeEventListener('keyup', handleKeyboardEvents)
    isRunning = false
  }

  onReceive(event => {
    if (!isEventType(event, 'TOGGLE_CONTROLLER')) return
    if (event.controller !== 'keyboard') return
    if (event.value) return startService()
    return stopService()
  })

  startService()
  return () => {
    stopService()
  }
}
