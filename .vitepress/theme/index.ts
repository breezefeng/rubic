import './styles/index.scss'
import { h, type App } from 'vue'
import { VPTheme } from '@vue/theme'
import NavbarTitle from './components/NavbarTitle.vue'

export default Object.assign({}, VPTheme, {
  Layout: () => {
    // @ts-ignore
    return h(VPTheme.Layout, null, {
      'navbar-title': () => h(NavbarTitle),
    })
  },
  enhanceApp({ app }: { app: App }) {},
})
