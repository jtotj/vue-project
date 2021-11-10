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
      open_withdraw_index: null,
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
        name: 'withdraw-detail',
        query: {
          seq: p,
        },
      })
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('wallet_page.withdraw_list') }}
        </h2>
      </div>

      <OrderNav></OrderNav>
      <AssetAccountList></AssetAccountList>

      <div v-loading="loading" :class="[$style.mainDeal]">
        <ul v-if="withdraw_list.length" :class="[$style.dealList]">
          <template v-for="withdraw in withdraw_list">
            <li :key="withdraw.seq">
              <span :class="[$style.numberBadge]">
                {{ withdraw._no }}
              </span>
              <div :class="[$style.infoWrap]">
                <strong :class="[$style.infoTitle]">{{
                  withdraw.asset_title
                }}</strong>
                <div :class="[$style.multiple]">
                  <div :class="[$style.moneyWrap]">
                    <strong :class="[$style.money]">
                      {{
                        withdraw.request_amount
                          | codeDecimal(withdraw.asset_code)
                      }}
                    </strong>
                  </div>
                  <div :class="[$style.btnWrap]">
                    <a
                      :class="[$style.lookupLinks]"
                      @click="handleClick(withdraw.seq)"
                      >{{ $t('look_up') }}</a
                    >
                    <a
                      v-if="withdraw.status === 'PENDING'"
                      :class="[$style.cancelLinks]"
                      @click="handleCancel(withdraw.seq)"
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
                      {{ date('Y-m-d H:i:s', new Date(withdraw.regdate)) }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('wallet_page.withdraw_bank_address') }}
                    </span>
                    <span :class="[$style.content]">
                      {{ withdraw.account_number }}
                    </span>
                  </li>
                  <li :class="[$style.status]">
                    <span :class="[$style.text]">{{ $t('status') }}</span>
                    <span :class="[$style.content]">{{
                      fromPairs(constants.withdraw.status)[withdraw.status]
                    }}</span>
                  </li>

                  <li>
                    <span :class="[$style.text]">{{
                      $t('wallet_page.fee_type')
                    }}</span>

                    <span :class="[$style.content]">{{
                      fromPairs(constants.asset.withdraw_fee.fee_type)[
                        withdraw.fee_type
                      ]
                    }}</span>
                  </li>
                  <li>
                    <span :class="[$style.text]">{{
                      $t('wallet_page.fee_charge_type')
                    }}</span>
                    <span :class="[$style.content]">{{
                      fromPairs(constants.asset.withdraw_fee.fee_amount_type)[
                        withdraw.fee_amount_type
                      ]
                    }}</span>
                  </li>
                  <li>
                    <span :class="[$style.text]">{{
                      $t('wallet_page.amount_of_fee')
                    }}</span>
                    <span :class="[$style.content]">{{
                      withdraw.fee_amount | codeDecimal(withdraw.asset_code)
                    }}</span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('wallet_page.net_amount') }}
                    </span>
                    <span :class="[$style.content]">{{
                      withdraw.net_amount | codeDecimal(withdraw.asset_code)
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
            {{ $t('wallet_page.no_withdraw_list') }}
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
