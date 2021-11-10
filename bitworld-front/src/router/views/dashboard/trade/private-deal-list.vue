<script>
import TradeNav from '@components/TradeNav'
import { fetchPrivateDeals, cancelPrivateDeal } from '@apis/deal'
import date from 'locutus/php/datetime/date'
import PageNavigation from '@components/page-navigation'

import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'PrivateDealList',
    meta: [
      {
        name: 'description',
        content: 'PrivateDealList',
      },
    ],
  },
  components: {
    TradeNav,
    PageNavigation,
  },
  data() {
    return {
      private_deal_list: [],
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
      this.getPrivateDeal()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.getPrivateDeal()
  },
  methods: {
    async getPrivateDeal() {
      this.loading = true
      const ret_obj = await fetchPrivateDeals({
        ...this.$route.query,
        list_count: 5,
        own_deals: 1,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.private_deal_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    date,
    fromPairs,
    handleClick(p) {
      this.$router.push({
        name: 'applicationSeq',
        params: {
          deal_seq: p,
        },
      })
    },
    handleCancel(seq) {
      cancelPrivateDeal(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'))
          this.getPrivateDeal()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="foreground-container">
      <div class="contents">
        <div class="big-tit-wrap">
          <div class="container">
            <span class="big-tit">{{ $t('private.deal_list') }}</span>
          </div>
        </div>
        <div class="trades-wrap">
          <div class="container">
            <TradeNav></TradeNav>
            <div v-loading="loading">
              <template v-if="private_deal_list.length">
                <div class="main-deal">
                  <ul class="deal-list">
                    <template v-for="deal in private_deal_list">
                      <li :key="deal.seq" :class="['deal-act']">
                        <span class="number-badge">
                          {{ deal._no }}
                        </span>
                        <div class="wrap">
                          <div class="left-info">
                            <strong class="tit">{{ deal.market_title }}</strong>
                            <ul class="short-list">
                              <li>
                                <span>{{ $t('registration_date') }}</span>
                                {{
                                  date('Y-m-d H:i:s', new Date(deal.regdate))
                                }}
                              </li>
                              <li>
                                <span>{{
                                  $t('wallet_page.withdraw_bank_address')
                                }}</span>
                                {{ deal.account_number }}
                              </li>
                            </ul>
                          </div>
                          <div class="right-info">
                            <div class="multiple">
                              <div class="money-wrap">
                                <strong class="money">{{
                                  deal.source_amount
                                    | codeDecimal(deal.source_asset_code)
                                }}</strong>
                              </div>
                              <div class="act-wrap">
                                <a
                                  class="links lookup-links"
                                  @click="handleClick(deal.seq)"
                                  >{{ $t('look_up') }}</a
                                >
                                <a
                                  v-if="deal.status === 'OPEN'"
                                  class="links"
                                  @click="handleCancel(deal.seq)"
                                  >{{ $t('cancel') }}</a
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="acco-content">
                          <ul class="detail-list">
                            <li>
                              <span>
                                구매 안전 유형
                              </span>
                              <strong
                                ><span>
                                  {{
                                    fromPairs(
                                      constants.market.private_deal.escrow_type
                                    )[deal.escrow_type]
                                  }}
                                </span></strong
                              >
                            </li>
                            <li>
                              <span>{{
                                $t('private.deal_source_min_amount')
                              }}</span>
                              <strong
                                ><span>{{
                                  deal.source_min_amount
                                    | codeDecimal(deal.source_asset_code)
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{ $t('private.buy_price') }}</span>
                              <strong
                                ><span>{{
                                  deal.min_price
                                    | codeDecimal(deal.target_asset_code)
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{
                                $t('private.confirmed_source_amount')
                              }}</span>
                              <strong
                                ><span>{{
                                  deal.confirmed_source_amount
                                    | codeDecimal(deal.source_asset_code)
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{
                                $t('private.holding_source_amount')
                              }}</span>
                              <strong
                                ><span>{{
                                  deal.holding_source_amount
                                    | codeDecimal(deal.source_asset_code)
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{
                                $t('private.potential_source_amount')
                              }}</span>
                              <strong
                                ><span>{{
                                  deal.potential_source_amount
                                    | codeDecimal(deal.source_asset_code)
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{ $t('status') }}</span>
                              <strong
                                ><span>{{
                                  fromPairs(
                                    constants.market.private_deal.status
                                  )[deal.status]
                                }}</span></strong
                              >
                            </li>
                            <li v-if="deal.closed_date" class="closed_date">
                              <span>{{ $t('private.closed_date') }}</span>
                              <strong
                                ><span>{{
                                  date(
                                    'Y-m-d H:i:s',
                                    new Date(deal.closed_date)
                                  )
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
                  <p>{{ $t('header.no_c2c_sell_list') }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
