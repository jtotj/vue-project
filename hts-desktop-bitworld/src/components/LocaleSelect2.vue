<script>
import { getParentNodes } from '@/utils/dom';
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
    ...mapActions(['SetLocale']),
    onBodyClick(e) {
     const parentNodes = getParentNodes(e.target);
        const chk1 = e.target != this.$refs.type_sel;
        const chk2 = !~parentNodes.indexOf(this.$refs.type_sel);

        if (chk1 && chk2) this.show_options = false;
    },
    localeChange(locale) {
      this.$i18n.locale = locale;
      this.SetLocale(locale);
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
  <div class="lang-wrap2">
    <div
      ref="type_lang"
      :class="{ active: lang_menu === true }"
      class="lang2"
      @click="toggleMenu"
    >
      <!-- <span class="title-img" :class="`${flagSelect(common.locale)}`"></span> -->
      <span class="title-locale">{{ common.locales[common.locale] }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13.388"
        height="11.18"
        viewBox="0 0 13.388 11.18"
        class="gnb-svg"
      >
        <path
          d="M1328.782,30.441l6.694,11.18,6.694-11.18Z"
          transform="translate(-1328.782 -30.441)"
          fill="#6c338c"
        />
      </svg>
    </div>
    <!-- 언어 선택 -->
    <ul v-if="lang_menu" class="lang-dropbox2">
      <li
        v-for="(name, locale) in common.locales"
        :key="name"
        :class="{ active: common.locale === locale }"
        @click="localeChange(locale)"
      >
        <!-- <span class="nation-img" :class="`${flagSelect(locale)}`"></span> -->
        <span class="nation-tit2">{{ name }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>

</style>
