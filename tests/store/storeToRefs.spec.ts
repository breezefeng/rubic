import { describe, beforeEach, it, expect } from 'vitest'
import { computed, defineStore, reactive, ref, storeToRefs, type ToRefs } from '../../src'
import { resetRootStore } from '../../src/store'

describe('storeToRefs', () => {
  beforeEach(() => {
    resetRootStore()
  })

  function objectOfRefs<O extends Record<any, any>>(o: O): ToRefs<O> {
    return Object.keys(o).reduce((newO, key) => {
      // @ts-expect-error: we only need to match
      newO[key] = expect.objectContaining({ value: o[key] })
      return newO
    }, {} as ToRefs<O>)
  }

  it('empty state', () => {
    expect(storeToRefs(defineStore('a', () => {})())).toEqual({})
  })

  it('setup store', () => {
    const store = defineStore('a', () => {
      return {
        a: ref<null | undefined>(null),
        b: ref(false),
        c: ref(1),
        d: ref('d'),
        r: reactive({ n: 1 }),
      }
    })()

    const { a, b, c, d, r } = storeToRefs(store)

    expect(a.value).toBe(null)
    expect(b.value).toBe(false)
    expect(c.value).toBe(1)
    expect(d.value).toBe('d')
    expect(r.value).toEqual({ n: 1 })

    a.value = undefined
    expect(a.value).toBe(undefined)

    b.value = true
    expect(b.value).toBe(true)

    c.value = 2
    expect(c.value).toBe(2)

    d.value = 'e'
    expect(d.value).toBe('e')

    r.value.n++
    expect(r.value).toEqual({ n: 2 })
    expect(store.r).toEqual({ n: 2 })
    store.r.n++
    expect(r.value).toEqual({ n: 3 })
    expect(store.r).toEqual({ n: 3 })
  })

  tds(() => {
    const store1 = defineStore('a', () => {
      const n = ref(0)
      const double = computed(() => n.value * 2)
      return { n, double }
    })()

    storeToRefs(store1).double
  })

  function tds(_fn: Function) {}
})
