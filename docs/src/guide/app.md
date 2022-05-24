# 创建小程序

## 应用实例

在小程序 app.js 文件中使用 `createApp()` 函数替换原生的 `App()`

```js
// app.js
import { createApp } from 'rubic'

createApp({
  setup() {
    return {}
  },
})
```

## setup

`createApp` 接收一个 `setup` 选项，`setup` 会在小程序启动的第一时间执行，返回的对象将会被原样合并到小程序实例上。

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

- `原生代码` -> `使用框架`
- `onLaunch` -> `onAppLaunch`
- `onShow` -> `onAppShow`
- `onHide` -> `onAppHide`
- `onError` -> `onAppError`
- `onPageNotFound` -> `onAppPageNotFound`
- `onUnhandledRejection` -> `onAppUnhandledRejection`
- `onThemeChange` -> `onAppThemeChange`
