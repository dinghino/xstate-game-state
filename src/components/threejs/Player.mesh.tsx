import { useWindowEvent } from '@mantine/hooks'
import { MeshProps, useFrame } from '@react-three/fiber'
import { useSelector } from '@xstate/react'
import React from 'react'
import { Mesh, Object3D, Vector3 } from 'three'
import { playerService } from '../../state'
interface Values {
  yaw: number;
  pitch: number;
  roll: number;
  forward: number;
  left: number;
  up: number;
}

const AX = new Vector3(1, 0, 0)
const AY = new Vector3(0, 1, 0)
const AZ = new Vector3(0, 0, 1)

// export const initialRotation = new Euler(degToRad(45), 0, degToRad(45));
function parseTransform(obj: Object3D): {position: [number, number, number], rotation: [number, number, number]} {
  const p = obj.position
  const r = obj.rotation
  return { position: [p.x, p.y, p.z], rotation: [r.x, r.y, r.z] }
}

function updateObjectTransform(object: Object3D, inputs: Values, dt: number) {
  if (!object) return
  object.rotateOnWorldAxis(AY, inputs.yaw * dt)
  object.rotateOnWorldAxis(AX, inputs.pitch * dt)
  object.rotateOnWorldAxis(AZ, (Math.PI / 2) * inputs.roll * dt)
  object.translateX(inputs.left * dt)
  object.translateY(inputs.up * dt)
  object.translateZ(inputs.forward * dt)
}
function centerObject(object: Object3D) {
  if (!object) return
  object.position.x = 0
  object.position.y = 0
  object.position.z = 0
  object.rotation.x = 0
  object.rotation.y = 0
  object.rotation.z = 0
}


export const Player: React.FC<MeshProps> = ((props) => {
  const cube = React.useRef<Mesh>(null!)

  const inputs = useSelector(playerService, ({ context }) => context.inputs)
  const state = useSelector(playerService, ({ context }) => context.values)

  const values = useSelector(inputs, ({ context }) => context.values)
  const velocity = useSelector(state, ({ context }) => context.velocity)

  useWindowEvent('keypress', (e) => {
    if (e.code === 'KeyT') {
      centerObject(cube!.current)
      state.send('RESET')
    }
  })

  useFrame((_, dt) => {
    const obj = cube.current
    state.send({ type: 'UPDATE', values })
    updateObjectTransform(obj, velocity, dt)
    state.send({ type: 'UPDATE_TRANSFORM', ...parseTransform(obj) })
  })

  return (
    <mesh {...props} ref={cube}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  )
})
