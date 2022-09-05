import { CORE_KEY } from '../constants'
import type { Plugin } from '../plugin'
import { remove } from '../utils'

/**
 * 内置中间件 隐藏分享菜单
 * 框架默认会申明 shareAppMessage 和 shareTimeline, 如用户没有调用 onShareAppMessage、onShareTimeline 则需要将菜单隐藏掉。
 */
export const SharePlugin: Plugin = {
  name: 'builtin-share',
  type: 'Page',
  setup: (props, ctx, next) => {
    const menus: any[] = ['shareAppMessage', 'shareTimeline']
    next()
    const { onShareAppMessage, onShareTimeline } = ctx[CORE_KEY].hooks
    if (onShareAppMessage && onShareAppMessage.length > 0) {
      remove(menus, 'shareAppMessage')
    }
    if (onShareTimeline && onShareTimeline.length > 0) {
      remove(menus, 'shareTimeline')
    }
    if (menus.length > 0) {
      wx.hideShareMenu({
        menus,
      })
    }
  },
}
