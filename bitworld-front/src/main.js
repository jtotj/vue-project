import Vue from 'vue'
import Element from 'element-ui'
import Toasted from 'vue-toasted'
import App from './app'
import router from '@router'
import store from '@state/store'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import '@components/_globals'
import i18n from './locales'
import VueCarousel from 'vue-carousel'
import VueClipboard from 'vue-clipboard2'
import SocialSharing from 'vue-social-sharing'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import '../node_modules/material-icons/iconfont/material-icons.scss'
import find from 'lodash/find'
import Decimal from 'decimal.js'
import VueJWT from 'vuejs-jwt'
import VueYoutube from 'vue-youtube'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import VueLoaders from 'vue-loaders'
import 'vue-loaders/dist/vue-loaders.css'
import VueSocketIOExt from 'vue-socket.io-extended'
import sio from '@src/sio'
import VueCountdownTimer from 'vuejs-countdown-timer'

Vue.use(PerfectScrollbar)
Vue.use(VueCountdownTimer)

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.prototype.moment = moment
// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}
Vue.directive('restrict', {
  bind(el, binding) {
    el.addEventListener('keydown', (e) => {
      // delete, backpsace, tab, escape, enter,
      const special = [46, 8, 9, 27, 13]
      if (binding.modifiers.decimal) {
        // decimal(numpad), period
        special.push(110, 190)
      }
      // special from above
      if (
        special.indexOf(e.keyCode) !== -1 ||
        // Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) ||
        // Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) ||
        // Ctrl+X
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return // allow
      }
      if (
        binding.modifiers.alpha &&
        // a-z/A-Z
        (e.keyCode >= 65 && e.keyCode <= 90)
      ) {
        return // allow
      }
      if (
        binding.modifiers.number &&
        // number keys without shift
        ((!e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) ||
          // numpad number keys
          (e.keyCode >= 96 && e.keyCode <= 105))
      ) {
        return // allow
      }
      // otherwise stop the keystroke
      e.preventDefault()
    })
  },
})
Vue.filter('codeDecimal', (value, asset_code) => {
  if (!value) return ''
  const asset_info = find(store.state.assets.assets, {
    code: asset_code,
  }) || {
    decimal_point: 8,
  }
  const oDecimal = new Decimal(value)
  const decimal = oDecimal.toFixed(asset_info.decimal_point)
  const parts = decimal.toString().split('.')
  const comma =
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (parts[1] ? '.' + parts[1] : '')

  return comma
})

Vue.filter('numberFormat', (value) => {
  const parts = value.split('.')
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (parts[1] ? '.' + parts[1] : '')
  )
})
Vue.filter('trimDecimalZero', (value) =>
  value.replace(/(?:\.0+|(\.\d+?)0+)$/, '$1')
)
Vue.use(VuejsDialog, {
  okText: '확인',
  cancelText: '취소',
})
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value),
})
Vue.use(Toasted, {
  duration: 5000,
  theme: 'bubble',
  fitToScreen: false,
  position: 'top-center',
  iconPack: 'material',
  icon: 'info_outline',
})
Vue.use(VueCarousel)
Vue.use(VueClipboard)
Vue.use(SocialSharing)
Vue.use(VueJWT)
Vue.use(VueSocketIOExt, sio, {
  store,
})
Vue.use(VueLoaders)
const app = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
Vue.use(VueYoutube)

window.__app__ = app

app.$i18n.locale = store.state.common.locale
