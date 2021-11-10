<script>
import date from 'locutus/php/datetime/date'
import { mapGetters, mapState } from 'vuex'
import { fetchMerchantList } from '@apis/pg'
import { fetchPrivateMarkets } from '@apis/market'
import { fetchCertificationTypes } from '@apis/kyc'
import { fetchFaqList, fetchFaq } from '@apis/cs'
import filter from 'lodash/filter'
import HotCoupon from '@components/hot-coupon'
import QuickService from '@components/quick-service'
import QuickInfo from '@components/quick-info'

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
    HotCoupon,
    QuickService,
    QuickInfo,
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
      return filter(this.faq_list, (list) => list.type_name === 'NOTICE')
        .slice(0, 5)
        .reverse()
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
      <div class="slider-visual">
        <HotCoupon></HotCoupon>
      </div>
    </section>
    <section id="quick-info">
      <QuickInfo></QuickInfo>
    </section>
    <section id="notice" class="section clear">
      <div class="container">
        <div class="notice-area">
          <div class="notice-list">
            <ul class="t-head">
              <li>
                <span class="num">No</span>
                <span class="text">Title</span>
                <span class="date">Date</span>
              </li>
            </ul>
            <ul class="t-body">
              <li
                v-for="(faq, index) in c_faq_contents.reverse()"
                :key="faq.seq"
                class="clear"
                @click="goFaq(faq.seq)"
              >
                <span class="num">
                  {{ c_faq_contents.length - index }}
                </span>
                <router-link :to="{ name: 'contact-notice' }" class="text">
                  - {{ faq.title }}
                </router-link>
                <span class="date">{{
                  date('Y-m-d', new Date(faq.regdate))
                }}</span>
              </li>
            </ul>
            <div v-if="c_faq_contents.length === 0">
              <p>
                {{ $t('no_list') }}
              </p>
            </div>
            <router-link class="btn" :to="{ name: 'contact-notice' }">
              <span>{{ $t('dash.more') }}</span>
              <div class="img-wrap">
                <i class="fas fa-chevron-right"></i>
              </div>
            </router-link>
          </div>
        </div>
        <div class="customer-service" style="display:none">
          <div class="main-title">
            <h2>{{ $t('service_center.service_center') }}</h2>
          </div>
          <div class="counsel-area korea-counsel-area">
            <!-- <h4>{{ $t('overseas_consultation') }}</h4> -->
            <div>
              <div class="icon">
                <img src="@assets/img/icon-mail.svg" />
              </div>
              <span>
                help@cocobnk.com
              </span>
            </div>
            <span class="emp">/</span>
            <p>
              <!-- Malta - English -->
              {{ $t('hours_of_business') }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section id="trade">
      <div class="container">
        <h2 class="title">Trade. Anywhere.</h2>
        <p class="info-text"
          >Compatible with multiple devices, start trading with safety and
          convenien</p
        >
        <div class="trade-info">
          <div class="img-box">
            <img src="@assets/images/trade_bg.png" alt="trade" />
          </div>
          <div class="text-box"
            >The validity of each cryptocurrency's coins is provided by a
            blockchain. A blockchain is a continuously growing list of records,
            called blocks, which are linked and secured using cryptography. Each
            block typically contains a hash pointer as a link to a previous
            block, a timestamp and transaction data. By design, blockchains are
            inherently resistant to modification of the data. It is "an open,
            distributed ledger that can record transactions between two parties
            efficiently and in a verifiable and permanent way". For use as a
            distributed ledger, a blockchain is typically managed by a
            peer-to-peer network collectively adhering to a protocol for
            validating new blocks.
          </div>
        </div>
      </div>
    </section>
    <section id="quick-service">
      <QuickService></QuickService>
    </section>

    <section id="trade-start">
      <div class="container">
        <h2 class="title">Start trading now</h2>
        <router-link class="btn register" :to="{ name: '/' }">
          <span>Register Now</span>
        </router-link>
        <router-link class="btn trade" :to="{ name: '/' }">
          <span>Trade Now</span>
        </router-link>
      </div>
    </section>

    <!-- CCF 배너 -->
    <section id="ccf-intro" style="display:none;">
      <div class="container">
        <h2>
          <img src="@assets/images/ccf.svg" alt="" />
        </h2>
        <p>
          {{ $t('key_coin') }}
        </p>
        <div class="btn-wrap">
          <router-link class="btn-white" :to="{ name: 'ccf-intro' }">
            {{ $t('more_view') }}
            <div class="img-wrap">
              <i class="fas fa-chevron-right"></i>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 왜 전 세계 수많은 사업자들이 BITWORLD를 신뢰할까요. -->
    <section
      id="why-pick-bank"
      class="section text-center"
      style="display:none;"
    >
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
            <div class="left">
              <div class="img-wrap">
                <img src="@assets/img/icon-security.svg" alt="아이콘" />
              </div>
              <h3>{{ $t('pay_home.home_sec5_h3') }}</h3>
            </div>
            <p>{{ $t('pay_home.home_sec5_h3_sub1') }}</p>
          </div>
          <div class="box-list">
            <div class="left">
              <div class="img-wrap">
                <img src="@assets/img/icon-global.svg" alt="아이콘" />
              </div>
              <h3>{{ $t('pay_home.home_sec5_h31') }}</h3>
            </div>
            <p>{{ $t('pay_home.home_sec5_h31_sub1') }}</p>
          </div>
          <div class="box-list">
            <div class="left">
              <div class="img-wrap">
                <img src="@assets/img/icon-fast.svg" alt="아이콘" />
              </div>
              <h3>{{ $t('pay_home.home_sec5_h32') }}</h3>
            </div>
            <p>{{ $t('pay_home.home_sec5_h32_sub1') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style lang="scss">
@import '@src/design/home.scss';
</style>
<style lang="scss" module>
@import '@design';
</style>
