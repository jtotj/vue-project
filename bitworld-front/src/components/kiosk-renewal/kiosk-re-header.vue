<script>
import Qrcode from 'qrcode.vue'
import { EventBus } from '@utils/event-bus.js'
import KioskLocaleSelect from '@components/kiosk-renewal/kiosk-re-locale-select'
import '@assets/css/kiosk-renewal/kiosk-re-header.css'
import { mapGetters } from 'vuex'

export default {
  components: {
    KioskLocaleSelect,
    Qrcode,
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
      join_drawer: false,
      logout_modal_visible: false,
      direction: 'btt',
      touch_check: 0,
      interval_id: null,
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
          this.$router.push({ name: 'kiosk-re-home' })
          EventBus.$emit('kioskLogOut')
          this.handleClose()
          this.touch_check = 0
        } else if (
          this.touch_check === Number(this.max_count) &&
          !this.loggedIn
        ) {
          this.$router.push({ name: 'kiosk-re-home' })
          EventBus.$emit('kioskLogOut')
          this.handleClose()
          this.touch_check = 0
        }
      }, 1000)
    },
    logOut() {
      this.$store.dispatch('auth/logOut')
      this.$toasted.info(this.$t('kiosk.logged_out_txt'), {
        theme: 'toasted-primary',
        containerClass: 'kiosk-toasted',
      })
      if (this.$route.name === 'kiosk-re-home') {
        setTimeout(() => {
          this.logout_modal_visible = false
        }, 3000)
      }
      this.$router.push({ name: 'kiosk-re-home' })
    },
    handlerLocale() {
      if (this.$route.name === 'kiosk-re-home') {
        this.localeBtn = true
      } else {
        this.localeBtn = false
      }
    },
    handleClose() {
      this.drawer = false
      this.join_drawer = false
      this.logout_modal_visible = false
    },
    handleLogin() {
      EventBus.$emit('clickKioskLogin')
    },
  },
}
</script>

<template>
  <div>
    <div id="header">
      <div class="header-inner">
        <div v-if="(handlerLocale(), localeBtn)" class="locale-wrap re">
          <el-button class="lang-btn" @click="drawer = true">
            <KioskLocaleSelect
              v-model="drawer"
              class="main-lang-wrap"
              :visible="drawer"
            ></KioskLocaleSelect>
          </el-button>
        </div>
        <div v-else class="back-btn">
          <a href="javascript:;" @click="$router.go(-1)">
            <img src="@assets/kiosk-re-img/icon_bank_back.svg" alt="" />
          </a>
        </div>
        <h4 class="re-header-logo"
          ><router-link :to="{ name: 'kiosk-re-home' }"
            ><img src="@assets/kiosk-re-img/logo_main.svg" alt=""/></router-link
        ></h4>
        <div class="join-wrap">
          <el-button
            v-if="!loggedIn"
            class="btn-join btn-login"
            @click="handleLogin"
          >
            <img src="@assets/kiosk-re-img/icon_login.svg" alt="" />
            <p>{{ $t('login') }}</p>
          </el-button>
          <el-button
            v-if="!loggedIn"
            class="btn-join"
            @click="join_drawer = true"
          >
            <img src="@assets/kiosk-re-img/icon_join.svg" alt="" />
            <p>{{ $t('register') }}</p>
          </el-button>
          <el-button
            v-else
            class="btn-join"
            @click="logout_modal_visible = true"
          >
            <img src="@assets/kiosk-re-img/icon_logout.svg" alt="" />
            <p>{{ $t('logout') }}</p>
          </el-button>

          <!-- join modal -->
          <el-drawer
            :visible.sync="join_drawer"
            :direction="direction"
            class="re-drawer join-drw"
          >
            <div class="drw-inner">
              <img
                class="logo"
                src="@assets/kiosk-re-img/logo_main.svg"
                alt=""
              />
              <h4 v-html="$t('kiosk_re.buy_immedi')"></h4>
              <div class="qr-wrap">
                <Qrcode value="https://cocobnk.com" size="358"></Qrcode>
                <!-- <img class="qr" src="@assets/kiosk-re-img/QR.svg" alt="" /> -->
                <p>{{ $t('kiosk_re.new_acc') }}</p>
              </div>
              <p class="join_txt">{{ $t('kiosk_re.join_txt') }}</p>
            </div>
          </el-drawer>
          <!-- logout modal -->
          <el-dialog
            :append-to-body="true"
            class="re-logout-modal"
            :visible.sync="logout_modal_visible"
            top="40vh"
          >
            <template v-if="loggedIn">
              <span>{{ $t('kiosk.check_logged_out_txt') }}</span>
              <div slot="footer" class="dialog-footer">
                <el-button
                  class="cancel-btn"
                  @click="logout_modal_visible = false"
                  >{{ $t('cancel') }}</el-button
                >
                <el-button type="primary" class="confirm-btn" @click="logOut">{{
                  $t('logout')
                }}</el-button>
              </div>
            </template>
            <template v-else>
              <span>{{ $t('kiosk.logged_out_txt') }}</span>
              <div slot="footer" class="dialog-footer">
                <el-button
                  type="primary"
                  class="logout-success-btn"
                  @click="logout_modal_visible = false"
                  >{{ $t('kiosk.confirm') }}</el-button
                >
              </div>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
