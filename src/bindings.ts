import { isReactive, isRef, reactive, toRaw, unref, type Ref } from '@vue/reactivity'
import { CORE_KEY } from './constants'
import { diff } from './diff'
import { error } from './errorHandling'
import type { Instance } from './instance'
import type { Method } from './types'
import { isArray, isFunction, isJsonBaseType, isPlainObject, getType } from './utils'
import { watch } from './watch'

export function watchData<T extends object = Record<string, any>>(
  bindings: T,
  ctx: Instance,
  cb?: Method
) {
  let prevData = toDataRaw(bindings, 'data')
  return watch(
    bindings,
    () => {
      const currData = toDataRaw(bindings, 'data')
      const patchData = diff(prevData, currData)
      if (Object.keys(patchData).length > 0) {
        ctx.setData(patchData, cb)
        prevData = currData
      }
    },
    {
      deep: true,
    }
  )
}

export function toDataRaw(x: any, key?: string): any {
  if (typeof x === 'object') {
    if (x === null) {
      return null
    } else if (isReactive(x)) {
      return toDataRaw(toRaw(x), key)
    } else if (isRef(x)) {
      return toDataRaw((x as Ref<any>).value, key)
    } else if (Array.isArray(x)) {
      return (x as any[]).map((item, i) => toDataRaw(item, `${key}[${i}]`))
    }
    const obj: Record<string, any> = {}
    Object.keys(x).forEach(k => {
      obj[k] = toDataRaw(x[k], `${key}.${k}`)
    })
    return obj
  } else if (isJsonBaseType(x)) {
    return x
  } else {
    error(
      new Error(
        `错误的数据类型 ${key}:${getType(
          x
        )}, 小程序 data 仅支持可以转成 JSON 的类型(string | number | boolean | object | array)`
      )
    )
    return undefined
  }
}
