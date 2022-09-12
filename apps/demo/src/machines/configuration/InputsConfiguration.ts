import type {
  ConfigurationInputMappings,
  FinalizedInputs,
  InputMapping,
  TConfigurationSetup,
  TControllerType,
  TInputConfiguration
} from './configuration.types'

import { isAction, isKeyboardAxis, isMouseAxis } from './type-guards'
import { parseKeyboardAxis, parseMouseAxis, parseAction } from './parsers'

import { objKeys, objValues, objEntries } from '../../utils'

class ExistingInputError extends Error {
  constructor(
    ref: string,
    input: string,
    obj: InputsConfiguration<any, any>,
    current: TInputConfiguration
  ) {
    const existingRef = obj.keybindings[input]
    const existingBinding = obj.configs[existingRef]!.find((v) =>
      v.inputs.includes(input)
    )
    const existingName = existingBinding?.name

    let message = `found input with multiple bindings: "${input}" assigned to `
    message += existingName
      ? `"${existingRef}.${existingName}"`
      : `"${existingRef}"`
    message += ` and "${ref}.${current.name}"`
    super(message)
  }
}

function formatKeybindingName(controller: TControllerType, key: string) {
  return `${controller}.${key}`
}

export class InputsConfiguration<Axis extends string, Actions extends string> {
  public refs: (Axis | Actions)[]
  public controllers: TControllerType[]
  public configs: FinalizedInputs<Axis, Actions>
  public keybindings: { [k: string]: Axis | Actions }
  public axis: readonly Axis[]
  public actions: readonly Actions[]

  constructor(public source: TConfigurationSetup<Axis, Actions>) {
    /** list of all the binded action|axis names */
    this.refs = objKeys(source.mappings)
    /** list of refs that handle axis */
    this.axis = source.axis ?? []
    /** list of refs that handle actions */
    this.actions = source.actions ?? []
    /** list of all active controllers */
    this.controllers = []
    /** finalized configuration mappings with options */
    this.configs = {} as FinalizedInputs<Axis, Actions>
    /** map with binded key/axis (keyW, mouse.y, ...) and their respective action/axis */
    this.keybindings = {}

    this._setupLists(source.mappings)
    this._finalizeMappings(source.mappings)
  }
  getRef(
    controller: TControllerType,
    input: string
  ): Axis | Actions | undefined {
    return this.keybindings[formatKeybindingName(controller, input)]
  }
  findConfigs(name: Axis | Actions): InputMapping[] {
    return this.configs[name]
  }
  // getConfig(): FinalizedInputs<Axis, Actions>;
  // getConfig(name: Axis | Actions): InputMapping[];
  // getConfig(
  //     name?: Axis | Actions
  //   ): InputMapping[] | FinalizedInputs<Axis, Actions> {
  //     return name ? this.configs[name] : this.configs
  // }
    getConfig(): FinalizedInputs<Axis, Actions> {
    return this.configs
  }

  getAllBindings(): InputMapping[] {
    return objValues(this.configs).flat()
  }

  private _finalizeMappings(
    mappings: ConfigurationInputMappings<Axis, Actions>
  ) {
    objEntries(mappings).forEach(([ref, { type, bindings }]) => {
      // objEntries(mappings).forEach(([ref, config]) => {
      this.configs[ref] = bindings.map((binding, i) => {
        const { controller, inputs } = binding
        inputs.forEach((value) => {
          const key = formatKeybindingName(controller, value)
          if (key in this.keybindings) {
            throw new ExistingInputError(ref, key, this, binding)
          }
          this.keybindings[key] = ref
        })
        if (isKeyboardAxis(binding))
          return parseKeyboardAxis(ref, type, binding)
        if (isMouseAxis(binding)) return parseMouseAxis(ref, type, binding)
        if (isAction(binding)) return parseAction(ref, type, binding)
        throw new Error(
          `Unexpected configuration object found for ${ref} as bindings[${i}]`
        )
      }) as any
    })
  }
  private _setupLists(mappings: ConfigurationInputMappings<Axis, Actions>) {
    this.refs.forEach((name) => {
      const current = mappings[name]
      const bindings = current.bindings

      bindings.forEach(({ controller }) => {
        if (!this.controllers.includes(controller)) {
          this.controllers.push(controller)
        }
      })
    })
  }
}
