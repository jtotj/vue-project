<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      playing_condition: false,
      swiper: null,
    }
  },
  computed: {
    ...mapState('common', ['locale']),
  },
  mounted() {
    this.swiper = new Swiper('.hot-coupon .swiper-container', {
      slidesPerView: 1,
      loop: true,
      navigation: {
        // nextEl: '.swiper-button-next',
        // prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      // autoplay: {
      //   delay: 2000,
      // },
    })
  },
  methods: {
    alertPrepare() {
      return this.$alert(this.$t('service_prepare'))
    },
    windowRocation(url) {
      window.location.assign(url)
    },
    // playing() {
    //   this.playing_condition = !this.playing_condition
    // },
    // playButton() {
    //   this.swiper.autoplay.start()
    // },
    // pauseButton() {
    //   this.swiper.autoplay.stop()
    // },
  },
}
</script>

<template>
  <div class="hot-coupon">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide event1"
          @click="windowRocation('https://flex.bit-world.co.uk/notice')"
        >
          <div
            :class="[
              'word-break',
              {
                clap:
                  locale === 'en-US' ||
                  locale === 'de-DE' ||
                  locale === 'es-ES' ||
                  locale === 'fr-FR' ||
                  locale === 'pt-Pt',
              },
            ]"
            class="event-text"
          >
            <div class="event-title">
              <!-- v-html="$t('event_banner.clap')" -->
              <strong>BIT WORLD A new beginning</strong>
            </div>
            <div class="event-txt">Remember BIT-WORLD.CO.UK</div>
          </div>
          <!-- <div class="img-wrap">
            <img src="@assets/img/icon-lock-black.svg" alt="자물쇠 아이콘" />
          </div> -->
        </div>

        <div
          class="swiper-slide event2"
          @click="$router.push({ name: 'product-search' })"
        >
          <div class="event-text">
            <div class="event-title">
              <strong
                class="event2-sub-title"
                v-html="$t('event_banner.event2_sub_title')"
              ></strong>
            </div>
            <div class="event-txt">
              <p v-html="$t('event_banner.event2_text')"></p>
            </div>
          </div>
        </div>

        <div
          class="swiper-slide event3"
          @click="windowRocation('https://flex.bit-world.co.uk/vs11')"
        >
          <div class="event-text">
            <div class="event-title">
              <strong v-html="$t('event_banner.grab_bug')"></strong>
            </div>
            <p class="event-txt">{{ $t('event_banner.grab_bug_sub') }}</p>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <!-- <div class="swiper-button swiper-button-next">
        <img src="@assets/img/longarrow-right-black.svg" />
      </div> -->
      <!-- <div class="swiper-button swiper-button-prev">
        <img src="@assets/img/longarrow-left-black.svg" />
      </div> -->
      <!-- <div class="swiper-playing-button" @click="playing">
        <div
          v-if="playing_condition === true"
          class="swiper-button-play"
          @click="playButton"
        >
          <img src="@assets/img/slide-play.svg" alt="slide play" />
        </div>
        <div v-else class="swiper-button-pause" @click="pauseButton">
          <img src="@assets/img/slide-pause.svg" alt="slide pause" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style lang="scss">
@import '@src/design/hot-coupon.scss';
</style>
<style scoped>
.hot-coupon .swiper-slide {
  cursor: pointer;
}
.hot-coupon .swiper-slide * {
  pointer-events: none;
}
</style>
