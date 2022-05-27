# 响应式

框架依赖 `@vue/reactivity` 提供响应式能力，并直接导出了其中常用的一系列 api，该部分文档仅介绍响应式基础。

::: tip 注意
为了更深入的理解响应式原理，建议阅读 Vue 官网文档中的以下章节:

- [响应式基础](https://staging-cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [深入响应式系统](https://staging-cn.vuejs.org/guide/extras/reactivity-in-depth.html)
  :::

## `reactive()` 声明响应式

我们可以使用 reactive() 函数创建一个响应式对象或数组：

```ts
import { reactive } from 'rubic'

// 响应式状态
const state = reactive({ count: 0 })
```

要在小程序模板中使用响应式状态，请在 `setup()` 函数中定义并返回。

```ts
import { definePage, reactive } from 'rubic'

definePage({
  setup() {
    const state = reactive({ count: 0 })

    // 暴露 state 到模板
    return {
      state,
    }
  },
})
```

```vue-html
<view>{{ state.count }}</view>
```

相似地，我们也可以在这个作用域下定义可更改响应式 state 的函数，并作为一个方法与 state 一起暴露出去：

```ts
import { definePage, reactive } from 'vue'

definePage({
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // 不要忘记同时暴露 increment 函数
    return {
      state,
      increment,
    }
  },
})
```

暴露的方法通常会被用作事件监听器：

```vue-html
<button bind:tap="increment">
{{ state.count }}
</button>
```

### `reactive()` 的局限性

reactive() API 有两条限制：

- 仅对对象类型有效（对象、数组和 Map、Set 这样的集合类型），而对 string、number 和 boolean 这样的 原始类型 无效。

- 因为 Vue 的响应式系统是通过 property 访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着我们不可以随意地 “替换” 一个响应式对象：

```ts
let state = reactive({ count: 0 })

// 这行不通！
state = reactive({ count: 1 })
```

## `ref()` 定义响应式变量

为了解决 `reactive()` 带来的限制，提供了一个 `ref()` 方法来允许我们创建可以使用任何值类型的响应式 **ref**：

```ts
import { ref } from 'vue'

const count = ref(0)
```

`ref()` 从参数中获取到值，将其包装为一个带 `.value` property 的 **ref** 对象：

```ts
import { ref } from 'rubic'

const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

和响应式对象的 property 类似，ref 的 `.value` property 也是响应式的。同时，当值为对象类型时，会用 `reactive()` 自动转换它的 `.value`。

一个包含对象类型值的 ref 可以响应式地替换整个对象：

```ts
const objectRef = ref({ count: 0 })

// 这是响应式的替换
objectRef.value = { count: 1 }
```

ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性：

```ts
const obj = {
  foo: ref(1),
  bar: ref(2),
}

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
const { foo, bar } = obj
```

`ref()` 使我们能创造一种任意值的 “引用” 并能够不丢失响应性地随意传递。这个功能非常重要，因为它经常用于将逻辑提取到 组合函数 中。

### ref 在模板中的解包

当 ref 在模板中作为顶层 property 被访问时，它们会被自动“解包”，所以不需要使用 `.value`。下面是之前的计数器例子，用 `ref()` 代替：

```ts
import { definePage, reactive } from 'vue'

definePage({
  setup() {
    const count = ref(0)

    function increment() {
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
<button @click="increment">
  {{ count }} <!-- 无需 .value -->
</button>
```

## `computed()` 计算属性

有时我们需要依赖于其他状态的状态，我们可以使用 computed 方法：它接受 getter 函数并为 getter 返回的值返回一个不可变的响应式 ref 对象。

```ts
import { ref, computed } from 'rubic'

const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

我们在这里定义了一个计算属性 `plusOne`。 `computed()` 方法期望接收一个 getter 函数，返回值为一个**计算属性 ref**。和其他一般的 ref 类似，你可以通过 `plusOne.value` 访问计算结果。计算属性 ref 也会在模板中自动解包，因此在模板表达式中引用时无需添加 .value。

computed 会自动追踪响应式依赖。它会检测到 `plusOne` 依赖于 `count`，所以当 `count` 改变时，任何依赖于 `plusOne` 的绑定都会同时更新。

## watchEffect/watch

### watchEffect

为了根据响应式状态自动应用和重新应用副作用，我们可以使用 watchEffect 方法。它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

```ts
import { ref, watchEffect } from 'rubic'

const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

### watch

watch 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况下，它也是惰性的，即只有当被侦听的源发生变化时才执行回调。

与 watchEffect 比较，watch 允许我们：

- 懒执行副作用；
- 更具体地说明什么状态应该触发侦听器重新运行；
- 访问侦听状态变化前后的值。

#### 侦听一个单一源

侦听器数据源可以是具有返回值的 getter 函数，也可以是 ref：

```ts
import { reactive, ref, watch } from 'rubic'

// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

#### 侦听多个数据源

侦听器还可以使用数组同时侦听多个源：

```ts
import { ref, watch } from 'rubic'

const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // logs: ["John", ""] ["", ""]
lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
```

尽管如此，如果你在同一个方法里同时改变这些被侦听的来源，侦听器仍只会执行一次：

```js
import { ref, watch } from 'rubic'

const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
  // 打印 ["John", "Smith"] ["", ""]
})

const changeValues = () => {
  firstName.value = 'John'
  lastName.value = 'Smith'
}
```

注意多个同步更改只会触发一次侦听器。

## DOM 更新时机 (开发中)

当你更改响应式状态后，DOM 也会自动更新。然而，你得注意 DOM 的更新并不是同步的。相反，框架将缓冲它们直到更新周期的 “下个时机” 以确保无论你进行了多少次声明更改，每个组件都只需要更新一次。

若要等待一个状态改变后的组件的 DOM 更新完成，你可以使用 ctx.nextTick() 这个 API：

```ts
import { definePage, reactive } from 'rubic'

definePage({
  setup(query, ctx) {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
      ctx.nextTick(() => {
        // 访问更新后的界面
      })
    }

    // 暴露 state 到模板
    return {
      state,
    }
  },
})
```
