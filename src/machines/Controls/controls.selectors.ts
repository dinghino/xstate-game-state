import { TState } from '../types'
import type { createControlsMachine } from './controls.machine'

type ControlsState = TState<typeof createControlsMachine>

export const getConfig = ({context}: ControlsState) => context.config
export const getControllers = ({context}: ControlsState) => context.controllers
export const inputs = ({context}: ControlsState) => context.values

