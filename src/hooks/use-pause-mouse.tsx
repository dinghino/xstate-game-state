import { useEffect, useMemo, useState } from 'react'
import { useSelector } from '@xstate/react'

import { useWindowEvent } from '@mantine/hooks'
import { playerService } from '../state'

export const usePauseMouse = (keyCode: string) => {
  const inputs = useSelector(playerService, ({ context }) => context.inputs)
  const [paused, setPause] = useState(false)
  useWindowEvent('keydown', e => {
    if (e.code === keyCode) {
      e.preventDefault()
      setPause(p => !p)
    }
  })
  useEffect(() => {
    inputs.send({type: 'TOGGLE_CONTROLLER', controller: 'mouse', value: !paused })
  }, [paused])
  
  return useMemo(() => paused, [paused])
}
