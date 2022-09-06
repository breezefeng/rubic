import { describe, expect, test } from 'vitest'
import { createApp, ref, computed, watchEffect, nextTick, onAppShow } from '../src'
import { launchApp, mockConsole } from './mock'

// console.log(process.env)

const launchOptions: WechatMiniprogram.App.LaunchShowOption = {
  path: '/pages/test',
  query: { a: 'a' },
  scene: 1001,
  shareTicket: '',
}

describe('app', () => {
  test('create', async () => {
    const app = await launchApp(() =>
      createApp({
        setup() {},
      })
    )
    expect(app).toBeDefined()
  })

  test('bindings', async () => {
    const app = await launchApp(() =>
      createApp({
        setup() {
          const num = 0
          const count = ref(0)
          const double = computed(() => count.value * 2)
          const increment = (): void => {
            count.value++
          }

          return {
            num,
            count,
            double,
            increment,
          }
        },
      })
    )

    app.onLaunch(launchOptions)
    expect(app.num).toBe(0)
    expect(app.count.value).toBe(0)
    expect(app.double.value).toBe(0)

    let dummy
    watchEffect(() => {
      dummy = app.count.value
    })
    await nextTick()
    expect(dummy).toBe(0)

    app.increment()
    expect(app.count.value).toBe(1)
    expect(app.double.value).toBe(2)

    await nextTick()
    expect(dummy).toBe(1)
  })

  test('lifetimes', async () => {
    const calledKeys: string[] = []
    const app = await launchApp(() =>
      createApp({
        setup() {
          onAppShow(options => {
            calledKeys.push(`onAppShow0:${options.path}`)
          })
          onAppShow(options => {
            calledKeys.push(`onAppShow1:${options.path}`)
          })
        },
      })
    )
    app.onShow(launchOptions)
    expect(calledKeys[0]).toBe('onAppShow0:/pages/test')
    expect(calledKeys[1]).toBe('onAppShow1:/pages/test')
  })
  test('lifetime outside setup', async () => {
    expect(() => {
      onAppShow(() => {})
    }).toThrowError('当前没有实例 无法调用 onShow 钩子.')
  })
})
