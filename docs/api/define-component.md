# defineComponent

创建自定义组件，接受一个 Object 类型的参数。

## defineComponent

#### 声明:

```ts
export declare function defineComponent(options: ComponentOptions): void
```

#### 参数:

具有 `setup` 选项的对象，其他参数与小程序 [Component](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html) 函数的参数一致

| Parameter | Type                     | Description                                              |
| --------- | ------------------------ | -------------------------------------------------------- |
| setup     | (props, ctx) => bindings | props: 组件接收的参数, 响应式对象 <br> ctx: 页面实例对象 |
| 其他      | -                        | 其他参数与小程序相同                                     |

#### setup

如果 `setup` 返回一个对象，则对象的属性将会被合并到组件实例上，可以直接在组件模版中使用。

- `props`: 组件 property

  组件所定义 properties 的值，props 为响应式对象。

- `ctx`: 组件实例对象，包含一下属性:
  - is
  - id
  - query
  - dataset
  - triggerEvent
  - createSelectorQuery
  - createIntersectionObserver
  - selectComponent
  - selectAllComponents
  - selectOwnerComponent
  - getRelationNodes
  - getTabBar
  - getPageId
  - animate
  - clearAnimation
  - getOpenerEventChannel

```ts

import { defineComponent, toRefs } from 'rubic'

defineComponent({
  properties: {
    title: String
  }
  setup(props, ctx) {
    const { title } = toRefs(props)
    const text = computed(()=> {
      return `hello ${title.value}`
    })
    return { text }
  }
})

```
