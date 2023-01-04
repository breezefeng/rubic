import { render, sleep } from 'miniprogram-test-util'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { computed, CORE_KEY, defineComponent, reactive, ref } from '../src'

describe('setData', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  test('set data times', async () => {
    const fn = vi.fn()
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
    await sleep()
    expect(fn).toBeCalledTimes(1)
    expect(comp.data).toEqual({
      name: 'jaskang',
      info: {},
      list: [{ id: 1 }, { id: 2 }, { id: 3 }],
    })
    comp.instance[CORE_KEY].bindings.list.value[2].id = 4
    await sleep()
    expect(fn).toBeCalledTimes(2)
    expect(comp.data).toEqual({
      name: 'jaskang',
      info: {},
      list: [{ id: 1 }, { id: 2 }, { id: 4 }],
    })
  })

  test('set data merge', async () => {
    const fn = vi.fn()
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
    await sleep()
    expect(fn).toBeCalledTimes(1)
    comp.instance[CORE_KEY].bindings.list.value[2].id = 4
    comp.instance[CORE_KEY].bindings.info.text = 'hello world'
    await sleep()
    expect(fn).toBeCalledTimes(2)
    expect(comp.data).toEqual({
      name: 'jaskang',
      info: { text: 'hello world' },
      list: [{ id: 1 }, { id: 2 }, { id: 4 }],
    })
  })

  test('set data nexttick', async () => {
    const fn = vi.fn()
    let html
    const comp = render(
      defineComponent({
        setup(props, ctx) {
          const originSetData = ctx.setData as any
          ctx.setData = (data, cb) => {
            return originSetData(data, () => {
              if (cb) {
                setTimeout(() => {
                  cb()
                }, 0)
              }
            })
          }
          const name = ref('jaskang')
          const info = reactive({})
          const list = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
          const change = () => {
            list.value[1].id++
            ctx.$nextTick(() => {
              fn()
              html = comp.dom?.innerHTML
            })
          }
          return {
            name,
            info,
            list,
            change,
          }
        },
      }),
      {
        template: `{{list[1].id}}`,
      }
    )
    await sleep()
    expect(fn).toBeCalledTimes(0)
    comp.instance.change()
    await sleep()
    expect(fn).toBeCalledTimes(0)
    expect(html).toBe(undefined)
    await sleep(0)
    expect(fn).toBeCalledTimes(1)
    expect(html).toBe('3')
  })
})
