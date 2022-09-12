import { useEffect, useMemo, useState } from 'react'

import { useWindowEvent } from '@mantine/hooks'
import { playerService } from '../state'
import { useStateActions } from '../machines/hooks'

export const usePauseMouse = (keyCode: string) => {
  const { toggle } = useStateActions(playerService)

  const [paused, setPause] = useState(false)
  useWindowEvent('keydown', e => {
    if (e.code === keyCode) {
      e.preventDefault()
      setPause(p => !p)
    }
  })

  useEffect(() => { toggle(paused, 'controls', 'mouse') }, [paused])
  
  return useMemo(() => paused, [paused])
}
