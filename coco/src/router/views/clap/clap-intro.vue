<script>
import '@assets/css/clap/index.css'
import ClapNav from '@components/clap/clap-nav'

export default {
  page: {
    title: 'ClapIntro',
    meta: [{ name: 'description', content: 'ClapIntro' }],
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
          <h3 class="sub-title">{{ $t('clap.getting_started_clap') }}</h3>
          <div class="content-inner">
            <div class="step one">
              <h3 v-html="this.$t('clap.start_text_1')"> </h3>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-one.png" alt="" />
              </div>
            </div>

            <div class="step two">
              <h3 v-html="this.$t('clap.start_text_2')">> </h3>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-two.png" alt="" />
              </div>
            </div>

            <div class="step three">
              <h3 v-html="this.$t('clap.start_text_3')">> </h3>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-three.png" alt="" />
              </div>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-three2.png" alt="" />
              </div>
            </div>
            <div class="step four">
              <h3 v-html="this.$t('clap.start_text_4')">> </h3>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-four.png" alt="" />
              </div>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-three2.png" alt="" />
              </div>
            </div>

            <div class="step five">
              <h3 v-html="this.$t('clap.start_text_5')">> </h3>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-five.png" alt="" />
              </div>
              <div class="step-detail medium">
                <img src="@assets/img/back-card.jpg" alt="" />
              </div>
            </div>

            <div class="step six">
              <h3 v-html="this.$t('clap.start_text_6')">> </h3>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-five.png" alt="" />
              </div>
            </div>

            <div class="step seven">
              <h3 v-html="this.$t('clap.start_text_7')">> </h3>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-seven.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
