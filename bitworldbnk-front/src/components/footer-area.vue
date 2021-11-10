<script>
import '@assets/css/footer.css'
import { mapState } from 'vuex'

export default {
  // page: {
  //   title: 'footer-area',
  //   meta: [{ name: 'description', content: 'Home' }],
  // },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      dialogTableVisible: false,
      value: '',
      scrollPosition: null,
      is_show: false,
    }
  },
  computed: {
    ...mapState('common', ['locale']),
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
  },
  methods: {
    dropdownMenu() {
      this.is_show = !this.is_show
    },
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    handleToTop() {
      window.scrollTo(0, 0)
    },
  },
}
</script>

<template>
  <footer id="footer">
    <!-- <div class="footer-use-wrap">
      <div class="container">
        <h3 class="footer-use-title">
          {{ $t('footer.footer_msg') }}
        </h3>
        <p class="footer-use-text">
          {{ $t('footer.footer_sub_msg') }}
        </p>
      </div>
    </div> -->

    <!-- 하단 메뉴 pc -->

    <!-- 하단 메뉴 mobile -->
    <div class="footer-mobile-wrap mobile"> </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="footer-logo">
              <img src="@src/assets/images/f_logo.png" alt="푸터 로고" />
            </div>
          </div>
          <div class="col">
            <div class="text-area">
              <p
                >FH Financial House Trust Kommanditbolag Org.nm: 969778-0162
                Bit<br />
                World All rights reserved</p
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="copyright">
      <div class="container">
        <p>BITWORLD All rights reserved</p>
      </div>
    </div> -->
  </footer>
  <!-- //footer -->
</template>

<style lang="scss" module>
@import '@design';
</style>
<style lang="scss">
@import '@src/design/foot.scss';
</style>
