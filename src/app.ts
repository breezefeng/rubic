import { createCore, setCurrentInstance, unsetCurrentInstance, type Instance } from './instance'
import type { Bindings } from './types'
import { APP_LIFETIMES, CORE_KEY } from './constants'
import { wrapLifetimeHooks } from './lifetimes'
import { registerPlugins, type Plugin } from './plugin'
import { SharePlugin } from './plugins'

export type AppOptions = {
  setup: (options: WechatMiniprogram.App.LaunchShowOption) => Bindings | void
  plugins?: Plugin[]
}

export function createApp(options: AppOptions) {
  const { setup, plugins = [] } = options
  registerPlugins([...plugins, SharePlugin])

  const lifetimes = wrapLifetimeHooks(APP_LIFETIMES)
  const core = createCore('App').initHooks()

  return App({
    [CORE_KEY]: core,
    ...lifetimes,
    onLaunch(...args) {
      setCurrentInstance({ [CORE_KEY]: core } as unknown as Instance)
      const bindings = setup(...args) || {}
      unsetCurrentInstance()
      for (const key of Object.keys(bindings)) {
        this[key] = bindings[key]
      }
    },
  })
}
