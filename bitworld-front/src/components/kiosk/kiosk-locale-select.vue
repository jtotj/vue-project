<script>
import { getParentNodes } from '@utils/dom'
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lang_menu: false,
      drawer: false,
      direction: 'btt',
    }
  },
  computed: {
    ...mapState(['common']),
  },
  watch: {
    visible() {
      this.drawer = this.visible
    },
    drawer() {
      this.$emit('input', this.drawer)
    },
  },
  mounted() {
    this.drawer = this.visible
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
    <div ref="type_lang" class="lang two-hide">
      <span class="title-locale">{{ common.locales[common.locale] }}</span>
      <span class="title-img" :class="`${flagSelect(common.locale)}`"></span>
    </div>
    <!-- 언어 선택 -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      class="lang-drawer-wrapper"
    >
      <ul class="locale">
        <li>
          <ul class="drop-box two-hide">
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
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.lang {
  position: relative;
  padding: 10px;
  font-size: 14px;
  color: white;
  vertical-align: middle;
  cursor: pointer;
}

.title-locale {
  vertical-align: top;
}

.title-img {
  display: inline-block;
  width: 70px;
  height: 70px;
  background-repeat: no-repeat;
  background-size: contain;
}

.lang span {
  padding-right: 20px;
  font-size: 25px;
  font-style: normal;
  font-weight: bold;
  font-stretch: normal;
  line-height: 70px;
  color: #29304d;
  text-align: right;
  letter-spacing: normal;
}
.lang span:last-child {
  padding-right: 0;
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
}

.drop-box li {
  position: relative;
  display: flex;
  cursor: pointer;
}

.drop-box li.active {
  background-color: #f4f9ff;
}

.nation-tit {
  font-size: 14px;
  line-height: 38px;
  color: #191919;
}

.nation-img {
  display: inline-block;
  width: 67px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: 20px 10px;
  background-size: 28px 18px;
}
</style>
