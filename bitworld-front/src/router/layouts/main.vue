<script>
import Header from '@components/TopNav'
import Footer from '@components/Footer-Area'
import '@assets/css/swap.css'
import '@assets/css/button.css'
import '@assets/css/dashboard.css'
import '@assets/css/invest.css'
import '@assets/css/icon.css'
import '@assets/css/home.css'
import '@assets/css/mypage.css'
import '@assets/css/footer-link.css'
import '@assets/css/policy.css'
import '@assets/css/common.css'

export default {
  components: { Header, Footer },
  beforeMount() {
    window.addEventListener('resize', this.getWindowHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowHeight)
  },
  created() {
    this.getWindowHeight()
  },
  methods: {
    getWindowHeight() {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    },
  },
}
</script>

<template>
  <div :class="['page-wrap', `page-${$route.name}`]">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>
