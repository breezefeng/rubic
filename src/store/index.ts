import {
  EffectScope,
  effectScope,
  isReactive,
  isRef,
  reactive,
  readonly,
  toRaw,
  toRef,
  type ComputedRef,
  type ToRefs,
  type UnwrapRef,
} from '@vue/reactivity'
import { getCurrentInstance } from '../instance'
import type { Flat, Method } from '../types'

const STORE_EFFECT_SCOPE: EffectScope = effectScope(true)
const STORE_MAP = new Map<string, any>()

type _UnwrapAll<SS> = { [K in keyof SS]: UnwrapRef<SS[K]> }

type StateTree = Record<string | number | symbol, any>

type GettersTree<S extends StateTree> = Record<string, ((state: UnwrapRef<S>) => any) | (() => any)>

type ActionsTree = Record<string, (...args: any[]) => any>

type StoreWithGetters<G> = {
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R ? R : UnwrapRef<G[k]>
}

/**
 * Store type to build a store.
 */
export type Store<Id extends string = string, S extends StateTree = {}, G = {}, A = {}> = {
  readonly $id: Id
} & Readonly<UnwrapRef<S>> &
  StoreWithGetters<G> &
  // StoreWithActions<A> &
  (ActionsTree extends A ? {} : A)

type _ExtractStateFromSetupStore_Keys<SS> = keyof {
  [K in keyof SS as SS[K] extends Method | ComputedRef ? never : K]: any
}
type _ExtractActionsFromSetupStore_Keys<SS> = keyof {
  [K in keyof SS as SS[K] extends Method ? K : never]: any
}
type _ExtractGettersFromSetupStore_Keys<SS> = keyof {
  [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any
}

type _ExtractStateFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : _ExtractStateFromSetupStore_Keys<SS> extends keyof SS
  ? _UnwrapAll<Pick<SS, _ExtractStateFromSetupStore_Keys<SS>>>
  : never

export type _ExtractActionsFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : _ExtractActionsFromSetupStore_Keys<SS> extends keyof SS
  ? Pick<SS, _ExtractActionsFromSetupStore_Keys<SS>>
  : never

export type _ExtractGettersFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : _ExtractGettersFromSetupStore_Keys<SS> extends keyof SS
  ? Pick<SS, _ExtractGettersFromSetupStore_Keys<SS>>
  : never

/**
 * Return type of `defineStore()`. Function that allows instantiating a store.
 */
export type StoreDefinition<
  Id extends string = string,
  S extends StateTree = StateTree,
  G = GettersTree<S>,
  A = ActionsTree
> = () => Flat<Store<Id, S, G, A>>

type StoreGeneric = Store<string, StateTree, GettersTree<StateTree>, ActionsTree>

function createSetupStore<
  Id extends string,
  SS,
  S extends StateTree,
  G extends Record<string, Method>,
  A extends ActionsTree
>($id: Id, setup: () => SS): Store<Id, S, G, A> {
  let scope!: EffectScope
  const store: Store<Id, S, G, A> = reactive(Object.assign({ $id })) as unknown as Store<Id, S, G, A>
  const setupStore = STORE_EFFECT_SCOPE.run(() => {
    scope = effectScope()
    return scope.run(() => setup())
  })
  Object.assign(store, setupStore)
  const readonlyStore = readonly(store)
  STORE_MAP.set($id, readonlyStore)
  return readonlyStore as Store<Id, S, G, A>
}

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param id - id of the store (must be unique)
 * @param storeSetup - function that defines the store
 * @param options - extra options
 */
export function defineStore<Id extends string, SS>(
  id: Id,
  storeSetup: () => SS
): StoreDefinition<
  Id,
  _ExtractStateFromSetupStore<SS>,
  _ExtractGettersFromSetupStore<SS>,
  _ExtractActionsFromSetupStore<SS>
> {
  const useStore = () => {
    const currentInstance = getCurrentInstance()
    if (!STORE_MAP.has(id)) {
      createSetupStore(id, storeSetup)
    }
    const store: StoreGeneric = STORE_MAP.get(id)!
    return store as any
  }

  return useStore
}

export type StoreState<SS> = SS extends Store<string, infer S, GettersTree<StateTree>, ActionsTree>
  ? UnwrapRef<S>
  : _ExtractStateFromSetupStore<SS>

export type StoreGetters<SS> = SS extends Store<string, StateTree, infer G, ActionsTree>
  ? StoreWithGetters<G>
  : _ExtractGettersFromSetupStore<SS>

export function storeToRefs<SS extends StoreGeneric>(store: SS): ToRefs<StoreState<SS> & StoreGetters<SS>> {
  store = toRaw(store)
  const refs = {} as ToRefs<StoreState<SS> & StoreGetters<SS>>
  for (const key in store) {
    const value = store[key]
    if (isRef(value) || isReactive(value)) {
      // @ts-expect-error: the key is state or getter
      refs[key] = toRef(store, key)
    }
  }
  return refs
}
