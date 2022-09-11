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

  const showControlsModal = useControlsModal(inputs as any)

  const toggleService = React.useCallback(() => {
    inputs.send(active ? 'STOP' : 'START')
  }, [inputs.send, active])

  const toggleController = React.useCallback((controller: TControllerType) => {
    inputs.send({ type: 'TOGGLE_CONTROLLER', controller, value: !controllers[controller]})
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
