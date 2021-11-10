<script>
import '@assets/css/element-ui.css'
import '@assets/css/header.css'
import '@assets/css/common.css'
import '@assets/css/home.css'
import '@assets/css/icon.css'
import NavArea from '@components/nav-area'
import FooterArea from '@components/footer-area'
import NoticeModal from '@components/text-notice-modal.vue'
import { mapState, mapActions } from 'vuex'

export default {
  components: { NavArea, FooterArea, NoticeModal },
  data() {
    return {}
  },
  computed: {
    ...mapState(['common']),
  },
  created() {
    const [rootElement] = document.getElementsByTagName('html')
    const [bodyElement] = document.getElementsByTagName('body')
    delete this.common.locales['ko-KR']
    if (this.common.locale === 'ko-KR') this.SetLocale('en-US')
    rootElement.classList.add('bank')

    if (this.common.locale === 'zh-CN') {
      bodyElement.classList.add('zh-CN')
    } else {
      bodyElement.classList.remove('zh-CN')
    }

    if (this.common.locale === 'zh-TW') {
      bodyElement.classList.add('zh-TW')
    } else {
      bodyElement.classList.remove('zh-TW')
    }

    if (this.common.locale === 'ja-JP') {
      bodyElement.classList.add('ja-JP')
    } else {
      bodyElement.classList.remove('ja-JP')
    }

    if (this.common.locale === 'en-US') {
      bodyElement.classList.add('en-US')
    } else {
      bodyElement.classList.remove('en-US')
    }
  },
  methods: {
    ...mapActions('common', ['SetLocale']),
  },
}
</script>

<template>
  <div
    id="container"
    :class="[
      `${$route.name}`,
      { notKorean: common.locale !== 'ko-KR' },
      `${common.locale}`,
    ]"
    style="position:relative;width:100%;overflow:hidden;"
  >
    <header id="header">
      <NavArea></NavArea>
    </header>
    <router-view />
    <FooterArea></FooterArea>
    <NoticeModal></NoticeModal>
  </div>
</template>
