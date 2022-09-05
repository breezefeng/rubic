# 生命周期：页面

::: warning 注意
页面上列出的所有 api 必须在 Page 的 setup()阶段同步调用。更多细节请参见[指南-生命周期钩子]()。
:::

## onLoad

页面加载时触发。可以在参数中获取打开当前页面路径中的参数。

参数：接收一个函数，该函数与 [Page -> onLoad](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onLoad-Object-query) 一致

## onShow

页面显示/切入前台时触发。

参数：接收一个函数，该函数与 [Page -> onShow](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShow) 一致

## onHide

页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。

参数：接收一个函数，该函数与 [Page -> onHide](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onHide) 一致

## onUnload

页面卸载时触发。如 wx.redirectTo 或 wx.navigateBack 到其他页面时。

参数：接收一个函数，该函数与 [Page -> onUnload](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onUnload) 一致

## onPullDownRefresh

监听用户下拉刷新事件。

- 需要在 app.json 的 window 选项中或页面配置中开启 enablePullDownRefresh。
- 可以通过 wx.startPullDownRefresh 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
- 当处理完数据刷新后，wx.stopPullDownRefresh 可以停止当前页面的下拉刷新。

参数：接收一个函数，该函数与 [Page -> onPullDownRefresh](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onPullDownRefresh) 一致

## onReachBottom

监听用户上拉触底事件。

- 可以在 app.json 的 window 选项中或页面配置中设置触发距离 onReachBottomDistance。
- 在触发距离内滑动期间，本事件只会被触发一次。

参数：接收一个函数，该函数与 [Page -> onReachBottom](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onReachBottom) 一致

## onResize

小程序屏幕旋转时触发。详见 响应显示区域变化

参数：接收一个函数，该函数与 [Page -> onResize](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onResize-Object-object) 一致

## onTabItemTap

点击 tab 时触发

参数：接收一个函数，该函数与 [Page -> onTabItemTap](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onTabItemTap-Object-object) 一致

## onPageScroll

监听用户滑动页面事件。

参数：接收一个函数，该函数与 [Page -> onPageScroll](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onPageScroll-Object-object) 一致

## onShareAppMessage

监听用户点击页面内转发按钮（button 组件 open-type="share"）或右上角菜单“转发”按钮的行为，并自定义转发内容。

参数：接收一个函数，该函数与 [Page -> onShareAppMessage](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object) 一致

## onShareTimeline

监听右上角菜单“分享到朋友圈”按钮的行为，并自定义分享内容。

参数：接收一个函数，该函数与 [Page -> onShareTimeline](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareTimeline) 一致

## onAddToFavorites

监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容。

参数：接收一个函数，该函数与 [Page -> onAddToFavorites](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onAddToFavorites) 一致
