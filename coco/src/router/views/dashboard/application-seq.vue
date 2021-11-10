<script>
import { mapState } from 'vuex'
import {
  fetchPrivateApplications,
  confirmPrivateApplication,
  rejectPrivateApplication,
} from '@apis/application'
import TradeNav from '@components/TradeNav'
import PageNavigation from '@components/page-navigation'
import date from 'locutus/php/datetime/date'
import fromPairs from 'lodash/fromPairs'

export default {
  page: {
    title: 'ApplicationSeq',
    meta: [
      {
        name: 'description',
        content: 'ApplicationSeq',
      },
    ],
  },
  components: {
    TradeNav,
    PageNavigation,
  },

  data() {
    return {
      seq_app_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      open_app_index: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.getPrivateDealApp()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.getPrivateDealApp()
  },
  methods: {
    date,
    fromPairs,
    async getPrivateDealApp() {
      this.loading = true
      const ret_obj = await fetchPrivateApplications({
        deal_seq: this.$route.params.deal_seq,
        list_count: 10,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.seq_app_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleConfirm(seq) {
      confirmPrivateApplication(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.trade_confirm'))
          this.getPrivateDealApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleReject(seq) {
      rejectPrivateApplication(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.trade_reject'))
          this.getPrivateDealApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    openAppInfo(e, idx) {
      if (this.open_app_index === idx) {
        this.open_app_index = null
      } else {
        this.open_app_index = idx
      }
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <span class="big-title">{{ $t('private.select_deal_app_list') }}</span>
      </div>

      <div class="trades-wrap">
        <TradeNav></TradeNav>
        <div v-loading="loading">
          <template v-if="seq_app_list.length">
            <div class="main-deal">
              <ul class="deal-list">
                <template v-for="(app, index) in seq_app_list">
                  <li
                    :key="app.seq"
                    :class="['deal-act', { on: open_app_index === index }]"
                  >
                    <span class="number-badge">
                      {{ app._no }}
                    </span>
                    <div class="wrap">
                      <div
                        class="left-info"
                        @click="openAppInfo($event, index)"
                      >
                        <strong class="tit">{{ app.market_title }}</strong>
                        <ul class="short-list">
                          <li>
                            <span>{{ $t('registration_date') }}</span>
                            {{ date('Y-m-d H:i:s', new Date(app.regdate)) }}
                          </li>
                          <li>{{ app.user_id }}</li>
                        </ul>
                      </div>
                      <div class="right-info">
                        <div class="tip left">
                          <div class="tip-wrap multiple">
                            <div class="help">
                              <strong class="bold">
                                {{
                                  app.source_amount
                                    | codeDecimal(app.source_asset_code)
                                }}
                              </strong>
                              <div class="act-wrap">
                                <a
                                  v-if="
                                    app.status === 'PENDING' ||
                                      app.status === 'PAYED'
                                  "
                                  class="links"
                                  @click="handleConfirm(app.seq)"
                                  >{{ $t('confirm') }}</a
                                >
                                <a
                                  v-if="app.status === 'PENDING'"
                                  class="links"
                                  @click="handleReject(app.seq)"
                                  >{{ $t('cancel') }}</a
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="acco-content">
                      <ul class="detail-list">
                        <li>
                          <span>{{
                            $t('private.app_price_per_quantity')
                          }}</span>
                          <strong
                            ><span>{{
                              app.price | codeDecimal(app.target_asset_code)
                            }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ $t('private.app_fee_amount') }}</span>
                          <strong
                            ><span>{{ app.fee_amount }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ $t('private.deal_fee_amount') }}</span>
                          <strong
                            ><span>{{ app.deal_fee_amount }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ $t('status') }}</span>
                          <strong
                            ><span>{{
                              fromPairs(
                                constants.market.private_application.status
                              )[app.status]
                            }}</span></strong
                          >
                        </li>
                      </ul>
                    </div>
                  </li>
                </template>
              </ul>

              <PageNavigation
                :total_count="total_count"
                :total_page="page_navigation.total_page"
                :cur_page="page"
                :page_count="page_navigation.page_count"
              ></PageNavigation>
            </div>
          </template>
          <template v-else>
            <div class="no-list">
              <div class="img-wrap">
                <img src="@assets/img/no-list.png" />
              </div>
              <p>{{ $t('private.no_select_deal_app_list') }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
