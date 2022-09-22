# 创建小程序

## 应用实例

通过 createApp 函数创建一个新的小程序实例，`setup` 组合式 API 入口，对应 `onLaunch` 生命周期，参数与 `onLaunch` 一致。返回的数据将会被绑定到 app 实例

```ts
// app.js
import { createApp } from 'rubic'

createApp({
  setup(options, ctx) {
    console.log(options.path) //	启动小程序的路径 (代码包路径)
    console.log(options.scene) //	启动小程序的场景值
    console.log(options.query) //	启动小程序的 query 参数
    // ...
    return {
      appName: 'hello rubic',
    }
  },
})
```

`setup` 拥有两个参数 `options` 和 `ctx`

- `options`

  小程序启动参数，与 `wx.getLaunchOptionsSync` 一致。

- `ctx`

  当前 `app` 实例，与小程序 `this` 一致。

## 生命周期

可以通过导入 `onXXX` 来注册生命周期回调函数，它们接收的参数与原生小程序 `App` 对应的生命周期一致，每个 `onXXX` 函数都能被多次调用。

App 生命周期注册函数只能在 `setup` 中调用，否则将抛出异常。

**示例：**

```ts
import { createApp, onAppShow, onError } from 'rubic'

createApp({
  setup(options, ctx) {
    onAppShow(() => {
      console.log('onAppShow 1')
    })
    onAppShow(() => {
      console.log('onAppShow 2')
    })
    onAppHide(() => {
      console.log('onAppHide')
    })
    onError(err => {
      console.log('onError:', err)
    })
  },
})
```

这些生命周期钩子注册函数只能在 `setup()` 期间同步使用，因为它们依赖于内部的全局状态来定位当前活动的实例。在没有当前活动实例的情况下，调用它们将会出错。

### 生命周期对应关系

`createApp` 中可用的生命周期注册函数和原生小程序对应关系如下

- **`Rubic`** -> **`原生`**
- `onLaunch` -> `onLaunch`
- `onAppShow` -> `onShow`
- `onAppHide` -> `onHide`
- `onError` -> `onError`
- `onPageNotFound` -> `onPageNotFound`
- `onUnhandledRejection` -> `onUnhandledRejection`
- `onThemeChange` -> `onThemeChange`

## 数据绑定

由于 `createApp` 返回的数据将会被绑定到 app 实例，所以通过 `getApp()` 来获取对应的数据

```ts
import { createApp } from 'rubic'

createApp({
  setup() {
    return {
      globalData: 'I am global data',
    }
  },
})
```

```ts
const app = getApp()
console.log(app.globalData) // I am global data
```

## 插件配置

`createApp` 中 `plugins` 选项用于为全局页面和组件添加全局功能。详情参考 -> [插件](./plugin.md)

```ts
import { createApp } from 'rubic'

createApp({
  plugins: [myPlugin]
  setup() {
  },
})
```
