/**
 * Series of hooks to be used with the global state to retrieve a series of
 * informations from the whole machine structure
 */

import { useSelector } from '@xstate/react'

import * as state from '../ShipState/shipState.selectors'
import * as controls from '../Controls/controls.selectors'
import * as player from '../LocalPlayer/localPlayer.selectors'
import { TPlayerService } from '../LocalPlayer'

// sub machine accessors ------------------------------------------------------

/** Gives access to the controls machine */
export const usePlayerInputs = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(service, player.controls)
}
/** Gives access to the player internal state machine */
export const usePlayerState = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(service, player.state)
}

// configurations getters -----------------------------------------------------

/** Returns the inputs configuration provided when creating the machine */
export const useInputsConfiguration = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerInputs(service), controls.config)
}

/** Returns the inputs configuration provided when creating the machine */
export const useAxisConfigurations = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerState(service), state.settings)
}

// state values getters -------------------------------------------------------

/** Returns current parsed input values */
export const usePlayerTransform = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerState(service), state.transform)
}

/** Returns current parsed input values */
export const usePlayerInputValues = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerInputs(service), controls.inputs)
}

/** Returns the current delta to apply to the transform */
export const usePlayerVelocity = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerState(service), state.velocity)
}

/** Returns the current delta to apply to the transform */
export const usePlayerActions = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerState(service), state.actions)
}
// states getters -------------------------------------------------------------

/** Returns the current delta to apply to the transform */
export const useControllersStatus = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerInputs(service), controls.controllers)
}

export const useInputsActive= <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  return useSelector(usePlayerInputs(service), state => state.matches('active'))
}
