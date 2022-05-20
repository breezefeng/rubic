# 路由

## 特性

- 更简洁的 API, 提供三个接口: `go`, `redirect`, `relaunch`
- 支持按名字跳转
- 支持路由守卫

## 路由接口

最基本的路由接口为`go`

```typescript
type RouteOptions = (URLRoute | NamedRoute) & ExtraOptions
function go(urlOrNameOrOptions: string | RouteOptions, extraOptions: ExtraOptions)
```

- 第一个参数，类型可以是字符串表示跳转「URL」或「名字」，也可以是一个对象，表示跳转接口的所有选项
- 如果为字符串，字符串中有`slash(/)`，则判定为「URL」，否则判定为「名字」，第二个参数是额外参数
- 如果为对象，第二个参数无效

### 引入 router 模块

```
import { router } from 'rubic'
```

### 根据路径跳转

```typescript
// 跳转到指定路径
router.go('/pages/home/index')

// 跳转到指定路径，带query
router.go('/pages/home/index?hello=world')

// 跳转到指定路径，带query，和上一条等效
router.go('/pages/home/index', { query: { hello: 'world' } })

// url上的query和附加参数上的query会merge，传给navigateTo的url为/pages/home/index?name=Jackie&hello=world
router.go('/pages/home/index?name=Jackie', { query: { hello: 'world' } })

// 以附加参数的query优先，传给navigateTo的url为/pages/home/index?hello=world
router.go('/pages/home/index?hello=shenzhen', { query: { hello: 'world' } })

// 第一个参数可以是一个对象，包含全部选项，第二个参数无效
router.go({
  url: '/pages/home/index?hello=shenzhen',
  query: { hello: 'world' },
})
```

### 根据名字跳转

使用前，须配置 getNamedURL，获取名字对应的 URL

```typescript
defineConfig({
  getNamedURL: (name: string): Promise<string | URL> => {
    return api.getNamedURL(name)
  },
})
```

```typescript
router.go('home')

router.go({
  name: 'home',
  query: { hello: 'world' },
})
```

### 跳转到另一个小程序

使用前，须配置 appMapping, 给`appId`赋予一个可读的名字

```typescript
defineConfig({
  appMapping: {
    app1: '1428203235cc',
    app2: {
      appId: '18203705723ab',
      embed: true, // 表示此小程序打开，默认以嵌入方式打开
    },
  },
})
```

```typescript
// 跳转到小程序app1的首页
router.go('app1:/pages/home/index')

// 也可以这样写
router.go({
  app: 'app1',
  url: '/pages/home/index',
  query: {
    hello: 'world',
  },
})
// 也可以使用名字跳转, getNamedURL('app1Home')须返回对应的URL配置
router.go('app1Home')
```

### 跳转到 tab 页

使用前，须配置 isTab，用来判断跳转路径是否为 tab 页

```typescript
defineConfig({
  isTab: path => path.startsWith('/pages/tab/'),
})
```

```typescript
// 判断为tab页，内部会使用switchTab进行跳转
router.go('/pages/tab/productList/index')

// tabProductList配置为/pages/tab/productList/index
router.go('tabProductList')
```

### 其他类型跳转

redirect, relaunch 类型的跳转，可使用专用的接口，也可使用`go`接口指定 type

```typescript
// redirect
router.redirect('/pages/productDetail/index')
router.go('/pages/productDetail/index', { type: 'redirect' })
// relaunch
router.relaunch('/pages/payResult/index')
router.go('/pages/payResult/index', { type: 'relaunch' })
```

## 参数详解

TODO

## 配置详解

通过 defineConfig 来进行配置，支持的选项有

```typescript
type RouterConfig = {
  pathPrefix?: string
  historyCapacity?: number
  isTab?: (path: string) => boolean
  appMapping?: Record<string, string | { appId: string; embed?: boolean }>
  getNamedURL?: (name: string) => Promise<string | RouteURL | undefined>
  beforeChange?: (from: RouteURL, to: RouteURL) => boolean
}
```

- pathPrefix: 可选，所有页面路径的前缀：如`/pages`，如果设置，在调用跳转接口时，路径上可省去前缀
- historyCapacity: 可选，默认为 10，router 中存储 URL 历史的容量
- isTab: 可选，判断路径是否为 tab 页，若为 tab 页，内部使用 switchTab 来进行跳转，若不设置，表示小程序中无 tab 页
- appMapping: 可选，给 appId 取一个可读的名字，名字在跳转 URL 中使用，若不设置，表示无需跳转到其他小程序
- getNamedURL: 可选，获取名字对应的 URL，使用名字路由时内部会调用此接口获取名字对应的 URL
- beforeChange: 可选，路由守卫，如果返回为 false，则不跳转
