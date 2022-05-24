# 快速开始

根据你的使用场景选择不同的接入流程方式

## 使用脚手架（新小程序）

我们提供了小程序脚手架 `@rubic/create`，它为小程序工作流程提供了功能齐备的设。

```shell
npm create rubic
```

## NPM 安装（独立小程序）

- 1. 在小程序代码根目录使用 npm 安装

```bash
npm install rubic
```

- 2. 使用开发者工具[ npm 构建](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

![构建](/images/npm.png)

该操作会生成 `miniprogram_npm` 目录

- 4. 勾选“使用 npm 模块”选项

![npm](/images/usenpm.png)

- 3. 使用 import 引入框架

```ts
import { definePage, ... } from 'rubic'
```

## 框架更新

执行`NPM 安装`中的步骤 1 和 步骤 2
