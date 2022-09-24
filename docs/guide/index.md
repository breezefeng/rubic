# 快速起步

::: tip 注意

使用 `Rubic` 需开发者熟悉小程序以及对 Vue 响应性和组合式 API 有基本的了解，本文档不会过多重复这部分的内容，详情请移步[Vue 官方文档](https://cn.vuejs.org/guide/introduction.html)、[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/)、

:::

根据你的使用场景选择不同的接入流程方式

## NPM 接入

- 1. 在小程序代码根目录使用 npm 安装

```bash
npm install rubic
```

- 2. 使用开发者工具[:link: npm 构建](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

![构建](/images/npm.png)

该操作会生成 `miniprogram_npm` 目录

- 4. 勾选“使用 npm 模块”选项

![npm](/images/usenpm.png)

- 3. 使用 import 引入框架

```ts
import { definePage, ... } from 'rubic'
```

## 使用脚手架

开发中...

## 框架更新

执行`NPM 安装`中的步骤 1 和 步骤 2
