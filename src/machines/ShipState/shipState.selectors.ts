import { TState } from '../types'
import type { createShipStateMachine } from './shipState.machine'

type PlayerState = TState<typeof createShipStateMachine>

export const state = ({context}: PlayerState) => context.transform
export const settings = ({context}: PlayerState) => context.settings
export const velocity = ({context}: PlayerState) => context.velocity
export const actions = ({context}: PlayerState) => context.actions
export const transform = ({context}: PlayerState) => context.transform



