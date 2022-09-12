// import { InputsConfiguration } from '../configuration/InputsConfiguration'
import type { TControlsService } from './controls.machine'

type ControlsState<A extends string, B extends string,> = TControlsService<A, B>['state']

export const config = <A extends string, B extends string>({context}: ControlsState<A,B>) => context.config
export const controllers = <A extends string, B extends string>({context}: ControlsState<A,B>) => context.controllers
export const inputs = <A extends string, B extends string>({context}: ControlsState<A,B>) => context.values

