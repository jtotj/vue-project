<script>
import '@assets/css/kiosk/kiosk-login.css'
import '@assets/css/kiosk/kiosk-bank.css'
import { mapState } from 'vuex'
import KioskEvent from '@components/kiosk/kiosk-event'

export default {
  components: {
    KioskEvent,
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
  mounted() {
    this.src = `https://www.youtube.com/embed/${
      this.c_video_lang
    }?loop=1&amp;autoplay=1&amp;controls=0&amp;disablekb=1&amp;modestbranding=1&amp;playlist=${
      this.c_video_lang
    }&amp;video_id=${
      this.c_video_lang
    }&amp;fs=0&amp;iv_load_policy=3&amp;playsinline=0&amp;rel=0&amp;mute=1&amp;enablejsapi=1&amp;origin=http%3A%2F%2Fsnfex.com&amp;widgetid=1`
  },
  methods: {
    kioskTransition() {
      this.$emit('payment_count', 300)
      window.ipcRenderer.send('hide')
      window.ipcRenderer.send('receiptPrint', this.message)
    },
    handleClose() {
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
  },
}
</script>

<template>
  <div :class="$style.kioskHome" class="kiosk-home">
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

              [$style.wordBreakJpan]: locale === 'ja-JP',
            },
          ]"
        >
          <!-- <el-button @click="drawer_kiosk_login = true">
            <a> -->
          <router-link :to="{ name: 'kiosk-bank' }">
            <img src="@assets/kiosk-img/bank-bg.svg" alt="bank" />
            <h2>{{ $t('kiosk.bank_use') }}</h2>
            <span>{{ $t('kiosk.cocobank') }}</span>
          </router-link>
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
          <router-link v-if="0" :to="{ name: 'kiosk-payment-type' }">
            <img src="@assets/kiosk-img/order-bg.svg" alt="store" />
            <h2>{{ $t('kiosk.store_use') }}</h2>
            <span>{{ $t('kiosk.location_store') }}</span>
          </router-link>

          <router-link
            :to="{ name: 'kiosk-loading' }"
            @click.native="kioskTransition"
          >
            <img src="@assets/kiosk-img/order-bg.svg" alt="store" />
            <h2>{{ $t('kiosk.store_use') }}</h2>
            <span>{{ $t('kiosk.location_store') }}</span>
          </router-link>
        </div>
        <!-- //매장사용 -->
      </div>
    </div>

    <!-- 이미지 배너 -->
    <section
      v-if="0"
      :class="[
        $style.banner,
        {
          [$style.ko]: locale === 'ko-KR',
          [$style.en]: locale === 'en-US',
          [$style.es]: locale === 'es-ES',
          [$style.fr]: locale === 'fr-FR',
          [$style.jp]: locale === 'ja-JP',
          [$style.pt]: locale === 'pt-PT',
          [$style.vi]: locale === 'vi-VN',
          [$style.cn]: locale === 'zh-CN',
          [$style.tw]: locale === 'zh-TW',
          [$style.de]: locale === 'de-DE',
        },
      ]"
      @click="drawer_event = true"
    >
      <a target="_blank">
        <!-- <span>{{ $t('kiosk.home_ad_1') }}</span>
        <p>{{ $t('kiosk.home_ad_2') }}</p> -->
      </a>
    </section>
    <el-drawer
      title="오픈이벤트(21.05.24~21.05.31)"
      :visible.sync="drawer_event"
      direction="btt"
    >
      <KioskEvent v-if="drawer_event" @close_drawer="handleClose"></KioskEvent>
    </el-drawer>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-common.scss';
@import '@src/design/kiosk/kiosk-home.scss';
</style>
