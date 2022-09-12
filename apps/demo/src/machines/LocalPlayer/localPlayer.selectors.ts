import type { TPlayerService } from './localPlayer.machine'

type TPlayerState <A extends string, B extends string> = TPlayerService<A, B>['state']

export const state = <A extends string, B extends string>({context}: TPlayerState<A,B>) => context.values
export const controls = <A extends string, B extends string>({context}: TPlayerState<A,B>) => context.inputs
