---
outline: deep
---

# API 索引

## setup

`setup()` 钩子是在页面和组件中使用组合式 API 的入口

我们可以使用响应式 API 来声明响应式的状态，在 `setup()` 函数中返回的对象会暴露给小程序模板，不需要使用 `setData` 函数。

**示例:**

```ts
definePage({
  setup() {
    const count = ref(0)
    // 返回值会暴露给模板
    return {
      count,
    }
  },
})
// or
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

请注意在模板中访问从 `setup` 返回的 `ref` 时，它会自动浅层解包，因此你无须再在模板中为它写 .value。

## App

与小程序 `App` 相关的 API

### createApp

创建一个应用实例

- **类型:**

  ```ts
  function createApp(options: AppOptions): void
  ```

  ```ts
  type AppOptions = {
    plugins?: Plugin[]
    setup: AppSetup
  }
  ```

- **详细信息:**

  参数 `options` 是一个组件选项对象，setup

  #### plugins 插件

  #### setup

- **示例:**
