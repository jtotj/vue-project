import Vue from 'vue'
import VueI18n from 'vue-i18n'
import _ from 'lodash'

const files = require.context('.', false, /\.js$/)
const messages = {}

files.keys().forEach((key) => {
  if (key === './index.js') return
  messages[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

Vue.use(VueI18n)

const locales = _.chain(messages).keys().map(key => [key, messages[key].locale_name]).fromPairs().value()
export { locales }

const i18n = new VueI18n({
  // set locale messages
  messages
})
export default i18n
