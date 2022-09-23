# 页面

通过 `definePage` 函数注册小程序页面

> Rubic 为了统一页面和组件的 `setup` 执行时机（Page -> onLoad 与 Component -> attached 执行时机不一致）。 内部使用了 `behaviors` 来使页面支持 `attached`。所以 definePage 更接近于 [使用 Component 构造器构造页面](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html#%E4%BD%BF%E7%94%A8-Component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2)

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

## 页面参数

`setup` 第一个参数为页面接受的参数 `query`。这些参数需要在 `properties` 中声明。详情参考 -> [使用 Component 构造器构造页面](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html#%E4%BD%BF%E7%94%A8-Component-%E6%9E%84%E9%80%A0%E5%99%A8%E6%9E%84%E9%80%A0%E9%A1%B5%E9%9D%A2)

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
    query.paramC // 页面参数 paramA 的值 undefined
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

## 页面上下文

`setup` 第二个参数为当前页面实例 `ctx`，与原生小程序 Page 实例一致。且 `setup()` 中没有 `this`。

```ts
definePage({
  setup(query, ctx) {
    ctx.is
    ctx.id
    ctx.dataset
    ctx.triggerEvent
    ctx.createSelectorQuery
    ctx.createIntersectionObserver
    ctx.selectComponent
    ctx.animate
    ...
  },
})
```
