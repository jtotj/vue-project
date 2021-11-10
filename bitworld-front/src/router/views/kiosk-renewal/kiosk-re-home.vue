<script>
import Qrcode from 'qrcode.vue'
import '@assets/css/kiosk/kiosk-login.css'
import '@assets/css/kiosk/kiosk-bank.css'
import KioskLogin from '@components/kiosk-renewal/kiosk-re-login'
import { mapState, mapGetters } from 'vuex'
import { EventBus } from '@utils/event-bus'

export default {
  components: { KioskLogin, Qrcode },
  data() {
    return {
      market_drawar: false,
      about_drawar: false,
      drawer_visible: false,
      direction: 'btt',
      video_id: {
        ko: 'yfV4fvos-aE',
        en: '5BWvavehXq4',
        player_vars: {
          autoplay: 1,
        },
      },
      message: {
        KIND: 'WINDOWATTRIBUTE',
        FROM: 'BROWSER',
        TO: 'KIOSK',
        DATA: { COMMAND: 'SHOW' },
      },
      drawer_event: false,
      video_lang: {
        ko: 'NEZOmkepqLA',
        en: 'lQpztWW5Xzs',
        zh: 'zcl1RgvSEZM',
        ja: 'eD8Fg8jQpuo',
      },
      src: '',
    }
  },
  computed: {
    ...mapState('common', ['locale']),
    ...mapGetters('auth', ['loggedIn']),

    location() {
      return window.location
    },
    trade_guide_video() {
      return this.$refs.youtube.player
    },
    c_video_lang() {
      return this.videoFilter()
    },
    c_locale() {
      return this.locale.substring(0, 2)
    },
  },
  beforeMount() {
    EventBus.$on('clickKioskLogin', () => (this.drawer_visible = true))
    EventBus.$on('kioskLogOut', this.handleClose)
    EventBus.$on('flagSelect(locale)', this.localeClass)
  },
  mounted() {
    this.src = `https://www.youtube.com/embed/${
      this.c_video_lang
    }?loop=1&amp;autoplay=1&amp;controls=0&amp;disablekb=1&amp;modestbranding=1&amp;playlist=${
      this.c_video_lang
    }&amp;video_id=${
      this.c_video_lang
    }&amp;fs=0&amp;iv_load_policy=3&amp;playsinline=0&amp;rel=0&amp;mute=1&amp;enablejsapi=1&amp;origin=http%3A%2F%2Fsnfex.com&amp;widgetid=1`
  },
  beforeDestroy() {
    EventBus.$off('clickKioskLogin')
    EventBus.$off('kioskLogOut')
  },
  methods: {
    kioskTransition() {
      this.$emit('payment_count', 300)
      window.ipcRenderer.send('hide')
      window.ipcRenderer.send('receiptPrint', this.message)
    },
    handleClose() {
      this.market_drawar = false
      this.about_drawar = false
      this.drawer_visible = false
      this.drawer_event = false
    },
    videoFilter() {
      let v_id = 'lQpztWW5Xzs'
      for (const val in this.video_lang) {
        if (val === this.c_locale) {
          v_id = this.video_lang[val]
          return v_id
        }
      }
      return v_id
    },
    handleLogout() {
      this.$store.dispatch('auth/logOut')

      this.drawer_visible = false
    },
    handleLink() {
      if (this.loggedIn === true) {
        this.$router.push({ name: 'kiosk-re-bank' })
      } else {
        this.drawer_visible = true
      }
    },
  },
}
</script>

<template>
  <div :class="$style.kioskHome" class="kiosk-home re">
    <section :class="$style.adBanner">
      <div :class="$style.transparentBg"></div>
      <iframe
        frameborder="0"
        allowfullscreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube video player"
        width="100%"
        align="center"
        height="100%"
        :class="$style.ytplayer"
        :src="src"
      ></iframe>
    </section>
    <!-- //영상 배너 -->
    <div class="main-box-wrap">
      <div class="main-box">
        <a @click="kioskTransition">
          <img src="@assets/kiosk-re-img/icon_main_order.svg" alt="" />
          <div class="line"></div>
          <div class="title">
            <h4>{{ $t('kiosk.store_use') }}</h4>
            <p>{{ $t('kiosk_re.main_order_txt') }}</p>
          </div>
        </a>
      </div>
      <el-button class="bank" @click="handleLink">
        <div class="main-box">
          <img src="@assets/kiosk-re-img/icon_main_bank.svg" alt="" />
          <div class="line"></div>
          <div class="title">
            <h4>{{ $t('pay_home.cocobank_title') }}</h4>
            <p>{{ $t('kiosk_re.main_bank_txt') }}</p>
          </div>
        </div>
      </el-button>
      <!-- half wrap -->
      <div class="half-wrap">
        <!-- market -->
        <el-button class="market bot" @click="market_drawar = true">
          <div class="main-box half">
            <img src="@assets/kiosk-re-img/icon_main_market.svg" alt="" />
            <div class="line"></div>
            <div class="title">
              <h4>{{ $t('footer.coco_market') }}</h4>
              <p>{{ $t('kiosk_re.main_market_txt') }}</p>
            </div>
          </div>
        </el-button>
        <!-- coinabout -->
        <el-button class="about bot" @click="about_drawar = true">
          <div class="main-box half">
            <img src="@assets/kiosk-re-img/icon_main_about.svg" alt="" />
            <div class="line"></div>
            <div class="title">
              <h4>{{ $t('kiosk_re.main_about') }}</h4>
              <p>{{ $t('kiosk_re.main_about_txt') }}</p>
            </div>
          </div>
        </el-button>
      </div>
      <el-drawer
        :visible.sync="market_drawar"
        :direction="direction"
        class="re-drawer market-drw"
      >
        <img class="logo" src="@assets/kiosk-re-img/logo_market.svg" alt="" />
        <div class="top-txt">
          <h4 v-html="$t('kiosk_re.market_drw_txt_1')"></h4>
          <p v-html="$t('kiosk_re.market_drw_txt_2')"></p>
          <Qrcode class="qr" value="https://cocoin.market" size="280"></Qrcode>
          <!-- <img class="qr" src="@assets/kiosk-re-img/QR.svg" alt="" /> -->
          <p class="txt">{{ $t('kiosk_re.market_drw_txt_3') }}</p>
        </div>
        <div class="bot-txt">
          <img src="@assets/kiosk-re-img/img_market.png" alt="" />
          <p v-html="$t('kiosk_re.market_drw_txt_4')"></p>
        </div>
      </el-drawer>
      <el-drawer
        :visible.sync="about_drawar"
        :direction="direction"
        class="re-drawer about-drw market-drw"
      >
        <img
          class="logo"
          src="@assets/kiosk-re-img/logo_coinabout.svg"
          alt=""
        />
        <div class="top-txt">
          <h4 v-html="$t('kiosk_re.about_drw_txt_1')"></h4>
          <p v-html="$t('kiosk_re.about_drw_txt_2')"></p>
          <Qrcode class="qr" value="https://aboutcoin.io" size="280"></Qrcode>
          <!-- <img class="qr" src="@assets/kiosk-re-img/QR.svg" alt="" /> -->
          <p class="txt">{{ $t('kiosk_re.about_drw_txt_3') }}</p>
        </div>
        <div class="bot-txt">
          <img src="@assets/kiosk-re-img/img_aboutcoin.png" alt="" />
          <!-- <p v-html="$t('kiosk_re.market_drw_txt_4')"></p> -->
        </div>
      </el-drawer>
      <el-drawer
        :title="loggedIn ? '' : ''"
        :visible.sync="drawer_visible"
        :direction="direction"
        :append-to-body="true"
        class="re-drawer"
      >
        <component
          :is="'KioskLogin'"
          v-if="drawer_visible"
          @login_complete="drawer_visible = false"
          @close_drawer="handleClose"
          @logout_event="logout_modal_visible = true"
        ></component>
      </el-drawer>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-home.scss';
</style>
