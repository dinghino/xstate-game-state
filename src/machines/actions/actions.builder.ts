/**
 * File exports a single function that returns an object containing all the actions
 * contained in the module wrapped in a closure that provides the service automatically
 * and removes it from the parameters of the action itself.
 *
 * see the `usePlayerActions` hook (`machines/hooks/actions.hooks`) for an example
 */

import { objEntries } from '../../utils'
import type { TActionClosure, TActionFunction, TAnyAction } from './actions.types'
import { AnyInterpreter } from 'xstate'

export const wrap = <F extends TAnyAction, AF extends TActionFunction<S,F>, S extends AnyInterpreter>(s: S, f: AF) => ((...args) => f(s, ...args)) as TActionClosure<AF>

export function createActions<
  N extends string, 
  Am extends Record<N, TActionFunction<S, F>>, 
  F extends TAnyAction, 
  S extends AnyInterpreter
>(service: S, actions: Am) {
  const entries = objEntries(actions)
  return entries.reduce((p, [name, action]) => ({
    ...p,
    [name]: wrap(service, action)
  }), {}) as { [key in keyof Am]: TActionClosure<Am[key]> }
}
