import { TState } from '../types'
import type { createControlsMachine } from './controls.machine'

type ControlsState = TState<typeof createControlsMachine>

export const config = ({context}: ControlsState) => context.config
export const controllers = ({context}: ControlsState) => context.controllers
export const inputs = ({context}: ControlsState) => context.values

