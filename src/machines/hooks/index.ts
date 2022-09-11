/**
 * Series of hooks to be used with the global state to retrieve a series of
 * informations from the whole machine structure
 */

import { useSelector } from '@xstate/react'

import type { TService } from '../types'

import * as state from '../ShipState/shipState.selectors'
import * as controls from '../Controls/controls.selectors'
import * as player from '../LocalPlayer/localPlayer.selectors'
import { createLocalPlayerMachine } from '../LocalPlayer/localPlayer.machine'
import { InterpreterFrom, StateMachine } from 'xstate'
import { LocalPlayerContext, LocalPlayerEvent } from '../LocalPlayer/localPlayer.types'

// type PlayerService<_A,_B> = any;
type PlayerService = TService<typeof createLocalPlayerMachine>
// type PlayerService = InterpreterFrom<StateMachine<LocalPlayerContext<string, string, any>, any, LocalPlayerEvent>>

// sub machine accessors ------------------------------------------------------

/** Gives access to the controls machine */
export const usePlayerInputs = (service: PlayerService) => {
  return useSelector(service, player.controls)
}
/** Gives access to the player internal state machine */
export const usePlayerState = (service: PlayerService) => {
  return useSelector(service, player.state)
}

// configurations getters -----------------------------------------------------

/** Returns the inputs configuration provided when creating the machine */
export const useInputsConfiguration = (service: PlayerService) => {
  return useSelector(usePlayerInputs(service), controls.config)
}

/** Returns the inputs configuration provided when creating the machine */
export const useAxisConfigurations = (service: PlayerService) => {
  return useSelector(usePlayerState(service), state.settings)
}

// state values getters -------------------------------------------------------

/** Returns current parsed input values */
export const usePlayerTransform = (service: PlayerService) => {
  return useSelector(usePlayerState(service), state.transform)
}

/** Returns current parsed input values */
export const usePlayerInputValues = (service: PlayerService) => {
  return useSelector(usePlayerInputs(service), controls.inputs)
}

/** Returns the current delta to apply to the transform */
export const usePlayerVelocity = (service: PlayerService) => {
  return useSelector(usePlayerState(service), state.velocity)
}

/** Returns the current delta to apply to the transform */
export const usePlayerActions = (service: PlayerService) => {
  return useSelector(usePlayerState(service), state.actions)
}
// states getters -------------------------------------------------------------

/** Returns the current delta to apply to the transform */
export const useControllersStatus = (service: PlayerService) => {
  return useSelector(usePlayerInputs(service), controls.controllers)
}
