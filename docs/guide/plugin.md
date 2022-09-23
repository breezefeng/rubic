# 插件

`plugin` 用以处理页面和组件中全局通用共享的特性，类似于 `mixins` 或 `behaviors`。与组合式函数不同之处在于它不再需要在具体的页面和组件中显示调用，能有效的减少与当前业务无关的信息干扰。

::: tip
文中统一由 `bindings` 代表 `setup` 返回值，也就是绑定到 wxml 的数据和方法。
:::

```ts
import { createApp } from 'Rubic'

createApp({
  plugins: [],
})
```

## Plugin 类型

```ts
export type Plugin = {
  name: string
  type?: 'Page' | 'Component'
  config?: (options: PageOptions | ComponentOptions) => void
  setup?: (props: any, ctx: any, next?: () => Bindings) => Bindings
}
```

## Plugin `config()`

`config()` 是对 `definePage` / `defineComponent` 函数参数的一个 `hook` ,改函数允许开发者修改 `options` 值。

类型定义为: `(options: PageOptions | ComponentOptions) => void`

- **案例一**

  为小程序所有页面添加 channel 参数声明：

  ```ts
  const channelPlugin: Plugin = {
    name: '全局通用参数 channel',
    type: 'Page', // 指定类型为 Page
    options(options) {
      // 所有页面的 properties 添加 channel 声明
      options.properties = Object.assign(options.properties, { channel: String })
    },
    setup(query, ctx) {
      console.log(query.channel)
    },
  }

  createApp({
    plugins: [channelPlugin],
  })
  ```

  ```ts
  // pages/index?channel=test
  definePage({
    setup(query, ctx) {
      // channel 已在 channelPlugin 中声明，所以此处可以正常获取到
      console.log(query.channel) // 'test'
    },
  })
  ```

- **案例二**

  使小程序所有组件默认开启 multipleSlots ：

  ```ts
  export const multipleSlotsPlugin: Plugin = {
    name: '全局通用参数 channel',
    type: 'Component', // 指定类型为 Component
    options(options) {
      // 所有组件的 multipleSlots 默认为 true
      options.options = Object.assign({ multipleSlots: true }, options.options)
    },
    setup(props, ctx) {},
  }

  createApp({
    plugins: [multipleSlotsPlugin],
  })
  ```

  ```ts
  // component/test
  defineComponent({
    options: {
      // multipleSlots: true 已经由插件开启 multipleSlots，无需再次设置
    },
    setup(query, ctx) {},
  })
  ```

## Plugin `setup()`

插件 `setup()` 函数为中间件能力核心，类似 koa, express 中的中间件，它是对组件 `setup` 的扩充。

该函数接收三个参数：`props`、`ctx` 和 `next`。其中 `props`、`ctx` 与组件中 setup 的参数一致，`next` 表示下一个中间件

类型定义为:

`(props: Record<string, any>, ctx: any, next?: () => Bindings) => Bindings`

### 方式一

当插件 `setup()` 函数没有定义 `next` 参数时，返回值会自动与组件 `bindings` 合并。 即：`{...pluginSetupBindings,...setupBindings}`

如下代码为组件 `ctx` 添加 `$currentPage` 属性，并将 `$currentPage` 暴露给 `wxml`。

```ts
createApp({
  plugins: [
    {
      name: 'currentPage',
      type: 'Component',
      setup: (props, ctx) => {
        const pages = getCurrentPages()
        ctx.$currentPage = pages[pages.length - 1]
        return {
          $currentPage,
        }
      },
    },
  ],
})
```

```ts
defineComponent({
  setup(props, ctx) {
    console.log(ctx.$currentPage)
  },
})
```

```vue-html
<view>{{$currentPage}}</view>
```

示例中的代码执行顺序为： `c start` -> `d start` -> `page setup`

此时 bindings 为: `{ c:'c', d:'d', data:'page data'}`

### 方式二

当插件 `setup()` 函数定义了 `next` 参数时当前流程采用 `洋葱模型` ，开发者需要自行调用 `next` 函数和处理 bindings。

如下代码定义 a , b 两个中间件：

```js
import { defineConfig, definePage } from 'Rubic'

defineConfig({
  pageMiddlewares: [
    {
      setupProcess(props, ctx, next) {
        console.log('a start')
        const bindings = next()
        console.log('a end')
        return { ...bindings, a: 'a' }
      },
    },
    {
      setupProcess(props, ctx, next) {
        console.log('b start')
        const bindings = next()
        console.log('b end')
        return { ...bindings, b: 'b' }
      },
    },
  ],
})

// page.js
definePage({
  setup(props, ctx) {
    console.log('page setup')
    return { data: 'page data' }
  },
})
```

示例中的代码执行顺序为： `a start` -> `b start` -> `page setup` -> `b end` -> `a end`

此时 bindings 为: `{data:'page data', b:'b', a:'a' }`, data 为当前 Page/Component 的绑定值

::: warning
使用`洋葱模型`时，开发者需要谨慎处理 bindings 并避免定义了 next 而忘记调用，这将会导致下游 `setup` 未执行或 `bindings` 丢失。
:::
