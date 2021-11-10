<script>
import '@assets/css/kiosk-renewal/kiosk-renewal.css'
import '@assets/css/kiosk-renewal/kiosk-re-bank.css'
import KioskReHeader from '@components/kiosk-renewal/kiosk-re-header'
import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    KioskReHeader,
  },
  data() {
    return {
      login_count: 60,
    }
  },

  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('common', ['locale']),
  },
  created() {
    const [rootElement] = document.getElementsByTagName('html')
    rootElement.classList.add('re-kiosk')
  },
  methods: {
    countModify(time) {
      this.login_count = time
    },
  },
}
</script>

<template>
  <div :class="['kiosk', `${$route.name}`, `${locale}`]" class="re-kiosk">
    <KioskReHeader :max_count="login_count"></KioskReHeader>
    <router-view @payment_count="countModify" />
  </div>
</template>
