<p align="center">
  <a href="https://rubic.jaskang.vip" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://rubic.jaskang.vip/logo.svg" alt="Rubic logo">
  </a>
</p>

<p align="center">
  <a href="https://npmjs.com/package/rubic"><img src="https://img.shields.io/npm/v/rubic.svg" alt="npm package"></a>
  <a href="https://github.com/JasKang/rubic/actions/workflows/ci.yml"><img src="https://github.com/JasKang/rubic/actions/workflows/ci.yml/badge.svg?branch=main" alt="build status"></a>
  <a href='https://coveralls.io/github/JasKang/rubic?branch=main'><img src='https://coveralls.io/repos/github/JasKang/rubic/badge.svg?branch=main' alt='Coverage Status' /></a>
</p>

# Rubic

`Rubic` 是一个轻量级的小程序运行时框架，它继承 Vue3 的设计思路，并提供了与 Vue 一致的编程模型(组合式 API + 响应式 API)。它专注于 javascript 逻辑部分，为小程序提供更好的逻辑复用以及更灵活的代码组织能力。

[官方文档](https://rubic.jaskang.vip)

## 特性

- 响应性：基于 @vue/reactivity 的响应式能力。
- 组合式：与 vue3 一致的 Composition API 来描述组件逻辑。
- 类型化：灵活的 API 和完整的 TypeScript 类型。
- 轻量级：仅 30KB 的体积，无编译依赖，现有小程序可轻松接入。

## 示例：

```ts
import { definePage, ref, computed } from 'Rubic'

definePage({
  setup(query, ctx) {
    const count = ref(0)
    const double = computed(() => count.value * 2)

    const increment = () => {
      count.value++
    }
    return {
      count,
      double,
      increment,
    }
  },
})
```

```vue-html
<view bindtap="increment">{{count}} x2:{{double}}</view>
```
