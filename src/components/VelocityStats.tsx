import { Stack, Group,Divider, DefaultMantineColor} from '@mantine/core'
import { playerService } from '../state'
import { useAxisConfigurations, usePlayerVelocity } from '../machines/hooks'
import { StatBadge } from './StatBadge'
import { SpeedIndicator } from './SpeedIndicator'

interface IItem<
  T extends string,
  V = Record<T, number>,
  S = Record<T, {max: number}>
> {
  axis: T,
  velocity: V,
  settings: S,
  label: string,
  color: DefaultMantineColor,
  reverse?: boolean
}

const Item = <T extends string>({axis, reverse, velocity, settings,...props}: IItem<T>) => {
  const barValues = (axis: T) => ({value: velocity[axis], max: settings[axis].max })
  return (
    <Group grow position="center" spacing="xs">
      <StatBadge value={velocity[axis]} {...props} reverse={reverse}/>
      <Group grow spacing={0}>
        <SpeedIndicator {...barValues(axis)} reverse={reverse} />
      </Group>
    </Group>
  )
}


export const VelocityStats = () => {
  const velocity = usePlayerVelocity(playerService)
  const settings = useAxisConfigurations(playerService)

  return (
    <>
      <Stack>
        <Divider label="Position" labelPosition="center"/>

        <Item settings={settings} velocity={velocity} axis="left" label="X" color="red"/>
        <Item settings={settings} velocity={velocity} axis="up" label="Y" color="green"/>
        <Item settings={settings} velocity={velocity} axis="forward" label="Z" color="blue" reverse />

        <Divider label="Rotation" labelPosition="center"/>

        <Item settings={settings} velocity={velocity} axis="pitch" label="X" color="red" />
        <Item settings={settings} velocity={velocity} axis="yaw" label="Y" color="green" reverse />
        <Item settings={settings} velocity={velocity} axis="roll" label="Z" color="blue" reverse />
      </Stack>
    </>
  )
}
