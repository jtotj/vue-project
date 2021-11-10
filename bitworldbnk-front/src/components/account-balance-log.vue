<script>
import '@assets/css/icon.css'
import date from 'locutus/php/datetime/date'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import { mapState } from 'vuex'
import {
  fetchAccountBalanceLogList,
  createAccount,
  updateAccount,
} from '@apis/account'
import Decimal from 'decimal.js'
import DepositForm from '@components/deposit-form'
import WithdrawForm from '@components/withdraw-form'
import PageNavigation from '@components/modal-page-navigation'
import fromPairs from 'lodash/fromPairs'

export default {
  components: {
    DepositForm,
    WithdrawForm,
    PageNavigation,
  },
  filters: {
    replace(value) {
      if (!value) return ''
      return value.replace(/\[[^\]]*\]/g, '')
    },
  },
  props: {
    asset_seq: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      loading: false,
      select_account_seq: null,
      account_title: null,
      favorite_accounts: [],
      log_list: [],
      input_search_account: '',

      balance_modal: false,
      account_modal: false,
      deposit_modal: false,
      withdraw_modal: false,

      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},

      show_date_picker: false,
      date_search: [],
      search_date_option: null,
      search_order_type: null,
      search_params: {},

      update_account_info: null,
      select_account_asset_info: null,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['currentUser']),
    ...mapState('finance', ['funds']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_selected_asset_info() {
      if (this.asset_seq) {
        return find(this.assets, {
          seq: this.asset_seq,
        })
      } else {
        return null
      }
    },
    c_active_accounts() {
      return filter(
        this.accounts,
        (account) =>
          account.asset_seq === this.asset_seq &&
          !find(this.c_favorite_accounts, { seq: account.seq }) &&
          (!this.input_search_account ||
            account.title
              .toLowerCase()
              .includes(this.input_search_account.toLowerCase()) ||
            account.account_number.includes(this.input_search_account))
      )
    },
    c_favorite_accounts() {
      const accounts = filter(
        uniq(
          map(this.favorite_accounts, (value) =>
            find(this.accounts, { seq: value })
          )
        ).filter(
          (favorite_account) => favorite_account.asset_seq === this.asset_seq
        ),
        (account) =>
          !this.input_search_account ||
          account.title
            .toLowerCase()
            .includes(this.input_search_account.toLowerCase()) ||
          account.account_number.includes(this.input_search_account)
      )
      return accounts
    },
    c_favorite_accounts_currentUser() {
      return `favorite_accounts_${this.currentUser.seq}`
    },

    c_target_account_info() {
      return find(this.accounts, {
        seq: this.select_account_seq,
      })
    },
  },
  watch: {
    // 라우트가 변경되면
    $route(to, from) {
      this.page = this.$route.query.page || 1
    },
  },
  mounted() {
    if (localStorage.getItem(this.c_favorite_accounts_currentUser))
      this.favorite_accounts = JSON.parse(
        localStorage.getItem(this.c_favorite_accounts_currentUser)
      )
  },
  methods: {
    date,
    async getAccountBalanceLogList() {
      this.loading = true
      const ret_obj = await fetchAccountBalanceLogList({
        ...this.$route.query,
        ...this.search_params,
        list_count: 10,
        page: this.page,
        account_seq: this.select_account_seq,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      map(ret_obj.data, (val) => {
        const diff = new Decimal(val.after).minus(val.before)

        if (diff.gt(0)) val.heading = 'up'
        else if (diff.lt(0)) val.heading = 'down'
        else val.heading = 'eq'

        val.diff = diff.abs().toString()
      })
      this.log_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    toggleAccountFavorites(seq) {
      const index = this.favorite_accounts.indexOf(seq)

      if (index !== -1) {
        this.favorite_accounts.splice(index, 1)
        localStorage.setItem(
          this.c_favorite_accounts_currentUser,
          JSON.stringify(this.favorite_accounts)
        )
        return
      }
      this.favorite_accounts.push(seq)
      localStorage.setItem(
        this.c_favorite_accounts_currentUser,
        JSON.stringify(this.favorite_accounts)
      )
    },
    showBalanceModal(seq) {
      this.balance_modal = true
      this.select_account_seq = seq
      Promise.all([this.getAccountBalanceLogList()])
    },
    onCopy(data) {
      this.$copyText(data).then(
        this.$toasted.success(this.$t('toasted_msg.copy'))
      )
    },
    pickerOptions() {
      const start = new Date()
      const end = new Date()
      this.show_date_picker = true
      switch (this.search_date_option) {
        case 'one':
          this.date_search = [start.setHours(0, 0, 0, 0), end.getTime()]
          break
        case 'week':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'month':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'three_month':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'six_month':
          start.setMonth(start.getMonth() - 6)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'option':
          this.date_search = []
          break
        default:
          break
      }
      this.pickerDateChange()
    },
    Decimal,
    fromPairs,
    resetSearchOption() {
      this.show_date_picker = false
      this.date_search = null
      this.search_date_option = null
      this.search_order_type = null
      this.search_params = {}
    },
    pickerDateChange() {
      if (this.date_search && this.date_search.length) {
        this.search_params.regdate_start = this.date_search[0]
        this.search_params.regdate_end = this.date_search[1]
        this.getAccountBalanceLogList()
      }
    },
    sortOptions() {
      switch (this.search_order_type) {
        case 'desc':
          this.search_params.order_type = 'desc'
          break
        case 'asc':
          this.search_params.order_type = 'asc'
          break
      }
      this.getAccountBalanceLogList()
    },
    handlePageChange(data) {
      this.page = data
      this.getAccountBalanceLogList()
    },
    showAccountTaskModal(asset_seq, account_seq) {
      this.account_modal = true
      this.select_account_seq = account_seq
      this.select_account_asset_info = find(this.assets, { seq: asset_seq })
      this.update_account_info = find(this.accounts, {
        seq: this.select_account_seq,
      })
    },
    showAccountModal(seq) {
      this.select_account_seq = seq
      this.account_modal = true
    },
    handleCreate() {
      createAccount({
        asset_seq: this.c_selected_asset.seq,
        title: this.account_title,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.create_account'))
          this.account_title = null
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => (e ? this.$toasted.error(e.message) : null))
        .finally(() => {
          this.loading = false
          this.show_account = false
          this.account_create_modal = false
        })
    },
    handleUpdate() {
      updateAccount({
        account_seq: this.select_account_seq,
        title: this.account_title,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.modify'))
          this.account_title = null
          this.account_modal = false
        })
        .then(() => {
          this.$store.dispatch('account/getAccounts')
        })
        .catch((e) => (e ? this.$toasted.error(e.message) : null))
        .finally(() => {
          this.loading = false
          this.account_modal = false
        })
    },
    showDepositModal(account_seq) {
      this.deposit_modal = true
      this.select_account_seq = account_seq
      Promise.all([])
    },
    showWithdrawModal(account_seq) {
      this.withdraw_modal = true
      this.select_account_seq = account_seq
    },
    showFundDetail(account_seq) {
      const fund_info = find(this.funds, { fund_account_seq: account_seq })
      this.$router.push({
        name: 'fund-info',
        query: { fund_seq: fund_info.seq },
      })
    },
  },
}
</script>

<template>
  <div :class="[$style.accountList]">
    <!-- 계좌 검색 -->
    <div :class="[$style.account_search]">
      <el-input
        v-model="input_search_account"
        prefix-icon="el-icon-search"
        :placeholder="
          `${$t('wallet_page.account_title')} / ${$t(
            'wallet_page.withdraw_bank_address'
          )}`
        "
        :class="[$style.input_account_search]"
      />
    </div>
    <div :class="[$style.mainDeal]">
      <!-- 계좌 목록 -->
      <el-tabs type="card" :class="[$style.tabs]">
        <el-tab-pane :label="$t('account')">
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul :class="[$style.dealList]">
              <div :class="[$style.favoriteAsset]">
                <li
                  v-for="favorite in c_favorite_accounts"
                  :key="favorite.seq"
                  :class="[$style.deal_act]"
                >
                  <template>
                    <div :class="[$style.accountInfo]">
                      <div
                        :class="[
                          {
                            active:
                              favorite_accounts.indexOf(favorite.seq) !== -1,
                          },
                          'favorite',
                        ]"
                        @click.prevent.stop="
                          toggleAccountFavorites(favorite.seq)
                        "
                      ></div>
                      <strong :class="[$style.info_title]">
                        {{ favorite.title || $t('no_alias') }}
                        <span
                          >({{
                            fromPairs(constants.account.instrument_type)[
                              favorite.instrument_type
                            ]
                          }})</span
                        >
                      </strong>
                      <p :class="[$style.accountNumberWrap]">
                        <span :class="[$style.accountText]">
                          {{ $t('wallet_page.withdraw_bank_address') }}
                        </span>
                        <span :class="[$style.account_number]">
                          {{ favorite.account_number }}
                        </span>
                        <button
                          class="oncopy marginL-10"
                          @click.prevent.stop="onCopy(favorite.account_number)"
                          >{{ $t('copy') }}</button
                        >
                      </p>
                    </div>
                    <div :class="[$style.money]">
                      <strong class="amount">
                        {{
                          Decimal(favorite.balance).minus(
                            favorite.holding_balance
                          ) | codeDecimal(favorite.asset_code)
                        }}
                      </strong>
                    </div>
                    <div v-if="$route.name === 'money'" class="btn-wrap">
                      <div :class="[$style.depositWithdrawLinks]">
                        <router-link
                          v-if="
                            (c_selected_asset_info.allow_deposit === 'Y' &&
                              c_selected_asset_info.code === 'CCF') ||
                              (c_selected_asset_info.allow_deposit === 'Y' &&
                                c_selected_asset_info.code === 'CCE')
                          "
                          :to="{ name: 'deposit' }"
                          tag="button"
                          class="btn-green"
                          ><span>
                            {{ $t('wallet_page.deposit_list') }}
                          </span></router-link
                        >
                        <button
                          v-if="
                            c_selected_asset_info.allow_deposit === 'Y' &&
                              c_selected_asset_info.code !== 'CCF' &&
                              (c_selected_asset_info.allow_deposit === 'Y' &&
                                c_selected_asset_info.code !== 'CCE')
                          "
                          class="btn-green"
                          @click="showDepositModal(favorite.seq)"
                        >
                          <div class="img-wrap">
                            <img src="@assets/img/plus_btn.png" />
                          </div>
                          <span>
                            {{ $t('wallet_page.deposit') }}
                          </span>
                        </button>
                        <button
                          v-if="c_selected_asset_info.allow_withdraw === 'Y'"
                          class="btn-red marginL-10"
                          @click="showWithdrawModal(favorite.seq)"
                        >
                          <div class="img-wrap">
                            <img src="@assets/img/minus_btn.png" />
                          </div>
                          <span>
                            {{ $t('wallet_page.withdraw') }}
                          </span>
                        </button>
                      </div>
                      <div :class="[$style.modifyLinkWrap]">
                        <button
                          v-if="favorite.instrument_type !== 'LEGACY'"
                          class="btn"
                          @click="showFundDetail(favorite.seq)"
                        >
                          {{ '금융자금상세' }}
                        </button>
                        <button
                          class="btn"
                          @click="
                            showAccountTaskModal(
                              c_selected_asset_info.seq,
                              favorite.seq
                            )
                          "
                          >{{ $t('wallet_page.account_modify') }}</button
                        >
                      </div>
                    </div>
                    <div
                      v-if="$route.name === 'account-balance'"
                      :class="[$style.linksWrap]"
                    >
                      <div :class="[$style.links_wrap]">
                        <a
                          :class="[$style.balanceLogLink]"
                          @click="showBalanceModal(favorite.seq)"
                        >
                          {{ $t('deposit_account_inquiry') }}
                        </a>
                      </div>
                    </div>
                  </template>
                </li>
                <li
                  v-for="account in c_active_accounts"
                  :key="account.seq"
                  :class="[$style.deal_act]"
                >
                  <template>
                    <div :class="[$style.accountInfo]">
                      <div
                        :class="[
                          {
                            active:
                              favorite_accounts.indexOf(account.seq) !== -1,
                          },
                          'favorite',
                        ]"
                        @click.prevent.stop="
                          toggleAccountFavorites(account.seq)
                        "
                      ></div>
                      <strong :class="[$style.info_title]">
                        {{ account.title || $t('no_alias') }}
                        <span
                          >({{
                            fromPairs(constants.account.instrument_type)[
                              account.instrument_type
                            ]
                          }})</span
                        >
                      </strong>
                      <p :class="[$style.accountNumberWrap]">
                        <span :class="[$style.accountText]">
                          {{ $t('wallet_page.withdraw_bank_address') }}
                        </span>
                        <span :class="[$style.account_number]">
                          {{ account.account_number }}
                        </span>
                        <button
                          class="oncopy marginL-10"
                          @click.prevent.stop="onCopy(account.account_number)"
                          >{{ $t('copy') }}</button
                        >
                      </p>
                    </div>
                    <div :class="[$style.money]">
                      <strong class="amount">
                        {{
                          Decimal(account.balance).minus(
                            account.holding_balance
                          ) | codeDecimal(account.asset_code)
                        }}
                      </strong>
                    </div>
                    <div v-if="$route.name === 'money'" class="btn-wrap">
                      <div :class="[$style.depositWithdrawLinks]">
                        <router-link
                          v-if="
                            (c_selected_asset_info.allow_deposit === 'Y' &&
                              c_selected_asset_info.code === 'CCF') ||
                              (c_selected_asset_info.allow_deposit === 'Y' &&
                                c_selected_asset_info.code === 'CCE')
                          "
                          :to="{ name: 'deposit' }"
                          tag="button"
                          class="btn-green"
                          ><span>
                            {{ $t('wallet_page.deposit_list') }}
                          </span></router-link
                        >
                        <button
                          v-if="
                            c_selected_asset_info.allow_deposit === 'Y' &&
                              c_selected_asset_info.code !== 'CCF' &&
                              (c_selected_asset_info.allow_deposit === 'Y' &&
                                c_selected_asset_info.code !== 'CCE')
                          "
                          class="btn-green"
                          @click="showDepositModal(account.seq)"
                        >
                          <div class="img-wrap">
                            <img src="@assets/img/plus_btn.png" />
                          </div>
                          <span>
                            {{ $t('wallet_page.deposit') }}
                          </span>
                        </button>
                        <button
                          v-if="c_selected_asset_info.allow_withdraw === 'Y'"
                          class="btn-red marginL-10"
                          @click="showWithdrawModal(account.seq)"
                        >
                          <div class="img-wrap">
                            <img src="@assets/img/minus_btn.png" />
                          </div>
                          <span>
                            {{ $t('wallet_page.withdraw') }}
                          </span>
                        </button>
                      </div>
                      <div :class="[$style.modifyLinkWrap]">
                        <button
                          v-if="account.instrument_type !== 'LEGACY'"
                          class="btn marginL-10"
                          @click="showFundDetail(account.seq)"
                        >
                          {{ '금융자금상세' }}
                        </button>
                        <button
                          class="btn"
                          @click="
                            showAccountTaskModal(
                              c_selected_asset_info.seq,
                              account.seq
                            )
                          "
                          >{{ $t('wallet_page.account_modify') }}</button
                        >
                      </div>
                    </div>
                    <div
                      v-if="$route.name === 'account-balance'"
                      :class="[$style.linksWrap]"
                    >
                      <div :class="[$style.links_wrap]">
                        <a
                          :class="[$style.balanceLogLink]"
                          @click="showBalanceModal(account.seq)"
                        >
                          {{ $t('deposit_account_inquiry') }}
                        </a>
                      </div>
                    </div>
                  </template>
                </li>
                <template v-if="asset_seq === 0 || asset_seq === null">
                  <div class="no-list">
                    <div class="img-wrap img-size">
                      <img
                        src="@assets/img/please-select-icon.png"
                        alt="손가락 아이콘"
                      />
                    </div>
                    <p>
                      {{ $t('private.please_select_asset') }}
                    </p>
                  </div>
                </template>
                <div
                  v-if="
                    c_active_accounts.length === 0 &&
                      c_favorite_accounts.length === 0 &&
                      c_selected_asset_info
                  "
                  :class="[$style.dealList]"
                >
                  <div class="no-list">
                    <div class="img-wrap">
                      <img
                        src="@assets/img/no-list.png"
                        alt="목록 없음 아이콘"
                      />
                    </div>
                    <p>
                      {{ $t('wallet_page.no_account_list') }}
                    </p>
                  </div>
                </div>
              </div>
            </ul>
          </PerfectScrollbar>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <span class="favorite-length">
              {{ c_favorite_accounts.length }}
            </span>
            {{ $t('favorites') }}
          </span>

          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul :class="[$style.dealList]">
              <template v-if="c_favorite_accounts.length">
                <div :class="[$style.favoriteAsset]">
                  <li
                    v-for="favorite in c_favorite_accounts"
                    :key="favorite.seq"
                    :class="[$style.deal_act]"
                  >
                    <template>
                      <div :class="[$style.accountInfo]">
                        <div
                          :class="[
                            {
                              active:
                                favorite_accounts.indexOf(favorite.seq) !== -1,
                            },
                            'favorite',
                          ]"
                          @click.prevent.stop="
                            toggleAccountFavorites(favorite.seq)
                          "
                        ></div>
                        <strong :class="[$style.info_title]">
                          {{ favorite.title || $t('no_alias') }}
                          <span
                            >({{
                              fromPairs(constants.account.instrument_type)[
                                favorite.instrument_type
                              ]
                            }})</span
                          >
                        </strong>
                        <p :class="[$style.accountNumberWrap]">
                          <span :class="[$style.accountText]">
                            {{ $t('wallet_page.withdraw_bank_address') }}
                          </span>
                          <span :class="[$style.account_number]">
                            {{ favorite.account_number }}
                          </span>
                          <button
                            class="oncopy marginL-10"
                            @click.prevent.stop="
                              onCopy(favorite.account_number)
                            "
                          >
                            {{ $t('copy') }}
                          </button>
                        </p>
                      </div>
                      <div :class="[$style.money]">
                        <strong class="amount">
                          {{
                            Decimal(favorite.balance).minus(
                              favorite.holding_balance
                            ) | codeDecimal(favorite.asset_code)
                          }}
                        </strong>
                      </div>
                      <div v-if="$route.name === 'money'" class="btn-wrap">
                        <div :class="[$style.depositWithdrawLinks]">
                          <router-link
                            v-if="
                              (c_selected_asset_info.allow_deposit === 'Y' &&
                                c_selected_asset_info.code === 'CCF') ||
                                (c_selected_asset_info.allow_deposit === 'Y' &&
                                  c_selected_asset_info.code === 'CCE')
                            "
                            :to="{ name: 'deposit' }"
                            tag="button"
                            class="btn-green"
                            ><span>
                              {{ $t('wallet_page.deposit_list') }}
                            </span></router-link
                          >
                          <button
                            v-if="
                              c_selected_asset_info.allow_deposit === 'Y' &&
                                c_selected_asset_info.code !== 'CCF' &&
                                (c_selected_asset_info.allow_deposit === 'Y' &&
                                  c_selected_asset_info.code !== 'CCE')
                            "
                            class="btn-green"
                            @click="showDepositModal(favorite.seq)"
                          >
                            <div class="img-wrap">
                              <img src="@assets/img/plus_btn.png" />
                            </div>
                            <span>
                              {{ $t('wallet_page.deposit') }}
                            </span>
                          </button>
                          <button
                            v-if="c_selected_asset_info.allow_withdraw === 'Y'"
                            class="btn-red marginL-10"
                            @click="showWithdrawModal(favorite.seq)"
                          >
                            <div class="img-wrap">
                              <img src="@assets/img/minus_btn.png" />
                            </div>
                            <span>
                              {{ $t('wallet_page.withdraw') }}
                            </span>
                          </button>
                        </div>
                        <div :class="[$style.modifyLinkWrap]">
                          <button
                            v-if="favorite.instrument_type !== 'LEGACY'"
                            class="btn"
                            @click="showFundDetail(favorite.seq)"
                          >
                            {{ '금융자금상세' }}
                          </button>
                          <button
                            class="btn"
                            @click="
                              showAccountTaskModal(
                                c_selected_asset_info.seq,
                                favorite.seq
                              )
                            "
                            >{{ $t('wallet_page.account_modify') }}</button
                          >
                        </div>
                      </div>
                    </template>
                    <div
                      v-if="$route.name === 'account-balance'"
                      :class="[$style.linksWrap]"
                    >
                      <div :class="[$style.links_wrap]">
                        <a
                          :class="[$style.balanceLogLink]"
                          @click="showBalanceModal(favorite.seq)"
                        >
                          {{ $t('deposit_account_inquiry') }}
                        </a>
                      </div>
                    </div>
                  </li>
                </div>
              </template>
              <template v-else>
                <template v-if="asset_seq === 0 || asset_seq === null">
                  <div class="no-list">
                    <div class="img-wrap img-size">
                      <img
                        src="@assets/img/please-select-icon.png"
                        alt="손가락 아이콘"
                      />
                    </div>
                    <p>
                      {{ $t('private.please_select_asset') }}
                    </p>
                  </div>
                </template>
                <template
                  v-if="
                    c_favorite_accounts.length === 0 && c_selected_asset_info
                  "
                  :class="[$style.dealList]"
                >
                  <div class="no-list">
                    <div class="img-wrap">
                      <img
                        src="@assets/img/no-list.png"
                        alt="목록 없음 아이콘"
                      />
                    </div>
                    <p>
                      {{ $t('wallet_page.no_favorite_account_list') }}
                    </p>
                  </div>
                </template>
              </template>
            </ul>
          </PerfectScrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 입금 모달창 -->
    <el-dialog
      v-if="c_selected_asset_info"
      :title="$t('wallet_page.deposit_apply')"
      :class="[$style.depositModal]"
      :visible.sync="deposit_modal"
      :append-to-body="true"
      @close="deposit_modal = null"
    >
      <DepositForm
        v-if="deposit_modal"
        :account_seq="select_account_seq"
        :asset_seq="asset_seq"
        @modal_close="deposit_modal = null"
      ></DepositForm>
    </el-dialog>

    <!-- 출금 모달창 -->
    <el-dialog
      v-if="c_selected_asset_info"
      :title="$t('wallet_page.withdraw')"
      :class="[$style.withdrawModal]"
      :visible.sync="withdraw_modal"
      :append-to-body="true"
      @close="withdraw_modal = null"
    >
      <WithdrawForm
        v-if="withdraw_modal"
        :account_seq="select_account_seq"
        :asset_seq="asset_seq"
        @modal_close="withdraw_modal = null"
      ></WithdrawForm>
    </el-dialog>

    <!-- 계좌등록 & 계좌수정 모달창 -->
    <el-dialog
      :title="$t('wallet_page.account_modify')"
      :visible.sync="account_modal"
      :append-to-body="true"
      width="50%"
      :class="([$style.modifyModal], [$style.modal])"
    >
      <div :class="[$style.tableWrap]">
        <div :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.account_seq') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? c_target_account_info.address_seq
                : $t('auto_input')
            }}
          </div>
        </div>
        <div :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.withdraw_bank_address') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? c_target_account_info.account_number
                : $t('auto_input')
            }}
          </div>
        </div>
        <div :class="([$style.row], [$style.inputRow])">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.account_title') }}
          </div>
          <div :class="[$style.tableBody]">
            <el-input
              v-model="account_title"
              :placeholder="$t('wallet_page.input_account')"
            />
          </div>
        </div>
        <div :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.regdate') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? date('Y-m-d H:i:s', new Date(c_target_account_info.regdate))
                : $t('wallet_page.before_regdate')
            }}
          </div>
        </div>
        <div v-if="select_account_seq !== null" :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.holding_balance') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? c_target_account_info.holding_balance
                : $t('auto_input')
            }}
          </div>
        </div>
        <div :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('status') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? c_target_account_info.status
                : $t('auto_input')
            }}
          </div>
        </div>
        <div v-if="c_selected_asset_info !== null" :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.select_asset') }}
          </div>
          <div :class="[$style.tableBody]">{{
            c_selected_asset_info.code
          }}</div>
        </div>

        <div class="btn-wrap btn-right">
          <button
            v-if="select_account_seq === null"
            :class="[$style.createBtn]"
            @click="handleCreate"
            >{{ $t('wallet_page.create') }}</button
          >
          <button v-else :disabled="!account_title" @click="handleUpdate">
            {{ $t('modify') }}
          </button>
          <a class="btn-grey marginL-10" @click="account_modal = false">{{
            $t('cancel')
          }}</a>
        </div>
      </div>
    </el-dialog>

    <!-- 계좌거래 내역조회 -->
    <el-dialog
      :title="$t('account_transaction_history_inquiry')"
      :visible.sync="balance_modal"
      width="50%"
      :append-to-body="true"
      :class="([$style.depositInquiryModal], [$style.modal])"
      @close="resetSearchOption"
    >
      <template v-if="c_target_account_info && balance_modal">
        <div v-loading="loading">
          <el-row :class="[$style.balanceForm]">
            <el-col :span="12">{{ $t('wallet_page.account_title') }} </el-col>
            <el-col :span="12" :class="[$style.tRight]">{{
              c_target_account_info.title
            }}</el-col>
          </el-row>
          <el-row :class="[$style.balanceForm]">
            <el-col :span="12">{{
              $t('wallet_page.withdraw_bank_address')
            }}</el-col>
            <el-col :span="12" :class="[$style.tRight]"
              ><span class="marginR-10">{{
                c_target_account_info.account_number
              }}</span>
              <button
                class="oncopy"
                @click.prevent.stop="
                  onCopy(c_target_account_info.account_number)
                "
              >
                {{ $t('copy') }}
              </button>
            </el-col>
          </el-row>
          <el-row :class="[$style.balanceForm]">
            <el-col :span="12">{{ $t('balance') }}</el-col>
            <el-col :span="12" :class="[$style.tRight]"
              >{{ c_target_account_info.balance }}
            </el-col>
          </el-row>
          <el-row :class="[$style.balanceForm]">
            <el-col :span="12">{{ $t('withdrawable_amount') }}</el-col>
            <el-col :span="12" :class="[$style.tRight]">{{
              Decimal(c_target_account_info.balance).minus(
                c_target_account_info.holding_balance
              )
            }}</el-col>
          </el-row>
          <el-row
            :class="[$style.balanceForm, $style.balancePickerSort]"
            type="flex"
            justify="space-between"
          >
            <el-radio-group
              v-model="search_date_option"
              :class="[$style.balanceRadioBtn]"
              @change="pickerOptions"
            >
              <el-radio-button label="one">{{
                $t('account_transfer.today')
              }}</el-radio-button>
              <el-radio-button label="week">{{
                $t('account_transfer.one_week')
              }}</el-radio-button>
              <el-radio-button label="month">{{
                $t('account_transfer.one_month')
              }}</el-radio-button>
              <el-radio-button label="three_month">{{
                $t('account_transfer.three_months')
              }}</el-radio-button>
              <el-radio-button label="six_month">{{
                $t('account_transfer.six_months')
              }}</el-radio-button>
            </el-radio-group>
            <el-radio-group
              v-model="search_order_type"
              :class="[$style.balanceSort]"
              @change="sortOptions"
            >
              <el-radio-button label="desc">{{
                $t('account_transfer.recent_order')
              }}</el-radio-button>
              <el-radio-button label="asc">{{
                $t('account_transfer.past_order')
              }}</el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row
            v-if="show_date_picker"
            :class="[$style.balanceForm, $style.tCenter]"
          >
            <el-date-picker
              v-model="date_search"
              type="daterange"
              align="right"
              value-format="timestamp"
              :default-time="['00:00:00', '23:59:59']"
              :class="[$style.balancePickerDate]"
              @change="pickerDateChange"
            >
            </el-date-picker>
          </el-row>
          <el-row :class="[$style.balanceForm, $style.mainDeal]">
            <ul v-if="log_list.length" :class="[$style.dealList]">
              <template v-for="data in log_list">
                <li :key="data.seq">
                  <span :class="[$style.numberBadge]">
                    {{ data._no }}
                  </span>
                  <div :class="[$style.infoWrap]">
                    <strong :class="[$style.infoTitle]">{{
                      date('Y-m-d H:i:s', new Date(data.regdate))
                    }}</strong>

                    <ul :class="[$style.shortList]">
                      <li>
                        <span :class="[$style.text]">
                          {{ $t('variable_amount') }}
                        </span>
                        <span :class="[$style.content]">
                          <span :class="$style.fl">{{
                            { eq: '', up: '+', down: '-' }[data.heading]
                          }}</span>
                          {{ data.diff }}
                        </span>
                      </li>
                      <li>
                        <span :class="[$style.text]"> {{ $t('balance') }}</span>
                        <span :class="[$style.content]">
                          {{ data.after }}
                        </span>
                      </li>
                      <li :class="[$style.status]">
                        <span :class="[$style.text]">{{ $t('changes') }}</span>
                        <span :class="[$style.content]">{{
                          data.description_replaced | replace()
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
                @change="handlePageChange"
              ></PageNavigation>
            </ul>
            <div v-else class="no-list">
              <div class="img-wrap">
                <img src="@assets/img/no-list.png" />
              </div>
              <p>{{ $t('wallet_page.no_deposit_list') }}</p>
            </div>
          </el-row>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
@import '@src/design/account-list.scss';
@import '@src/design/modal.scss';
@import '@src/design/deal-list.scss';

.balanceForm {
  margin-bottom: 10px;
}
.balancePickerDate {
  margin-bottom: 10px;
}

.noSearchAsset {
  .imgWrap {
    width: 100px;
  }
}
.balanceLogLink {
  box-sizing: border-box;
  display: inline-block;
  width: 100%;
  padding: 8px;
  color: white;
  text-align: center;
  cursor: pointer;
  background-color: #96a5b1;
  border-radius: 5px;
}

@media (max-width: 1824px) {
  .balancePickerSort {
    flex-direction: column;
    .balanceRadioBtn {
      width: 100%;
      margin-bottom: 10px;
      label {
        width: 20%;
        span {
          width: 100%;
        }
      }
    }

    .balanceSort {
      width: 100%;
      label {
        width: 50%;
        span {
          width: 100%;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .balancePickerSort {
    .balanceRadioBtn {
      label {
        span {
          width: 100%;
          padding: 10px 0 !important;
          font-size: 13px;
        }
      }
    }
    .balanceSort {
      label {
        span {
          width: 100%;
          padding: 10px 0 !important;
          font-size: 13px;
        }
      }
    }
  }
}

@media (max-width: 440px) {
  .balanceForm {
    .balancePickerDate {
      width: 100%;
    }
  }
}
</style>

<style scoped>
.amount {
  float: right;
}
.btn-wrap {
  width: 100%;
  padding-bottom: 0;
  overflow: hidden;
}

.btn-wrap button {
  float: left;
}

.btn-wrap button .img-wrap {
  float: left;
  width: 16px;
  padding-right: 5px;
}

.btn-wrap .btn {
  float: right;
}

.btn-wrap a.btn-grey {
  padding: 5.6px 20px;
}

.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 100%;
}

.no-list .img-wrap.img-size img {
  width: 70%;
}
</style>
