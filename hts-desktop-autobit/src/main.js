// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Common from './plugins/common'
// import SweetModal from 'sweet-modal-vue/src/plugin.js'
import Toasted from 'vue-toasted';
import PrettyCheckbox from 'pretty-checkbox-vue';
import VTooltip from 'v-tooltip'
import VueLoading from 'vue2-loading';
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import VuePikaday from '@enrian/vue-pikaday';
import VModal from 'vue-js-modal'
import VuejsDialog from 'vuejs-dialog';
import VueModalTor from 'vue-modaltor';
import VueClipboard from 'vue-clipboard2'
import platform_type from '@/utils/platformType'
import i18n from './locales'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'

import store from './vuex/store'

import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import '../node_modules/material-icons/iconfont/material-icons.scss';
import '@enrian/vue-pikaday/dist/vue-pikaday.min.css';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import '@/grant';

Vue.prototype.$http = axios
Vue.config.ignoredElements = ['cq-context', 'cq-ui-manager', 'cq-color-picker', 'cq-colors', 'cq-overrides', 'cq-menu', 'cq-lookup', 'cq-lookup-input', 'cq-lookup-icon', 'cq-lookup-results', 'cq-lookup-filters', 'cq-filter', 'cq-scroll', 'cq-clickable', 'cq-menu-dropdown', 'cq-item', 'cq-separator', 'cq-views', 'cq-heading', 'cq-views-content', 'cq-view-save', 'cq-plus', 'cq-flag', 'cq-language-name', 'cq-themes', 'cq-themes-builtin', 'cq-themes-custom', 'cq-study-legend', 'cq-section-dynamic', 'cq-study-legend-content', 'cq-placeholder', 'cq-toggle', 'cq-tooltip', 'cq-toolbar', 'cq-toolbar-settings', 'cq-fill-color', 'cq-line-color', 'cq-line-style', 'cq-axis-label', 'cq-annotation', 'cq-measure', 'cq-undo-section', 'cq-undo', 'cq-redo', 'cq-loader', 'cq-chart-title', 'cq-symbol', 'cq-chart-price', 'cq-current-price', 'cq-change', 'cq-todays-change', 'cq-todays-change-pct', 'cq-comparison', 'cq-comparison-add-label', 'cq-comparison-plus', 'cq-comparison-add', 'cq-comparison-lookup-frame', 'cq-swatch', 'cq-accept-btn', 'cq-comparison-key', 'cq-attrib-container', 'cq-attrib-source', 'cq-attrib-quote-type', 'cq-hu-static', 'cq-hu-price', 'cq-hu-open', 'cq-hu-close', 'cq-volume-section', 'cq-hu-volume', 'cq-volume-rollup', 'cq-hu-high', 'cq-hu-low', 'cq-attribution', 'cq-show-range', 'cq-dialog', 'cq-view-dialog', 'cq-aggregation-dialog', 'cq-study-context', 'cq-fib-settings-dialog', 'cq-fibonacci-settings', 'cq-study-dialog', 'cq-study-inputs', 'cq-study-outputs', 'cq-study-parameters', 'cq-theme-dialog', 'cq-close', 'cq-section', 'cq-theme-piece', 'cq-action', 'cq-timezone-dialog', 'cq-language-dialog', 'cq-languages', 'cq-share-dialog', 'cq-share-create', 'cq-share-generating', 'cq-share-uploading', 'cq-side-panel', 'cq-label', 'cq-theme-custom', 'stx-hu-tooltip', 'stx-hu-tooltip-field', 'stx-hu-tooltip-field-value', 'cq-comparison-item', 'cq-comparison-swatch', 'cq-comparison-label', 'cq-comparison-price', 'cq-comparison-loader', 'cq-hu-dynamic', 'cq-hu-col1', 'cq-hu-date', 'cq-volume-grouping', 'cq-volume-visual', 'cq-hu-col2', 'cq-fibonacci-setting', 'cq-study-input', 'cq-selected', 'cq-study-output', 'cq-study-parameter', 'stx-hu-tooltip-field-name'];
Vue.use(Element, {
  locale,
})
Vue.use(VTooltip)
// Vue.use(SweetModal)
Vue.use(Common)
Vue.use(VuejsDialog, {
  okText: '확인',
  cancelText: '취소',
});
Vue.use(VueModalTor);
Vue.use(VueClipboard);
Vue.use(VModal, { dialog: true, })
Vue.use(Toasted, { duration: 5000, theme: 'bubble', icon: 'info_outline', fullWidth: platform_type === 'mobile', fitToScreen: false, position: 'top-center', iconPack: 'material' });
Vue.use(PrettyCheckbox);
Vue.use(PerfectScrollbar)
Vue.use(VuePikaday)
Vue.use(VueLoading, {
  text: 'Loading...',
  bg: 'rgba(230, 233, 236, 0.8)',
  textColor: '#000',
  spinnerClass: 'xi xi-spinner-3 xi-3x xi-spin',
});
Vue.directive('restrict', {
  bind(el, binding) {
    el.addEventListener('keydown', (e) => {
      // delete, backpsace, tab, escape, enter,
      const special = [46, 8, 9, 27, 13];
      if (binding.modifiers.decimal) {
        // decimal(numpad), period
        special.push(110, 190);
      }
      // special from above
      if (special.indexOf(e.keyCode) !== -1 ||
        // Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) ||
        // Ctrl+C
        (e.keyCode === 67 && e.ctrlKey === true) ||
        // Ctrl+X
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return; // allow
      }
      if ((binding.modifiers.alpha) &&
        // a-z/A-Z
        (e.keyCode >= 65 && e.keyCode <= 90)) {
        return; // allow
      }
      if ((binding.modifiers.number) &&
        // number keys without shift
        ((!e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) ||
        // numpad number keys
        (e.keyCode >= 96 && e.keyCode <= 105))) {
        return; // allow
      }
      // otherwise stop the keystroke
      e.preventDefault();
    });
  },
});

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  i18n,
  router,
  template: '<App />',
  components: { App }
})

app.$i18n.locale = store.state.common.locale;

// axios.interceptors.request.use(function(config) {
//   app.request_count++;

//   return config;
// }, function(error) {
//   app.request_count--;

//   Promise.reject(error);
// })
// axios.interceptors.response.use(function(response) {
//   app.request_count--;

//   return response;
// }, function(error) {
//   app.request_count--;

//   Promise.reject(error);
// })
