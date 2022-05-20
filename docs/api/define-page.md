# definePage

创建页面，接受一个 Object 类型的参数。

#### 声明:

```ts
export declare function definePage(options: PageOptions): void
```

#### 参数：

具有 `setup` 选项的对象，其他参数与小程序 [Page](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html) 函数的参数一致

| Parameter  | Type                                      | Description                     |
| ---------- | ----------------------------------------- | ------------------------------- |
| properties | string[]                                  | 页面参数                        |
| setup      | (query: P, ctx: PageInstance) => Bindings | 组合式 API 入口                 |
| options    | {styleIsolation}                          | 原小程序 Component -> options   |
| behaviors  | string[]                                  | 原小程序 Component -> behaviors |

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
  properties: ['paramA', 'paramB'],
  setup(query, ctx) {
    return {}
  },
})
```
