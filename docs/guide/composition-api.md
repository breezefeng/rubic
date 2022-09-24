# 组合式 API

组合式 API 是从 vue3 移植而来,它是 `Rubic` 最核心的能力。

## 什么是组合式 API？

组合式 API 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写小程序组件。它是一个概括性的术语，涵盖了以下方面的 API：

- 响应性 API：例如 `ref()` 和 `reactive()`，使我们可以直接创建响应式状态、计算属性和侦听器。

- 生命周期钩子：例如 `onLoad()` 和 `onUnLoad()`，使我们可以在页面各个生命周期阶段添加逻辑。

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。这种形式更加自由，也需要你对响应式系统有更深的理解才能高效使用。相应的，它的灵活性也使得组织和重用逻辑的模式变得更加强大。

下面是一个使用组合式 API 的组件示例：

```ts
import { onResize } from 'Rubic'

function useWindowSize() {
  const windowInfo = wx.getWindowInfo()
  const width = ref(windowInfo.windowWidth)
  const height = ref(windowInfo.windowHeight)

  onResize(({ size }) => {
    width.value = size.windowWidth
    height.value = size.windowHeight
  })
  return { width, height }
}
```

```ts
definePage({
  setup(query, ctx) {
    const { width, height } = useWindowSize()

    return {
      width,
      height,
    }
  },
})
```

```vue-html
<view>width: {{width}} height: {{height}}</view>
```
