import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Rubic',
  description: 'Vite & Vue powered static site generator.',
  themeConfig: {
    nav: [
      {
        text: '文档',
        link: '/guide/',
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: `v${version}`,
        link: '',
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Why Vitest',
              link: '/guide/why',
            },
          ],
        },
      ],
    },
  },
})
