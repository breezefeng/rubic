import { describe, expect, test } from 'vitest'
import { registerPlugins, loadPlugin } from '../src/plugin'

const plugins: string[] = []
registerPlugins([
  {
    name: '1',
    setup(props, ctx, next) {
      plugins.push('a start')
      const nextRet = next ? next() : {}
      plugins.push('a end')
      return { ...nextRet, a: 'a' }
    },
  },
  {
    name: '2',
    setup(props, ctx, next) {
      plugins.push('b start')
      const nextRet = next ? next() : {}
      plugins.push('b end')
      return { ...nextRet, b: 'b' }
    },
  },
  {
    name: '3',
    setup(props, ctx) {
      plugins.push('c start')
      plugins.push('c end')
      return { c: 'c' }
    },
  },
  {
    name: '4',
    setup(props, ctx) {
      plugins.push('d start')
      plugins.push('d end')
      return { d: 'd' }
    },
  },
])

describe('middleware', () => {
  test('string keys', () => {
    const { setup: pageSetup } = loadPlugin(
      {
        setup() {
          plugins.push('page')
          return {}
        },
      },
      'Page'
    )
    const pageBinding = pageSetup({}, {})

    expect(pageBinding).toEqual({ c: 'c', d: 'd', b: 'b', a: 'a' })
    expect(plugins).toEqual(['a start', 'b start', 'c start', 'c end', 'd start', 'd end', 'page', 'b end', 'a end'])

    const { setup: componentSetup } = loadPlugin(
      {
        setup() {
          plugins.push('Component')
        },
      },
      'Component'
    )
    const componentBinding = componentSetup({}, {})

    expect(componentBinding).toEqual({ c: 'c', d: 'd', b: 'b', a: 'a' })
  })
})
