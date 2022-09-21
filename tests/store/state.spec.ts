import { beforeEach, describe, it, expect, vi } from 'vitest'
import { computed, defineStore, nextTick, reactive, ref, watch } from '../../src'
import { resetRootStore } from '../../src/store'

describe('State', () => {
  beforeEach(() => {
    resetRootStore()
  })

  const useStore = defineStore('main', () => ({
    name: ref('Eduardo'),
    counter: ref(0),
    nested: reactive({ n: 0 }),
  }))

  it('can directly access state at the store level', () => {
    const store = useStore()
    expect(store.name).toBe('Eduardo')
    store.name = 'Ed'
    expect(store.name).toBe('Ed')
  })

  it('state is reactive', () => {
    const store = useStore()
    const upperCased = computed(() => store.name.toUpperCase())
    expect(upperCased.value).toBe('EDUARDO')
    store.name = 'Ed'
    expect(upperCased.value).toBe('ED')
  })

  it('can be set with patch', () => {
    const store = useStore()

    store.$patch({ name: 'a' })

    expect(store.name).toBe('a')
    expect(store.$state.name).toBe('a')
  })

  it('can be set on store', () => {
    const store = useStore()

    store.name = 'a'

    expect(store.name).toBe('a')
    expect(store.$state.name).toBe('a')
  })

  it('can be set on store.$state', () => {
    const store = useStore()

    store.$state.name = 'a'

    expect(store.name).toBe('a')
    expect(store.$state.name).toBe('a')
  })

  it('can be nested set with patch', () => {
    const store = useStore()

    store.$patch({ nested: { n: 3 } })

    expect(store.nested.n).toBe(3)
    expect(store.$state.nested.n).toBe(3)
  })

  it('can be nested set on store', () => {
    const store = useStore()

    store.nested.n = 3

    expect(store.nested.n).toBe(3)
    expect(store.$state.nested.n).toBe(3)
  })

  it('can be nested set on store.$state', () => {
    const store = useStore()

    store.$state.nested.n = 3

    expect(store.nested.n).toBe(3)
    expect(store.$state.nested.n).toBe(3)
  })

  it('state can be watched', async () => {
    const store = useStore()
    const spy = vi.fn()
    watch(() => store.name, spy)
    expect(spy).not.toHaveBeenCalled()
    store.name = 'Ed'
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('state can be watched when a ref is given', async () => {
    const store = useStore()
    const spy = vi.fn()
    watch(() => store.name, spy)
    expect(spy).not.toHaveBeenCalled()
    const nameRef = ref('Ed')
    store.$state.name = nameRef.value
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('can be given a ref', () => {
    const store = useStore()

    // If the ref is directly set to the store, it won't work,
    // it must be set into the `store.$state` so it connects to pinia
    // store.name = ref('Ed')

    store.$state.name = ref('Ed').value

    expect(store.name).toBe('Ed')
    expect(store.$state.name).toBe('Ed')

    store.name = 'Other'
    expect(store.name).toBe('Other')
    expect(store.$state.name).toBe('Other')
  })

  it('unwraps refs', () => {
    const name = ref('Eduardo')
    const counter = ref(0)
    const double = computed({
      get: () => counter.value * 2,
      set(val) {
        counter.value = val / 2
      },
    })

    const useStore = defineStore('main', () => ({
      name,
      counter,
      double,
    }))

    const store = useStore()

    expect(store.name).toBe('Eduardo')
    expect(store.$state.name).toBe('Eduardo')
    expect(store.$state).toEqual({
      name: 'Eduardo',
      double: 0,
      counter: 0,
    })

    name.value = 'Ed'
    expect(store.name).toBe('Ed')
    expect(store.$state.name).toBe('Ed')

    store.name = 'Edu'
    expect(store.name).toBe('Edu')

    store.$patch({ counter: 2 })
    expect(store.counter).toBe(2)
    expect(counter.value).toBe(2)
  })
})
