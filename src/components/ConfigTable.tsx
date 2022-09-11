import React from 'react'
import { Icon, Keyboard, Mouse } from 'tabler-icons-react'
import { Center, createStyles, Kbd, Table, Text as Txt } from '@mantine/core'
import type {
  FinalizedInputs,
  InputMapping,
  TControllerType
} from '../machines/configuration/configuration.types'
import { objValues } from '../utils'
import { InputsConfiguration } from '../machines/configuration/InputsConfiguration'

const Icons: Record<TControllerType, Icon> = {
  keyboard: Keyboard,
  mouse: Mouse
  // gamepad: DeviceGamepad2
}

const getIcon = (control: TControllerType): Icon => Icons[control]
const splitCamelCase = (text: string): string[] => {
  return text.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ')
}

const cleanKeyValue = (text: string): string => {
  const s = splitCamelCase(text)
  return s[0] === 'Key' ? s[1] : s.join(' ')
}

const formatInputValue = (text: string, control: InputMapping): string => {
  let value = text
  if (control.controller === 'mouse') {
    const direction = text === 'y' ? 'forward / backward' : 'left / right'
    value = `${direction}`
  }
  return cleanKeyValue(value)
}

const getMaxInputsCount = (controls: FinalizedInputs<string, string>) => {
  let value = 0
  objValues(controls).forEach((control) => {
    control.forEach(({ inputs: { length } }) => {
      value = length > value ? length : value
    })
  })
  return value
}

const AxisControl: React.FC<{
  control: InputMapping;
  maxCount: number;
}> = ({ control, maxCount = 1 }) => {
  const { controller, inputs, name } = control
  const Logo = getIcon(controller)

  const length = React.useMemo(() => Array(maxCount).fill(null), [maxCount])
  const controls = React.useMemo(
    () =>
      length.map((_, i) => {
        const key = inputs[i]
        return key ? (
          <td key={key}>
            <Txt transform="uppercase" align="center" pr="xs">
              <Kbd>{formatInputValue(key, control)}</Kbd>
            </Txt>
          </td>
        ) : (
          // empty cells if needed
          <td key={i}>
            <span />
          </td>
        )
      }),
    [inputs, length, control]
  )

  return (
    <tr>
      <td>
        <Txt align="right" transform="uppercase">
          {name}
        </Txt>
      </td>
      <td>
        <Center>
          <Logo />
        </Center>
      </td>
      {controls}
    </tr>
  )
}

const AxisRow: React.FC<{
  axis: string;
  controls: InputMapping[];
  maxCount: number;
}> = ({ axis, controls, maxCount }) => {
  return (
    <>
      {controls.map((control) => {
        const key = `${axis}-${control.controller}-${control.inputs.join('_')}`
        return <AxisControl key={key} control={control} maxCount={maxCount} />
      })}
    </>
  )
}

const useStyles = createStyles((theme) => ({
  table: {
    thead: {
      borderBottom: `1px solid ${theme.colors.dark[5]}`
    },
    'tbody tr td:not(:last-of-type)': {
      borderRight: `1px solid ${theme.colors.dark[5]}`
    }
  }
}))

export const ConfigTable: React.FC<{ config: InputsConfiguration<string, string> }> = ({
  config
}) => {
  const { classes } = useStyles()
  // max number of inputs on any axis configured. value used to determine col span of table cells
  // when the count is less than the max, to properly render the table
  const maxCount = React.useMemo(() => getMaxInputsCount(config.getConfig()), [
    config
  ])
  return (
    <Table highlightOnHover className={classes.table}>
      <caption>
        <Txt transform="uppercase" color="dimmed">
          Input mappings
        </Txt>
        <Txt color="dimmed">These are your set inputs.</Txt>
        <Txt span>Click outside of this window to continue.</Txt>
      </caption>

      <tbody>
        {Object.entries(config.configs).map(([axis, controls]) => (
          <AxisRow
            key={axis}
            controls={controls}
            axis={axis}
            maxCount={maxCount}
          />
        ))}
      </tbody>
    </Table>
  )
}
