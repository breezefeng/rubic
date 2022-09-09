import { toRaw, unref } from '@vue/reactivity'

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
