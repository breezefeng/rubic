import { readonly } from '@vue/reactivity'
import { createCore, setCurrentInstance, unsetCurrentInstance, type Instance, type AppCustomContext } from './instance'
import type { Bindings } from './types'
import { APP_LIFETIMES, CORE_KEY } from './constants'
import { wrapLifetimeHooks } from './lifetimes'
import { registerPlugins, type Plugin } from './plugin'
import { SharePlugin } from './plugins'

export type AppSetup = (this: void) => Bindings | void

export type AppOptions = {
  setup: AppSetup
  plugins?: Plugin[]
  errorHandler?: (err: unknown, instance: Instance | null, info: string) => void
}

export function createApp(options: AppOptions) {
  const { setup, plugins = [], errorHandler } = options
  registerPlugins([...plugins, SharePlugin])

  const lifetimes = wrapLifetimeHooks(APP_LIFETIMES)
  const core = createCore('App').initHooks()

  return App({
    [CORE_KEY]: core,
    errorHandler,
    ...lifetimes,
    onLaunch(options) {
      setCurrentInstance({ [CORE_KEY]: core } as unknown as Instance)
      const bindings = setup() || {}
      unsetCurrentInstance()
      for (const key of Object.keys(bindings)) {
        this[key] = bindings[key]
      }
    },
  })
}
