import { CORE_KEY } from '../constants'
import type { Plugin } from '../plugin'

export const SharePlugin: Plugin = {
  name: 'builtin-share',
  type: 'Page',
  setup: (props, ctx, next) => {
    const menus: any[] = []
    next()
    if (ctx[CORE_KEY].hooks.methods['onShareAppMessage'].length > 0) {
      menus.push('shareAppMessage')
    }
    if (ctx[CORE_KEY].hooks.methods['onShareTimeline'].length > 0) {
      menus.push('shareTimeline')
    }
    if (menus.length > 0) {
      wx.hideShareMenu({
        menus,
      })
    }
  },
}
