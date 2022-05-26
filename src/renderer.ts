import { isRef } from '@vue/reactivity'
import type { Instance } from './instance'
import { bindingToData } from './bindings'
import { isObject } from './utils'
import { watch } from './watch'

export function watchBinding(this: Instance, key: string, value: unknown): void {
  if (!isObject(value)) {
    return
  }
  watch(
    isRef(value) ? value : () => value,
    () => {
      this.setData({ [key]: bindingToData(value, key) })
    },
    {
      deep: true,
    }
  )
}
