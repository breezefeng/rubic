import { describe, expect, test } from 'vitest'
import { diff } from '../src/diff'

describe('diff data', () => {
  test('number', () => {
    expect(diff({ a: 1 }, { a: -1 })).toStrictEqual({ a: -1 })
  })

  test('string', () => {
    expect(diff({ a: 1 }, { a: '1' })).toStrictEqual({ a: '1' })
  })

  test('boolean', () => {
    expect(diff({ a: false }, { a: true })).toStrictEqual({ a: true })
  })

  test('before the object does not exist', () => {
    expect(diff(undefined, { a: 1 })).toStrictEqual({ a: 1 })
    expect(diff(null, { a: 1 })).toStrictEqual({ a: 1 })
    expect(diff('', { a: 1 })).toStrictEqual({ a: 1 })
    expect(diff(false, { a: 1 })).toStrictEqual({ a: 1 })
    expect(diff(0, { a: 1 })).toStrictEqual({ a: 1 })
    expect(diff('', { a: 1 })).toStrictEqual({ a: 1 })
    expect(diff({}, { a: 1 })).toStrictEqual({ a: 1 })
  })

  test('after the object does not exist', () => {
    expect(diff({ a: 1 }, undefined)).toStrictEqual({})
    expect(diff({ a: 1 }, null)).toStrictEqual({})
    expect(diff({ a: 1 }, '')).toStrictEqual({})
    expect(diff({ a: 1 }, false)).toStrictEqual({})
    expect(diff({ a: 1 }, 0)).toStrictEqual({})
    expect(diff({ a: 1 }, {})).toStrictEqual({})
  })

  test('array', () => {
    expect(diff({}, { list: [] })).toStrictEqual({ list: [] })

    expect(diff({ list: [{ a: 1 }] }, { list: [{ a: 2 }] })).toStrictEqual({
      'list[0].a': 2,
    })

    expect(diff({ list: [{ a: 1 }] }, { list: [{ a: 2, b: 1 }] })).toStrictEqual({
      'list[0].a': 2,
      'list[0].b': 1,
    })

    expect(
      diff(
        {
          data: 1,
          list: [{ user: { name: 'Tom' } }, { user: { name: 'Jeck' } }],
        },
        {
          data: 2,
          list: [{ user: { name: 'Alice', age: 10 } }],
        }
      )
    ).toEqual({
      data: 2,
      list: [{ user: { name: 'Alice', age: 10 } }],
    })
  })

  test('object with depth', () => {
    const before = {
      list: [
        {
          a: 1,
          b: 2,
          c: [5, 5, 1],
        },
      ],
      user: {
        avatar: '',
        id: '',
      },
    }

    const after = {
      list: [
        {
          a: '1',
          b: 3,
          c: [5, 4, 1],
        },
      ],
      user: {
        avatar: '123',
        id: '1',
      },
    }

    expect(diff(before, after)).toStrictEqual({
      'list[0].a': '1',
      'list[0].b': 3,
      'list[0].c[1]': 4,
      'user.avatar': '123',
      'user.id': '1',
    })
  })

  test('the value of the target object is undefined', () => {
    expect(diff({ a: { b: 1 } }, { a: { b: undefined } })).toStrictEqual({
      'a.b': undefined,
    })
  })
})
