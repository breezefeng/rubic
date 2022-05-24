# 依赖注入

与 Vue 一样，Rubic 提供了依赖注入功能，以解决 `props` 深度透传的问题。它们是一对 `provide / inject` 函数，它们的使用方式和 API 均与 Vue 一致。

## Provide

```js
// injectKeys.js
import { defineComponent, ref, provide, readonly } from 'rubic'

export const myKey = Symbol('myKey')
```

```js
// parent-component.js
import { defineComponent, ref, provide, readonly } from 'rubic'
import { myKey } from 'injectKeys'

defineComponent({
  setup() {
    const count = ref(0)

    function increment() {
      count.value++
    }

    const parentProvider = {
      count,
      increment,
    }

    provide(myKey, parentProvider)
  },
})
```

## Inject

```js
// deep-child-component.js
import { defineComponent, inject } from 'rubic'
import { myKey } from 'injectKeys'

defineComponent({
  setup() {
    const { count, increment } = inject(myKey)

    return {
      count,
      increment,
    }
  },
})
```

## 差异

Vue 的依赖注入是与组件树绑定的，但是由于小程序的限制我们不能访问组件树，所以 Rubic 的依赖注入与组件树并没有什么关系，每一项依赖都会被保存到一个全局单一的仓库中。也就是说依赖的 `key` 需要是全局唯一的，使用 [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 作 `key` 可以保证这一点。
