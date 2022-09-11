import React from 'react'
import { useSelector } from '@xstate/react'
import {
  ActionIcon,
  Button,
  Group,
  Stack,
} from '@mantine/core'
// import service, { playerService } from "./state";
import { playerService } from '../state'
import { useControlsModal } from '../hooks/use-controls-modal'
import { DeviceGamepad2, Keyboard, Mouse, TableAlias } from 'tabler-icons-react'
import { TControllerType } from '../machines/configuration/configuration.types'

export const Toolbar: React.FC = () => {
  const inputs = useSelector(playerService, ({ context }) => context.inputs)
  const active = useSelector(inputs, (state) => state.matches('active'))
  const controllers = useSelector(inputs, ({ context }) => context.controllers)

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
