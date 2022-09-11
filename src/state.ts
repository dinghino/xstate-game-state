import { createControlsMachine } from './machines/Controls'
import { createLocalPlayerMachine } from './machines/LocalPlayer'
import { inputs, AXIS, ACTIONS, shipConfig } from './config'
import { interpret } from 'xstate'

export const inputsMachine = createControlsMachine(AXIS, ACTIONS, inputs)

export const service = interpret(inputsMachine).start()

export default service

const localPlayerMachine = createLocalPlayerMachine(
  AXIS,
  ACTIONS,
  inputs,
  shipConfig.settings
)

export const playerService = interpret(localPlayerMachine)
  // .onEvent((e) => console.info("player service", e))
  .start()
// s.send("START");
// console.info(s);

// (window as any).s = s;
