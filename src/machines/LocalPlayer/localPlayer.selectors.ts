import { TState } from '../types'
import type { createLocalPlayerMachine } from './localPlayer.machine'

type PlayerControllerState = TState<typeof createLocalPlayerMachine>

export const state = ({context}: PlayerControllerState) => context.values
export const inputs = ({context}: PlayerControllerState) => context.inputs


