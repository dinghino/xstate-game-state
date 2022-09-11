import type {
  TActionInputConfig,
  TInputConfiguration,
  TKeyboardAxisConfig,
  TMouseAxisInputConfig
} from './configuration.types'

// TODO: Make generic OR make doubles for both "entry" and finalized configurations

export function isKeyboardAxis(
  binding: TInputConfiguration
): binding is TKeyboardAxisConfig {
  if (binding.controller === 'keyboard' && 'scale' in binding) return true
  return false
}
export function isMouseAxis(
  binding: TInputConfiguration
): binding is TMouseAxisInputConfig {
  if (binding.controller === 'mouse' && 'deadzone' in binding) return true
  return false
}
export function isAction(
  binding: TInputConfiguration
): binding is TActionInputConfig {
  if (!('scale' in binding) && !('deadzone' in binding)) return true
  return false
}

export function isActionRef<Actions extends string>(
  value: string
): value is Actions {
  return true
}
