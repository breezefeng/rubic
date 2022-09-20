import {
  EffectScope,
  effectScope,
  isReactive,
  isRef,
  markRaw,
  reactive,
  ref,
  toRaw,
  toRef,
  type Ref,
  type ToRefs,
  type UnwrapRef,
} from '@vue/reactivity'
import type { Flat, Method, PickKeysByType } from '../types'
import { isPlainObject } from '../utils'

type _DeepPartial<T> = { [K in keyof T]?: _DeepPartial<T[K]> }

type ActionsTree = Record<string, Method>

type StateTree = Record<string | number | symbol, any>

type StoreAction<SS> = Pick<SS, PickKeysByType<SS, Method>>
type StoreState<SS> = Omit<SS, PickKeysByType<SS, Method>>

export type Store<Id extends string = string, S extends StateTree = {}, A /* extends ActionsTree */ = {}> = {
  $id: Id
  $state: UnwrapRef<S>
  $patch(partialState: _DeepPartial<UnwrapRef<S>>): void
} & UnwrapRef<S> &
  // StoreWithActions<A> &
  (ActionsTree extends A ? {} : A)

type StoreGeneric = Store<string, StateTree, ActionsTree>

/**
 * Return type of `defineStore()`. Function that allows instantiating a store.
 */
export type StoreDefinition<Id extends string = string, S extends StateTree = StateTree, A = ActionsTree> = () => Flat<
  Store<Id, S, A>
>

type Pinia = {
  state: Ref<Record<string, StateTree>>
  _e: EffectScope
  _s: Map<string, StoreGeneric>
}

function createRootStore() {
  const scope = new EffectScope(true)
  const state = scope.run<Ref<Record<string, StateTree>>>(() => ref<Record<string, StateTree>>({}))!
  const pinia: Pinia = markRaw({
    _e: scope,
    _s: new Map<string, StoreGeneric>(),
    state,
  })
  return pinia
}

const rootStore = createRootStore()

export const resetRootStore = () => {
  rootStore._e = new EffectScope(true)
  rootStore._s = new Map<string, StoreGeneric>()
  rootStore.state = rootStore._e.run<Ref<Record<string, StateTree>>>(() => ref<Record<string, StateTree>>({}))!
}

function mergeReactiveObjects<T extends StateTree>(target: T, patchToApply: _DeepPartial<T>): T {
  // Handle Map instances
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value))
  }
  // Handle Set instances
  if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target)
  }

  // no need to go through symbols because they cannot be serialized anyway
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key)) continue
    const subPatch = patchToApply[key]
    const targetValue = target[key]
    if (
      isPlainObject(targetValue) &&
      isPlainObject(subPatch) &&
      target.hasOwnProperty(key) &&
      !isRef(subPatch) &&
      !isReactive(subPatch)
    ) {
      // NOTE: here I wanted to warn about inconsistent types but it's not possible because in setup stores one might
      // start the value of a property as a certain type e.g. a Map, and then for some reason, during SSR, change that
      // to `undefined`. When trying to hydrate, we want to override the Map with `undefined`.
      target[key] = mergeReactiveObjects(targetValue, subPatch)
    } else {
      target[key] = subPatch
    }
  }

  return target
}

function createSetupStore<Id extends string, SS, S extends StateTree, A extends ActionsTree>(
  $id: Id,
  setup: () => SS
): Store<Id, S, A> {
  let scope!: EffectScope

  rootStore.state.value[$id] = {}

  function $patch(stateMutation: (state: UnwrapRef<S>) => void): void
  function $patch(partialState: _DeepPartial<UnwrapRef<S>>): void
  function $patch(partialStateOrMutator: _DeepPartial<UnwrapRef<S>> | ((state: UnwrapRef<S>) => void)): void {
    if (typeof partialStateOrMutator === 'function') {
      partialStateOrMutator(rootStore.state.value[$id] as UnwrapRef<S>)
    } else {
      mergeReactiveObjects(rootStore.state.value[$id], partialStateOrMutator)
    }
  }

  const partialStore = {
    $id,
    $patch,
  }

  const store: Store<Id, S, A> = reactive(
    Object.assign(
      {},
      partialStore
      // must be added later
      // setupStore
    )
  ) as unknown as Store<Id, S, A>

  // store the partial store now so the setup of stores can instantiate each other before they are finished without
  // creating infinite loops.
  rootStore._s.set($id, store)

  // TODO: idea create skipSerialize that marks properties as non serializable and they are skipped
  const setupStore = rootStore._e.run(() => {
    scope = effectScope()
    return scope.run(() => setup())
  })!

  // overwrite existing actions to support $onAction
  for (const key in setupStore) {
    const prop = setupStore[key]

    if (isRef(prop) || isReactive(prop)) {
      rootStore.state.value[$id][key] = prop
    } else if (typeof prop === 'function') {
      setupStore[key] = prop
    }
  }

  Object.assign(store, setupStore)
  // allows retrieving reactive objects with `storeToRefs()`. Must be called after assigning to the reactive object.
  // Make `storeToRefs()` work with `reactive()` #799
  Object.assign(toRaw(store), setupStore)

  // use this instead of a computed with setter to be able to create it anywhere
  // without linking the computed lifespan to wherever the store is first
  // created.
  Object.defineProperty(store, '$state', {
    get: () => rootStore.state.value[$id],
    set: state => {
      $patch($state => {
        Object.assign($state, state)
      })
    },
  })
  return store
}

export function defineStore<Id extends string, SS>(
  id: Id,
  setup: () => SS
): StoreDefinition<Id, StoreState<SS>, StoreAction<SS>> {
  function useStore(): Flat<Store<Id, StoreState<SS>, StoreAction<SS>>> {
    if (!rootStore._s.has(id)) {
      createSetupStore(id, setup)
    }
    const store: StoreGeneric = rootStore._s.get(id)!
    // StoreGeneric cannot be casted towards Store
    return store as any
  }

  useStore.$id = id

  return useStore
}

export function storeToRefs<SS extends StoreGeneric>(store: SS): ToRefs<StoreState<SS>> {
  store = toRaw(store)
  const refs = {} as ToRefs<StoreState<SS>>
  for (const key in store) {
    const value = store[key]
    if (isRef(value) || isReactive(value)) {
      // @ts-ignore
      refs[key] = toRef(store, key)
    }
  }
  return refs
}
