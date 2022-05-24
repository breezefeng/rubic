# 页面注册

使用 `definePage` 函数注册页面。

## 基础示例

```ts
// page.js
import { definePage, reactive, computed } from 'rubic'

definePage({
  properties: ['queryA']
  setup(query, context) {
    const count = ref(0)

    function increment() {
      count.value++
    }

    return {
      count,
      increment
    }
  }
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

- **参数 `query`：** 当前页面参数，必须在 [properties](#properties) 中提前声明

  ```ts
  // page.js
  import { definePage } from 'rubic'

  definePage({
    properties: ['channel', 'id'],
    setup(query, context) {
      // query 为打开当前页面路径中的参数
      query.id
      query.channel
    },
  })
  ```

- **参数`context`**：当前页面实例，原小程序页面 `this` 。

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
    },
  })
  ```

注意 `setup` 返回的 ref 在模板中会自动解开，不需要写 `.value`。

::: tip
setup 对应的小程序组件 attached 生命周期。
:::

## 页面参数

页面中所用到的参数需要显式声明 `properties` 选项，这样页面才能正常获取到外部传入的 query 参数。

当访问路径 /pages/index?paramA=A&parmaB=B&paramC=C

```ts
import { definePage } from 'rubic'

definePage({
  properties: ['paramA', 'paramB'],
  setup(query, context) {
    console.log(query.paramA)
    // A
    console.log(query.paramB)
    // B
    console.log(query.paramC)
    // undefined，未在 queryProps 中定义的参数无法获取到
  },
})
```

#### 无法确定请求参数的场景

在实际业务需求中会有一些无法确定请求参数的场景，例如：用于中转的 redirect 页面等，这时候我们可以使用 `onLoad` 生命周期钩子来获取完整的页面参数。

```ts
import { definePage, onLoad } from 'rubic'

definePage({
  properties: ['paramA', 'paramB'],
  setup(query, context) {
    console.log(query)
    // { paramA: 'A', parmaB: 'B' }

    onLoad(options => {
      console.log(options) // 此处可以获取到完整的页面参数
      // { paramA: 'A', parmaB: 'B', paramC: 'C' }
    })
  },
})
```

::: info
无法在 setup 阶段直接获取未声明的页面参数是由于小程序机制问题导致的。曾尝试解决此问题，但由于代价太大放弃。
:::

## 生命周期

框架导出了一系列组合式 API 来注册生命周期钩子。它们的命名和 Page 原始生命周期一致

这些函数接受一个回调，该回调的参数与对应的生命周期一致，当钩子被实例调用时，该回调将被执行。 且 onX 函数大都能被多次调用，依赖返回值的将会使用最后一次的返回值。

使用示例：

```js
// page.js
import { definePage, onShow, onHide, onShareAppMessage } from 'rubic'

definePage({
  setup() {
    onShow(() => {
      console.log('show')
    })
    onHide(() => {
      console.log('hide')
    })
    onShareAppMessage(() => {
      return {
        title: '自定义转发标题',
        path: '/page/user?id=123',
        promise,
      }
    })
  },
})
```

这些生命周期钩子注册函数只能在 `setup()` 期间同步使用，其他场景下调用这些函数会抛出一个错误。

在 `setup()` 内同步创建的侦听器和计算状态会在页面销毁时自动删除。

### 钩子函数的返回值

对应有返回值的钩子函数，将按照调用顺序使用最后一份返回值。

```ts
// page.js
import { definePage, onPageScroll, onShareAppMessage, onShareTimeline } from 'rubic'

definePage({
  setup() {
    onShareAppMessage(() => ({
      title: '自定义转发标题1',
      path: '/page/user?id=1',
    }))
    // 后面的将会覆盖前面的
    onShareAppMessage(() => ({
      title: '自定义转发标题2',
      path: '/page/user?id=2',
    }))
  },
})
```

### 生命周期对应关系

各生命周期详情可查看[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)

- `原生代码` -> `使用框架`
- `attached` -> `setup`
- `onLoad` -> `onLoad`
- `onShow` -> `onShow`
- `onReady` -> `onReady`
- `onHide` -> `onHide`
- `onUnload` -> `onUnload`
- `onPullDownRefresh` -> `onPullDownRefresh`
- `onReachBottom` -> `onReachBottom`
- `onAddToFavorites` -> `onAddToFavorites`
- `onResize` -> `onResize`
- `onTabItemTap` -> `onTabItemTap`
- `onPageScroll` -> `onPageScroll`
- `onShareAppMessage` -> `onShareAppMessage`
- `onShareTimeline` -> `onShareTimeline`

::: tip
为了统一页面和组件的 setup 执行顺序，definePage 底层使用了 Component 来实现，具体详情可查看小程序官方文档: [使用 Component 构造器构造页面](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html#%E4%BD%BF%E7%94%A8-Component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2)
:::
