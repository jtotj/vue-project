import Vue from 'vue'
import VueI18n from 'vue-i18n'
import _ from 'lodash'
import elementEnUs from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhTw from 'element-ui/lib/locale/lang/zh-TW' // element-ui lang
import elementKoKr from 'element-ui/lib/locale/lang/ko' // element-ui lang
import elementJaJp from 'element-ui/lib/locale/lang/ja' // element-ui lang
import elementViVn from 'element-ui/lib/locale/lang/vi' // element-ui lang

const files = require.context('.', false, /\.js$/)
const messages = {}

const el_locale = {
  'en-US': {
    ...elementEnUs,
  },
  'zh-TW': {
    ...elementZhTw,
  },
  'ko-KR': {
    ...elementKoKr,
  },
  'ja-JP': {
    ...elementJaJp,
  },
  'vi-VN': {
    ...elementViVn,
  },
}

// files.keys().forEach((key) => {
//   if (key === './index.js') return
//   messages[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
// })

files.keys().forEach((key) => {
  if (key === './index.js') return
  messages[key.replace(/(\.\/|\.js)/g, '')] = {
    ...files(key).default,
    ...el_locale[key.replace(/(\.\/|\.js)/g, '')],
  }
})

Vue.use(VueI18n)

const locales = _.chain(messages)
  .omit(['ko-KR'])
  .keys()
  .map((key) => [key, messages[key].locale_name])
  .fromPairs()
  .value()
export { locales }

const i18n = new VueI18n({
  // set locale messages
  messages,
})
export default i18n
