import { isReactive, isRef, reactive, toRaw, unref, type Ref } from '@vue/reactivity'
import { CORE_KEY } from './constants'
import { error } from './errorHandling'
import type { Instance } from './instance'
import type { Method } from './types'
import { isArray, isFunction, isJsonBaseType, isPlainObject, getType, diff } from './utils'
import { watch } from './watch'

export function watchData<T extends object = Record<string, any>>(
  bindings: T,
  instance: Instance,
  cb?: Method
) {
  const prevData = toDataRaw(bindings, 'data')
  return watch(
    bindings,
    () => {
      const data = toDataRaw(bindings, 'data')
      instance.setData(diff(prevData, data), cb)
    },
    {
      deep: true,
    }
  )
}

export function toDataRaw(x: any, key?: string): any {
  if (isJsonBaseType(x) || isFunction(x)) {
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
