<script>
import KioskLocaleSelect from '@components/kiosk/kiosk-locale-select'
import '@assets/css/kiosk/kiosk-header.css'
import { mapGetters } from 'vuex'
import KioskLogin from '@components/kiosk/kiosk-login'

export default {
  components: {
    KioskLocaleSelect,
    KioskLogin,
  },
  props: {
    max_count: {
      type: Number,
      default: 60,
    },
  },
  data() {
    return {
      drawer: false,
      touch_check: 0,
      interval_id: null,
      drawer_visible: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  watch: {
    $route(to, from) {
      clearInterval(this.interval_id)
    },
    max_count() {
      clearInterval(this.interval_id)
      this.checkTimer()
    },
    loggedIn() {
      if (this.loggedIn) {
        this.drawer_visible = false
      }
    },
  },
  beforeMount() {
    document.body.addEventListener('click', this.focusInput)
    document.body.addEventListener('click', this.kioskbodyClick)
    document.body.addEventListener('focusin', this.kioskbodyFocus)
    document.body.addEventListener('focusin', this.focusInput)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.focusInput)
    document.body.removeEventListener('click', this.kioskbodyClick)
    document.body.removeEventListener('focusin', this.kioskbodyFocus)
    document.body.removeEventListener('focusin', this.focusInput)
    clearInterval(this.interval_id)
  },
  mounted() {
    this.checkTimer()
  },
  methods: {
    focusInput(e) {
      const el = e.target
      if (
        el.tagName === 'INPUT' ||
        (el.getAttribute('type') === 'text' &&
          el.getAttribute('readonly') !== 'readonly')
      ) {
        // eslint-disable-next-line no-undef
        window.keyboardCall()
      } else {
        // eslint-disable-next-line no-undef
        window.keyboardKill()
      }
    },
    kioskbodyFocus(e) {
      const el = e.target
      if (el.tagName === 'INPUT') {
        this.touch_check = 0
      }
    },
    kioskbodyClick() {
      this.touch_check = 0
    },
    checkTimer() {
      this.interval_id = setInterval(() => {
        this.touch_check = this.touch_check + 1
        if (this.touch_check === Number(this.max_count) && this.loggedIn) {
          this.$store.dispatch('auth/logOut')
          this.$toasted.info(this.$t('kiosk.logged_out_txt'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          if (this.$route.name === 'kiosk-payment') {
            const message = {
              KIND: 'BIT PAY',
              FROM: 'BROWSER',
              TO: 'BITPAY',
              DATA: {
                CODE: '0',
                MSG: '결제가 취소되었습니다.',
              },
            }
            window.ipcRenderer.send('receiptPrint', message)
            this.$emit('payment_count', 60)
          }
          this.$router.push({
            name:
              this.$route.path.indexOf('bank-alone') === -1
                ? 'kiosk-home'
                : 'kiosk-bank-alone',
          })
          this.touch_check = 0
        } else if (
          this.touch_check === Number(this.max_count) &&
          !this.loggedIn
        ) {
          if (this.$route.name === 'kiosk-payment') {
            const message = {
              KIND: 'BIT PAY',
              FROM: 'BROWSER',
              TO: 'BITPAY',
              DATA: {
                CODE: '0',
                MSG: '결제가 취소되었습니다.',
              },
            }
            window.ipcRenderer.send('receiptPrint', message)
            this.$emit('payment_count', 60)
          }
          this.$router.push({
            name:
              this.$route.path.indexOf('bank-alone') === -1
                ? 'kiosk-home'
                : 'kiosk-bank-alone',
          })
          this.touch_check = 0
        }
      }, 1000)
    },
    handleGoHome() {
      if (this.$route.path.indexOf('kiosk-payment') !== -1) {
        const message = {
          KIND: 'BIT PAY',
          FROM: 'BROWSER',
          TO: 'BITPAY',
          DATA: {
            CODE: '0',
            MSG: '결제가 취소되었습니다.',
          },
        }
        window.ipcRenderer.send('receiptPrint', message)
        this.$emit('payment_count', 60)
      }
      this.$router.push({
        name:
          this.$route.path.indexOf('bank-alone') === -1
            ? 'kiosk-home'
            : 'kiosk-bank-alone',
      })
    },
  },
}
</script>

<template>
  <div :class="$style.kioskHeader">
    <header :class="$style.header">
      <div :class="$style.container">
        <div class="locale-wrap" :class="$style.mainLocaleWrap">
          <el-button class="lang-btn" @click="drawer = true">
            <KioskLocaleSelect
              v-model="drawer"
              class="main-lang-wrap"
              :visible="drawer"
            ></KioskLocaleSelect>
          </el-button>
        </div>

        <h1>
          <a @click="handleGoHome">
            <img src="@assets/kiosk-img/header-logo.png" alt="로고" />
          </a>
        </h1>

        <a
          v-if="loggedIn"
          :class="$style.logoutWrap"
          @click="$store.dispatch('auth/logOut')"
        >
          <img src="@assets/kiosk-img/icon-logout.svg" />
          <span>{{ $t('logout') }}</span>
        </a>
        <a v-else :class="$style.logoutWrap" @click="drawer_visible = true">
          <img src="@assets/kiosk-img/icon-logout.svg" />
          <span>{{ $t('login') }}</span>
        </a>
        <!-- //locale-wrap -->
      </div>
      <!-- //container -->
    </header>
    <div class="drawer-wrapper">
      <el-drawer
        title=""
        :visible.sync="drawer_visible"
        direction="btt"
        :append-to-body="true"
      >
        <KioskLogin v-if="drawer_visible"></KioskLogin>
      </el-drawer>
    </div>
    <!-- //header -->
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-common.scss';
@import '@src/design/kiosk/kiosk-header.scss';
</style>
