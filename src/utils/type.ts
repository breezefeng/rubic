import { isRef, type ComputedRef } from '@vue/reactivity'
import type { Method } from '../types'

export const getType = (value: unknown): string => Object.prototype.toString.call(value)

export const { isArray } = Array
export const isFunction = (val: unknown): val is Method => typeof val === 'function'
export const isMap = (val: unknown): val is Map<any, any> => getType(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => getType(val) === '[object Set]'
export const isPlainObject = (val: unknown): val is Record<string, unknown> => getType(val) === '[object Object]'
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
