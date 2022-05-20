import './styles/index.css'
import { h, type App } from 'vue'
import { VPTheme } from '@vue/theme'

export default Object.assign({}, VPTheme, {
  Layout: () => {
    // @ts-ignore
    return h(VPTheme.Layout, null, {})
  },
  enhanceApp({ app }: { app: App }) {
    // app.provide('prefer-composition', preferComposition)
    // app.provide('prefer-sfc', preferSFC)
    // app.provide('filter-headers', filterHeadersByPreference)
    // app.component('VueSchoolLink', VueSchoolLink)
  },
})
