import { useMemo } from 'react'

import type { TPlayerService } from '../LocalPlayer'
import * as actions from '../actions/actions.functions'
import { createActions } from '../actions'

/**
 * Returns usable actions that sends events to the provided service, using all
 * the `actions` exported from the `machines/actions` module.
 */
export const useStateActions = <A extends string, B extends string>(service: TPlayerService<A,B>) => {
  /** @dev this creates a copy every time we  */
  return useMemo(() => createActions(service, actions), [service])
}
