export * from './object'
export * from './type'

export const EMPTY_OBJ = {}
export const NOOP = () => {}

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
