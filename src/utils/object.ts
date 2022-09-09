import { isReactive, isRef, toRaw, unref, type Ref } from '@vue/reactivity'
import { getType, isArray, isBaseType, isFunction, isPlainObject } from './type'

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

export function isEqual(
  a: any,
  b: any,
  options: {
    match?: boolean
  } = {}
) {
  const { match } = options

  if (a === b) return true
  if (a == null || b == null) return false
  const source = toRaw(unref(a))
  const target = toRaw(unref(b))

  if (Array.isArray(source)) {
    return (
      Array.isArray(target) &&
      source.length === target.length &&
      source.every(function (item, index) {
        return isEqual(item, target[index], options)
      })
    )
  }

  if (typeof source === 'object' || typeof target === 'object') {
    return Object.keys(match ? source : Object.assign({}, source, target)).every(function (key) {
      return isEqual(source[key], target[key], options)
    })
  }

  return false
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
  console.warn(
    `错误的数据类型 ${key}:${getType(x)}, 
  小程序 data 仅支持可以转成 JSON 的类型(string | number | boolean | object | array)`
  )
  return undefined
}
