# 生命周期钩子

每个小程序组件实例在创建时都需要经历一系列的初始化步骤，比如设置数据，挂载实例到 DOM，以及在数据改变时更新 DOM。在此过程中，它也会运行被称为生命周期钩子的函数，让开发者有机会在特定阶段运行自己的代码。

## 注册周期钩子

举例来说，`onReady` 钩子可以用来在页面初次渲染完成后运行代码：

```ts
definePage({
  setup() {
    onReady(() => {
      console.log(`页面初次渲染完成`)
    })
  },
})
```

还有其他一些钩子，会在实例生命周期的不同阶段被调用，比如 `onShow`、`onHide` 和 `onLoad`。所有生命周期钩子的完整参考及其用法请参考 [API 索引](../api/index.md)。
当调用 `onUnload` 时，`Rubic` 会自动将回调函数注册到当前正被初始化的组件实例上。这意味着这些钩子应当在组件初始化时被同步注册。例如，请不要这样做：

```ts
setTimeout(() => {
  onUnload(() => {
    // 异步注册时当前组件实例已丢失
    // 这将不会正常工作
  })
}, 100)
```

注意这并不意味着对 `onUnload` 的调用必须放在 setup() 内的词法上下文中。`onUnload()` 也可以在一个外部函数中调用，只要调用栈是同步的，且最终起源自 `setup()` 就可以。

## 对应关系

在 `createApp`、`definePage` 和 `defineComponent` 中可以用的生命周期注册函数以及对应关系如下：

### App 生命周期对应关系

- **`Rubic`** -> **`原生 App`**
- `setup` -> `onLaunch`
- `onAppShow` -> `onShow`
- `onAppHide` -> `onHide`
- `onError` -> `onError`
- `onPageNotFound` -> `onPageNotFound`
- `onUnhandledRejection` -> `onUnhandledRejection`
- `onThemeChange` -> `onThemeChange`

### Page 生命周期对应关系

- **`Rubic`** -> **`原生 Page`**
- `onLoad` -> `attached`
- `onUnload` -> `onUnload`
- `onShow` -> `onShow`
- `onHide` -> `onHide`
- `onReady` -> `onReady`
- `onResize` -> `onResize`
- `onPullDownRefresh` -> `onPullDownRefresh`
- `onReachBottom` -> `onReachBottom`
- `onAddToFavorites` -> `onAddToFavorites`
- `onTabItemTap` -> `onTabItemTap`
- `onSaveExitState` -> `onSaveExitState`
- `onShareAppMessage` -> `onShareAppMessage`
- `onShareTimeline` -> `onShareTimeline`
- `onPageScroll` -> `onPageScroll`

### Component 生命周期对应关系

- **`Rubic`** -> **`原生 Component`**
- `setup` -> `lifetimes -> attached`
- `onMoved`-> `lifetimes -> moved`
- `onDetached`-> `lifetimes -> detached`
- `onReady`-> `lifetimes -> ready`
- `onError`-> `lifetimes -> error`
- `onShow`-> `pageLifetimes -> show`
- `onHide`-> `pageLifetimes -> hide`
- `onResize`-> `pageLifetimes -> resize`
