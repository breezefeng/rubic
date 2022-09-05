import { readonly } from '@vue/reactivity'
import { createCore, setCurrentInstance, unsetCurrentInstance, type Instance, type AppCustomContext } from './instance'
import type { Bindings } from './types'
import { APP_LIFETIMES, CORE_KEY } from './constants'
import { wrapLifetimeHooks } from './lifetimes'
import { loadPlugin, registerPlugins } from './plugin'
import { SharePlugin } from './plugins'

export type AppSetup = (this: void) => Bindings | void

export type AppOptions = {
  setup: AppSetup
  middlewares?: any[]
  errorHandler?: (err: unknown, instance: Instance | null, info: string) => void
}

export function createApp(options: AppOptions) {
  const { setup, middlewares = [], errorHandler } = options
  registerPlugins([...middlewares, SharePlugin])

  const lifetimes = wrapLifetimeHooks(APP_LIFETIMES)
  const core = createCore({ type: 'App' }).initHooks()
  setCurrentInstance({ [CORE_KEY]: core } as unknown as Instance)
  const bindings = setup() || {}
  unsetCurrentInstance()

  return App({
    [CORE_KEY]: core,
    errorHandler,
    ...lifetimes,
    ...bindings,
  })
}
