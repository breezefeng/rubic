import { isRef, reactive, readonly, shallowReactive, shallowReadonly } from '@vue/reactivity'
import { createCore, type Instance, setCurrentInstance, unsetCurrentInstance } from './instance'
import { CORE_KEY } from './constants'
import type { Data } from './types'
import { isEqual, isFunction, isObject } from './utils'
import { error, warn } from './errorHandling'
import { bindingToData } from './bindings'
import { watch } from './watch'

type CoreSetupOptions = {
  type: 'Page' | 'Component'
  properties: Record<string, any>
  setup?: (...args: any[]) => any
}

export function watchBinding(this: Instance, key: string, value: unknown): void {
  if (!isObject(value)) {
    return
  }
  watch(
    isRef(value) ? value : () => value,
    () => {
      this.setData({ [key]: bindingToData(value, key) }, () => {})
    },
    { deep: true }
  )
}

function getQueryProxy(params: string[], data: Record<string, any>) {
  const queryData = params.reduce((prev, param) => {
    prev[param] = data[param]
    return prev
  }, {} as any)
  const query = new Proxy(queryData, {
    get(target, prop, receiver) {
      if (!Reflect.has(target, prop)) {
        warn(`参数 ${prop.toString()} 未在 \`properties\` 中定义`)
      }
      return Reflect.get(target, prop, receiver)
    },
  })
  return query
}

export const createSetupHook = ({ type, setup, properties = {} }: CoreSetupOptions) => {
  return {
    created: function (this: Instance) {
      this[CORE_KEY] = createCore(type).initHooks()
    },
    attached: function (this: Instance) {
      const ctx = this as Instance
      const core = ctx[CORE_KEY]

      if (core.type === 'Page') {
        core.props = getQueryProxy(Object.keys(ctx.properties), ctx.data)
      } else {
        core.props = Object.keys(properties).reduce((prev, key) => {
          prev[key] = ctx.data[key]
          return prev
        }, shallowReactive<Record<string, any>>({}))
      }

      const props = core.type === 'Page' ? core.props : (shallowReadonly(core.props) as Data)

      setCurrentInstance(ctx)
      const bindings: Record<string, any> = setup ? setup.call(ctx, props, ctx) || {} : {}
      core.bindings = bindings

      if (bindings) {
        const bindingData = reactive({})
        Object.keys(bindings).forEach((key: string) => {
          const value = bindings[key]
          if (isFunction(value)) {
            // @ts-ignore
            ctx[key] = value
            return
          } else {
            bindingData[key] = value
          }
          try {
            ctx.setData({ [key]: bindingToData(value, key) })
          } catch (err) {
            error(err as Error, ctx)
          }
          // watchBinding.call(ctx, key, value)
        })
        watch(
          bindingData,
          // @ts-ignore
          (val, _, onCleanup, oldVal) => {
            const patchObj = {}
            for (const key of Object.keys(oldVal)) {
              if (!isEqual(oldVal[key], val[key])) {
                patchObj[key] = bindingToData(val[key], key)
              }
            }
            ctx.setData(patchObj)
          },
          {
            deep: true,
          }
        )
      }
      unsetCurrentInstance()
    },
  }
}
