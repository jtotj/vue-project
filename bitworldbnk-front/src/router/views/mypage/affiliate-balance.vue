<script>
import { fetchAffiliateBalance, createAdjust } from '@apis/affiliate'
import PageNavigation from '@components/modal-page-navigation'
import AffiliateNav from '@components/affiliate-nav'
import { mapState } from 'vuex'
import filter from 'lodash/filter'

export default {
  page: {
    title: 'AffiliateBalance',
    meta: [{ name: 'description', content: 'AffiliateBalance' }],
  },
  components: {
    PageNavigation,
    AffiliateNav,
  },
  data() {
    return {
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      affiliate_balance: [],
      s_balance_info: 0,
      show_modal: false,
      account_seq: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),

    c_selected_adjust_asset_account_list() {
      return filter(this.accounts, { asset_seq: this.s_balance_info.asset_seq })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([this.loadAffiliateBalance()])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    async loadAffiliateBalance() {
      const ret_obj = await fetchAffiliateBalance({
        ...this.$route.query,
        list_count: 10,
        page: this.page,
      }).catch((e) => this.$toasted.error(e.message))
      this.affiliate_balance = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handlePageChange(data) {
      this.page = data
      this.loadAffiliateBalance()
    },
    openDialogAdjust(affiliate) {
      this.s_balance_info = affiliate
      this.show_modal = true
    },
    handleSubmitAdjust() {
      createAdjust({
        balance_seq: this.s_balance_info.seq,
        account_seq: this.account_seq,
      })
        .then(() => {
          this.$toasted.success('정산에 성공했습니다.')
          this.loadAffiliateBalanceList()
          this.$store.dispatch('account/getAccounts')
          this.show_modal = false
        })
        .catch((e) => (e ? this.$toasted.error(e.message) : null))
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('affiliate.list_allowance_balance_asset') }}
        </h2>
      </div>
      <div :class="[$style.affiliageBalance]">
        <AffiliateNav></AffiliateNav>
        <div v-loading="loading" :class="[$style.tableWrap]">
          <table>
            <thead>
              <tr>
                <th>
                  {{ $t('affiliate.asset_name') }}
                </th>
                <th>
                  {{ $t('affiliate.asset_code') }}
                </th>
                <th>
                  {{ $t('affiliate.balance') }}
                </th>
                <th>
                  {{ $t('affiliate.cumulative_amount') }}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-for="affiliate in affiliate_balance" :key="affiliate.seq">
              <div :class="[$style.row]">
                <tr>
                  <td>
                    {{ affiliate.asset_title }}
                  </td>
                  <td>
                    {{ affiliate.asset_code }}
                  </td>
                  <td class="nowrap text-right">
                    {{ affiliate.amount | trimDecimalZero | numberFormat }}
                  </td>
                  <td class="nowrap text-right">
                    {{
                      affiliate.total_amount | trimDecimalZero | numberFormat
                    }}
                  </td>
                  <td>
                    <button
                      :class="[$style.settlementProcessBtn]"
                      @click="openDialogAdjust(affiliate)"
                    >
                      {{ $t('affiliate.settle') }}
                    </button>
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
          <div v-if="!affiliate_balance.length" class="no-list">
            <div class="img-wrap">
              <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
            </div>
            <p>
              {{ $t('affiliate.no_affiliate_balance') }}
            </p>
          </div>
        </div>
        <PageNavigation
          class="page-navigation"
          :total_count="total_count"
          :total_page="page_navigation.total_page"
          :cur_page="page"
          :page_count="page_navigation.page_count"
          @change="handlePageChange"
        ></PageNavigation>
      </div>
    </div>
    <el-dialog
      :visible.sync="show_modal"
      :title="$t('affiliate.allowance_settlement')"
      :class="$style.adjustModal"
      :append-to-body="true"
    >
      <form v-if="show_modal" @submit.prevent="handleSubmitAdjust">
        <div :class="[$style.adjustInfo]">
          <div :class="[$style.row]">
            <span :class="[$style.adjustTitle]">
              {{ $t('affiliate.allowance_settlement_info') }}
            </span>
          </div>
          <div :class="[$style.row]">
            <span :class="[$style.adjustTitle]">
              {{ $t('affiliate.name_asset_settled') }}
            </span>
            <div :class="[$style.adjustContent]">
              {{ s_balance_info.asset_title }}
            </div>
          </div>
          <div :class="[$style.row]">
            <span :class="[$style.adjustTitle]">
              {{ $t('affiliate.balance_receive_payment') }}
            </span>
            <div :class="[$style.adjustContent]">
              {{ s_balance_info.amount }}
            </div>
          </div>
          <div :class="[$style.row]">
            <span :class="[$style.adjustTitle]">
              {{ $t('affiliate.select_account_settled') }}
            </span>
            <el-select
              v-model="account_seq"
              class="select-box"
              :class="[$style.select]"
              :placeholder="$t('affiliate.please_select_account')"
            >
              <el-option
                v-for="account in c_selected_adjust_asset_account_list"
                :key="account.seq"
                :label="account.title || account.account_number"
                :value="account.seq"
              >
                <span v-if="account.title">
                  {{ account.title }} | {{ account.account_number }}
                </span>
                <span v-else>
                  {{ account.account_number }}
                </span>
              </el-option>
            </el-select>
          </div>
          <div class="btn-wrap">
            <button class="withdrawal-btn" native-type="submit">{{
              $t('affiliate.calculate')
            }}</button>
          </div>
        </div>
      </form>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/affiliate.scss';
</style>
