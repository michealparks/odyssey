import { Object3D } from 'three'
import { injectPlugin, useTask } from '@threlte/core'

export const injectMatrixPlugin = () => {
  const propKeysRequiringMatrixUpdate = [
    'position',
    'position.x',
    'position.y',
    'position.z',
    'rotation',
    'rotation.x',
    'rotation.y',
    'rotation.z',
    'rotation.order',
    'quaternion',
    'quaternion.x',
    'quaternion.y',
    'quaternion.z',
    'quaternion.w',
    'scale',
    'scale.x',
    'scale.y',
    'scale.z'
  ]

  const objectsToUpdate: Object3D[] = []

  type MatrixPluginProps = {
    matrixAutoUpdate?: boolean
  }

  useTask(() => {
    if (objectsToUpdate.length === 0) return

    objectsToUpdate.forEach((obj) => obj.updateMatrix())
    objectsToUpdate.splice(0, objectsToUpdate.length)
    // invalidate()
  }, {
    autoInvalidate: false,
  })

  injectPlugin<MatrixPluginProps>('matrix-update', ({ ref, props }) => {
    let currentRef: THREE.Object3D = ref
    let currentProps = props
  
    if (!(currentRef instanceof Object3D)) return
    if (currentProps.matrixAutoUpdate) return

    currentRef.matrixAutoUpdate = false

    const checkForMatrixUpdate = (props: Record<string, unknown>) => {
      if (propKeysRequiringMatrixUpdate.some((key) => props[key] !== undefined)) {
        objectsToUpdate.push(currentRef)
      }
    }

    return {
      pluginProps: ['matrixAutoUpdate'],
      onRefChange(ref: THREE.Object3D) {
        currentRef = ref
        ref.updateMatrix()
      },
      onRestPropsChange(restProps) {
        checkForMatrixUpdate(restProps)
      }
    }
  })
}