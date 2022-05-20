# createApp

创建小程序

```ts
function createApp(options: AppOptions): void
```

## 参数

```ts
type AppOptions = {
  setup: () => {
    context: Record<string, any>
    [key: string]: any
  }
}
```

## 示例：

```ts
import { createApp } from 'rubic'

createApp({
  setup(options) {
    const count = ref(0)
    return { count }
  },
})
```
