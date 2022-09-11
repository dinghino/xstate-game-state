import type { TStateService } from './shipState.machine'

type TState<A extends string, B extends string> = TStateService<A,B>['state']

export const state = <A extends string, B extends string>({context}: TState<A,B>) => context.transform
export const settings = <A extends string, B extends string>({context}: TState<A,B>) => context.settings
export const velocity = <A extends string, B extends string>({context}: TState<A,B>) => context.velocity
export const actions = <A extends string, B extends string>({context}: TState<A,B>) => context.actions
export const transform = <A extends string, B extends string>({context}: TState<A,B>) => context.transform



