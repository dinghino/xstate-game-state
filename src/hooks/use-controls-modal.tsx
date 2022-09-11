import { openModal } from '@mantine/modals'
import { useSelector } from '@xstate/react'

import { ConfigTable } from '../components/ConfigTable'

import type { ControlsService } from '../machines/types'
const _options = { pause: true, resume: true }
export const useControlsModal = (
  service: ControlsService,
  options = _options
) => {
  const opts = { ...options, _options }
  const config = useSelector(service, ({ context }) => context.config)
  return () => {
    if (opts.pause) service.send('STOP')
    openModal({
      onClose: () => opts.resume && service.send('START'),
      size: 'xl',
      trapFocus: false,
      children: <ConfigTable config={config} />,
      withCloseButton: false,
      centered: true
    })
  }
}
