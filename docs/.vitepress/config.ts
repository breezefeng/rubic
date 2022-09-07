import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Rubic',
  description: 'Rubic & 响应式小程序框架',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Rubic' }],
    ['meta', { property: 'og:description', content: 'Rubic & 响应式小程序框架' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
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
        link: 'https://github.com/JasKang/rubic/blob/main/CHANGELOG.md',
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
