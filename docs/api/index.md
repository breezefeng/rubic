---
outline: deep
---

# API 索引

## setup

`setup()` 钩子是在页面和组件中使用组合式 API 的入口

我们可以使用响应式 API 来声明响应式的状态，在 `setup()` 函数中返回的对象会暴露给小程序模板，不需要使用 `setData` 函数。

**示例:**

```ts
defineComponent({
  setup() {
    const count = ref(0)
    return {
      count,
    }
  },
})
```

```handlebars
<view>{{count}}</view>
```

请注意在模板中访问从 `setup` 返回的 `ref` 时，它会自动浅层解包，因此你无须再在模板中为它写 `.value`。

## App

与小程序 `App` 相关的 API

### createApp

创建一个应用实例, `setup()` 对应 `onLaunch` 生命周期。

- **类型:**

  ```ts
  function createApp(options: AppOptions): void
  ```

  ```ts
  type AppOptions = {
    plugins?: Plugin[]
    setup: (options: LaunchShowOption) => Bindings | void
  }
  ```

- **详细信息:**

  参数 `options` 是一个选项对象，包括以下属性：

  - **plugins**

    插件数组，详情见[页面和组件插件](/guide/plugin)

  - **setup** :pushpin:

    app 入口函数，对应 `onLaunch` 生命周期，参数与其一致。返回的数据将会被绑定到 `app` 实例

- **示例:**

  ```ts
  createApp({
    plugins: [],
    setup(options) {
      return {
        globalData: {},
      }
    },
  })
  ```

  ```ts
  // pages/xxxx.js
  const { globalData } = getApp()
  ```
