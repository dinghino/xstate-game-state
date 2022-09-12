import { useMemo } from 'react'

import type { TPlayerService } from '../LocalPlayer'
import * as ACTIONS from '../actions/actions.functions'
import { createActions } from '../actions'

/** hackety-hack to get typed module */
type Module = typeof import('../actions/actions.functions')
type Keys = keyof Module
type Actions = Readonly<{[key in Keys]: Module[key]}>

const actions: Actions = ACTIONS

/**
 * Returns usable actions that sends events to the provided service, using all
 * the `actions` exported from the `machines/actions` module.
 */
export const useStateActions = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  /** @dev this creates a copy every time we  */
  return useMemo(() => createActions(service, actions), [service])
}
