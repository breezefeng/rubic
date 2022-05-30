# 简介

::: tip 注意
使用本框架需开发者对 Vue 响应性和组合式 API 有基本的了解，本文档不会过多重复这部分的内容，详情请移步[Vue 官方文档](https://staging-cn.vuejs.org/guide/introduction.html)

且 Rubic 的开发参考了多个社区方案，其中包括 [vue-mini](https://github.com/vue-mini/vue-mini)、[miniprogram-composition-api](https://github.com/clevok/miniprogram-composition-api)、[miniprogram-computed](https://github.com/wechat-miniprogram/computed) 等
:::

## Rubic 是什么

Rubic 是一个轻量级的小程序运行时库，专注于 javascript 逻辑部分，不涉及 wxss 和 wxml。它继承了 Vue 的设计思路，并提供了与 Vue 一致的 Composition API 和响应性能力。

与通常的小程序框架不同的是，Rubic 不依赖任何编译步骤，直接使用 npm 引入即可。大部分小程序都可以方便快捷的接入。

- **Composition API**：通过组合式 API，可以使用导入的 API 函数来描述组件逻辑。

- **Reactivity**：响应式能力，框架会自动跟踪 JavaScript 状态变化并在合适的时机调用 setData 更新界面。

下面是一个最基本的组件示例：

```ts
import { defineComponent } from 'rubic'

defineComponent({
  properties:{
    title: String
  }
  setup(props,ctx) {
    const count = ref(0)
    return {
      count
    }
  },
})
```

```vue-html
<view> Count is: {{ count }} </view>
```

## 为什么

- **更好的逻辑复用**

  组合式 API 最基本的优势是它使我们能够通过组合函数来实现更加简洁高效的逻辑复用。

  组合式 API 提供的更多逻辑复用可能性，可以形成一些不断成长的工具型可组合函数集合。

- **更灵活的代码组织**

  许多用户都喜欢选项式 API，因为在默认情况下就能够写出有组织的代码：任何东西都有其对应的选项来管理。然而，选项式 API 在单个组件的逻辑复杂到一定程度时，也面临了一些无法忽视的限制。这些限制主要体现在需要处理多个逻辑关注点的组件中，在许多已经上线的小程序代码中可以看到这一点。

## 兼容性

框架响应性能力直接依赖 [@vue/reactivity]，所以需要运行环境原生支持 `Proxy`。

- iOS: >= iOS 10
- Android: >= Android 5.0
- 微信小程序基础库: >= v2.11.0

[小程序的基础库 ECMAScript 支持表](https://wechat-miniprogram.github.io/miniprogram-compat/#2_11_0)

## 还有其他问题？

请查看我们的 FAQ。
