import './styles/index.css'
import VPApp from './components/VPApp.vue'
import VPNotFound from './components/VPNotFound.vue'
import { Theme } from 'vitepress'
import { withConfigProvider } from './composables/config'

import VPDemo from './components/VPDemo.vue'

const VPTheme: Theme = {
  Layout: withConfigProvider(VPApp),
  NotFound: VPNotFound,
  enhanceApp({app}) {
    app.component('Demo', VPDemo)
  },
}

export { VPTheme }

export type { Config } from './config'
