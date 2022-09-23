---
outline: deep
---

# API 索引

## 核心 API

### setup

`setup()` 钩子是在页面和组件中使用组合式 API 的入口

我们可以使用响应式 API 来声明响应式的状态，在 `setup()` 函数中返回的对象会暴露给小程序模板，不需要使用 `setData` 函数。

**示例:**

```ts
defineComponent({
  setup() {
    const count = ref(0)
    const increment = () => {
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
<view bindtap="increment">{{count}}</view>
```

请注意在模板中访问从 `setup` 返回的 `ref` 时，它会自动浅层解包，因此你无须再在模板中为它写 `.value`。

::: tip 注意
`setup()` 自身并不含对组件实例的访问权，即在 setup() 中访问 this 会是 `undefined`。
:::

---

### createApp

创建一个应用实例, `setup()` 对应 `onLaunch` 生命周期。

- **类型:**

  ```ts
  function createApp(options: AppOptions): void
  ```

  ```ts
  type AppOptions = {
    plugins?: Plugin[]
    setup: (options: LaunchShowOption) => Bindings | void
  }
  ```

- **详细信息:**

  参数 `options` 是一个选项对象，包括以下属性：

  - **plugins**

    插件数组，详情见[页面和组件插件](/guide/plugin)

  - **setup** :pushpin:

    组合式 API 入口，对应 `onLaunch` 生命周期，参数与 [App -> onLaunch](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onLaunch-Object-object) 一致。返回的数据将会被绑定到 `app` 实例

- **示例:**

  ```ts
  createApp({
    plugins: [],
    setup(options) {
      return {
        text: 'Hello',
      }
    },
  })
  ```

  ```ts
  getApp().text === 'Hello'
  ```

---

### definePage

在定义小程序页面

- **类型:**

  ```ts
  function definePage(options: PageOptions): void
  ```

  > 为了便于阅读，对类型进行了简化

- **参数:**

  `options` 参数是一个页面选项对象，包含一下属性

  - **properties** Object Map

    页面所接收的 `querystring` 对外属性，是属性名到属性设置的映射表

  - **behaviors** string[]

    类似于 mixins 和 traits 的组件间代码复用机制，与小程序 `behaviors` 一致，参见 [behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)

  - **observers** Object

    组件数据字段监听器，用于监听 properties 和 data 的变化，与小程序 `observers` 一致，参见 [数据监听器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html)

  - **options** Object

    一些选项，同 [`Component` 构造器](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html) 中的 `options`

  - **setup** :pushpin:

    组合式 API 入口，在 `attached` 阶段执行。

- **详细信息:**

  `setup` 函数拥有两个参数，类型定义为 `setup(query, ctx) => Object`

  - **query**

    query 参数，必须在 `properties` 声明过的参数才能获取

  - **ctx**

    当前小程序实例，与原生小程序 `this` 一致

- **示例:**

  如访问页面 /pages/index/index?paramA=123&paramB=xyz ，如果声明有属性 paramA 或 paramB ，则它们会被赋值为 123 或 xyz 。

  ```ts
  definePage({
    properties: {
      paramA: Number,
      paramB: String,
    },
    setup(query, ctx) {
      query.paramA // 页面参数 paramA 的值
      query.paramB // 页面参数 paramB 的值
    },
  })
  ```

---

### defineComponent

在定义小程序组件，

- **类型:**

  ```ts
  function defineComponent(options: ComponentOptions): void
  ```

  > 为了便于阅读，对类型进行了简化

- **参数:**

  `options` 参数是一个页面选项对象，包含一下属性

  - **properties** Object Map

    组件的对外属性，是属性名到属性设置的映射表

  - **behaviors** string[]

    类似于 mixins 和 traits 的组件间代码复用机制，与小程序 `behaviors` 一致，参见 [behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)

  - **observers** Object

    组件数据字段监听器，用于监听 properties 和 data 的变化，与小程序 `observers` 一致，参见 [数据监听器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html)

  - **externalClasses** string[]

    组件接受的外部样式类，与小程序组件 `externalClasses` 一致，参见 [外部样式类](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E5%A4%96%E9%83%A8%E6%A0%B7%E5%BC%8F%E7%B1%BB)

  - **relations** Object

    组件间关系定义，与小程序组件 `relations` 一致，参见 [组件间关系](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/relations.html)

  - **options** Object

    一些选项，同 [`Component` 构造器](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html) 中的 `options`

  - **setup** :pushpin:

    组合式 API 入口，在 `attached` 阶段执行。

- **详细信息:**

  `setup` 函数拥有两个参数，类型定义为 `setup(query, ctx) => Object`

  - **props**

    props 是响应式的，并且会在传入新的 `props` 时同步更新。

  - **ctx**

    当前小程序实例，与原生小程序 `this` 一致

- **示例:**

  ```ts
  defineComponent({
    properties: {
      title: String,
    },
    setup(props, ctx) {
      console.log(props.title)
    },
  })
  ```

---

## App 生命周期

小程序 `App` 相关生命周期注册函数

---

### onAppShow

注册一个回调函数，在小程序启动，或从后台进入前台显示时触发。对应原生小程序 `App` -> `onShow`。

- **类型:**

  ```ts
  function onAppShow(callback: Listener): void

  type Listener = (options: App.LaunchShowOption) => void
  ```

- **详细信息:**

  `options` 启动参数与 `wx.onAppShow` 一致，详情参考 -> [小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppShow.html)

  | 属性             | 类型            | 说明                                                                                 |
  | ---------------- | --------------- | ------------------------------------------------------------------------------------ |
  | path             | string          | 启动小程序的路径 (代码包路径)                                                        |
  | scene            | number          | 启动小程序的场景值                                                                   |
  | query            | Object          | 启动小程序的 query 参数                                                              |
  | shareTicket      | string          | shareTicket，详见获取更多转发信息                                                    |
  | referrerInfo     | Object          | 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}。(参见后文注意) |
  | forwardMaterials | Array\<Object\> | 打开的文件信息数组，只有从聊天素材场景打开（scene 为 1173）才会携带该参数            |
  | chatType         | number          | 从微信群聊/单聊打开小程序时，chatType 表示具体微信群聊/单聊类型                      |
  | apiCategory      | string          | API 类别                                                                             |

- **示例:**

  ```ts
  createApp({
    setup() {
      onAppShow(options => {
        // options.path	string	启动小程序的路径 (代码包路径)
        // options.scene	number	启动小程序的场景值
        // options.query	Object	启动小程序的 query 参数
        // options.shareTicket	string	shareTicket，详见获取更多转发信息
        // ...
        console.log('进入前台 onAppShow')
      })
    },
  })
  ```

---

### onAppHide

注册一个回调函数，在小程序从前台进入后台时触发。对应原生小程序 `App` -> `onHide` 。

- **类型:**

  ```ts
  function onAppHide(callback: Listener): void

  type Listener = () => void
  ```

- **详细信息:**

  与 `wx.onAppHide` 一致，详情参考 -> [小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppHide.html)

- **示例:**

  ```ts
  createApp({
    setup() {
      onAppHide(() => {
        console.log('进入后台 onAppHide')
      })
    },
  })
  ```

---

### onError

注册一个回调函数，在小程序发生脚本错误或 API 调用报错时触发。对应原生小程序 `App` -> `onError`。

- **类型:**

  ```ts
  function onError(callback: Listener): void

  type Listener = (error) => void
  ```

- **详细信息:**

  `error` 错误信息，包含堆栈。详情参考 -> [小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onError.html)

- **示例:**

  ```ts
  createApp({
    setup() {
      onError(err => {
        console.log('小程序错误：', err)
      })
    },
  })
  ```

---

### onPageNotFound

注册一个回调函数，在小程序要打开的页面不存在时触发。对应原生小程序 `App` -> `onPageNotFound`。

- **类型:**

  ```ts
  function onPageNotFound(callback: Listener): void

  type Listener = (res: App.PageNotFoundOption) => void
  ```

<hr />

- **详细信息:**

  `res` 参数与 `wx.onPageNotFound` 一致，详情参考 -> [小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onPageNotFound.html#%E5%8F%82%E6%95%B0)

  | 属性        | 类型    | 说明                                                                           |
  | ----------- | ------- | ------------------------------------------------------------------------------ |
  | path        | string  | 不存在页面的路径 (代码包路径)                                                  |
  | query       | Object  | 打开不存在页面的 query 参数                                                    |
  | isEntryPage | boolean | 是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面） |

- **示例:**

  ```ts
  createApp({
    setup() {
      onPageNotFound(err => {
        wx.switchTab({
          url: 'pages/...',
        })
      })
    },
  })
  ```

---

### onUnhandledRejection

注册一个回调函数，小程序有未处理的 Promise 拒绝时触发。对应原生小程序 `App` -> `onUnhandledRejection`。

- **类型:**

  ```ts
  function onUnhandledRejection(callback: Listener): void

  type Listener = (res: OnUnhandledRejectionCallback) => void
  ```

- **详细信息:**

  `res` 参数与 `wx.onUnhandledRejection` 一致，详情参考 -> [小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onUnhandledRejection.html)

  | 属性    | 类型            | 说明                            |
  | ------- | --------------- | ------------------------------- |
  | reason  | string          | 拒绝原因，一般是一个 Error 对象 |
  | promise | Promise.\<any\> | 被拒绝的 Promise 对象           |

- **示例:**

  ```ts
  createApp({
    setup() {
      onUnhandledRejection(res => {
        console.log(res.reason)
        console.log(res.promise)
      })
    },
  })
  ```

- **注意**
  所有的 unhandledRejection 都可以被这一监听捕获，但只有 Error 类型的才会在小程序后台触发报警。

---

### onThemeChange

注册一个回调函数，系统切换主题时触发。对应原生小程序 `App` -> `onThemeChange`。

- **类型:**

  ```ts
  function onThemeChange(callback: Listener): void

  type Listener = (res: { theme: 'dark' | 'light' }) => void
  ```

- **详细信息:**

  `res` 参数与 `wx.onThemeChange` 一致，详情参考 -> [小程序文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onThemeChange.html)

  | 属性  | 类型              | 说明                                 |
  | ----- | ----------------- | ------------------------------------ |
  | theme | 'dark' \| 'light' | 系统当前的主题，取值为 light 或 dark |

- **示例:**

  ```ts
  createApp({
    setup() {
      onThemeChange(res => {
        console.log(res.theme)
      })
    },
  })
  ```

---

## Page 生命周期

小程序 `Page` 相关生命周期注册函数

### onLoad

注册一个回调函数，页面加载时触发。一个页面只会调用一次，可以在参数中获取打开当前页面路径中的参数。对应原生小程序 `Page` -> `onLoad`。

- **类型:**

  ```ts
  function onLoad(callback: Listener): void

  type Listener = (query: Object) => void
  ```

- **详细信息:**

  `query` 打开当前页面路径中的参数

- **示例:**

  ```ts
  definePage({
    setup() {
      onLoad(query => {
        console.log(query)
      })
    },
  })
  ```

---

### onShow

注册一个回调函数，页面显示/切入前台时触发。对应原生小程序 `Page` -> `onShow`。

- **类型:**

  ```ts
  function onShow(callback: Listener): void

  type Listener = () => void
  ```

- **示例:**

  ```ts
  definePage({
    setup() {
      onShow(() => {
        console.log('页面显示/切入前台')
      })
    },
  })
  ```

---

### onReady

注册一个回调函数，页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。对应原生小程序 `Page` -> `onReady`。

- **类型:**

  ```ts
  function onReady(callback: Listener): void

  type Listener = () => void
  ```

- **示例:**

  ```ts
  definePage({
    setup() {
      onReady(() => {
        console.log('页面初次渲染完成')
      })
    },
  })
  ```

---

### onHide

注册一个回调函数，页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。对应原生小程序 `Page` -> `onHide`。

- **类型:**

  ```ts
  function onHide(callback: Listener): void

  type Listener = () => void
  ```

- **示例:**

  ```ts
  definePage({
    setup() {
      onHide(() => {
        console.log('页面隐藏/切入后台')
      })
    },
  })
  ```

---

### onUnload

注册一个回调函数，页面卸载时触发。如 wx.redirectTo 或 wx.navigateBack 到其他页面时。对应原生小程序 `Page` -> `onUnload`。

- **类型:**

  ```ts
  function onUnload(callback: Listener): void

  type Listener = () => void
  ```

- **示例:**

  ```ts
  definePage({
    setup() {
      onUnload(() => {
        console.log('页面卸载')
      })
    },
  })
  ```

## Page 事件处理函数

### onPullDownRefresh

注册一个回调函数，用户下拉刷新时触发。对应原生小程序 `Page` -> `onPullDownRefresh`。

- **类型:**

  ```ts
  function onPullDownRefresh(callback: Listener): void

  type Listener = () => void
  ```

- **示例:**

  ```ts
  definePage({
    setup() {
      onPullDownRefresh(() => {
        console.log(`用户下拉刷新`)
      })
    },
  })
  ```

---

### onReachBottom

注册一个回调函数，用户上拉触底时触发。对应原生小程序 `Page` -> `onReachBottom`。

- **类型:**

  ```ts
  function onReachBottom(callback: Listener): void

  type Listener = () => void
  ```

- **示例:**

  ```ts
  definePage({
    setup() {
      onReachBottom(() => {
        console.log('用户上拉触底')
      })
    },
  })
  ```

---

### onPageScroll

注册一个回调函数，用户滑动页面时触发。对应原生小程序 `Page` -> `onPageScroll`。

- **类型:**

  ```ts
  function onPageScroll(callback: Listener): void

  type Listener = ({ scrollTop }) => void
  ```

- **参数** Object object:

  | 属性      | 类型   | 说明                                  |
  | --------- | ------ | ------------------------------------- |
  | scrollTop | Number | 页面在垂直方向已滚动的距离（单位 px） |

- **示例:**

  ```ts
  definePage({
    setup() {
      onPageScroll(res => {
        console.log(res.scrollTop)
      })
    },
  })
  ```

---

### onAddToFavorites

注册一个回调函数，用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容时触发。对应原生小程序 `Page` -> `onAddToFavorites`。

此事件处理函数需要 return 一个 Object，用于自定义收藏内容：

- **类型:**

  ```ts
  function onAddToFavorites(callback: Listener): void

  type Listener = ({ webViewUrl: string }) => {
    title: string //	自定义标题	页面标题或账号名称
    imageUrl: string //	自定义图片，显示图片长宽比为 1：1	页面截图
    query: string //	自定义 query 字段	当前页面的query
  }
  ```

- **示例:**

  ```ts
  definePage({
    setup() {
      onAddToFavorites(res => {
        // webview 页面返回 webViewUrl
        console.log('webViewUrl: ', res.webViewUrl)
        return {
          title: '自定义标题',
          imageUrl: 'http://demo.png',
          query: 'name=xxx&age=xxx',
        }
      })
    },
  })
  ```

---

### onShareAppMessage

注册一个回调函数，用户点击页面内转发按钮（button 组件 open-type="share"）或右上角菜单“转发”按钮的行为，并自定义转发内容时触发。对应原生小程序 `Page` -> `onShareAppMessage`。

- **类型:**

  ```ts
  function onShareAppMessage(callback: Listener): void

  type Listener = (options: Page.IShareAppMessageOption) => Page.ICustomShareContent
  ```

- **详细信息:**

  `options` 参数与 `onShareAppMessage` 一致，详情参考 -> [onShareAppMessage](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object)

  | 参数       | 类型   | 说明                                                                           |
  | ---------- | ------ | ------------------------------------------------------------------------------ |
  | from       | String | 转发事件来源-> `button:`页面内转发按钮 `menu:`右上角转发菜单                   |
  | target     | Object | 如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined |
  | webViewUrl | String | 页面中包含 web-view 组件时，返回当前 web-view 的 url                           |

  此事件处理函数需要 return 一个 Object，用于自定义转发内容，返回内容如下：

  | 字段     | 说明                                                                                                                     |
  | -------- | ------------------------------------------------------------------------------------------------------------------------ |
  | title    | 转发标题，默认为当前小程序名称                                                                                           |
  | path     | 转发路径 必须是以 / 开头的完整路径 默认为 当前页面 path                                                                  |
  | imageUrl | 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及 JPG。显示图片长宽比是 5:4。 使用默认截图 |
  | promise  | 如果该参数存在，则以 resolve 结果为准，如果三秒内不 resolve，分享会使用上面传入的默认参数                                |

- **示例:**

  ```ts
  definePage({
    setup() {
      onShareAppMessage(({ from, target, webViewUrl }) => {
        return {
          title: '自定义转发标题',
          path: '/page/user?id=123',
          imageUrl: 'http://xxx.png',
        }
      })
    },
  })
  ```

---

### onShareTimeline

注册一个回调函数，点击右上角菜单“分享到朋友圈”按钮触发。对应原生小程序 `Page` -> `onShareTimeline`。

- **类型:**

  ```ts
  function onShareTimeline(callback: Listener): void

  type Listener = () => Page.ICustomShareContent
  ```

- **详细信息:**

  事件处理函数返回一个 Object，用于自定义分享内容，不支持自定义页面路径，返回内容如下：

  | 字段     | 说明                                                                                                    |
  | -------- | ------------------------------------------------------------------------------------------------------- |
  | title    | 自定义标题，即朋友圈列表页上显示的标题，默认为当前小程序名称                                            |
  | query    | 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分，默认为当前页面路径携带的参数               |
  | imageUrl | 自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1。 默认使用小程序 Logo |

- **示例:**

  ```ts
  definePage({
    setup() {
      onShareTimeline(() => {
        return {
          title,
          query,
          imageUrl,
        }
      })
    },
  })
  ```

---

### onResize

注册一个回调函数，小程序屏幕旋转时触发。对应原生小程序 `Page` -> `onResize`。

- **类型:**

  ```ts
  function onResize(callback: Listener): void

  type Listener = (res: Page.IResizeOption) => void
  ```

- **详细信息:**

  `res` 参数与 `wx.onResize` 一致，详情参考 -> [onResize](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E4%BA%8B%E4%BB%B6)

  | 属性         | 类型   | 说明                      |
  | ------------ | ------ | ------------------------- |
  | windowWidth  | number | 变化后的窗口宽度，单位 px |
  | windowHeight | number | 变化后的窗口高度，单位 px |

- **示例:**

  ```ts
  definePage({
    setup() {
      onResize(res => {
        res.size.windowWidth // 新的显示区域宽度
        res.size.windowHeight // 新的显示区域高度
      })
    },
  })
  ```

---

### onTabItemTap

注册一个回调函数，点击 tab 时触发。对应原生小程序 `Page` -> `onTabItemTap`。

- **类型:**

  ```ts
  function onTabItemTap(callback: Listener): void

  type Listener = (item: Page.ITabItemTapOption) => void
  ```

- **详细信息:**

  `item` 参数与 `onTabItemTap` 一致，详情参考 -> [onTabItemTap](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onTabItemTap-Object-object)

  | 属性     | 类型   | 说明                             |
  | -------- | ------ | -------------------------------- |
  | index    | String | 被点击 tabItem 的序号，从 0 开始 |
  | pagePath | String | 被点击 tabItem 的页面路径        |
  | text     | String | 被点击 tabItem 的按钮文字        |

- **示例:**

  ```ts
  definePage({
    setup() {
      onTabItemTap(item => {
        console.log(item.index)
        console.log(item.pagePath)
        console.log(item.text)
      })
    },
  })
  ```

---

### onSaveExitState

注册一个回调函数，每当小程序可能被销毁之前，页面回调函数 onSaveExitState 会被调用。如果想保留页面中的状态，可以在这个回调函数中“保存”一些数据，下次启动时可以通过 exitState 获得这些已保存数据。

对应原生小程序 `Page` -> [`onSaveExitState`](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html#_4-%E9%80%80%E5%87%BA%E7%8A%B6%E6%80%81)。

- **类型:**

  ```ts
  function onSaveExitState(callback: () => void): void

  type Listener = () => void
  ```

- **详细信息:**

  onSaveExitState 返回值可以包含两项：

  | 字段名          | 类型   | 含义                                                                       |
  | --------------- | ------ | -------------------------------------------------------------------------- |
  | data            | Any    | 需要保存的数据（只能是 JSON 兼容的数据）                                   |
  | expireTimeStamp | Number | 超时时刻，在这个时刻后，保存的数据保证一定被丢弃，默认为 (当前时刻 + 1 天) |

- **示例:**

  ```ts
  definePage({
    setup(query, ctx) {
      // 尝试获得上一次退出前 onSaveExitState 保存的数据
      var prevExitState = this.exitState
      if (prevExitState !== undefined) {
        // 如果是根据 restartStrategy 配置进行的冷启动，就可以获取到
        prevExitState.myDataField === 'myData'
      }

      onSaveExitState(() => {
        const exitState = { myDataField: 'myData' } // 需要保存的数据
        return {
          data: exitState,
          expireTimeStamp: Date.now() + 24 * 60 * 60 * 1000, // 超时时刻
        }
      })
    },
  })
  ```

---

## Component 生命周期

小程序 `Component` -> `lifetimes` 相关生命周期注册函数

### onReady

注册一个回调函数，在组件布局完成后触发。对应原生小程序 `Component.lifetimes` -> `ready`。

- **类型:**

  ```ts
  function onReady(callback: () => void): void
  ```

- **示例:**

  ```ts
  defineComponent({
    setup() {
      onReady(() => {
        console.log('组件布局完成')
      })
    },
  })
  ```

---

### onMoved

注册一个回调函数，在组件实例被移动到节点树另一个位置时触发。对应原生小程序 `Component.lifetimes` -> `moved`。

- **类型:**

  ```ts
  function onMoved(callback: () => void): void
  ```

- **示例:**

  ```ts
  defineComponent({
    setup() {
      onMoved(() => {
        console.log('页面显示/切入前台')
      })
    },
  })
  ```

---

### onDetached

注册一个回调函数，组件实例被从页面节点树移除时触发。对应原生小程序 `Component.lifetimes` -> `detached`。

- **类型:**

  ```ts
  function onDetached(callback: () => void): void
  ```

- **示例:**

  ```ts
  defineComponent({
    setup() {
      onDetached(() => {
        console.log('组件实例被从页面节点树移除')
      })
    },
  })
  ```

---

### onError

注册一个回调函数，每当组件方法抛出错误时触发。对应原生小程序 `Component.lifetimes` -> `error`。

- **类型:**

  ```ts
  function onError(callback: (err: Error) => void): void
  ```

- **示例:**

  ```ts
  defineComponent({
    setup() {
      onError(err => {
        console.log('组件方法抛出错误', err)
      })
    },
  })
  ```

---

## Component 所在页面的生命周期

小程序 `Component` -> `pageLifetimes` 相关生命周期注册函数

### onShow

注册一个回调函数，组件所在的页面被展示时触发。对应原生小程序 `Component.pageLifetimes` -> `show`。

- **类型:**

  ```ts
  function onShow(callback: () => void): void
  ```

- **示例:**

  ```ts
  defineComponent({
    setup() {
      onShow(() => {
        console.log('组件所在的页面被展示')
      })
    },
  })
  ```

::: tip 注意
在异步挂载的组件中 `onShow` 并不会触发，因为组件加载时已经错过所在页面 `onShow`
:::

---

### onHide

注册一个回调函数，组件所在的页面被隐藏时触发。对应原生小程序 `Component.pageLifetimes` -> `hide`。

- **类型:**

  ```ts
  function onHide(callback: () => void): void
  ```

- **示例:**

  ```ts
  defineComponent({
    setup() {
      onHide(() => {
        console.log('组件所在的页面被隐藏')
      })
    },
  })
  ```

---

### onResize

注册一个回调函数，组件所在的页面尺寸变化时触发。对应原生小程序 `Component.pageLifetimes` -> `resize`。

- **类型:**

  ```ts
  function onResize(callback: Listener): void

  type Listener = (res: Page.IResizeOption) => void
  ```

- **详细信息:**

  `res` 参数与 [`wx.onResize`](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E4%BA%8B%E4%BB%B6) 一致

  | 属性         | 类型   | 说明                      |
  | ------------ | ------ | ------------------------- |
  | windowWidth  | number | 变化后的窗口宽度，单位 px |
  | windowHeight | number | 变化后的窗口高度，单位 px |

- **示例:**

  ```ts
  defineComponent({
    setup() {
      onResize(res => {
        res.size.windowWidth // 新的显示区域宽度
        res.size.windowHeight // 新的显示区域高度
      })
    },
  })
  ```
