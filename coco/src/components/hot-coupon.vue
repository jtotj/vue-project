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
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
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
          @click="$router.push({ name: 'clap-intro' })"
        >
          <span class="badge-small">NEW</span>
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
              <strong v-html="$t('event_banner.clap')"></strong>
            </div>
          </div>
          <div class="img-wrap">
            <img src="@assets/img/icon-lock-black.svg" alt="자물쇠 아이콘" />
          </div>
        </div>

        <div class="swiper-slide event2" @click="alertPrepare">
          <p
            class="event2-sub-title"
            v-html="$t('event_banner.event2_sub_title')"
          ></p>
          <p
            class="event2-title"
            :class="[{ 'fs-32': locale !== 'ko-KR' }]"
            v-html="$t('event_banner.event2_title')"
          ></p>
          <p class="event2-text" v-html="$t('event_banner.event2_text')"></p>
          <div class="event2-img">
            <img src="@assets/img/event2-slide-img.svg" alt="" />
          </div>
          <button class="btn-event">{{ $t('event_banner.event2_btn') }}</button>
        </div>

        <div class="swiper-slide event3" @click="alertPrepare">
          <div class="img-wrap">
            <img src="@assets/img/2020.svg" alt="2020" />
          </div>
          <div class="event-text">
            <div class="event-title">
              <strong v-html="$t('event_banner.grab_bug')"></strong>
              <div class="icon-wrap">
                <img src="@assets/img/emoji-devil.svg" />
              </div>
            </div>
            <p>{{ $t('event_banner.grab_bug_sub') }}</p>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button swiper-button-next">
        <img src="@assets/img/longarrow-right-black.svg" />
      </div>
      <div class="swiper-button swiper-button-prev">
        <img src="@assets/img/longarrow-left-black.svg" />
      </div>
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

<style scoped>
.hot-coupon {
  position: relative;
  box-sizing: border-box;
  float: right;
  width: 30%;
  height: 600px;
  margin-left: 2%;
}

.hot-coupon .event-text {
  text-align: center;
}

.hot-coupon .event-text.word-break.clap {
  word-wrap: break-word;
}

.hot-coupon strong {
  font-size: 24px;
  font-weight: bold;
  color: #222;
}

.hot-coupon p {
  margin-top: 10px;
}

.hot-coupon .swiper-container {
  height: 100%;
}

.hot-coupon .swiper-slide {
  overflow: hidden;
  cursor: pointer;
  border-radius: 5px;
}

.hot-coupon .swiper-slide strong,
.hot-coupon .swiper-slide p {
  color: #222;
}

.hot-coupon .swiper-slide .badge-small {
  display: inline-block;
  margin: 20px auto;
}

.hot-coupon .event1 {
  box-sizing: border-box;
  padding: 100px 50px;
  text-align: center;
  background-color: rgb(220 242 255);
}

.hot-coupon .event1 .img-wrap {
  width: 100px;
  padding: 40px 0;
  margin: 0 auto;
}

.hot-coupon .event1 .event-text .event-title strong {
  font-size: 30px;
  line-height: 2.5rem;
}

.notKorean .hot-coupon .event1 .event-text .event-title strong {
  font-size: 20px;
}

.hot-coupon .event2 {
  font-family: 'Noto Sans KR';
  color: #f5eff5;
  text-align: center;
  background-image: url('../assets/img/event2-slide-bg.svg');
}

.hot-coupon .event2 .event2-sub-title {
  margin-top: 40px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;
  color: #fffdac;
  letter-spacing: 0;
}

.hot-coupon .event2 .event2-title {
  margin-top: 0;
  font-size: 54px;
  font-weight: 900;
  line-height: 1;
  color: #f5eff5;
  letter-spacing: 0;
}

.hot-coupon .event2 .event2-title span {
  color: #fffdac;
}

.hot-coupon .event2 .event2-text {
  margin-top: 30px;
  font-size: 16px;
  font-weight: 400;
  line-height: 28.8px;
  color: #f5eff5;
  letter-spacing: 0;
}
.hot-coupon .event2 .event2-text span {
  font-weight: 700;
}

.hot-coupon .event2 .event2-img {
  display: inline-block;
  margin-top: 20px;
}

.hot-coupon .event2 .btn-event {
  display: block;
  padding: 11px 45px;
  margin: 30px auto 0 auto;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background-color: #092531;
  border-radius: 0;
}

.hot-coupon .event3 {
  background-color: #f7ebeb;
}

.hot-coupon .event3 .img-wrap {
  width: 300px;
}

.hot-coupon .event3 .event-text {
  box-sizing: border-box;
  padding: 60px 30px;
  overflow: hidden;
  text-align: left;
}

.hot-coupon .event3 .event-text .event-title {
  width: 100%;
  overflow: hidden;
}

.hot-coupon .event3 .event-text strong {
  float: left;
}

.hot-coupon .event3 .event-text .icon-wrap {
  float: left;
  width: 24px;
  padding-left: 10px;
}

.hot-coupon .swiper-button {
  width: 15px;
}

.hot-coupon .swiper-button::after {
  display: none;
}

.hot-coupon .swiper-playing-button {
  position: absolute;
  right: 110px;
  bottom: 20px;
  z-index: 10;
  display: inline-block;
  cursor: pointer;
}

.swiper-pagination-bullet {
  background: white !important;
}

.swiper-button-next {
  right: 5%;
}

.swiper-button-prev {
  left: 5%;
}

.hot-coupon .swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 20px;
}

.swiper-pagination-bullet-active {
  width: 32px !important;
  height: 10px !important;
}

.hot-coupon .event2 .fs-32 {
  font-size: 32px;
}

@media (max-width: 1030px) {
  .hot-coupon {
    height: auto;
  }
}

@media (max-width: 768px) {
  .hot-coupon {
    float: none;
    width: 100%;
    margin: 0;
  }

  .hot-coupon .swiper-slide {
    min-height: 650px;
  }
}
</style>
