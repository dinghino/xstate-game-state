import React from 'react'
import { ActionIcon, Button, Group, Stack } from '@mantine/core'
import { DeviceGamepad2, Keyboard, Mouse, TableAlias } from 'tabler-icons-react'

import type { TControllerType } from '../machines/configuration/configuration.types'

import { useControlsModal } from '../hooks/use-controls-modal'
import { useControllersStatus, useInputsActive } from '../machines/hooks'
import { playerService } from '../state'

export const Toolbar: React.FC = () => {

  const active = useInputsActive(playerService)
  const controllers = useControllersStatus(playerService)

  /** TODO: refactor the controls modal with mantine ContextModal API so we can call them `by name` */
  const showControlsModal = useControlsModal()

  const toggleService = React.useCallback(() => {
    playerService.send(active ? 'INPUTS_STOP' : 'INPUTS_START')
  }, [active])

  const toggleController = React.useCallback((controller: TControllerType) => {
    playerService.send({ type: 'INPUTS_TOGGLE', controller, value: !controllers[controller]})
  }, [controllers])
  const activeColor = (v?: boolean) => v ? 'green' : 'red'

  return (
    <Stack>
      <Button uppercase leftIcon={<DeviceGamepad2 size={18}/>} onClick={toggleService} color={activeColor(active)}>
        {active ? 'Running' : 'Stopped'}
      </Button>
      <Group position="center" grow>
        <ActionIcon
          disabled={!active}
          size="lg" variant="filled"
          onClick={() => toggleController('keyboard')}
          color={activeColor(controllers.keyboard)}
          >
          <Keyboard />
        </ActionIcon>
        <ActionIcon
          disabled={!active}
          size="lg" variant="filled"
          onClick={() => toggleController('mouse')}
          color={activeColor(controllers.mouse)}>
          <Mouse />
        </ActionIcon>
        <ActionIcon variant="filled" size="lg" onClick={showControlsModal}>
        <TableAlias/>
      </ActionIcon>
      </Group>
    </Stack>
  )
}
