# definePage

创建页面，接受一个 Object 类型的参数。

#### 声明:

```ts
export declare function definePage(options: PageOptions): void
```

#### 参数：

具有 `setupOptions` 和 `setup` 选项的对象，其他参数与小程序 [Page](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html) 函数的参数一致

| Parameter    | Type                     | Description                            |
| ------------ | ------------------------ | -------------------------------------- |
| setupOptions | [SetupOptions]           | 页面额外配置                           |
| setup        | (query, ctx) => bindings | query: 页面参数 <br> ctx: 页面实例对象 |
| 其他         | -                        | 其他参数与小程序相同                   |

#### setupOptions 页面额外配置

- `enablePageScroll`: boolean

  是否允许调用 onPageScroll，默认为 false

- `enableShareAppMessage`: boolean

  是否允许调用 onShareAppMessage，默认为 false

- `enableShareTimeline`: boolean

  是否允许调用 onShareTimeline，默认为 false

#### setup

如果 `setup` 返回一个对象，则对象的属性将会被合并到组件实例上，可以直接在组件模版中使用。

- `query`: 页面参数

  页面中用到所有的参数均需要在 `properties` 中提前定义，如未定义就使用框架将抛出一个 warn

- `ctx`: 页面实例对象, 包含一下属性:
  - is
  - route
  - options
  - createSelectorQuery
  - createIntersectionObserver
  - selectComponent
  - selectAllComponents
  - getTabBar
  - getPageId
  - animate
  - clearAnimation
  - getOpenerEventChannel

#### 参考：

```ts
import { definePage } from 'rubic'

definePage({
  queryProps: {
    a: String,
    b: String,
  },
  setupOptions: {
    enablePageScroll: true,
    enableShareAppMessage: true,
    enableShareTimeline: true,
  },
  setup(query, ctx) {
    const { a, b } = query
    return {}
  },
})
```
