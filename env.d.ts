/// <reference types="vitepress/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

declare module '@vue/theme/config' {
  import { UserConfig } from 'vitepress'
  const config: () => Promise<UserConfig>
  export default config
}

declare const __TEST__: boolean
