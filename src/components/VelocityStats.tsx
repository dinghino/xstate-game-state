import React, { useMemo } from 'react'
import { useSelector } from '@xstate/react'
import { Stack, Badge, Group,Divider, DefaultMantineColor, Progress, ProgressProps, Indicator, BadgeProps } from '@mantine/core'
import { playerService } from '../state'
import { isNearly } from '../machines/functions'

function evalPercent(current: number, max: number, reverse = false) {
  return ((current / max) * 100 * (reverse ? -1 : 1)).toFixed(2)
}

type IStatBadge = BadgeProps & {
  label?: React.ReactNode,
  value: number,
  reverse?:boolean,
  color?: DefaultMantineColor
}

interface ISpeedBar {
  value: number;
  max: number;
  colors?: {pos: DefaultMantineColor, neg: DefaultMantineColor}
  reverse?:boolean
}

const StatBadge:React.FC<IStatBadge> = ({value, label, reverse, color, ...props}) => {
  const actual = useMemo(() => value * 100 * (reverse ? -1 : 1), [value, reverse])
  return (
    <Badge color={color} variant="dot" radius="sm" size="lg" leftSection={label} {...props}>
      {actual.toFixed(2).padStart(6, '0')}
    </Badge>
  )
}

const SpeedBar: React.FC<ISpeedBar & ProgressProps> = ({value, max, reverse, colors = {pos:'teal', neg: 'orange'}, ...props}) => {
  const v = value * (reverse ? -1 : 1)
  // const barValue = Math.abs(+evalPercent(value+max * (reverse ? -1 : 1), max*2));
  const barValueP = +evalPercent(v, max)
  const barValueN = v < 0 ? Math.abs(barValueP) : 0
  const color = v > 0 ? 'cyan' : v > 50 ? colors.pos : colors.neg
  const indicatorStyles = {
    indicator: {width: 6, marginLeft: -1, transition: 'background-color 0.5s ease-out'}
  }
  return (
    <>
    <Progress radius={'sm'} color={color} size="lg" {...props} value={barValueN} style={{transform: 'rotate(180deg)', marginRight: -2}}/>
    <Indicator position="middle-center" radius="xs" color={isNearly(value, 0, 0.05) ? 'green': color} size={16} styles={indicatorStyles}>{null}</Indicator>
    <Progress radius={'sm'} color={color} size="lg" {...props} value={barValueP} style={{marginLeft: -2}}/>
    </>
  )
}

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
        <SpeedBar {...barValues(axis)} reverse={reverse} />
      </Group>
    </Group>
  )
}


export const VelocityStats = () => {
  const playerState = useSelector(playerService, ({ context }) => context.values)
  const velocity = useSelector(playerState, ({ context }) => context.velocity)
  const settings = useSelector(playerState, ({ context }) => context.settings)

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
