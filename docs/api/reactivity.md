# 响应式核心

## 所有 API

Rubic 的响应式基础能力通过 `@vue/reactivity` 实现, 具体使用方法和文档请移步 [Vue3 Reactivity 文档](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive)

提供的能力包括以下 API：

```js
export {
  // 核心函数
  reactive,
  ref,
  readonly,
  computed,
  // 辅助函数
  markRaw,
  toRaw,
  unref,
  isRef,
  toRef,
  toRefs,
  isProxy,
  isReactive,
  isReadonly,
  shallowRef,
  triggerRef,
  effectScope,
  ITERATE_KEY,
  // 类型
  EffectScope,
  ReactiveEffect,
  ReactiveEffectOptions,
  DebuggerEvent,
  TrackOpTypes,
  TriggerOpTypes,
  Ref,
  ComputedRef,
  WritableComputedRef,
  UnwrapRef,
  ShallowUnwrapRef,
  WritableComputedOptions,
  ToRefs,
  DeepReadonly,
} from 'rubic'
```

## ref()

接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 `.value` property，指向该内部值。

**示例:**

```ts
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

如果将对象分配为 ref 值，则它将被 reactive 函数处理为深层的响应式对象。

**类型声明**

```ts
function ref<T>(value: T): Ref<UnwrapRef<T>>

interface Ref<T> {
  value: T
}
```

有时我们可能需要为 ref 的内部值指定复杂类型。可以在调用 `ref` 时传递一个泛型参数以覆盖默认推断，从而简洁地做到这一点：

```ts
const foo = ref<string | number>('foo') // foo 的类型：Ref<string | number>

foo.value = 123 // ok!
```

## unref

如果参数是一个 ref，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 的语法糖函数。

```ts
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x) // unwrapped 现在一定是数字类型
}
```

## toRef

可以用来为源响应式对象上的某个 property 新创建一个 ref。然后，ref 可以被传递，它会保持对其源 property 的响应式连接。

```ts
const state = reactive({
  foo: 1,
  bar: 2,
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

当你要将 prop 的 ref 传递给复合函数时，toRef 很有用:

```ts
defineComponent({
  setup(props) {
    const fooRef = toRef(props, 'foo')
  },
})
```

即使源 property 不存在，`toRef` 也会返回一个可用的 ref。这使得它在使用可选 prop 时特别有用，可选 prop 并不会被 `toRefs` 处理。

## toRefs

将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 `ref`。

```ts
const state = reactive({
  foo: 1,
  bar: 2,
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs 的类型:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 和原始 property 已经“链接”起来了
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

当从组合式函数返回响应式对象时，`toRefs` 非常有用，这样消费组件就可以在不丢失响应性的情况下对返回的对象进行解构/展开：

```ts
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2,
  })

  // 操作 state 的逻辑

  // 返回时转换为ref
  return toRefs(state)
}

export default {
  setup() {
    // 可以在不失去响应性的情况下解构
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar,
    }
  },
}
```

toRefs 只会为源对象中包含的 property 生成 ref。如果要为特定的 property 创建 ref，则应当使用 `toRef`

## isRef

检查值是否为一个 ref 对象。

## computed()

接受一个 getter 函数，并根据 getter 的返回值返回一个不可变的响应式 `ref` 对象。

```ts
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误
```

或者，接受一个具有 get 和 set 函数的对象，用来创建可写的 ref 对象。

```ts
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  },
})

plusOne.value = 1
console.log(count.value) // 0
```

**类型声明：**

```ts
// 只读的
function computed<T>(getter: () => T, debuggerOptions?: DebuggerOptions): Readonly<Ref<Readonly<T>>>

// 可写的
function computed<T>(
  options: {
    get: () => T
    set: (value: T) => void
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>
interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}
```

## watchEffect

立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

```ts
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

**类型声明：**

```ts
function watchEffect(effect: (onInvalidate: InvalidateCbRegistrator) => void, options?: WatchEffectOptions): StopHandle

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}

type InvalidateCbRegistrator = (invalidate: () => void) => void

type StopHandle = () => void
```

参考：watchEffect [指南](/guide/reactivity.html#watcheffect-watch)

## watch

`watch` 需要侦听特定的数据源，并在单独的回调函数中执行副作用。默认情况下，它也是惰性的——即回调仅在侦听源发生变化时被调用。

- 与 watchEffect 相比，watch 允许我们：
  - 惰性地执行副作用；
  - 更具体地说明应触发侦听器重新运行的状态；
  - 访问被侦听状态的先前值和当前值。

### 侦听单一源

侦听器数据源可以是一个具有返回值的 getter 函数，也可以直接是一个 ref：

```ts
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听一个 ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### 侦听多个源

侦听器还可以使用数组以同时侦听多个源：

```ts
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

### 与 `watchEffect` 相同的行为

`watch` 与 `watchEffect` 在手动停止侦听、清除副作用 (将 onInvalidate 作为第三个参数传递给回调)、刷新时机和调试方面有相同的行为。

**类型声明**

```ts
// 侦听单一源
function watch<T>(
  source: WatcherSource<T>,
  callback: (
    value: T,
    oldValue: T,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options?: WatchOptions
): StopHandle

// 侦听多个源
function watch<T extends WatcherSource<unknown>[]>(
  sources: T
  callback: (
    values: MapSources<T>,
    oldValues: MapSources<T>,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options? : WatchOptions
): StopHandle

type WatcherSource<T> = Ref<T> | (() => T)

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatcherSource<infer V> ? V : never
}

// 参见 `watchEffect` 共享选项的类型声明
interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // 默认：false
  deep?: boolean
}
```
