import { sleep, render } from 'miniprogram-test-util'
import { describe, expect, test } from 'vitest'
import { defineComponent, ref } from '../src'
import { diff } from '../src/diff'

describe('diff data', () => {
  test('基础 - 数字', () => {
    expect(diff({ a: 1 }, { a: -1 })).toStrictEqual({ a: -1 })
  })

  test('基础 - 字符串', () => {
    expect(diff({ a: 1 }, { a: '1' })).toStrictEqual({ a: '1' })
  })

  test('基础 - 布尔', () => {
    expect(diff({ a: false }, { a: true })).toStrictEqual({ a: true })
  })

  test('目标为对象', () => {
    expect(diff({ d: undefined }, { d: { a: 1 } })).toStrictEqual({ d: { a: 1 } })
    expect(diff({ d: null }, { d: { a: 1 } })).toStrictEqual({ d: { a: 1 } })
    expect(diff({ d: '' }, { d: { a: 1 } })).toStrictEqual({ d: { a: 1 } })
    expect(diff({ d: false }, { d: { a: 1 } })).toStrictEqual({ d: { a: 1 } })
    expect(diff({ d: 0 }, { d: { a: 1 } })).toStrictEqual({ d: { a: 1 } })
    expect(diff({ d: {} }, { d: { a: 1 } })).toStrictEqual({ 'd.a': 1 })
  })

  test('目标非对象', () => {
    expect(diff({ d: { a: 1 } }, { d: undefined })).toStrictEqual({ d: undefined })
    expect(diff({ d: { a: 1 } }, { d: null })).toStrictEqual({ d: null })
    expect(diff({ d: { a: 1 } }, { d: '' })).toStrictEqual({ d: '' })
    expect(diff({ d: { a: 1 } }, { d: false })).toStrictEqual({ d: false })
    expect(diff({ d: { a: 1 } }, { d: 0 })).toStrictEqual({ d: 0 })
    expect(diff({ d: { a: 1 } }, { d: {} })).toStrictEqual({ d: {} })
  })

  test('新增属性', () => {
    expect(diff({ d: { a: 1 } }, { d: { a: 1, b: 2 } })).toStrictEqual({ 'd.b': 2 })
    expect(diff({ d: { a: 1 } }, { d: { a: 1, b: 2 }, c: 1 })).toStrictEqual({ c: 1, 'd.b': 2 })
    expect(diff({ d: { a: 1 } }, { d: { a: 1, b: { c: 1 } } })).toStrictEqual({ 'd.b': { c: 1 } })
  })

  test('删除属性', () => {
    expect(diff({ d: { b: 1 } }, { d: { a: 1 } })).toStrictEqual({ d: { a: 1 } })
    expect(diff({ d: { a: 1, b: 2 } }, { d: { a: 1, b: undefined } })).toStrictEqual({
      d: { a: 1, b: undefined },
    })
    expect(diff({ d: { b: 1 } }, { d: {} })).toStrictEqual({ d: {} })
  })
  test('数组 - 新增', () => {
    expect(diff({}, { list: [] })).toStrictEqual({ list: [] })
  })
  test('数组 - 修改 item 对象', () => {
    expect(diff({ list: [{ a: 1 }] }, { list: [{ a: 2 }] })).toStrictEqual({
      'list[0].a': 2,
    })
  })
  test('数组 - 修改 item 对象', () => {
    expect(diff({ list: [{ a: 1 }] }, { list: [{ a: 2 }] })).toStrictEqual({
      'list[0].a': 2,
    })

    expect(diff({ list: [{ a: 1 }] }, { list: [{ a: 2, b: 1 }] })).toStrictEqual({
      'list[0].a': 2,
      'list[0].b': 1,
    })

    expect(diff({ list: [{ a: 1 }] }, { list: [{}] })).toStrictEqual({
      'list[0]': {},
    })

    expect(diff({ list: [{ a: 1, b: 2 }] }, { list: [{ a: 1 }] })).toStrictEqual({
      'list[0]': { a: 1 },
    })
    expect(diff({ list: [{ a: 1, b: 2 }] }, { list: [{ a: 2 }] })).toStrictEqual({
      'list[0]': { a: 2 },
    })
    expect(diff({ list: [{ a: 1, b: 2 }] }, { list: [{ a: 2, b: 2, c: 2 }] })).toStrictEqual({
      'list[0].a': 2,
      'list[0].c': 2,
    })
  })
  test('数组 - 删除 item 直接替换', () => {
    expect(
      diff(
        { list: [{ user: { name: 'Tom' } }, { user: { name: 'Jeck' } }] },
        { list: [{ user: { name: 'Alice', age: 10 } }] }
      )
    ).toEqual({
      list: [{ user: { name: 'Alice', age: 10 } }],
    })
  })

  test('object with depth', () => {
    expect(
      diff(
        { list: [{ a: 1, b: 2, c: [5, 5, 1] }], user: { avatar: '', id: '' } },
        { list: [{ a: '1', b: 3, c: [5, 4, 1] }], user: { avatar: '123', id: '1' } }
      )
    ).toStrictEqual({
      'list[0].a': '1',
      'list[0].b': 3,
      'list[0].c[1]': 4,
      'user.avatar': '123',
      'user.id': '1',
    })
  })

  test('setData 调用次数', async () => {
    const comp = await render(
      defineComponent({
        setup(props, ctx) {
          const index = ref(1)
          return {
            index,
            onChange: () => {
              if (index.value > 1) {
                index.value = 0
              } else {
                index.value++
              }
            },
          }
        },
      }),
      {
        template: `{{index}}`,
      }
    )
    await sleep()
    expect(comp.dom?.innerHTML).toEqual('1')
    comp.instance.onChange()
    await sleep()
    expect(comp.dom?.innerHTML).toEqual('2')
    comp.instance.onChange()
    await sleep()
    expect(comp.dom?.innerHTML).toEqual('0')
  })
})
