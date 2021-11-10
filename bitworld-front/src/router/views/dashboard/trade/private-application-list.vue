<script>
import TradeNav from '@components/TradeNav'
import {
  fetchPrivateApplications,
  cancelPrivateApplication,
  payPrivateApplication,
  confirmPrivateApplication,
} from '@apis/application'
import date from 'locutus/php/datetime/date'
import PageNavigation from '@components/page-navigation'

import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'PrivateApplication',
    meta: [
      {
        name: 'description',
        content: 'PrivateApplication',
      },
    ],
  },
  components: {
    TradeNav,
    PageNavigation,
  },
  data() {
    return {
      app_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
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
      this.getPrivateApp()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.getPrivateApp()
  },
  methods: {
    async getPrivateApp() {
      this.loading = true
      const ret_obj = await fetchPrivateApplications({
        ...this.$route.query,
        list_count: 10,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.app_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleCancel(seq) {
      cancelPrivateApplication(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'))
          this.getPrivateApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handlePay(seq) {
      payPrivateApplication(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.msg_holding'))
          this.getPrivateApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleConfirm(seq) {
      confirmPrivateApplication(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.trade_confirm'))
          this.getPrivateApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    date,
    fromPairs,
  },
}
</script>

<template>
  <div class="main">
    <div class="foreground-container">
      <div class="contents">
        <div class="big-tit-wrap">
          <div class="container">
            <span class="big-tit">{{ $t('private.app_list') }}</span>
          </div>
        </div>
        <div class="trades-wrap">
          <div class="container">
            <TradeNav></TradeNav>
            <div v-loading="loading">
              <template v-if="app_list.length">
                <div class="main-deal">
                  <ul class="deal-list">
                    <template v-for="app in app_list">
                      <li :key="app.seq" :class="['deal-act']">
                        <span class="number-badge">
                          {{ app._no }}
                        </span>
                        <div class="wrap">
                          <div class="left-info">
                            <strong class="tit">{{ app.market_title }}</strong>
                            <ul class="short-list">
                              <li>
                                <span>{{ $t('registration_date') }}</span>
                                {{ date('Y-m-d H:i:s', new Date(app.regdate)) }}
                              </li>
                              <li>
                                <span
                                  >{{ $t('wallet_page.withdraw_bank_address') }}
                                </span>
                                {{ app.deal_account_number }}
                              </li>
                            </ul>
                          </div>
                          <div class="right-info">
                            <div class="multiple">
                              <div class="money-wrap">
                                <strong class="money">{{
                                  app.source_amount
                                    | codeDecimal(app.source_asset_code)
                                }}</strong>
                              </div>
                              <div class="act-wrap">
                                <a
                                  class="links"
                                  @click="
                                    $router.push({
                                      name: 'private-app-detail',
                                      params: { seq: app.seq },
                                    })
                                  "
                                >
                                  {{ $t('detail') }}</a
                                >
                                <template
                                  v-if="
                                    ~['DEALER', 'DISABLE'].indexOf(
                                      app.escrow_type
                                    )
                                  "
                                >
                                  <a
                                    v-if="app.status === 'PENDING'"
                                    class="links"
                                    @click="handlePay(app.seq)"
                                    >{{ $t('pay') }}</a
                                  >
                                  <a
                                    v-if="
                                      !(
                                        app.status === 'CANCELED' ||
                                        app.status === 'CONFIRMED' ||
                                        app.status === 'REJECTED'
                                      )
                                    "
                                    class="links"
                                    @click="handleCancel(app.seq)"
                                    >{{ $t('cancel') }}</a
                                  >
                                </template>
                                <template
                                  v-if="app.escrow_type === 'APPLICANT'"
                                >
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
                                    v-if="
                                      !(
                                        app.status === 'CANCELED' ||
                                        app.status === 'CONFIRMED' ||
                                        app.status === 'REJECTED'
                                      )
                                    "
                                    class="links"
                                    @click="handleCancel(app.seq)"
                                    >{{ $t('cancel') }}</a
                                  >
                                </template>
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
                </div>
                <PageNavigation
                  :total_count="total_count"
                  :total_page="page_navigation.total_page"
                  :cur_page="page"
                  :page_count="page_navigation.page_count"
                ></PageNavigation>
              </template>
              <template v-else>
                <div class="no-list-wrap">
                  <img class="no-list-img" src="@assets/img/no-list.png" />
                  <p>{{ $t('private.no_select_deal_app_list') }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
