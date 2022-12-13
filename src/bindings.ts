import { isReactive, isRef, reactive, toRaw, unref, type Ref } from '@vue/reactivity'
import { CORE_KEY } from './constants'
import { error } from './errorHandling'
import type { Instance } from './instance'
import {
  isArray,
  isFunction,
  isBaseType,
  isPlainObject,
  getType,
  isObject,
  isSet,
  isMap,
} from './utils'
import { watch } from './watch'

export function findTargetPatches(
  data: object,
  targets: object[],
  paths: Array<string | number> = []
) {
  const patches: Array<string | number>[] = []
  if (isBaseType(data) || isFunction(data) || data === null) {
    return null
  }
  for (const target of targets) {
    if (target === toRaw(unref(data))) {
      patches.push([...paths])
      break
    }
  }
  if (patches.length > 0) {
    return patches
  }

  if (isRef(data)) {
    const ret = findTargetPatches(toRaw(unref(data)) as object, targets, paths)
    if (ret) {
      patches.push(...ret)
    }
  } else if (isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const ret = findTargetPatches(data[i] as object, targets, [...paths, i])
      if (ret) {
        // patches.push(...ret)
        // INFO: 数组内部变化直接更新整个数组
        patches.push([...paths])
      }
    }
  } else if (isSet(data) || isMap(data)) {
    data.forEach((v: any) => {
      const ret = findTargetPatches(v as object, targets, paths)
      if (ret) {
        patches.push([...paths])
      }
    })
  } else if (isPlainObject(data)) {
    for (const k of Object.keys(data)) {
      const ret = findTargetPatches(data[k] as object, targets, [...paths, k])
      if (ret) {
        patches.push(...ret)
      }
    }
  }
  return patches.length > 0 ? patches : null
}

export function watchData<T extends object = Record<string, any>>(bindings: T, instance: Instance) {
  const data = reactive(bindings)
  const rawData = toRaw(data)
  const rootPatches = new Set<string>()
  const deepTargets = new Set<object>()
  return watch(
    data,
    () => {
      const patches = findTargetPatches(data, Array.from(deepTargets))

      deepTargets.clear()
    },
    {
      onTrigger(event) {
        if (event.target === rawData) {
          rootPatches.add(event.key)
        } else {
          deepTargets.add(event.target)
        }
      },
    }
  )
}

export function toDataRaw(x: any, key?: string): any {
  if (isBaseType(x) || isFunction(x)) {
    return x
  }
  if (isRef(x)) {
    return toDataRaw((x as Ref<any>).value, key)
  }
  if (isReactive(x)) {
    return toDataRaw(toRaw(x), key)
  }
  if (isArray(x)) {
    return (x as any[]).map((item, i) => toDataRaw(item, `${key}[${i}]`))
  }
  if (isPlainObject(x)) {
    const obj: Record<string, any> = {}
    Object.keys(x).forEach(k => {
      obj[k] = toDataRaw(x[k], `${key}.${k}`)
    })
    return obj
  }
  error(
    new Error(
      `错误的数据类型 ${key}:${getType(
        x
      )}, 小程序 data 仅支持可以转成 JSON 的类型(string | number | boolean | object | array)`
    )
  )
  return undefined
}
