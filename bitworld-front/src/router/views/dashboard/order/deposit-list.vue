<script>
import OrderNav from '@components/OrderNav'
import { fetchDepositList, cancelDeposit } from '@apis/deposit'
import PageNavigation from '@components/page-navigation'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

import AssetAccountList from '@components/asset-account-list'

export default {
  page: {
    title: 'Deposit',
    meta: [{ name: 'description', content: 'Deposit' }],
  },
  components: { OrderNav, PageNavigation, AssetAccountList },
  data() {
    return {
      deposit_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      loading: false,
      search_target_account: null,
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.loadDepositList()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadDepositList()
  },
  methods: {
    date,
    fromPairs,
    async loadDepositList() {
      this.loading = true
      const ret_obj = await fetchDepositList({
        ...this.$route.query,
        list_count: 10,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.deposit_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleCancel(seq) {
      cancelDeposit(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'))
          this.loadDepositList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleClick(p) {
      this.$router.push({
        name: 'Deposit-Detail',
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
            <span class="big-tit">{{ $t('wallet_page.deposit_list') }}</span>
          </div>
        </div>
        <div class="orders-wrap">
          <div class="container">
            <OrderNav></OrderNav>

            <AssetAccountList
              v-model="search_target_account"
            ></AssetAccountList>

            <div v-loading="loading">
              <template v-if="deposit_list.length">
                <div class="main-deal">
                  <ul class="deal-list">
                    <template v-for="deposit in deposit_list">
                      <li :key="deposit.seq" :class="['deal-act']">
                        <span class="number-badge">
                          {{ deposit._no }}
                        </span>
                        <div class="wrap">
                          <div class="left-info">
                            <strong class="tit">{{
                              deposit.asset_title
                            }}</strong>
                            <ul class="short-list">
                              <li>
                                <span>
                                  {{ $t('registration_date') }}
                                </span>
                                {{
                                  date('Y-m-d H:i:s', new Date(deposit.regdate))
                                }}</li
                              >
                              <li>
                                <span>{{
                                  $t('wallet_page.withdraw_bank_address')
                                }}</span>
                                {{ deposit.account_number }}</li
                              >
                            </ul>
                          </div>
                          <div class="right-info">
                            <div class="multiple">
                              <div class="money-wrap">
                                <strong class="money">{{
                                  deposit.request_amount
                                    | codeDecimal(deposit.asset_code)
                                }}</strong>
                              </div>

                              <div class="act-wrap">
                                <a
                                  class="links lookup-links"
                                  @click="handleClick(deposit.seq)"
                                  >{{ $t('look_up') }}</a
                                >
                                <a
                                  v-if="deposit.status === 'PENDING'"
                                  class="links"
                                  @click="handleCancel(deposit.seq)"
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
                                  fromPairs(constants.deposit.status)[
                                    deposit.status
                                  ]
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
                    <p>{{ $t('wallet_page.no_deposit_list') }}</p>
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

<style lang="scss" module>
@import '@design';
</style>
