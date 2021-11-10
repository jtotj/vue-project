<script>
import '@assets/css/clap/index.css'
import ClapNav from '@components/clap/clap-nav'

export default {
  page: {
    title: 'ClapReset',
    meta: [{ name: 'description', content: 'ClapReset' }],
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
          <h3 class="sub-title">
            {{ $t('clap.how_to_initialize_clap') }}
          </h3>
          <div class="content-inner">
            <div class="step one">
              <h3 v-html="this.$t('clap.init_text_1')"></h3>
              <div class="card">
                <div class="step-detail small">
                  <img src="@assets/img/restore-card1.svg" alt="" />
                </div>
                <div class="step-detail small">
                  <img src="@assets/img/restore-card2.svg" alt="" />
                </div>
              </div>
            </div>

            <div class="step two">
              <h3 v-html="this.$t('clap.init_text_2')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/setting-step-three2.png" alt="" />
              </div>
              <span class="step-detail direction-icon"
                ><img src="@assets/img/icon-next-step.png" alt=""
              /></span>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-two.png" alt="" />
              </div>
              <span class="step-detail direction-icon"
                ><img src="@assets/img/icon-next-step.png" alt=""
              /></span>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-two3.png" alt="" />
              </div>
            </div>

            <div class="step three">
              <h3 v-html="this.$t('clap.init_text_3')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-three.png" alt="" />
              </div>
              <span class="step-detail direction-icon"
                ><img src="@assets/img/icon-next-step.png" alt=""
              /></span>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-three2.png" alt="" />
              </div>
              <span class="step-detail direction-icon"
                ><img src="@assets/img/icon-next-step.png" alt=""
              /></span>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-three3.png" alt="" />
              </div>
            </div>

            <div class="step four">
              <h3 v-html="this.$t('clap.init_text_4')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-four.png" alt="" />
              </div>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-four2.png" alt="" />
              </div>
            </div>

            <div class="step five">
              <h3 v-html="this.$t('clap.init_text_5')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-five.png" alt="" />
              </div>
            </div>

            <div class="step six">
              <h3 v-html="this.$t('clap.init_text_6')"></h3>
              <div class="step-detail large">
                <img src="@assets/img/reset-step-six.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
