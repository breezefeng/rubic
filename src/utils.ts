import { isRef, type ComputedRef } from '@vue/reactivity'
import type { Method } from './types'

export const EMPTY_OBJ = {}
export const NOOP = () => {}

export const toTypeString = (value: unknown): string => Object.prototype.toString.call(value)

export const { isArray } = Array
export const isFunction = (val: unknown): val is Method => typeof val === 'function'
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
export const isPlainObject = (val: unknown): val is Record<string, unknown> => toTypeString(val) === '[object Object]'
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'
export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch)

export function isBaseType(x: any): boolean {
  const simpleTypes = new Set(['undefined', 'boolean', 'number', 'string'])
  return x === null || simpleTypes.has(typeof x)
}

export function isComputed<T>(value: ComputedRef<T> | unknown): value is ComputedRef<T>
export function isComputed(o: any): o is ComputedRef {
  return !!(isRef(o) && (o as any).effect)
}

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue)

export const remove = <T>(arr: T[], el: T) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
  return arr
}

export function firstToLower(str: string) {
  if (str.length > 0) {
    return str.trim().replace(str[0], str[0].toLowerCase())
  }
  return ''
}

export function keysToRecord<T extends readonly string[], R = any>(
  keys: T,
  func: (key: T[number]) => R
): { [key in T[number]]: R } {
  const obj = {} as { [key in T[number]]: R }
  for (const key of keys) {
    obj[key as T[number]] = func(key)
  }
  return obj
}

export function randomId(length = 8) {
  const dict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let id = ''
  while (length--) {
    const idx = parseInt((Math.random() * dict.length).toFixed(0), 10) % dict.length
    id += dict[idx]
  }
  return id
}
