# 简介

::: tip 注意
使用本框架需开发者对 Vue 响应性和组合式 API 有基本的了解，本文档不会过多重复这部分的内容，详情请移步[Vue 官方文档](https://staging-cn.vuejs.org/guide/introduction.html)

且 Rubic 的开发参考了多个社区方案，其中包括 [miniprogram-composition-api](https://github.com/clevok/miniprogram-composition-api)、 [vue-mini](https://github.com/vue-mini/vue-mini)、[miniprogram-computed](https://github.com/wechat-miniprogram/computed) 、[mobx-miniprogram](https://github.com/wechat-miniprogram/mobx-miniprogram-bindings) 等
:::

## Rubic 是什么

Rubic 是一个轻量级的小程序开发框架，它继承 Vue 的设计思路，并提供了与 Vue 一致的编程模型。它能帮助你高效地开发小程序，无论任务是简单还是复杂。

与通常的开发方案不同的是 Rubic 仅仅是一个轻量的运行时库，它既不依赖任何编译步骤，也不涉及任何 Virtual DOM。并且从一开始就被设计为能跟小程序原生语法协同工作，你能在同一个页面或组件内混用原生语法，这能让你很轻松的将其整合进既有项目中。当然，你也能完全使用 Rubic 开发一个小程序。

**核心功能**

组合式：通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。

响应性：框架会自动跟踪 JavaScript 状态变化并在改变发生时响应式地调用 setData 更新界面。

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
  组合式 API 最基本的优势是它使我们能够通过组合函数来实现更加简洁高效的逻辑复用。它解决了 behaviors 的缺陷，那是选项式 API 中一种逻辑复用机制。

  组合式 API 提供的更多逻辑复用可能性，可以形成一些不断成长的工具型可组合函数集合。

- **更灵活的代码组织**
  许多用户都喜欢选项式 API，因为在默认情况下就能够写出有组织的代码：任何东西都有其对应的选项来管理。然而，选项式 API 在单个组件的逻辑复杂到一定程度时，也面临了一些无法忽视的限制。这些限制主要体现在需要处理多个逻辑关注点的组件中，在许多已经上线的小程序代码中可以看到这一点。

## 它是如何工作的？

框架底层直接依赖于 [@vue/reactivity](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)。事实上，你可以简单的将 Rubic 理解为 Vue 与小程序的绑定。它会在适当的时机调用 `setup` 函数，并监听返回的响应式数据，如果数据变化了，就调用 `setData` 通知小程序。如果返回的是方法，就将其添加到小程序上。如果你在 `setup` 函数内调用生命周期钩子函数，Rubic 也会将其动态注入到小程序上。

## 兼容性

框架响应性能力直接依赖 [@vue/reactivity]，所以需要运行环境原生支持 `Proxy`。

- iOS: >= iOS 10
- Android: >= Android 5.0
- 微信小程序基础库: >= v2.11.0

[小程序的基础库 ECMAScript 支持表](https://wechat-miniprogram.github.io/miniprogram-compat/#2_11_0)

## 还有其他问题？

请查看我们的 FAQ。