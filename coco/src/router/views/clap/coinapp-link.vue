<script>
import '@assets/css/clap/index.css'
import ClapNav from '@components/clap/clap-nav'

export default {
  page: {
    title: 'CoinappLink',
    meta: [{ name: 'description', content: 'CoinappLink' }],
  },
  components: {
    ClapNav,
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">CLAP</h2>
      </div>
      <div class="setting-box">
        <div class="nav-wrap">
          <ClapNav></ClapNav>
        </div>
        <div class="content">
          <h3 class="sub-title"> {{ $t('clap.install_coin_app') }} </h3>
          <div class="content-inner">
            <div class="step one">
              <h3 v-html="this.$t('clap.coin_app_text_1')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/coinapp-setting-step-one.png" alt="" />
              </div>
            </div>

            <div class="step two">
              <h3 v-html="this.$t('clap.coin_app_text_2')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/coinapp-setting-step-two.png" alt="" />
              </div>
            </div>

            <div class="step three">
              <h3 v-html="this.$t('clap.coin_app_text_3')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/coinapp-setting-step-three.png" alt="" />
              </div>
            </div>

            <div class="step four">
              <h3 v-html="this.$t('clap.coin_app_text_4')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/coinapp-setting-step-four.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
