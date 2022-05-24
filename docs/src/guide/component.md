# 定义组件

使用 `defineComponent` 函数注册组件。

## 基础示例

```js
// component.js
import { defineComponent, reactive, computed } from 'rubic'

defineComponent({
  setup() {
    const count = ref(0)

    function increment() {
      count.value++
    }

    return {
      count,
      increment,
    }
  },
})
```

```vue-html
<!-- page.wxml -->
<button bindtap="increment">
  Count is: {{ state.count }}
</button>
```

## setup 函数

`setup` 函数是组合式 API 的核心，返回的数据和方法会被合并到页面实例上，可以直接在组件模版中使用。

- **参数 `props`：** 组件接收到的 properties

  `props` 对象是响应式的，可以用 `watchEffect` 或 `watch` 观察和响应 `props` 的更新，也可以基于 `props` 生成新的计算状态。

  ```ts
  // page.js
  import { definePage } from 'rubic'

  definePage({
    properties: {
      title: {
        type: String,
        value: '默认标题',
      },
      icon: {
        type: String,
      },
    },
    setup(props, context) {
      const { title, icon } = toRefs(props)

      return {
        title,
        icon,
      }
    },
  })
  ```

  ```vue-html
  <view >
    <view wx:if="{{ icon }}">{{ icon }}</view>
     {{ title }}
  </view>
  ```

- **参数`context`**：当前组件实例，原小程序组件 `this` 。

  包含以下属性和方法，详情请见[小程序组件文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html)

  ```ts
  definePage({
    setup(query, ctx) {
      // 属性
      ctx.is
      ctx.id
      ctx.dataset
      ctx.data
      ctx.properties
      // 方法
      ctx.hasBehavior
      ctx.triggerEvent
      ctx.createSelectorQuery
      ctx.createIntersectionObserver
      ctx.createMediaQueryObserver
      ctx.selectComponent
      ctx.selectAllComponents
      ctx.selectOwnerComponent
      ctx.getRelationNodes
      ctx.groupSetData
      ctx.getTabBar
      ctx.getPageId
      ctx.animate
      ctx.clearAnimation
      ctx.setUpdatePerformanceListener
      ...
    },
  })
  ```

注意 `setup` 返回的 ref 在模板中会自动解开，不需要写 `.value`。

::: tip
setup 对应的小程序组件 attached 生命周期。
:::

## properties 声明

`properties` 的声明与小程序原生语法类似，差别在于 `type` 直接支持了数组，移除了 `optionalTypes` 和 `observer`

```js
// component.js
import { defineComponent } from 'rubic'

defineComponent({
  properties: {
    title: String, // 基础写法
    icon: {
      type: String,
      value: 'success', // 默认值
    },
    count: {
      type: [String, Number], // 类型支持数组
    },
  },
  setup(props) {
    console.log(props.title)
    console.log(props.icon)
    console.log(props.count)
  },
})
```

::: warning
但是，因为 props 是响应式的，你不能使用 ES6 解构，它会消除 prop 的响应性。
:::

如果需要解构 prop，可以在 setup 函数中使用 toRefs 函数来完成此操作：

```js
// component.js
import { defineComponent, watchEffect } from 'rubic'

defineComponent({
  properties: {
    count: Number,
  },
  setup({ count }) {
    watchEffect(() => {
      console.log('count is: ' + count) // 失去响应式能力
    })
  },
})
```

```js
// component.js
import { defineComponent, watchEffect, toRefs } from 'rubic'

defineComponent({
  properties: {
    count: Number,
  },
  setup(props) {
    const { count } = toRefs(props)
    watchEffect(() => {
      console.log('count is: ' + count.value) // 具有响应式能力
    })
  },
})
```

## 生命周期

框架导出了一系列组合式 API 来注册生命周期钩子。它们的命名和 Component 原始生命周期一一对应

这些函数接受一个回调，该回调的参数与对应的生命周期一致，当钩子被实例调用时，该回调将被执行。 且 onX 函数大都能被多次调用，依赖返回值的将会使用最后一次的返回值。

```js
// component.js
import { defineComponent, onReady, onMoved, onDetached } from 'rubic'

createApp({
  setup() {
    onReady(() => {
      console.log('ready')
    })
    onMoved(() => {
      console.log('move')
    })
    onDetached(() => {
      console.log('detach')
    })
  },
})
```

这些生命周期钩子注册函数只能在 `setup()` 期间同步使用，其他场景下调用这些函数会抛出一个错误。

在 `setup()` 内同步创建的侦听器和计算状态会在页面销毁时自动删除。

::: info 没有 created
框架并没有 `onCreate` 钩子函数，这是因为 `setup` 是在 `attached` 阶段执行的，此时 `created` 生命周期已经执行完毕了。
:::

### 生命周期对应关系

- `原生代码` -> `使用框架`
- `lifetimes.created` -> `无`
- `lifetimes.attached` -> `setup`
- `lifetimes.ready` -> `onReady`
- `lifetimes.moved` -> `onMoved`
- `lifetimes.detached` -> `onDetached`
- `lifetimes.error` -> `onError`
- `pageLifetimes.show` -> `onShow`
- `pageLifetimes.hide` -> `onHide`
- `pageLifetimes.resize` -> `onResize`
