# 插件

`plugin` 用以处理全局通用共享的特性，类似于 `mixins` 或 `behaviors`。与 `hooks` 不同之处在于它不再需要在具体的页面和组件中显示调用，能有效的减少与当前业务无关的信息干扰。

```js
import { createApp, onLoad } from 'rubic'

createApp({
  plugins: [
    {
      name: '插件 a'
      type: 'Page'
      setup(query, ctx) {
        onLoad(() => {
          console.log('onLoad in plugin')
        })
      },
    },
  ]
})
```

## Plugin 类型

| 参数    | 类型                               | 说明              |
| ------- | ---------------------------------- | ----------------- |
| name    | string                             | 插件名称          |
| type    | undefined \| 'Page' \| 'Component' | 插件类型          |
| options | PluginOptions                      | 处理 options 函数 |
| setup   | PluginSetup                        | setup 函数        |

### options

`options` 是对 definePage / defineComponent 函数参数 options 的一个钩子 ,该函数允许对 `options` 值进行修改。

类型定义为:

`(options: ComponentBaseOptions) => void `

常用于给 Page 添加全局支持的 query 参数

如下代码使全局 Page 支持 wtag 参数：

```js
createApp({
  plugin: [
    {
      name: '全局支持 externalClasses',
      type: 'Component',
      options(options) {
        options.externalClasses = ['myClass']
        return options
      },
    },
  ],
})
```

### setup

`setup` 为中间件能力核心，提供了普通 [串行模型](#串行模型)，以及类似 koa, express 中的 [洋葱模型](#洋葱模型), 该函数接收三个参数：props、ctx 和 next。其中 props、ctx 与 Page/Component 中 setup 的参数一致，`next` 表示下一个中间件

类型定义为:

`(props: Record<string, any>, ctx: Instance, next?: () => void | Bindings) => void | Bindings`

#### 串行模型

当 `setup` 函数没有定义 `next` 参数时当前流程采用`串行模型` ，返回值会自动合并到 setup bindings

如下代码定义 a , b 两个中间件：

```js
import { defineConfig, definePage } from 'rubic'

createApp({
  plugins: [
    {
      name: '插件 a',
      type: 'Page',
      setup(props, ctx) {
        console.log('a start')
        return { a: 'a' }
      },
    },
    {
      name: '插件 b',
      type: 'Page',
      setupProcess(props, ctx, next) {
        console.log('b start')
        return { b: 'b' }
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

示例中的代码执行顺序为： `a start` -> `b start` -> `page setup`

此时 bindings 为: `{ a:'a', b:'b', data:'page data'}`

#### 洋葱模型

当 `setup` 函数定义了 `next` 参数时当前流程采用 `洋葱模型` ，开发者需要自行调用 `next` 函数和处理 bindings。

如下代码定义 a , b 两个中间件：

```js
import { defineConfig, definePage } from 'rubic'

createApp({
  plugins: [
    {
      name: '插件 a',
      type: 'Page',
      setupProcess(props, ctx, next) {
        console.log('a start')
        const bindings = next()
        console.log('a end')
        return { ...bindings, a: 'a' }
      },
    },
    {
      name: '插件 b',
      type: 'Page',
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

此时 bindings 为: `{data:'page data', b:'b', a:'a' }`, data 为当前 Page 的绑定值

::: warning
使用`洋葱模型`时，开发者需要谨慎处理 bindings 并避免定义了 next 而忘记调用，这将会导致下游 setup 未执行或 bindings 丢失。
:::
