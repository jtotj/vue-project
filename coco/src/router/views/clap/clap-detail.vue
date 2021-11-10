<script>
import '@assets/css/clap/index.css'
import ClapNav from '@components/clap/clap-nav'

export default {
  page: {
    title: 'ClapDetail',
    meta: [{ name: 'description', content: 'ClapDetail' }],
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
            CLAP
          </h3>
          <div class="content-area">
            <div class="left-area">
              <img src="@assets/img/clap.png" />
            </div>
            <div class="right-area">
              <h3>Create your own Leading Asset Portfolio</h3>
              <p>{{ $t('clap.detail_content1_1') }}</p>
              <p>{{ $t('clap.detail_content1_2') }}</p>
              <p>{{ $t('clap.detail_content1_3') }}</p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
              <h3>{{ $t('clap.detail_title_2') }}</h3>
              <p>{{ $t('clap.detail_content2_1') }}</p>
              <p>{{ $t('clap.detail_content2_2') }}</p>
            </div>
          </div>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <h3>{{ $t('clap.detail_title_3') }} </h3>
          <p>{{ $t('clap.detail_content3_1') }}</p>
          <p>{{ $t('clap.detail_content3_2') }}</p>
          <p>{{ $t('clap.detail_content3_3') }}</p>
          <p>&nbsp;</p>
          <h3>{{ $t('clap.detail_title_4') }}</h3>
          <p>{{ $t('clap.detail_content4_1') }}</p>
          <p>{{ $t('clap.detail_content4_2') }}</p>
          <p>&nbsp;</p>
          <div class="large">
            <img src="@assets/img/clap2.png" />
          </div>
          <p>&nbsp;</p>
          <h3>{{ $t('clap.detail_title_6') }}</h3>
          <p>{{ $t('clap.detail_content6_1') }}</p>
          <p>{{ $t('clap.detail_content6_2') }}</p>
          <p>{{ $t('clap.detail_content6_3') }}</p>
          <p>{{ $t('clap.detail_content6_4') }}</p>
          <p>&nbsp;</p>
          <h3>{{ $t('clap.detail_title_7') }}</h3>
          <p>{{ $t('clap.detail_content7_1') }}</p>
          <p>{{ $t('clap.detail_content7_2') }}</p>
          <p>{{ $t('clap.detail_content7_3') }}</p>
          &nbsp;
          <div class="large">
            <img src="@assets/img/clap3.png" />
          </div>
          &nbsp;
          <h3>{{ $t('clap.detail_title_8') }} </h3>
          <p>{{ $t('clap.detail_content8_1') }}</p>
          <p>&nbsp;</p>
          <h3>{{ $t('clap.detail_title_9') }} </h3>
          <p>{{ $t('clap.detail_content9_1') }}</p>
          <p><strong>&nbsp;</strong></p>
          <p>{{ $t('clap.detail_content9_2') }}</p>
          <p><strong>&nbsp;</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
