# 生命周期：应用

::: warning 注意
页面上列出的所有 api 必须在 App 的 setup()阶段同步调用。更多细节请参见[指南-生命周期钩子]()。
:::

## onAppLaunch

小程序启动，或从后台进入前台显示时触发。

参数：与 [wx.onLaunch](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onLaunch.html) 一致

## onAppShow

小程序启动，或从后台进入前台显示时触发。

参数：与 [wx.onAppShow](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppShow.html) 一致

## onAppHide

小程序从前台进入后台时触发。

参数：与 [wx.onAppHide](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppHide.html) 一致

## onAppError

小程序发生脚本错误或 API 调用报错时触发。

参数：与 [wx.onError](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onError.html) 一致

## onAppPageNotFound

小程序要打开的页面不存在时触发。

参数：与 [wx.onPageNotFound](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onPageNotFound.html) 一致

## onAppUnhandledRejection

小程序有未处理的 Promise 拒绝时触发。

参数：与 [wx.onUnhandledRejection](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onUnhandledRejection.html) 一致

## onAppThemeChange

系统切换主题时触发。也可以使用 wx.onThemeChange 绑定监听。

参数：与 [wx.onThemeChange](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onThemeChange.html) 一致
