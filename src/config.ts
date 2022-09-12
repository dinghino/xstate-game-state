import { AxisSettings, InputsConfiguration } from './machines'

export const AXIS = ['forward', 'left', 'up', 'yaw', 'roll', 'pitch'] as const
export const ACTIONS = ['fire', 'break'] as const

export type TAxis = typeof AXIS[number];
export type TAction = typeof ACTIONS[number];

export const inputs = new InputsConfiguration({
  axis: AXIS,
  actions: ACTIONS,
  mappings: {
    forward: {
      type: 'axis',
      bindings: [
        {
          name: 'forward',
          controller: 'keyboard',
          inputs: ['KeyW', 'ArrowUp'],
          scale: -1,
        },
        {
          name: 'backward',
          controller: 'keyboard',
          inputs: ['KeyS', 'ArrowDown'],
          scale: 1,
        },
      ],
    },
    left: {
      type: 'axis',
      bindings: [
        {
          name: 'strafe left',
          controller: 'keyboard',
          inputs: ['KeyA', 'ArrowLeft'],
          scale: -1,
        },
        {
          name: 'strafe right',
          controller: 'keyboard',
          inputs: ['KeyD', 'ArrowRight'],
          scale: 1,
        },
      ],
    },
    up: {
      type: 'axis',
      bindings: [
        {
          name: 'strafe up',
          controller: 'keyboard',
          inputs: ['KeyR'],
          scale: 1,
        },
        {
          name: 'strafe down',
          controller: 'keyboard',
          inputs: ['KeyF'],
          scale: -1,
        },
      ],
    },
    yaw: {
      type: 'axis',
      bindings: [
        {
          name: 'yaw',
          controller: 'mouse',
          inputs: ['x'],
          scale: -1,
          deadzone: 0.15,
        },
      ],
    },
    pitch: {
      type: 'axis',
      bindings: [
        {
          name: 'pitch',
          controller: 'mouse',
          inputs: ['y'],
          scale: -1,
          deadzone: 0.15,
        },
      ],
    },
    roll: {
      type: 'axis',
      bindings: [
        {
          name: 'roll left',
          controller: 'keyboard',
          inputs: ['KeyQ'],
          scale: 1,
        },
        {
          name: 'roll right',
          controller: 'keyboard',
          inputs: ['KeyE'],
          scale: -1,
        },
      ],
    },
    // actions
    break: {
      type: 'action',
      bindings: [{ controller: 'keyboard', inputs: ['Space'] }],
    },
    fire: {
      type: 'action',
      bindings: [{ controller: 'mouse', inputs: ['0'] }], // TODO: correct input for primary key
    },
  },
})

export const axisSettings: AxisSettings<TAxis> = {
  forward: { max: 3, acceleration: 0.025, inertial: true },
  left: { max: 1, acceleration: 0.0075, inertial: true, reset: true },
  up: { max: 0.5, acceleration: 0.005, inertial: true, reset: true },
  // TODO: non inertial axis should have just a single value, since they do not accelerate
  // but map the relative input value directly
  pitch: { max: 1, acceleration: 1 },
  yaw: { max: 1, acceleration: 1, },
  // roll: { max: 1, acceleration: 1, },
  roll: { max: 5, acceleration: .025, inertial: true, reset: true },
}
