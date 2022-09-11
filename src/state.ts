// import { createControlsMachine } from './machines/Controls'
import { createLocalPlayerMachine } from './machines/LocalPlayer'
import { inputs, AXIS, ACTIONS, axisSettings } from './config'
import { interpret } from 'xstate'

const localPlayerMachine = createLocalPlayerMachine( AXIS, ACTIONS, inputs, axisSettings)

export const playerService = interpret(localPlayerMachine).start()

export default playerService
