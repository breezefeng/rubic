import type { ShallowReactive } from '@vue/reactivity'
import { EffectScope, shallowReactive } from '@vue/reactivity'
import type { HookType } from './constants'
import {
  APP_LIFETIMES,
  COMPONENT_LIFETIMES,
  COMPONENT_METHOD_LIFETIMES,
  COMPONENT_PAGE_LIFETIMES,
  CORE_KEY,
} from './constants'

import type { Data, Flat, Func } from './types'
import { keysToRecord } from './utils'

export type NextTick = (fn: () => void) => void

export type InstanceType = 'App' | 'Page' | 'Component'

export type Core<T extends InstanceType = 'Page'> = {
  props: ShallowReactive<Record<string, any>>
  type: T
  isUnmounted: boolean
  hooks: T extends 'App'
    ? { [key in HookType['App']]?: Func[] }
    : {
        lifetimes: {
          [key in HookType['Component']]: Func[]
        }
        pageLifetimes: {
          [key in HookType['ComponentPage']]: Func[]
        }
        methods: {
          [key in HookType['ComponentMethods']]: Func[]
        }
      }
  scope: EffectScope
  bindings: Record<string, any>
  nextTick: NextTick
  initHooks(type: InstanceType): Core
}

export interface AppCustomContext {}
export interface PageCustomContext {}
export interface ComponentCustomContext {}

export type InstanceCore = { [CORE_KEY]: Core; nextTick: NextTick; route: string }

type BaseInstance<D, C, P extends boolean = false> = Flat<
  WechatMiniprogram.Component.Instance<D, {}, {}, InstanceCore & C, P>
>

export type PageInstance = BaseInstance<Data, PageCustomContext, true>

export type ComponentInstance = BaseInstance<Data, ComponentCustomContext, false>

export type Instance = PageInstance | ComponentInstance

let currentInstance: Instance | null = null

export function setCurrentInstance(instance: Instance) {
  if (instance) {
    // @ts-ignore
    instance[CORE_KEY].scope.on()
    currentInstance = instance
  }
}
export function unsetCurrentInstance() {
  if (currentInstance) {
    // @ts-ignore
    currentInstance[CORE_KEY].scope.off()
    currentInstance = null
  }
}

export function getCurrentInstance() {
  return currentInstance
}

export function createCore(instance: any): Core {
  const core: Core = {
    props: shallowReactive<Record<string, any>>({}),
    scope: new EffectScope(),
    type: 'Page',
    isUnmounted: false,
    // @ts-ignore
    hooks: {},
    bindings: {},
    nextTick(fn: (this: Instance) => void) {},
    initHooks(this: any, type: InstanceType) {
      this.type = type
      this.hooks =
        type === 'App'
          ? keysToRecord(APP_LIFETIMES, () => [])
          : {
              lifetimes: keysToRecord(COMPONENT_LIFETIMES, () => []),
              pageLifetimes: keysToRecord(COMPONENT_PAGE_LIFETIMES, () => []),
              methods: keysToRecord(COMPONENT_METHOD_LIFETIMES, () => []),
            }
      return this
    },
  }

  return core
}
