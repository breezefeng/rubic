// Public API ------------------------------------------------------------------

export { CORE_KEY } from './constants'

export { watch, watchEffect, watchPostEffect, watchSyncEffect } from './watch'
export type { WatchEffect, WatchSource, WatchCallback } from './watch'

export { nextTick } from './scheduler'

export { getCurrentInstance } from './instance'
export type { Instance, AppCustomProperties, PageCustomProperties, ComponentCustomProperties } from './instance'

export { createApp } from './app'
export type { AppOptions } from './app'

export { registerPlugins, loadPlugin } from './plugin'
export type { Plugin, PluginSetup, PluginConfig } from './plugin'

export { definePage } from './page'
export { defineComponent } from './component'

export { defineStore, storeToRefs } from './store'
export {
  onAppShow,
  onAppHide,
  onPageNotFound,
  onUnhandledRejection,
  onThemeChange,
  onError,
  onLoad,
  onUnload,
  onPullDownRefresh,
  onReachBottom,
  onAddToFavorites,
  onTabItemTap,
  onSaveExitState,
  onShareAppMessage,
  onShareTimeline,
  onPageScroll,
  onMoved,
  onDetached,
  onReady,
  onShow,
  onHide,
  onResize,
} from './lifetimes'

export {
  computed,
  customRef,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  isShallow,
  markRaw,
  reactive,
  readonly,
  ref,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  triggerRef,
  toRaw,
  toRef,
  toRefs,
  unref,
  ITERATE_KEY,
} from '@vue/reactivity'
export type {
  DebuggerEvent,
  ComputedGetter,
  ComputedRef,
  CustomRefFactory,
  ComputedSetter,
  Ref,
  ShallowReactive,
  ShallowUnwrapRef,
  ToRef,
  ToRefs,
  UnwrapNestedRefs,
  UnwrapRef,
} from '@vue/reactivity'
