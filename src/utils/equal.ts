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

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every(function (item, index) {
        return isEqual(item, b[index], options)
      })
    )
  }

  if (typeof a === 'object' || typeof b === 'object') {
    return Object.keys(match ? a : Object.assign({}, a, b)).every(function (key) {
      return isEqual(a[key], b[key], options)
    })
  }

  return false
}
