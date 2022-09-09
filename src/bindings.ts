import { isReactive, isRef, toRaw, type Ref } from '@vue/reactivity'
import { error } from './errorHandling'
import { isArray, isFunction, isBaseType, isPlainObject, getType } from './utils'

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
