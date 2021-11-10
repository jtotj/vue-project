<script>
import { getParentNodes } from '@utils/dom'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      lang_menu: false,
    }
  },
  computed: {
    ...mapState(['common']),
  },
  beforeMount() {
    document.body.addEventListener('click', this.onBodyClick)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.onBodyClick)
  },
  methods: {
    ...mapActions('common', ['SetLocale']),
    onBodyClick(e) {
      const parentNodes = getParentNodes(e.target)
      const chk1 = e.target !== this.$refs.type_lang
      const chk2 = !~parentNodes.indexOf(this.$refs.type_lang)
      if (chk1 && chk2) this.lang_menu = false
    },
    localeChange(locale) {
      this.$i18n.locale = locale
      this.SetLocale(locale)
    },
    flagSelect(locale) {
      if (this.common.locales[locale] === 'English') {
        return 'us'
      } else if (this.common.locales[locale] === '한국어') {
        return 'ko'
      } else if (this.common.locales[locale] === '日本語') {
        return 'ja'
      } else if (this.common.locales[locale] === '中文(中国)') {
        return 'ch'
      } else if (this.common.locales[locale] === '中文(臺灣)') {
        return 'TW'
      } else if (this.common.locales[locale] === 'Français') {
        return 'fr'
      } else if (this.common.locales[locale] === 'Deutsch') {
        return 'de'
      } else if (this.common.locales[locale] === 'Español') {
        return 'es'
      } else if (this.common.locales[locale] === 'Tiếng Việt') {
        return 'vi'
      } else if (this.common.locales[locale] === 'Português') {
        return 'br'
      }
    },
  },
}
</script>

<template>
  <div class="lang-wrap">
    <div ref="type_lang" class="lang two-hide" @click="lang_menu = !lang_menu">
      <span class="title-img" :class="`${flagSelect(common.locale)}`"></span>
      <span class="title-locale">{{ common.locales[common.locale] }}</span>
      <svg class="gnb-svg" viewBox="0 0 19 32">
        <path
          fill="#333"
          d="M18.048 13.696l-7.488 7.168q-.576.576-1.28.576T8 20.864L.512 13.696Q0 13.184 0 12.384t.512-1.312q1.216-1.216 2.496 0l6.272 6.016 6.272-6.016q1.28-1.216 2.496 0 .512.512.512 1.312t-.512 1.312z"
        ></path>
      </svg>
    </div>
    <!-- 언어 선택 -->
    <ul v-if="lang_menu" class="drop-box two-hide">
      <li
        v-for="(name, locale) in common.locales"
        :key="name"
        :class="{ active: common.locale === locale }"
        @click="localeChange(locale)"
      >
        <span class="nation-img" :class="`${flagSelect(locale)}`"></span>
        <span class="nation-tit">{{ name }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
<style scoped>
.lang {
  position: relative;
  padding-right: 15px;
  font-size: 14px;
  cursor: pointer;
}
.title-locale {
  vertical-align: super;
}
.title-img {
  display: inline-block;
  width: 45px;
  height: 21px;
  background-repeat: no-repeat;
  background-size: 28px 18px;
}
.lang span {
  text-decoration: none;
}

.lang:hover {
  text-decoration: none;
}

/* 언어 드롭박스 */

.drop-box {
  position: absolute;
  right: 0;
  z-index: 9;
  background: #fff;
  border: 1px solid #eee;
}

.drop-box li {
  position: relative;
  display: flex;
  padding: 5px 15px 5px 0;
  cursor: pointer;
}

.drop-box li.active {
  color: #333;
  background-color: #f4f9ff;
}

.drop-box li.active span {
  color: #333;
}

.nation-tit {
  display: table;
  font-size: 14px;
  line-height: 38px;
  color: #191919;
}

.nation-img {
  display: inline-block;
  width: 59px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: 20px 10px;
  background-size: 28px 18px;
}
</style>
