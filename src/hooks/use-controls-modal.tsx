import { openModal } from '@mantine/modals'
import { useSelector } from '@xstate/react'
import { useCallback } from 'react'

import { ConfigTable } from '../components/ConfigTable'
import { InputsConfiguration } from '../machines/configuration/InputsConfiguration'

import { playerService } from '../state'

const _options = { pause: true, resume: true }

export const useControlsModal = (options = _options) => {
  const opts = { ...options, _options }
  /**
   * TODO: this is ugly. we're going to set up selector hooks, but this needs to be fixed.
   * main issue is the State type that goes in
   */
  const config = useSelector(playerService, ({ context }) =>
    context.inputs.getSnapshot().context.config
  ) as InputsConfiguration<string, string>

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
