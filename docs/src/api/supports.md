# 辅助 API

一些提供辅助能力的 api

## getCurrentInstance

支持访问内部组件实例, `getCurrentInstance` 能在 setup 阶段获取到当前实例。一般用于封装组合式函数。

```ts
import { defineComponent, getCurrentInstance } from 'rubic'

// 在组合式函数中
function useComponentId() {
  const { is } = getCurrentInstance()
  return is
}

defineComponent({
  setup(props, ctx) {
    const id = useComponentId()
    console.log('this component is:', id)
  },
})
```

其返回值和 `setup` 函数的第二个参数 `ctx` 相等。

```ts
import { defineComponent, getCurrentInstance } from 'rubic'

defineComponent({
  setup(props, ctx) {
    const ins = getCurrentInstance()
    console.log(ins === ctx) // true
  },
})

const ins = getCurrentInstance()
console.log(ins) // null
```

`setup` 外调用将会返回 `null`

```ts
import { defineComponent, getCurrentInstance } from 'rubic'

defineComponent({
  setup(props, ctx) {},
})

const ins = getCurrentInstance()
console.log(ins) // null
```
