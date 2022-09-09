import { render, sleep } from 'miniprogram-test-util'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { CORE_KEY, defineComponent, reactive, ref } from '../src'

describe('setData', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  test('set data times', async () => {
    const fn = vi.fn((...args: any[]) => {
      console.log(...args)
    })
    const comp = render(
      defineComponent({
        setup(props, ctx) {
          const originSetData = ctx.setData as any
          ctx.setData = (...args: any[]) => {
            fn(...args)
            return originSetData(...args)
          }
          const name = ref('jaskang')
          const info = reactive({})
          const list = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
          return {
            name,
            info,
            list,
          }
        },
      })
    )
    expect(fn).toBeCalledTimes(1)
    comp.instance[CORE_KEY].bindings.list.value[2].id = 4
    comp.instance[CORE_KEY].bindings.info.text = 'hello world'
    await sleep()
    expect(fn).toBeCalledTimes(2)
  })
})
