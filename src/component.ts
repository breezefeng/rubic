import type { ComponentInstance, Instance } from './instance'
import type { ComponentObjectPropsOptions, ComponentPropsOptions, ExtractPropTypes } from './props'
import { convertProps } from './props'
import type { AnyObject, Flat } from './types'
import { COMPONENT_LIFETIMES, CORE_KEY } from './constants'
import { keysToRecord } from './utils'
import { createSetupHook } from './setup'
import { wrapLifetimeHooks } from './lifetimes'
import { loadPlugin } from './plugin'

export type StyleIsolation = 'isolated' | 'apply-shared' | 'shared'

export type RelationOption = {
  type: 'parent' | 'child' | 'ancestor' | 'descendant'
  linked?(target: any): void
  linkChanged?(target: any): void
  unlinked?(target: any): void
  /** 如果这一项被设置，则它表示关联的目标节点所应具有的behavior，所有拥有这一behavior的组件节点都会被关联 */
  target?: string | undefined
}

export type ComponentInnerOptions = {
  /**
   * 启用多slot支持
   */
  multipleSlots?: boolean
  /**
   * 组件样式隔离
   */
  styleIsolation?: StyleIsolation
  /**
   * 虚拟化组件节点
   */
  virtualHost?: boolean
}

export type ComponentBaseOptions<P = {}> = {
  behaviors?: string[]
  observers?: Record<string, (...args: any[]) => any>
  externalClasses?: string[]
  relations?: { [key: string]: RelationOption }
  options?: ComponentInnerOptions
  setup: (this: void, props: P, ctx: ComponentInstance) => AnyObject | void
}

type ComponentOptionsWithoutProps<P = {}> = ComponentBaseOptions<P> & {
  properties?: undefined
}

type ComponentOptionsWithArrayProps<
  PropNames extends string = string,
  P = Readonly<{ [key in PropNames]?: string }>
> = ComponentBaseOptions<P> & {
  properties: PropNames[]
}

type ComponentOptionsWithObjectProps<
  PropsOptions = ComponentObjectPropsOptions,
  P = Readonly<Flat<ExtractPropTypes<PropsOptions>>>
> = ComponentBaseOptions<P> & {
  properties: PropsOptions
}

export function defineComponent<P = {}>(options: ComponentOptionsWithoutProps<P>): string
export function defineComponent<P extends string>(options: ComponentOptionsWithArrayProps<P>): string
export function defineComponent<P extends Readonly<ComponentPropsOptions>>(
  options: ComponentOptionsWithObjectProps<P>
): string
export function defineComponent(
  componentOptions: ComponentBaseOptions<AnyObject> & {
    properties?: ComponentPropsOptions
  }
) {
  const { setup, options } = loadPlugin(componentOptions, 'Component')

  const {
    properties: propsOptions = {},
    behaviors = [],
    observers = {},
    options: innerOptions,
    externalClasses,
    relations,
    ...others
  } = options

  const properties = convertProps(propsOptions)
  const propNames = Object.keys(properties)
  const { detached, ...lifetimes } = wrapLifetimeHooks(COMPONENT_LIFETIMES.LIFETIMES)
  const pageLifetimes = wrapLifetimeHooks(COMPONENT_LIFETIMES.PAGELIFETIMES)

  const propsObservers = keysToRecord(propNames, propName => {
    return function (this: ComponentInstance, ...args: unknown[]) {
      const _props = this[CORE_KEY].props
      if (_props[propName] !== args[0]) {
        _props[propName] = args[0]
      }
      if (observers[propName]) {
        observers[propName](...args)
      }
    }
  })

  const { created, attached } = createSetupHook({ type: 'Component', properties, setup })
  const sourceOptions = {
    properties,
    behaviors: behaviors,
    options: Object.assign({ multipleSlots: true }, innerOptions),
    externalClasses,
    relations,
    ...others,
    observers: {
      ...observers,
      ...propsObservers,
    },
    lifetimes: {
      ...lifetimes,
      created(this: Instance) {
        created.call(this)
        // @ts-ignore
        lifetimes.created && lifetimes.created.call(this)
      },
      attached(this: Instance) {
        // @ts-ignore
        attached.call(this)
        lifetimes.attached && lifetimes.attached.call(this)
      },
      detached(this: Instance) {
        detached.call(this)
        this[CORE_KEY].isUnmounted = true
        this[CORE_KEY].scope.stop()
      },
    },
    pageLifetimes,
    methods: {},
  }
  return Component(sourceOptions)
}
