<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'

export default {
  data() {
    return {
      swiper: null,
    }
  },
  mounted() {
    this.swiper = new Swiper('.quick-info .swiper-container', {
      slidesPerView: 4,
      observer: true,
      observeParents: true,
      spaceBetween: 30,
      breakpoints: {
        1: {
          slidesPerView: 'auto',
          spaceBetween: 20,
          // freeMdoe: true,
          followFinger: true,
        },
        1100: {
          slidesPerView: 4,
          spaceBetween: 30,
          followFinger: false,
        },
      },
    })
  },
  methods: {
    alertPrepare() {
      return this.$alert(this.$t('service_prepare'))
    },
  },
}
</script>

<template>
  <div class="quick-info">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <a @click="alertPrepare">
            <p>Archive/View My Assets</p>
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="alertPrepare">
            <p
              >Comfortable<br />
              and fast</p
            >
            <span>Professional trading</span>
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="alertPrepare">
            <p>Product purchase</p>
            <span>online<br />product<br />purchase</span>
          </a>
        </div>
        <div class="swiper-slide">
          <a @click="alertPrepare">
            <p>D<br />NFT</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
