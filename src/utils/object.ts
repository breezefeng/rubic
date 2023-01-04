import { isReactive, isRef, toRaw, unref, type Ref } from '@vue/reactivity'
import { getType, isArray, isJsonType, isFunction, isPlainObject } from './type'

export function clone(target: any) {
  if (Array.isArray(target)) {
    let k = target.length
    const out = Array(k)
    while (k--) {
      const tmp = target[k]
      out[k] = typeof tmp === 'object' ? clone(tmp) : tmp
    }
    return out
  }
  if (isPlainObject(target)) {
    if (isRef(target)) {
      return clone({ value: target.value })
    }
    if (isReactive(target)) {
      return clone(toRaw(target))
    }
    const out = {} // null
    for (const k in target) {
      if (k !== '__proto__') {
        const tmp = target[k]
        out[k] = typeof tmp === 'object' ? clone(tmp) : tmp
      }
    }
    return out
  }

  return target
}
