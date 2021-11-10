<script>
import KioskLocaleSelect from '@components/kiosk/kiosk-locale-select'
import '@assets/css/kiosk/kiosk-header.css'
import { mapGetters } from 'vuex'

export default {
  components: {
    KioskLocaleSelect,
  },
  data() {
    return {
      drawer: false,
      touch_check: 0,
      interval_id: null,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },

  methods: {
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push({ name: 'kiosk-bank-use' })
    },
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
        if (this.touch_check === 30 && this.loggedIn) {
          this.$store.dispatch('auth/logOut')
          this.$toasted.info(this.$t('kiosk.logged_out_txt'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.$router.push({ name: 'kiosk-bank-use' })
          this.touch_check = 0
        } else if (this.touch_check === 30 && !this.loggedIn) {
          this.$router.push({ name: 'kiosk-bank-use' })
          this.touch_check = 0
        }
      }, 1000)
    },
  },
}
</script>

<template>
  <div :class="$style.kioskHeader">
    <header :class="$style.header">
      <div :class="$style.container">
        <template v-if="$route.path.indexOf('bank-use') === -1">
          <div
            v-if="$route.path.indexOf('home') === -1"
            :class="$style.backBtn"
          >
            <a @click="goBack">
              <img src="@assets/kiosk-img/back-icon.svg" alt="back button" />
            </a>
          </div>
          <div v-else class="locale-wrap" :class="$style.mainLocaleWrap">
            <el-button class="lang-btn" @click="drawer = true">
              <KioskLocaleSelect
                v-model="drawer"
                class="main-lang-wrap"
                :visible="drawer"
              ></KioskLocaleSelect>
            </el-button>
          </div>
        </template>
        <template v-else>
          <div class="locale-wrap" :class="$style.mainLocaleWrap">
            <el-button class="lang-btn" @click="drawer = true">
              <KioskLocaleSelect
                v-model="drawer"
                class="main-lang-wrap"
                :visible="drawer"
              ></KioskLocaleSelect>
            </el-button>
          </div>
        </template>
        <h1>
          <router-link
            :to="{
              name:
                $route.path.indexOf('bank-use') === -1
                  ? 'kiosk-home'
                  : 'kiosk-bank-use',
            }"
          >
            <img src="@assets/kiosk-img/header-logo.png" alt="로고" />
          </router-link>
        </h1>

        <a
          v-if="loggedIn"
          :class="$style.logoutWrap"
          @click="$store.dispatch('auth/logOut')"
        >
          <img src="@assets/kiosk-img/icon-logout.svg" />
          <span>{{ $t('logout') }}</span>
        </a>
        <a
          v-else
          :class="$style.logoutWrap"
          @click="
            $router.push({
              name: 'register',
              query: { redirectFrom: 'kiosk-bank-use' },
            })
          "
        >
          <i class="el-icon-user-solid" :class="$style.registerIcon"></i>
          <span>{{ $t('register') }}</span>
        </a>
        <!-- //locale-wrap -->
      </div>
      <!-- //container -->
    </header>
    <!-- //header -->
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-common.scss';
@import '@src/design/kiosk/kiosk-header.scss';
</style>
