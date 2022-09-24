# 响应式

`Rubic` 依赖 `@vue/reactivity` 提供响应式能力，并直接导出了其中常用的一系列 api。

为了更深入的理解响应式原理，建议阅读 Vue 官网文档中的以下章节:

- [响应式基础](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [深入响应式系统](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)

## 响应式 API

详细信息参见 -> [:link: Vue 响应式 API 文档](https://cn.vuejs.org/api/reactivity-core.html)

- `ref()`
- `computed ()`
- `reactive()`
- `readonly()`
- `watchEffect()`
- `watch()`
- `isRef()`
- `unref()`
- `toRef()`
- `toRefs()`
- `isProxy()`
- `isReactive()`
- `isReadonly()`
- `shallowRef()`
- `triggerRef()`
- `customRef()`
- `shallowReactive()`
- `shallowReadonly()`
- `toRaw()`
- `markRaw()`

### 示例

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
