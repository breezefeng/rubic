const diffArrToPath = (from: any[], to: any[], res: any = {}, keyPrev = '') => {
  const len = to.length
  for (let i = 0; i < len; i++) {
    const toItem = to[i]
    const fromItem = from[i]
    const targetKey = `${keyPrev}[${i}]`
    if (toItem === fromItem) {
      continue
    } else if (typeof toItem !== typeof fromItem) {
      res[targetKey] = toItem
    } else {
      if (typeof toItem !== 'object') {
        res[targetKey] = toItem
      } else {
        const arrTo = Array.isArray(toItem)
        const arrFrom = Array.isArray(fromItem)
        if (arrTo !== arrFrom) {
          res[targetKey] = toItem
        } else if (arrTo && arrFrom) {
          if (toItem.length < fromItem.length) {
            res[targetKey] = toItem
          } else {
            // 数组
            diffArrToPath(fromItem, toItem, res, `${targetKey}`)
          }
        } else {
          if (!toItem || !fromItem || Object.keys(toItem).length < Object.keys(fromItem).length) {
            res[targetKey] = toItem
          } else {
            // 对象
            const shouldReplace = Object.keys(fromItem).some(key => {
              if (typeof fromItem[key] !== 'undefined' && typeof toItem[key] === 'undefined') {
                return true
              }
              return false
            })
            if (shouldReplace) {
              res[targetKey] = toItem
            } else {
              diffObjToPath(fromItem, toItem, res, `${targetKey}.`)
            }
          }
        }
      }
    }
  }
  return res
}

const diffObjToPath = (from: any, to: any, res: any = {}, keyPrev = '') => {
  const keys = Object.keys(to)
  const len = keys.length

  for (let i = 0; i < len; i++) {
    const key = keys[i]
    const toItem = to[key]
    const fromItem = from[key]
    const targetKey = `${keyPrev}${key}`
    if (toItem === fromItem) {
      continue
    } else if (!Object.prototype.hasOwnProperty.call(from, key)) {
      res[targetKey] = toItem
    } else if (typeof toItem !== typeof fromItem) {
      res[targetKey] = toItem
    } else {
      if (typeof toItem !== 'object') {
        res[targetKey] = toItem
      } else {
        const arrTo = Array.isArray(toItem)
        const arrFrom = Array.isArray(fromItem)
        if (arrTo !== arrFrom) {
          res[targetKey] = toItem
        } else if (arrTo && arrFrom) {
          if (toItem.length < fromItem.length) {
            res[targetKey] = toItem
          } else {
            // 数组
            diffArrToPath(fromItem, toItem, res, `${targetKey}`)
          }
        } else {
          // null
          if (!toItem || !fromItem) {
            res[targetKey] = toItem
          } else {
            // 对象
            const shouldReplace = Object.keys(fromItem).some(key => {
              if (typeof fromItem[key] !== 'undefined' && typeof toItem[key] === 'undefined') {
                return true
              }
              return false
            })
            if (shouldReplace) {
              res[targetKey] = toItem
            } else {
              diffObjToPath(fromItem, toItem, res, `${targetKey}.`)
            }
          }
        }
      }
    }
  }
  return res
}

export const diff = function (oldData: any, newData: any) {
  const target = {}
  diffObjToPath(oldData, newData, target, '')
  return target
}
