export const CORE_KEY = '$$core'

export const APP_LIFETIMES = [
  'onShow',
  'onHide',
  'onError',
  'onPageNotFound',
  'onUnhandledRejection',
  'onThemeChange',
] as const

export const PAGE_LIFETIMES = [
  'onLoad',
  'onShow',
  'onReady',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onShareAppMessage',
  'onShareTimeline',
  'onAddToFavorites',
  'onPageScroll',
  'onResize',
  'onTabItemTap',
  'onSaveExitState',
] as const

export const COMPONENT_LIFETIMES = {
  LIFETIMES: ['attached', 'ready', 'moved', 'detached', 'error'],
  PAGELIFETIMES: ['show', 'hide', 'resize'],
} as const
