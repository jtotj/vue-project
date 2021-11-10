<script>
import OrderNav from '@components/OrderNav'
import { fetchWithdrawList, cancelWithdraw } from '@apis/withdraw'
import PageNavigation from '@components/page-navigation'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

import AssetAccountList from '@components/asset-account-list'

export default {
  page: {
    title: 'Withdraw',
    meta: [{ name: 'description', content: 'withdraw' }],
  },
  components: { OrderNav, PageNavigation, AssetAccountList },
  data() {
    return {
      withdraw_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      open_withdraw_index: [],
      loading: false,
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.loadWithdrawList()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadWithdrawList()
  },
  methods: {
    date,
    fromPairs,
    async loadWithdrawList() {
      this.loading = true
      const ret_obj = await fetchWithdrawList({
        ...this.$route.query,
        list_count: 10,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.withdraw_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleCancel(seq) {
      cancelWithdraw(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'))
          this.loadWithdrawList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleClick(p) {
      this.$router.push({
        name: 'Withdraw-Detail',
        query: {
          seq: p,
        },
      })
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
            <span class="big-tit">{{ $t('wallet_page.withdraw_list') }}</span>
          </div>
        </div>
        <div class="orders-wrap">
          <div class="container">
            <OrderNav></OrderNav>

            <AssetAccountList></AssetAccountList>

            <div v-loading="loading">
              <template v-if="withdraw_list.length">
                <div class="main-deal">
                  <ul class="deal-list">
                    <template v-for="(withdraw, index) in withdraw_list">
                      <li
                        :key="withdraw.seq"
                        :class="[
                          'deal-act',
                          { on: open_withdraw_index === index },
                        ]"
                      >
                        <span class="number-badge">
                          {{ withdraw._no }}
                        </span>
                        <div class="wrap">
                          <div class="left-info">
                            <p class="tit">{{ withdraw.asset_title }}</p>
                            <ul class="short-list">
                              <li>
                                <span>{{ $t('registration_date') }}</span>
                                {{
                                  date(
                                    'Y-m-d H:i:s',
                                    new Date(withdraw.regdate)
                                  )
                                }}</li
                              >
                              <li>
                                <span>{{
                                  $t('wallet_page.withdraw_bank_address')
                                }}</span>
                                {{ withdraw.account_number }}</li
                              >
                            </ul>
                          </div>
                          <div class="right-info">
                            <div class="multiple">
                              <div class="money-wrap">
                                <strong class="money">{{
                                  withdraw.request_amount
                                    | codeDecimal(withdraw.asset_code)
                                }}</strong>
                              </div>
                              <div class="act-wrap">
                                <a
                                  class="links lookup-links"
                                  @click="handleClick(withdraw.seq)"
                                  >{{ $t('look_up') }}</a
                                >
                                <a
                                  v-if="withdraw.status === 'PENDING'"
                                  class="links"
                                  @click="handleCancel(withdraw.seq)"
                                  >{{ $t('cancel') }}</a
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="acco-content">
                          <ul class="detail-list">
                            <li>
                              <span>{{ $t('status') }}</span>
                              <strong
                                ><span>{{
                                  fromPairs(constants.withdraw.status)[
                                    withdraw.status
                                  ]
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{ $t('wallet_page.fee_type') }}</span>
                              <strong
                                ><span>{{
                                  fromPairs(
                                    constants.asset.withdraw_fee.fee_type
                                  )[withdraw.fee_type]
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{ $t('type_of_charge') }}</span>
                              <strong
                                ><span>{{
                                  fromPairs(
                                    constants.asset.withdraw_fee.fee_amount_type
                                  )[withdraw.fee_amount_type]
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{ $t('fee_charged') }}</span>
                              <strong
                                ><span>{{
                                  withdraw.fee_amount
                                    | codeDecimal(withdraw.asset_code)
                                }}</span></strong
                              >
                            </li>
                            <li>
                              <span>{{ $t('wallet_page.net_amount') }}</span>
                              <strong
                                ><span>{{
                                  withdraw.net_amount
                                    | codeDecimal(withdraw.asset_code)
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
                  <h2 class="trades-tit">
                    <img class="no-list-img" src="@assets/img/no-list.png" />
                    <p>{{ $t('wallet_page.no_withdraw_list') }}</p>
                  </h2>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
