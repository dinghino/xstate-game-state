import { objEntries } from '../../utils'
import { TControllerType } from '../configuration/configuration.types'

export const getAxisFromKeybindings = <
  Axis extends string,
  Actions extends string,
  Key extends `${TControllerType}.${string}`
>(bindings: Record<Key, Axis | Actions>, controller: TControllerType): Array<Axis|Actions> => {
  return objEntries(bindings)
    .filter(([key]) => key.split('.')[0] === controller)
    .map(([, value]) => value).filter((v, i, a) => a.indexOf(v) === i)
}
