<script>
import date from 'locutus/php/datetime/date'
import { mapGetters, mapState } from 'vuex'
import { fetchMerchantList } from '@apis/pg'
import { fetchPrivateMarkets } from '@apis/market'
import { fetchCertificationTypes } from '@apis/kyc'
import { fetchFaqList, fetchFaq } from '@apis/cs'
import filter from 'lodash/filter'
import Sitemap from '@components/sitemap'
import HotCoupon from '@components/hot-coupon'
import DirectKrw from '@components/direct-krw-market'
import QuickService from '@components/quick-service'
import NewsArea from '@components/news-area'
import CompanyLocation from '@components/company-location'
import NoticeModal from '@components/notice-modal'

export default {
  page: {
    title: 'Bank::BankHome',
    meta: [
      {
        name: 'description',
        content: 'Bank::BankHome',
      },
    ],
  },
  components: {
    Sitemap,
    DirectKrw,
    HotCoupon,
    QuickService,
    CompanyLocation,
    NewsArea,
    NoticeModal,
  },
  data() {
    return {
      faq_list: [],
      faq: null,
      market_list: [],
      merchant_list: [],
      kyc_type_list: [],
      video_id: {
        ko: 'yfV4fvos-aE',
        en: '5BWvavehXq4',
        player_vars: {
          autoplay: 1,
        },
      },
      trade_guide_modal: false,
      news: [
        {
          content: this.$t('part_of_news'),
        },
        {
          content: this.$t('part_of_news'),
        },
        {
          content: this.$t('part_of_news'),
        },
        {
          content: this.$t('part_of_news'),
        },
        {
          content: this.$t('part_of_news'),
        },
        {
          content: this.$t('part_of_news'),
        },
        {
          content: this.$t('part_of_news'),
        },
        {
          content: this.$t('part_of_news'),
        },
      ],
    }
  },
  computed: {
    ...mapState(['common']),
    ...mapGetters('auth', ['loggedIn']),

    c_active_market() {
      return filter(this.market_list, { is_active: 'Y' })
    },
    trade_guide_video() {
      return this.$refs.youtube.player
    },
    c_faq_contents() {
      return filter(this.faq_list, (list) => list.type_name === 'NOTICE').slice(
        0,
        5
      )
    },
  },
  mounted() {
    Promise.all([this.loadFaqList()]).catch((e) =>
      this.$toasted.error(e.message)
    )

    if (this.loggedIn) {
      Promise.all([
        this.loadMerchantList(),
        this.loadMarketList(),
        this.loadKycTypeList(),
      ])
        .then(() => this.loadFaqList())
        .catch((e) => this.$toasted.error(e.message))
    } else {
      this.loadMarketList()
    }
  },
  methods: {
    date,
    async loadMerchantList() {
      const ret_obj = await fetchMerchantList({
        ...this.$route.query,
      }).catch((e) => this.$toasted.error(e.message))
      this.merchant_list = ret_obj.data
    },
    async loadMarketList() {
      const { data } = await fetchPrivateMarkets().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.market_list = data
    },
    async loadKycTypeList() {
      const ret_obj = await fetchCertificationTypes({
        type_seq: this.$route.params.type_seq * 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.kyc_type_list = ret_obj.data
    },
    openTradeGuideModal() {
      this.trade_guide_modal = true
      if (this.$refs.youtube) this.trade_guide_video.playVideo()
    },
    closeTradeGuideModal() {
      this.trade_guide_modal = false
      this.trade_guide_video.stopVideo()
    },
    moveToTop() {
      window.scrollTo(0, 0)
    },
    async loadFaqList() {
      const ret_obj = await fetchFaqList({
        ...this.$route.query,
        no_paging: 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.faq_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    async loadFaq() {
      const ret_obj = await fetchFaq().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.faq = ret_obj.data
    },

    goFaq(seq) {
      this.$router.push({
        name: 'contact-notice',
        query: { seq: seq },
      })
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <section id="quick-trade">
      <div class="container layout-flex">
        <DirectKrw></DirectKrw>
        <HotCoupon></HotCoupon>
      </div>
    </section>
    <!-- 트레이드가이드 -->
    <!-- <section class="section introduce-wrap">
      <div class="guide-wrap">
        <div>{{ $t('guide.title') }}</div>
        <a class="detail" @click="openTradeGuideModal">
          <i class="fas fa-video"></i>
          {{ $t('guide.watch_video') }}
        </a>
      </div>
    </section> -->
    <section id="quick-service" class="section">
      <QuickService></QuickService>
    </section>

    <!-- 찾아 오시는 길, 위치, 뉴스  -->
    <section id="location" class="section">
      <div class="container">
        <CompanyLocation></CompanyLocation>
        <NewsArea></NewsArea>
      </div>
    </section>

    <!-- 원하는 방법으로 결제하세요. -->
    <section id="induce-payment" class="section">
      <div class="container">
        <div class="main-title">
          <h2>{{ $t('pay_home.home_sec2_h2') }}</h2>
          <p>
            {{ $t('pay_home.home_sec2_text1') }}
            <br />
            {{ $t('pay_home.home_sec2_text2') }}
          </p>
        </div>
        <div class="box-wrap">
          <div class="box-list">
            <h3>{{ $t('pay_home.home_sec2_online_pay') }}</h3>
            <span class="line"></span>
            <p>{{ $t('pay_home.home_sec2_online_text') }}</p>
          </div>
          <div class="box-list">
            <h3>{{ $t('pay_home.home_sec2_voice_invoice') }}</h3>
            <span class="line"></span>
            <p>{{ $t('pay_home.home_sec2_voice_text') }}</p>
          </div>
          <div class="box-list">
            <h3>{{ $t('pay_home.home_sec2_exchange_pay') }}</h3>
            <span class="line"></span>
            <p>{{ $t('pay_home.home_sec2_exchange_text') }}</p>
          </div>
          <div class="box-list">
            <h3>{{ $t('pay_home.home_sec2_mobile_pay') }}</h3>
            <span class="line"></span>
            <p>{{ $t('pay_home.home_sec2_mobile_text') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 왜 전 세계 수많은 사업자들이 COCOBANK를 신뢰할까요. -->
    <section id="why-pick-bank" class="section text-center">
      <div class="container">
        <div class="main-title">
          <h2 v-html="$t('pay_home.home_sec5_h2')"></h2>
          <p
            >{{ $t('pay_home.home_sec5_sub_text_1') }}
            <br />
            {{ $t('pay_home.home_sec5_sub_text_2') }}</p
          >
        </div>
        <div class="box-wrap">
          <div class="box-list">
            <div class="img-wrap">
              <img src="@assets/img/icon-security.svg" alt="아이콘" />
            </div>
            <h3>{{ $t('pay_home.home_sec5_h3') }}</h3>
            <p>{{ $t('pay_home.home_sec5_h3_sub1') }}</p>
          </div>
          <div class="box-list">
            <div class="img-wrap">
              <img src="@assets/img/icon-global.svg" alt="아이콘" />
            </div>
            <h3>{{ $t('pay_home.home_sec5_h31') }}</h3>
            <p>{{ $t('pay_home.home_sec5_h31_sub1') }}</p>
          </div>
          <div class="box-list">
            <div class="img-wrap">
              <img src="@assets/img/icon-fast.svg" alt="아이콘" />
            </div>
            <h3>{{ $t('pay_home.home_sec5_h32') }}</h3>
            <p>{{ $t('pay_home.home_sec5_h32_sub1') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 글로벌 셀러가 되어보세요. -->
    <!-- <section id="signup-area" class="section">
      <div class="container">
        <div class="main-title">
          <p>{{ $t('pay_home.home_sec9_h2_1') }}</p>
          <h2>{{ $t('pay_home.home_sec9_h2_2') }}</h2>
        </div>
        <div class="btn-wrap">
          <router-link class="btn-white" :to="{ name: 'register' }">
            {{ $t('pay_home.home_sec9_btn') }}
            <div class="img-wrap">
              <img src="@assets/img/longarrow-right-black.svg" />
            </div>
          </router-link>
        </div>
      </div>
    </section> -->

    <!-- CCF 배너 -->
    <section id="ccf-intro">
      <div class="container">
        <div class="main-title">
          <h2>
            CCF
          </h2>
          <p>
            {{ $t('key_coin') }}
          </p>
        </div>
        <div class="btn-wrap">
          <router-link class="btn-white" :to="{ name: 'ccf-intro' }">
            {{ $t('more_view') }}
            <div class="img-wrap">
              <img src="@assets/img/longarrow-right-black.svg" />
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 공지사항 / 고객센터 -->
    <section id="notice" class="section clear">
      <div class="container">
        <div class="notice-area">
          <div class="main-title">
            <h2>{{ $t('header.notice') }}</h2>
            <router-link class="more-view" :to="{ name: 'contact-notice' }">
              <span>{{ $t('dash.more') }}</span>
              <div class="img-wrap">
                <img src="@assets/img/arrow-right-grey.svg" alt="화살표" />
              </div>
            </router-link>
          </div>
          <div class="notice-list">
            <ul>
              <li
                v-for="faq in c_faq_contents"
                :key="faq.seq"
                class="clear"
                @click="goFaq(faq.seq)"
              >
                <router-link :to="{ name: 'contact-notice' }">
                  - {{ faq.title }}
                </router-link>
                <span>{{ date('Y-m-d', new Date(faq.regdate)) }}</span>
              </li>
            </ul>
            <div v-if="c_faq_contents.length === 0">
              <p>
                {{ $t('no_list') }}
              </p>
            </div>
          </div>
        </div>
        <div class="customer-service">
          <div class="main-title">
            <h2>{{ $t('service_center.service_center') }}</h2>
          </div>
          <div class="counsel-area korea-counsel-area">
            <h4>{{ $t('korean_language_counseling') }}</h4>
            <div class="icon">
              <img src="@assets/img/icon-mail.svg" />
            </div>
            <span> korea@cocobnk.com</span>
            <p>{{ $t('hours_of_business') }}</p>
          </div>
          <div class="counsel-area korea-counsel-area">
            <h4>{{ $t('overseas_consultation') }}</h4>
            <div class="icon">
              <img src="@assets/img/icon-mail.svg" />
            </div>
            <span>
              help@cocobnk.com
            </span>
            <p>
              Malta - English
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 유튜브 인가보다. -->
    <!-- <el-dialog
      class="youtube_dial"
      :visible.sync="trade_guide_modal"
      :title="$t('guide.title')"
      :before-close="closeTradeGuideModal"
      :append-to-body="true"
      >
      <youtube
        ref="youtube"
        width="100%"
        :video-id="common.locale === 'ko-KR' ? video_id.ko : video_id.en"
        :player-vars="video_id.player_vars"
      ></youtube>
    </el-dialog> -->

    <!-- 사이트맵 -->
    <section id="sitemap" class="section">
      <div class="container">
        <div class="main-title">
          <h2>
            {{ $t('pay_head_foot.site_map') }}
          </h2>
        </div>
        <Sitemap></Sitemap>
      </div>
    </section>

    <NoticeModal></NoticeModal>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
