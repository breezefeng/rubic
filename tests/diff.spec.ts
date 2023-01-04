import { render, sleep } from 'miniprogram-test-util'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { computed, CORE_KEY, defineComponent, reactive, ref } from '../src'
import { diff } from '../src/utils'

describe('setData', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('reactive binding', async () => {
    const ret = diff(
      {
        data: 1,
        list: [{ user: { name: 'Tom' } }, { user: { name: 'Jeck' } }],
      },
      {
        data: 2,
        list: [{ user: { name: 'Alice', age: 10 } }],
      }
    )
    expect(ret).toEqual({
      data: 2,
      'list[0].user.name': 'Alice',
      'list[0].user.age': 10,
    })
  })
})
