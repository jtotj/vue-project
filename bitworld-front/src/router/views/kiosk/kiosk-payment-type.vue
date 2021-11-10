<script>
import '@assets/css/kiosk/kiosk-login.css'
import { mapState, mapGetters } from 'vuex'
import KioskLogin from '@components/kiosk/kiosk-login'

export default {
  page: {
    title: 'KioskPaymentType',
    meta: [{ name: 'description', content: 'KioskPaymentType' }],
  },
  components: {
    KioskLogin,
  },
  data() {
    return {
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
      drawer_visible: false,
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
  },
  watch: {
    loggedIn() {
      if (this.loggedIn) {
        this.$router.push({ name: 'kiosk-store' })
        this.kioskTransition()
      }
    },
  },
  methods: {
    shopUse() {
      this.drawer_kiosk_login = true

      if (!this.drawer_kiosk_login) {
        location.reload()
      }
    },
    kioskTransition() {
      this.$emit('payment_count', 300)
      window.ipcRenderer.send('hide')
      window.ipcRenderer.send('receiptPrint', this.message)
    },
  },
}
</script>

<template>
  <div :class="$style.kioskHome" class="kiosk-home">
    <section :class="$style.adBanner">
      <iframe
        frameborder="0"
        allowfullscreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube video player"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/QoUB7EIOI2k?loop=1&amp;autoplay=1&amp;controls=0&amp;disablekb=1&amp;modestbranding=1&amp;playlist=QoUB7EIOI2k&amp;video_id=QoUB7EIOI2k&amp;fs=0&amp;iv_load_policy=3&amp;playsinline=0&amp;rel=0&amp;mute=1&amp;enablejsapi=1&amp;origin=http%3A%2F%2Fsnfex.com&amp;widgetid=1"
      ></iframe>
    </section>
    <!-- //영상 배너 -->

    <div :class="$style.mainUse">
      <div :class="$style.container" class="container">
        <div
          :class="[
            $style.mainUseBank,
            {
              [$style.wordBreak]:
                locale === 'de-DE' ||
                locale === 'es-ES' ||
                locale === 'ja-JP' ||
                locale === 'pt-PT' ||
                locale === 'fr-FE',
            },
          ]"
        >
          <!-- <el-button @click="drawer_kiosk_login = true">
            <a> -->
          <a @click="!loggedIn ? (drawer_visible = true) : kioskTransition()">
            <img src="@assets/kiosk-img/bank-bg.svg" alt="bank" />
            <h2>{{ '코코뱅크로 결제' }}</h2>
            <span>{{ '코코뱅크 계좌를 사용하여 결제합니다' }}</span>
          </a>
          <!-- </el-button> -->
        </div>
        <!-- //은행사용 -->

        <div
          :class="[
            $style.mainUseStore,
            {
              [$style.wordBreak]:
                locale === 'de-DE' ||
                locale === 'es-ES' ||
                locale === 'ja-JP' ||
                locale === 'pt-PT' ||
                locale === 'fr-FE',

              [$style.wordBreakJpan]: locale === 'ja-JP',
            },
          ]"
        >
          <!-- <el-button @click="shopUse">
            <a> -->
          <a @click="kioskTransition">
            <img src="@assets/kiosk-img/store-bg.svg" alt="store" />
            <h2>{{ '신용카드로 결제' }}</h2>
            <span>{{ '로그인 없이 신용카드를 통해 결제합니다' }}</span>
          </a>
          <!-- </el-button> -->
        </div>
        <!-- //매장사용 -->
      </div>
    </div>
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
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-common.scss';
@import '@src/design/kiosk/kiosk-home.scss';
</style>
