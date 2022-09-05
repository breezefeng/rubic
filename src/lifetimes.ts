import { CORE_KEY, APP_LIFETIMES, COMPONENT_LIFETIMES, PAGE_LIFETIMES } from './constants'
import { error, warn } from './errorHandling'
import type {
  AppHooks,
  AppLifetimeKey,
  ComponentHooks,
  ComponentLifetimeKey,
  Instance,
  PageHooks,
  PageLifetimeKey,
} from './instance'
import { getCurrentInstance } from './instance'
import type { Method } from './types'
import { keysToRecord } from './utils'

type HookTarget = { App?: AppLifetimeKey; Page?: PageLifetimeKey; Component?: ComponentLifetimeKey }

type LifetimeKey = AppLifetimeKey | PageLifetimeKey | ComponentLifetimeKey

const isAppHook = (key: string): key is AppLifetimeKey => APP_LIFETIMES.indexOf(key as any) >= 0

const isPageHook = (key: string): key is PageLifetimeKey => PAGE_LIFETIMES.indexOf(key as any) >= 0

const isComponentHook = (key: string): key is ComponentLifetimeKey =>
  COMPONENT_LIFETIMES['LIFETIMES'].indexOf(key as any) >= 0 ||
  COMPONENT_LIFETIMES['PAGELIFETIMES'].indexOf(key as any) >= 0

// const isComponentPageHook = (key: string): key is ComponentPageLifetimeKey =>
//   COMPONENT_LIFETIMES['PAGELIFETIMES'].indexOf(key as any) >= 0

export type WrapOptions<T> = {
  lifetimes: T
  originLifetime: Record<string, any>
  excludes?: string[]
}

export function wrapLifetimeHooks<T extends readonly string[]>(
  lifetimes: T,
  excludes: string[] = []
): { [key in T[number]]: Method } {
  const list = lifetimes.filter(name => excludes.indexOf(name) === -1) as unknown as T
  const lifeTimes = keysToRecord<T, Method>(list, key => {
    return function (this: Instance, ...args: unknown[]) {
      const hooksGroup = this[CORE_KEY].hooks as any
      const hooks: Method[] = [...hooksGroup[key]]

      let ret: unknown = undefined
      hooks.forEach(func => {
        ret = func(...args)
      })
      return ret
    }
  })
  return lifeTimes
}

function getLifetimeHooks(ins: Instance, key: LifetimeKey) {
  const { type, hooks } = ins[CORE_KEY]
  if (type === 'App' && isAppHook(key)) {
    return (hooks as AppHooks)[key]
  } else if (type === 'Page' && isPageHook(key)) {
    return (hooks as PageHooks)[key]
  } else if (type === 'Component' && isComponentHook(key)) {
    return (hooks as ComponentHooks)[key]
  }
  return undefined
}

function createHook<T extends Method>(
  hook: HookTarget,
  validator: (ins: Instance, lifetime: string) => boolean = () => true
) {
  const { App: appHook, Page: pageHook, Component: componentHook } = hook
  const firstKey = (appHook || pageHook || componentHook) as LifetimeKey

  return (cb: T) => {
    const ins = getCurrentInstance()
    if (!ins) {
      throw new Error(`当前没有实例 无法调用 ${firstKey} 钩子.`)
    }
    const type = ins[CORE_KEY].type
    const key: LifetimeKey = hook[type]! || firstKey

    const hooks = getLifetimeHooks(ins, key)

    if (!validator(ins, key)) {
      return
    }

    if (Array.isArray(hooks)) {
      hooks.push(cb)
    } else {
      error(new Error(`${type} 不存在 ${key} 钩子.`), ins)
    }
  }
}

/**
 * ====== App Lifetime ====
 */
type IAppLt = Required<WechatMiniprogram.App.Option>
export const onAppShow = createHook<IAppLt['onShow']>({ App: 'onShow' })
export const onAppHide = createHook<IAppLt['onHide']>({ App: 'onHide' })
export const onPageNotFound = createHook<IAppLt['onPageNotFound']>({ App: 'onPageNotFound' })
export const onUnhandledRejection = createHook<IAppLt['onUnhandledRejection']>({ App: 'onUnhandledRejection' })
export const onThemeChange = createHook<IAppLt['onThemeChange']>({ App: 'onThemeChange' })
export const onError = createHook<IAppLt['onError']>({ App: 'onError', Component: 'error' })

/**
 * ====== Page Lifetime  ====
 */
type IPageLt = Required<WechatMiniprogram.Page.ILifetime>
export const onLoad = createHook<IPageLt['onLoad']>({ Page: 'onLoad' })
export const onUnload = createHook<IPageLt['onUnload']>({ Page: 'onUnload' })
export const onPullDownRefresh = createHook<IPageLt['onPullDownRefresh']>({ Page: 'onPullDownRefresh' })
export const onReachBottom = createHook<IPageLt['onReachBottom']>({ Page: 'onReachBottom' })
export const onAddToFavorites = createHook<IPageLt['onAddToFavorites']>({ Page: 'onAddToFavorites' })
export const onTabItemTap = createHook<IPageLt['onTabItemTap']>({ Page: 'onTabItemTap' })
export const onSaveExitState = createHook<() => { data: any; expireTimeStamp: number }>({ Page: 'onSaveExitState' })
export const onShareAppMessage = createHook<IPageLt['onShareAppMessage']>({ Page: 'onShareAppMessage' })
export const onShareTimeline = createHook<IPageLt['onShareTimeline']>({ Page: 'onShareTimeline' })
export const onPageScroll = createHook<IPageLt['onPageScroll']>({ Page: 'onPageScroll' })

/**
 * ====== Component Lifetime  ====
 */
type CLt = Required<WechatMiniprogram.Component.Lifetimes['lifetimes']>
// created、attached 没有
export const onMoved = createHook<CLt['moved']>({ Component: 'moved' })
export const onDetached = createHook<CLt['detached']>({ Component: 'detached' })
// export const onError = createHook<CLt['error']>({ Component: 'error' })
export const onReady = createHook<CLt['ready']>({ Page: 'onReady', Component: 'ready' })

/**
 * ====== Component PageLifetime  ====
 */
type CPageLt = Required<WechatMiniprogram.Component.PageLifetimes>
export const onShow = createHook<CPageLt['show']>({ Page: 'onShow', Component: 'show' })
export const onHide = createHook<CPageLt['hide']>({ Page: 'onHide', Component: 'hide' })
export const onResize = createHook<CPageLt['resize']>({ Page: 'onResize', Component: 'resize' })
