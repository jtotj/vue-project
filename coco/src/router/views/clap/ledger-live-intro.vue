<script>
import '@assets/css/clap/index.css'
import ClapNav from '@components/clap/clap-nav'

export default {
  page: {
    title: 'LedgerLiveIntro',
    meta: [{ name: 'description', content: 'LedgerLiveIntro' }],
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
          <h3 class="sub-title">{{
            $t('clap.getting_started_ledger_live')
          }}</h3>
          <div class="content-inner">
            <div class="step one">
              <h3 v-html="$t('clap.ledger_live_text_1')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-one.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step two">
              <h3 v-html="$t('clap.ledger_live_text_2')"></h3>
              <div class="step-detail medium">
                <img
                  src="@assets/img/ledger-live-setting-step-two.png"
                  alt=""
                />
              </div>
              <span class="step-detail direction-icon"
                ><img src="@assets/img/icon-next-step.png" alt=""
              /></span>
              <div class="step-detail medium">
                <img
                  src="@assets/img/ledger-live-setting-step-two2.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step three">
              <h3 v-html="$t('clap.ledger_live_text_3')"></h3>
              <div class="step-detail medium">
                <img
                  src="@assets/img/ledger-live-setting-step-three.png"
                  alt=""
                  class="img-size"
                />
              </div>
            </div>
            <div class="step four">
              <h3 v-html="$t('clap.ledger_live_text_4')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-four.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step five">
              <h3 v-html="$t('clap.ledger_live_text_5')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-five.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step six">
              <h3 v-html="$t('clap.ledger_live_text_6')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-six.png"
                  alt=""
                />
              </div>
              <span class="step-detail direction-icon"
                ><img src="@assets/img/icon-next-step.png" alt=""
              /></span>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-six2.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step seven">
              <h3 v-html="$t('clap.ledger_live_text_7')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-seven.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step eight">
              <h3 v-html="$t('clap.ledger_live_text_8')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-eight.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step nine">
              <h3 v-html="$t('clap.ledger_live_text_9')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-nine.png"
                  alt=""
                />
              </div>
              <span class="step-detail direction-icon"
                ><img src="@assets/img/icon-next-step.png" alt=""
              /></span>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-nine2.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step ten">
              <h3 v-html="$t('clap.ledger_live_text_10')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-ten.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step eleven">
              <h3 v-html="$t('clap.ledger_live_text_11')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-eleven.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step twelve">
              <h3 v-html="$t('clap.ledger_live_text_12')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-twelve.png"
                  alt=""
                />
              </div>
            </div>

            <div class="step thirteen">
              <h3 v-html="$t('clap.ledger_live_text_13')"></h3>
              <div class="step-detail large">
                <img
                  src="@assets/img/ledger-live-setting-step-thirteen.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
