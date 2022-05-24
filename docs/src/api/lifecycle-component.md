# 生命周期：组件

::: warning 注意
页面上列出的所有 api 必须在 Component 的 setup()阶段同步调用。更多细节请参见[指南-生命周期钩子]()。
:::

## onMoved

在组件实例被移动到节点树另一个位置时执行

参数：接收一个函数，该函数与 [lifetimes -> moved](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html) 一致

## onDetached

在组件实例被从页面节点树移除时执行

参数：接收一个函数，该函数与 [lifetimes -> detached](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html) 一致

## onReady

在组件在视图层布局完成后执行

参数：接收一个函数，该函数与 [lifetimes -> ready](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html) 一致

## onError

每当组件方法抛出错误时执行 2.4.1

参数：接收一个函数，该函数与 [Component -> moved](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html) 一致

## onShow

组件所在的页面被展示时执行 2.2.3

参数：接收一个函数，该函数与 [pageLifetimes -> moved](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html) 一致

## onHide

组件所在的页面被隐藏时执行 2.2.3

参数：接收一个函数，该函数与 [pageLifetimes -> moved](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html) 一致

## onResize

组件所在的页面尺寸变化时执行

参数：接收一个函数，该函数与 [pageLifetimes -> moved](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html) 一致
