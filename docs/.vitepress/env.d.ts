/// <reference types="vitepress/client" />
/// <reference types="vue/macros-global" />

declare module '@docsearch/js' {
  function docsearch<T = any>(props: T): void
  export default docsearch
}

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}
