import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import pkg from '../package.json'
import { headerPlugin } from './headerMdPlugin'

const nav = [
  {
    text: '指引',
    activeMatch: `^/guide/`,
    link: '/guide/introduction',
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/create-app',
  },
  {
    text: 'HOOKS',
    activeMatch: `^/hooks/`,
    link: '/hooks/request',
  },
  {
    text: pkg.version,
    activeMatch: `^/about/`,
    link: '/about/releases',
  },
]

export const sidebar = {
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '简介', link: '/guide/introduction' },
        {
          text: '快速开始',
          link: '/guide/quick-start',
        },
      ],
    },
    {
      text: '基础',
      items: [
        {
          text: '创建小程序',
          link: '/guide/app',
        },
        {
          text: '注册页面',
          link: '/guide/page',
        },
        {
          text: '注册组件',
          link: '/guide/component',
        },
        {
          text: '响应性',
          link: '/guide/reactivity',
        },
        {
          text: '路由',
          link: '/guide/router',
        },
        {
          text: '依赖注入',
          link: '/guide/provide-inject',
        },
      ],
    },
    {
      text: '进阶',
      items: [
        {
          text: '可组合函数',
          link: '/guide/composition-api',
        },
        {
          text: '中间件',
          link: '/guide/middleware',
        },
        {
          text: 'TS 与组合式 API',
          link: '/guide/typescript',
        },
      ],
    },
    {
      text: '最佳实践',
      items: [
        {
          text: '与生态系统的结合',
          link: '/guide/best-practices/ecosystem',
        },
      ],
    },
  ],
  '/api/': [
    {
      text: '全局 API',
      items: [
        { text: 'createApp', link: '/api/create-app' },
        {
          text: 'definePage',
          link: '/api/define-page',
        },
        {
          text: 'defineComponent',
          link: '/api/define-component',
        },
      ],
    },
    {
      text: '组合式 API',
      items: [
        { text: '生命周期: 应用', link: '/api/lifecycle-app' },
        {
          text: '生命周期: 页面',
          link: '/api/lifecycle-page',
        },
        {
          text: '生命周期: 组件',
          link: '/api/lifecycle-component',
        },
        {
          text: '响应式',
          link: '/api/reactivity',
        },
        {
          text: '依赖注入',
          link: '/api/provide-inject',
        },
        {
          text: '辅助 API',
          link: '/api/supports',
        },
      ],
    },
    {
      text: '进阶 APIs',
      items: [{ text: 'TypeScript 工具类', link: '/api/types' }],
    },
  ],
  '/hooks/': [
    {
      text: '基础',
      items: [
        {
          text: 'useRequestV2',
          link: '/hooks/request',
        },
      ],
    },
    {
      text: '业务',
      items: [{ text: 'useEventTrack', link: '/hooks/event-track' }],
    },
  ],
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: 'zh-CN',
  title: 'Rubic',
  description: 'Rubic - 响应式小程序框架',
  srcDir: 'docs',
  scrollOffset: 'header',
  head: [['script', {}, fs.readFileSync(path.resolve(__dirname, './inlined-scripts/restorePreference.js'), 'utf-8')]],

  themeConfig: {
    nav,
    sidebar,

    algolia: {
      indexName: 'rubic',
      appId: 'C0YGLUN59H',
      apiKey: '7eb55d1722df59642ff7c7c8bec14e41',
      searchParameters: {
        // facetFilters: [''],
      },
    },

    editLink: {
      repo: 'jaskang/rubic',
      text: '在 GitHub 上编辑此页',
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT',
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} JasKang`,
    },
  },

  markdown: {
    config(md) {
      md.use(headerPlugin)
    },
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false,
    },
    server: {
      host: true,
      fs: {
        allow: ['../..'],
      },
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity,
    },
    json: {
      stringify: true,
    },
  },

  vue: {
    reactivityTransform: true,
  },
})
