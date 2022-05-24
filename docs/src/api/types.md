# TypeScript 工具类（编写中）

`rubic` 使用 `typescript` 编写，框架本身自带了完整的类型文件，安装即可使用无需额外的操作。

但在实际业务开发中会一些全局中间件会对实例进行额外的拓展，此时自带的类型推断就无法满足了，为此我们提供了三个额外的 `interface` 类型，开发者可自行拓展

## 使用方法

在项目中添加类型文件 `global.d.ts` (可自行命名)，并在 `tsconfig.json` 配置中 `include` 改文件。

tsconfig.json :

```json
{
  "compilerOptions": { ... },
  "include": ["global.d.ts", ...]
}
```

global.d.ts :

```ts
/// <reference types="rubic/custom" />

interface AppCustomContext {
  xxx: xxx
}
interface PageCustomContext {
  myPageField: string
}
interface ComponentCustomContext {
  myComponentField: string
}
```

## AppCustomContext

该类型定义了 `getAppContext()` 返回值的类型推断:

```ts
/// <reference types="rubic/custom" />

interface AppCustomContext {
  userInfo: {
    token: string
    userId: string
  }
}
```

![getAppContext](/images/types-context.png)

## PageCustomContext

该类型定义了 `definePage` 中 `context` 实例的类型推断

## ComponentCustomContext

该类型定义了 `defineComponent` 中 `context` 实例的类型推断
