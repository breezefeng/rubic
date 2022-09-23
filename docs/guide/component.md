# 页面

通过 `defineComponent` 函数注册小程序页面

::: tip 注意
`defineComponent` 和 `definePage` 的区别在于两者的 `properties` 不同。

- 在 defineComponent 中 `properties` 表示组件**属性**
- 在 definePage 中 `properties` 表示页面路径的**参数**

:::

## 定义一个页面

`setup` 为入口函数，对应小程序的 `attach` 生命周期，`setup()` 返回值将会暴露给小程序模板，可以直接在模板中使用。

```ts
defineComponent({
  setup(props, ctx) {
    const count = ref(0)
    const increment = () => {
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
<view bindtap="increment">{{count}}</view>
```

## 组件属性 `props`

`setup` 函数的第一个参数是组件的 `props`，这些属性需要在 `properties` 中声明。一个 `setup` 函数的 `props` 是响应式的，并且会在传入新的 `props` 时同步更新。

### 访问 Props

请注意如果你解构了 `props` 对象，解构出的变量将会丢失响应性。因此我们推荐通过 `props.xxx` 的形式来使用其中的 props。

```ts
defineComponent({
  properties: {
    title: String,
  },
  setup(props, ctx) {
    console.log(props.title)
  },
})
```

如果你确实需要解构 `props` 对象，或者需要将某个 prop 传到一个外部函数中并保持响应性，那么你可以使用 toRefs() 和 toRef() 这两个工具函数：

```ts
defineComponent({
  setup(props) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props)
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value)

    // 或者，将 `props` 的单个属性转为一个 ref
    const title = toRef(props, 'title')
  },
})
```

### properties 声明

`properties` 的声明和原生小程序类似，`type` 支持了数组并移除了 `optionalTypes`。参见 [:link: properties](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html#properties-%E5%AE%9A%E4%B9%89)

```ts
defineComponent({
  properties: {
    min: Number,
    max: {
      type: Number,
      value: 0,
    },
    lastLeaf: {
      // 这个属性可以是 Number 、 String 、 Boolean 三种类型中的一种
      type: [Number, String, Object],
    },
  },
  setup(props, ctx) {
    console.log(props.min)
    console.log(props.max)
    console.log(props.lastLeaf)
  },
})
```

属性的类型可以为 `String` `Number` `Boolean` `Object` `Array` 其一，也可以为 `null` 表示不限制类型。

多数情况下，属性最好指定一个确切的类型。这样，在 WXML 中以字面量指定属性值时，值可以获得一个确切的类型，如：

```vue-html
<custom-comp min="1" max="5" />
```

此时，由于自定义组件的对应属性被规定为 `Number` 类型， min 和 max 会被赋值为 1 和 5 ，而非 "1" 和 "5" ，即：

```ts
props.min === 1 // true
props.max === 5 // true
```

## 组件上下文 `ctx`

传入 `setup` 函数的第二个参数是一个`组件上下文`对象，与原生小程序 Component 实例一致。

```ts
defineComponent({
  setup(props, ctx) {
    // 组件的文件路径
    console.log(ctx.is)
    // 节点 dataset
    console.log(ctx.dataset)
    // 选择器
    console.log(ctx.createSelectorQuery)
    // 触发事件（函数，等价于 triggerEvent）
    console.log(ctx.triggerEvent)
    // 动画（函数）
    console.log(ctx.animate)
  },
})
```

该上下文对象是非响应式的，可以安全地解构：

```ts
defineComponent({
  setup(props, { dataset, triggerEvent }) {
    ...
  }
})
```

::: tip 注意
`setup()` 中没有 `this`，`ctx` 包含了当前实例所有可用属性和方法。
:::

## 其他选项

### `behaviors`

defineComponent 同样支持 `behaviors`，参见 [:link: behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)

```ts
defineComponent({
  behaviors: [],
  setup(props, ctx) {},
})
```

### externalClasses

组件接受的外部样式类，参见 [:link: 外部样式类](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E5%A4%96%E9%83%A8%E6%A0%B7%E5%BC%8F%E7%B1%BB)

```ts
defineComponent({
  externalClasses: ['my-class'],
})
```

### options

组件选项，同 [:link: Component 构造器](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html) 中的 `options`。

- `multipleSlots` boolean

  启用多 slot 支持，参见 [:link: 组件 wxml 的 slot](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6-wxml-%E7%9A%84-slot)

- `virtualHost` boolean

  虚拟化组件节点，参见 [:link: 虚拟化组件节点](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E8%99%9A%E6%8B%9F%E5%8C%96%E7%BB%84%E4%BB%B6%E8%8A%82%E7%82%B9)

- `styleIsolation` 'isolated' | 'apply-shared' | 'shared'

  组件样式隔离，参见 [:link: 组件样式隔离](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB)

```ts
defineComponent({
  options: {
    multipleSlots: true,
    virtualHost: true,
    styleIsolation: 'apply-shared',
  },
  setup(props, ctx) {},
})
```

### relations

组件间关系定义，参见 [:link: 组件间关系](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/relations.html)

```ts
/* 组件 custom-component.js */
defineComponent({
  relations: {
    './custom-li': {
      type: 'child', // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有 custom-li 被插入时执行，target是该节点实例对象，触发在该节点 attached 生命周期之后
      },
      linkChanged: function (target) {
        // 每次有 custom-li 被移动后执行，target是该节点实例对象，触发在该节点 moved 生命周期之后
      },
      unlinked: function (target) {
        // 每次有 custom-li 被移除时执行，target是该节点实例对象，触发在该节点 detached 生命周期之后
      },
    },
  },
})
```
