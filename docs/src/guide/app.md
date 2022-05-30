# 创建小程序

## 注册小程序 createApp

注册小程序。在小程序 app.js 文件中使用 `createApp()` 函数替换小程序原生的 `App()`

```ts
function createApp(options: AppOptions): void
```

示例：

```ts
// app.js
import { createApp } from 'rubic'

createApp({
  setup() {
    return {}
  },
})
```

## 参数 AppOptions

`createApp()` 所接收的参数

| Name    | Type                              | Description     |
| ------- | --------------------------------- | --------------- |
| setup   | () => Record<string, any> \| void | 组合式 API 入口 |
| plugins | Plugin[]                          | 插件            |

- **setup**：组合式 API 入口
- **plugins**：全局作用域于的页面和组件插件，详情见[插件](./plugin.md)

## setup

`setup` 函数会在小程序启动的第一时间执行，返回的对象将会被原样合并到小程序实例上。

```js
createApp({
  setup() {
    return {
      hello: 'Hello World!',
    }
  },
})

// xxx.js
const app = getApp()
console.log(app.hello) // Hello World!
console.log(app.context) // {}
```

## 生命周期

可以通过直接导入 `onAppX` 函数来注册生命周期钩子，它们接收的参数与对应的生命周期一致，每个 `onAppX` 函数都能被多次调用。

使用示例：

```js
import { createApp, onAppLaunch, onAppShow, onAppError } from 'rubic'

createApp({
  setup() {
    onAppLaunch(options => {
      console.log('onLaunch options:', options)
    })
    onAppShow(options => {
      console.log('onShow options:', options)
    })
    onAppError(err => {
      console.log('error:', err)
    })
  },
})
```

这些生命周期钩子注册函数只能在 setup() 期间同步使用，因为它们依赖于内部的全局状态来定位当前活动的实例 (此时正在调用其 setup() 的组件实例)。在没有当前活动实例的情况下，调用它们将会出错。

### 生命周期对应关系

小程序 App 生命周期全部以 `onAppXXX` 的形式导出。

| `原生代码`             | `使用框架`                |
| ---------------------- | ------------------------- |
| `onLaunch`             | `onAppLaunch`             |
| `onShow`               | `onAppShow`               |
| `onHide`               | `onAppHide`               |
| `onError`              | `onAppError`              |
| `onPageNotFound`       | `onAppPageNotFound`       |
| `onUnhandledRejection` | `onAppUnhandledRejection` |
| `onThemeChange`        | `onAppThemeChange`        |

:::tip
加上 `onXXX` 改为 `onAppXXX` 是为了明确 App 与 Component 的区别。如 `onShow`、`onHide` 同时存在于 App 和 Component 但他们的参数并不相同，不利于 Typescript 类型推断。
:::
