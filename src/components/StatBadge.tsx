import React, { useMemo } from 'react'
import { Badge , BadgeProps, DefaultMantineColor } from '@mantine/core'

type IStatBadge = BadgeProps & {
  label?: React.ReactNode,
  value: number,
  reverse?:boolean,
  color?: DefaultMantineColor
}

export const StatBadge:React.FC<IStatBadge> = ({value, label, reverse, color, ...props}) => {
  const actual = useMemo(() => value * 100 * (reverse ? -1 : 1), [value, reverse])
  return (
    <Badge color={color} variant="dot" radius="sm" size="lg" leftSection={label} {...props}>
      {actual.toFixed(2).padStart(6, '0')}
    </Badge>
  )
}
