import { EffectScope, shallowReactive, type ShallowReactive } from '@vue/reactivity'
import { APP_LIFETIMES, CORE_KEY, PAGE_LIFETIMES, COMPONENT_LIFETIMES } from './constants'
import type { Data, Flat, Method } from './types'
import { keysToRecord } from './utils'

export type InstanceType = 'App' | 'Page' | 'Component'

export type AppLifetimeKey = typeof APP_LIFETIMES[number]
export type PageLifetimeKey = typeof PAGE_LIFETIMES[number]

export type ComponentPageLifetimeKey = typeof COMPONENT_LIFETIMES.PAGELIFETIMES[number]
export type ComponentLifetimeKey =
  | typeof COMPONENT_LIFETIMES.LIFETIMES[number]
  | typeof COMPONENT_LIFETIMES.PAGELIFETIMES[number]

export type AppHooks = { [key in AppLifetimeKey]?: Method[] }
export type PageHooks = { [key in PageLifetimeKey]?: Method[] }
export type ComponentHooks = { [key in ComponentLifetimeKey]?: Method[] }

export type Core = {
  type: InstanceType
  props: ShallowReactive<Record<string, any>>
  hooks: AppHooks & PageHooks & ComponentHooks
  isUnmounted: boolean
  scope: EffectScope
  bindings: Record<string, any>
  renderCbs: Array<() => void>
  initHooks(): Core
  toJSON(): string
}

type InstanceCore = {
  [CORE_KEY]: Core
}

type BaseInstance<D extends Record<string, any>, C, P extends boolean = false> = Flat<
  WechatMiniprogram.Component.Instance<
    D,
    {},
    {},
    InstanceCore & {
      $nextTick: (fn: () => void) => void
      route?: string
    } & C,
    P
  >
>

export interface AppCustomContext {}
export interface PageCustomContext {}
export interface ComponentCustomContext {}

export type AppInstance = WechatMiniprogram.App.Instance<InstanceCore & AppCustomContext>

export type PageInstance = BaseInstance<Data, PageCustomContext, true>

export type ComponentInstance = BaseInstance<Data, ComponentCustomContext, false>

let currentInstance: PageInstance | ComponentInstance | null = null

export type Instance = PageInstance | ComponentInstance

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

export function createCore(type: InstanceType): Core {
  const core: Core = {
    type: type,
    props: shallowReactive<Record<string, any>>({}),
    hooks: {},
    isUnmounted: false,
    scope: new EffectScope(),
    bindings: {},
    renderCbs: [],
    initHooks() {
      switch (this.type) {
        case 'App':
          this.hooks = keysToRecord(APP_LIFETIMES, () => [])
          break
        case 'Page':
          this.hooks = keysToRecord(PAGE_LIFETIMES, () => [])
          break
        default:
          this.hooks = keysToRecord([...COMPONENT_LIFETIMES.LIFETIMES, ...COMPONENT_LIFETIMES.PAGELIFETIMES], () => [])
          break
      }
      return this
    },
    toJSON() {
      return 'core'
    },
  }

  return core
}
