# 依赖注入

provide 和 inject 启用依赖注入。这两者只能在使用当前活动实例的 setup() 期间被调用。

## 类型声明

```ts
interface InjectionKey<T> extends Symbol {}

function provide<T>(key: InjectionKey<T> | string, value: T): void

// 没有默认值
function inject<T>(key: InjectionKey<T> | string): T | undefined
// 有默认值
function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
// 有工厂函数
function inject<T>(key: InjectionKey<T> | string, defaultValue: () => T, treatDefaultAsFactory: true): T
```

框架提供了一个 `InjectionKey` 接口，该接口是扩展了 `Symbol` 的泛型类型。它可用于在生产者和消费者之间同步 inject 值的类型：

```ts
import { InjectionKey, provide, inject } from 'rubic'

const key: InjectionKey<string> = Symbol()

provide(key, 'foo') // 若提供非字符串值将出错

const foo = inject(key) // foo 的类型: string | undefined
```

如果使用了字符串 key 或非类型化的 symbol，则需要显式声明 inject 值的类型：

```ts
const foo = inject<string>('foo') // string | undefined
```
