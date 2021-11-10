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
    handleLookUp(p) {
      this.$router.push({
        name: 'deposit-detail',
        query: {
          seq: p,
        },
      })
    },
    handleCancel(seq) {
      cancelDeposit(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'))
          this.loadDepositList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('wallet_page.deposit_list') }}
        </h2>
      </div>
      <OrderNav></OrderNav>
      <AssetAccountList></AssetAccountList>

      <div v-loading="loading" :class="[$style.mainDeal]">
        <ul v-if="deposit_list.length" :class="[$style.dealList]">
          <template v-for="deposit in deposit_list">
            <li :key="deposit.seq">
              <span :class="[$style.numberBadge]">
                {{ deposit._no }}
              </span>
              <div :class="[$style.infoWrap]">
                <strong :class="[$style.infoTitle]">{{
                  deposit.asset_title
                }}</strong>
                <div :class="[$style.multiple]">
                  <div :class="[$style.moneyWrap]">
                    <strong :class="[$style.money]">
                      {{
                        deposit.request_amount | codeDecimal(deposit.asset_code)
                      }}
                    </strong>
                  </div>
                  <div :class="[$style.btnWrap]">
                    <a
                      :class="[$style.lookupLinks]"
                      @click="handleLookUp(deposit.seq)"
                      >{{ $t('look_up') }}</a
                    >
                    <a
                      v-if="deposit.status === 'PENDING'"
                      :class="[$style.cancelLinks]"
                      @click="handleCancel(deposit.seq)"
                      >{{ $t('cancel') }}</a
                    >
                  </div>
                </div>
                <ul :class="[$style.shortList]">
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('registration_date') }}
                    </span>
                    <span :class="[$style.content]">
                      {{ date('Y-m-d H:i:s', new Date(deposit.regdate)) }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('wallet_page.withdraw_bank_address') }}</span
                    >
                    <span :class="[$style.content]">
                      {{ deposit.account_number }}
                    </span>
                  </li>
                  <li :class="[$style.status]">
                    <span :class="[$style.text]">{{ $t('status') }}</span>
                    <span :class="[$style.content]">{{
                      fromPairs(constants.deposit.status)[deposit.status]
                    }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </template>
          <PageNavigation
            :total_count="total_count"
            :total_page="page_navigation.total_page"
            :cur_page="page"
            :page_count="page_navigation.page_count"
          ></PageNavigation>
        </ul>
        <div v-else class="no-list">
          <div class="img-wrap">
            <img src="@assets/img/no-list.png" />
          </div>
          <p>
            {{ $t('wallet_page.no_deposit_list') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/deal-list.scss';
</style>
