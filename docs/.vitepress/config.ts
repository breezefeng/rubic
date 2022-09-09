import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Rubic',
  description: 'Rubic & 响应式小程序框架',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'author', content: `jaskang` }],
    ['meta', { name: 'keywords', content: '小程序, miniprogram, vue, reactivity, Composition API, weapp, wechatapp' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Rubic' }],
    ['meta', { property: 'og:description', content: 'Rubic & 响应式小程序框架' }],
  ],
  lastUpdated: true,
  vite: {
    server: {
      port: 3000,
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      pattern: 'https://github.com/jaskang/rubic/tree/main/docs/:path',
      text: '为此页提供修改建议',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/jaskang/rubic' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT Jaskang',
    },
    algolia: {
      appId: 'C0YGLUN59H',
      apiKey: '7eb55d1722df59642ff7c7c8bec14e41',
      indexName: 'rubic',
    },
    nav: [
      {
        text: '指南',
        link: '/guide/',
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: `v${version}`,
        items: [
          {
            text: '版本发布',
            link: 'https://github.com/JasKang/rubic/releases',
          },
        ],
      },
    ],
    sidebar: {
      '/': [
        {
          text: '指南',
          items: [
            { text: '简介', link: '/guide/why' },
            { text: '快速起步', link: '/guide/' },
            { text: '创建小程序', link: '/guide/app' },
            { text: '定义页面', link: '/guide/page' },
            { text: '定义组件', link: '/guide/component' },
            { text: '状态管理', link: '/guide/store' },
            { text: '插件', link: '/guide/plugin' },
            { text: 'TS 工具类型', link: '/guide/ts' },
          ],
        },
      ],
    },
  },
})
