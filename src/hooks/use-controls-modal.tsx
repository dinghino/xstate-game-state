import { openModal } from '@mantine/modals'
import { useCallback } from 'react'

import { ConfigTable } from '../components/ConfigTable'
import { useInputsConfiguration } from '../machines/hooks'

import { playerService } from '../state'

const _options = { pause: true, resume: true }

export const useControlsModal = (options = _options) => {
  const opts = { ...options, _options }

  const config = useInputsConfiguration(playerService)

  const pauseFn = useCallback(() => playerService.send('INPUTS_STOP'), [opts.pause])
  const startFn = useCallback(() => opts.resume && playerService.send('INPUTS_START'), [opts.resume])

  return () => {
    if (opts.pause) pauseFn()

    openModal({
      onClose: startFn,
      size: 'xl',
      trapFocus: false,
      children: <ConfigTable config={config} />,
      withCloseButton: false,
      centered: true
    })
  }
}
