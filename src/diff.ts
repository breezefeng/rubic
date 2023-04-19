import { isArray, getType as toTypeString } from './utils'

const diffData = (from: any, to: any, data: any = {}, parentKey = '') => {
  if (from === to) return

  if (from === null || to === null) {
    // 新旧数据如果存在值为null则添加到需要更新的数据中
    data[parentKey] = to
  } else if (toTypeString(from) !== toTypeString(to)) {
    // 新旧数据如果类型不一样则添加到需要更新的数据中
    data[parentKey] = to
  } else if (isArray(to)) {
    // 如果新旧数据均为数组，则进行diff
    if (from.length === to.length) {
      for (let i = 0, len = to.length; i < len; i++) {
        // 递归处理，处理数据中包含数据或者包含对象的情况
        diffData(from[i], to[i], data, parentKey + '[' + i + ']')
      }
    } else {
      // 数组长度不一样直接setData
      data[parentKey] = to
    }
  } else if (typeof to === 'object') {
    // 如果新旧数据均为对象，进行diff
    const oldKeys = Object.keys(from)
    const newKeys = Object.keys(to)

    const shouldReplace = oldKeys.some(key => {
      return (
        // 因为小程序不支持 undefined , 在新值有 undefined 时，应该直接更新上层对象。
        (to[key] === undefined && from[key] !== undefined) ||
        // 新对象缺少旧属性
        newKeys.indexOf(key) === -1 ||
        // 新属性和比旧属性少
        oldKeys.length > newKeys.length
      )
    })

    if (!shouldReplace) {
      newKeys.forEach(key => {
        const itemKey = parentKey ? parentKey + '.' + key : key
        const fromItem = from[key]
        const toItem = to[key]
        if (
          fromItem &&
          toItem &&
          typeof toItem === 'object' &&
          toTypeString(from) === toTypeString(to)
        ) {
          diffData(fromItem, toItem, data, itemKey)
          return
        }
        if (fromItem !== toItem) {
          data[itemKey] = toItem
        }
      })
    } else {
      if (parentKey) {
        data[parentKey] = to
      } else {
        Object.assign(data, to)
      }
    }
  } else {
    data[parentKey] = to
  }
}

export const diff = function (oldData: any, newData: any) {
  const target = {}
  diffData(oldData, newData, target, '')
  return target
}
