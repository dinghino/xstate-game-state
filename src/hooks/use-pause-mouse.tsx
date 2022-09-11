import { useEffect, useMemo, useState } from 'react'

import { useWindowEvent } from '@mantine/hooks'
import { playerService } from '../state'

export const usePauseMouse = (keyCode: string) => {

  const [paused, setPause] = useState(false)
  useWindowEvent('keydown', e => {
    if (e.code === keyCode) {
      e.preventDefault()
      setPause(p => !p)
    }
  })

  useEffect(() => {
    playerService.send({ type: 'INPUTS_TOGGLE', controller: 'mouse', value: !paused })
  }, [paused])
  
  return useMemo(() => paused, [paused])
}
