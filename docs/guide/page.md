# 页面

通过 `definePage` 函数注册小程序页面

::: tip 注意
`defineComponent` 和 `definePage` 的区别在于两者的 `properties` 不同。

- 在 defineComponent 中 `properties` 表示组件**属性**
- 在 definePage 中 `properties` 表示页面路径的**参数**

:::

## 定义一个页面

`setup` 为入口函数，对应小程序的 `attach` 生命周期，`setup()` 返回值将会暴露给小程序模板，可以直接在模板中使用。

```ts
definePage({
  setup(query, ctx) {
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

## 页面参数 `query`

`setup` 第一个参数为页面接受的参数 `query`。这些参数需要在 `properties` 中声明。详情参考 -> [:link: 使用 Component 构造器构造页面](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html#%E4%BD%BF%E7%94%A8-Component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2)

### 声明参数

如访问页面 /pages/index/index?paramA=123&paramB=xyz，如果声明有属性 paramA 或 paramB ，则它们会被赋值为 123 或 xyz 。

```ts
definePage({
  properties: {
    paramA: Number,
    paramB: String,
  },
  setup(query, ctx) {
    query.paramA // 页面参数 paramA 的值 123
    query.paramB // 页面参数 paramB 的值 'xyz'
  },
})
```

properties 声明格式参见 [](./component.md#properties-%E5%A3%B0%E6%98%8E)

### 未声明的参数

如果参数未在 `properties` 声明，则无法从 `setup` 中获取。

如访问页面 /pages/index/index?paramA=123&paramB=xyz&paramC=abc。

```ts
definePage({
  properties: {
    paramA: Number,
    paramB: String,
    // paramC: String
  },
  setup(query, ctx) {
    query.paramC // 页面参数 paramC 的值 undefined
  },
})
```

在遇到无法预知页面参数的情况下，可以使用 `onLoad` 生命周期钩子来获取完整参数，`onLoad` 的参数 `options` 为当前页面完整参数无需声明。

```ts
definePage({
  properties: {
    // paramC: String
  },
  setup(query, ctx) {
    // query 中的值必须在 properties 中声明
    onLoad(options => {
      options.paramA // 页面参数 paramA 的值 123
      options.paramB // 页面参数 paramB 的值 'xyz'
      options.paramC // 页面参数 paramB 的值 'abc'
    })
  },
})
```

## 页面上下文 `ctx`

传入 `setup` 函数的第二个参数是一个`组件上下文`对象，与原生小程序 Page 实例一致。

```ts
definePage({
  setup(query, ctx) {
    // 组件的文件路径
    console.log(ctx.is)
    // 节点 dataset
    console.log(ctx.dataset)
    // 选择器
    console.log(ctx.createSelectorQuery)
    // 动画（函数）
    console.log(ctx.animate)
  },
})
```

该上下文对象是非响应式的，可以安全地解构：

```ts
definePage({
  setup(props, { triggerEvent }) {
    ...
  }
})
```

`setup()` 中没有 `this`，`ctx` 包含了当前实例所有可用属性和方法。

## 其他选项

### `behaviors`

definePage 同样支持 `behaviors`，参见 [:link: behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)

```ts
definePage({
  behaviors: [],
  setup(query, ctx) {},
})
```

### `options`

页面的组件选项，同 [:link: Component 构造器](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html) 中的 `options`。

```ts
definePage({
  options: {
    styleIsolation: 'apply-shared',
  },
  setup(query, ctx) {},
})
```

::: tip 提示
Rubic 为了统一页面和组件的 `setup` 执行时机（Page -> onLoad 与 Component -> attached 执行时机不一致）。 内部使用了 `behaviors` 来使 Page 支持 `attached`。
:::
