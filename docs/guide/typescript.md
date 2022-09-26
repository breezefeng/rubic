# TypeScript 工具类型

`Rubic` 本身就是用 TypeScript 编写的，自带了类型声明文件，开箱即用。

某些插件会为所有组件都拓展全局可用的属性。举例来说，我们可能为了请求数据而安装了 `ctx.$http`，或者为了国际化而安装了 `ctx.$translate`。为了使 TypeScript 更好地支持这个行为，Rubic 为页面和组件分别暴露了被设计为可以通过 TypeScript 模块扩展来扩展的接口：

## PageCustomProperties

用于增强 **页面** 实例类型以支持自定义全局属性。

- **示例：**

```ts
export {}

declare module 'rubic' {
  interface PageCustomProperties {
    $http: typeof MyFetch
    $translate: (key: string) => string
  }
}
```

## ComponentCustomProperties

用于增强 **组件** 实例类型以支持自定义全局属性。

- **示例：**

```ts
export {}

declare module 'rubic' {
  interface ComponentCustomProperties {
    $http: typeof MyFetch
    $translate: (key: string) => string
  }
}
```

::: tip
类型扩展必须被放置在一个模块 .ts 或 .d.ts 文件中。查看类型扩展指南了解更多细节
:::
