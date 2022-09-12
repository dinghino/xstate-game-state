import React from 'react'
import { DefaultMantineColor, ProgressProps, Progress, Indicator } from '@mantine/core'
import { isNearly } from '../machines/functions'

interface ISpeedBar {
  value: number;
  max: number;
  colors?: {pos: DefaultMantineColor, neg: DefaultMantineColor}
  reverse?:boolean
}
function evalPercent(current: number, max: number, reverse = false) {
  return ((current / max) * 100 * (reverse ? -1 : 1)).toFixed(2)
}

export const SpeedIndicator: React.FC<ISpeedBar & ProgressProps> = ({value, max, reverse, colors = {pos:'teal', neg: 'orange'}, ...props}) => {
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
