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
        return 'en'
      } else if (this.common.locales[locale] === '한국어') {
        return 'ko'
      } else if (this.common.locales[locale] === '日本語') {
        return 'ja'
      } else if (this.common.locales[locale] === '中文(中国)') {
        return 'cn'
      } else if (this.common.locales[locale] === '中文(臺灣)') {
        return 'tw'
      } else if (this.common.locales[locale] === 'Français') {
        return 'fr'
      } else if (this.common.locales[locale] === 'Deutsch') {
        return 'de'
      } else if (this.common.locales[locale] === 'Español') {
        return 'es'
      } else if (this.common.locales[locale] === 'Tiếng Việt') {
        return 'vi'
      } else if (this.common.locales[locale] === 'Português') {
        return 'pt'
      }
    },
    toggleMenu() {
      this.lang_menu = !this.lang_menu
    },
  },
}
</script>

<template>
  <div class="lang-wrap">
    <div
      ref="type_lang"
      :class="{ active: lang_menu === true }"
      class="lang"
      @click="toggleMenu"
    >
      <span class="title-img" :class="`${flagSelect(common.locale)}`"></span>
      <span class="title-locale">{{ common.locales[common.locale] }}</span>
      <svg class="gnb-svg" viewBox="0 0 19 32">
        <path
          fill="#222"
          d="M18.048 13.696l-7.488 7.168q-.576.576-1.28.576T8 20.864L.512 13.696Q0 13.184 0 12.384t.512-1.312q1.216-1.216 2.496 0l6.272 6.016 6.272-6.016q1.28-1.216 2.496 0 .512.512.512 1.312t-.512 1.312z"
        ></path>
      </svg>
    </div>
    <!-- 언어 선택 -->
    <ul v-if="lang_menu" class="lang-dropbox">
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
  cursor: pointer;
}

.lang .title-img {
  display: inline-block;
  width: 24px;
  height: 18px;
  margin-right: 10px;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-size: 100%;
}
.lang span {
  text-decoration: none;
}

.lang:hover {
  text-decoration: none;
}

.lang .gnb-svg {
  float: right;
  width: 10px;
  padding: 4px;
  transition: 0.3s;
}

.lang.active .gnb-svg {
  transform: rotate(180deg);
}

.lang-dropbox {
  position: absolute;
  z-index: 9;
  background: #fff;
  border: 1px solid #e5e5e5;
}

.lang-dropbox li {
  position: relative;
  display: flex;
  padding: 5px 10px;
  cursor: pointer;
}

.lang-dropbox li.active {
  color: #333;
  background-color: #dfeaf7;
}

.lang-dropbox li.active span {
  color: #333;
}

.lang-dropbox .nation-tit {
  line-height: 40px;
}

.lang-dropbox .nation-img {
  display: inline-block;
  width: 26px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-position: 0;
  background-size: 100%;
}
</style>
