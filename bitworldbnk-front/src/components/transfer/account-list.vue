<script>
import '@assets/css/icon.css'
import date from 'locutus/php/datetime/date'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import includes from 'lodash/includes'
import assetDecimal from '@utils/asset-decimal'
import { mapState } from 'vuex'
import { createAccountTransfer, fetchAccount } from '@apis/account'
import { fetchOtpConfig } from '@apis/config'
import { fetchWithdrawAddressList, createWithdrawAddress } from '@apis/kyc'
import WithdrawForm from '@components/withdraw-form'
import Decimal from 'decimal.js'

export default {
  components: {
    WithdrawForm,
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
      select_account_seq: null,
      transfer_account_modal: false,
      transfer_wallet_modal: false,
      params: {
        amount: null,
        asset_seq: null,
        strBankCode: null,
        strNm: null,
        strAccountNo: null,
        strResId: null,
        address: null,
      },
      find_account: null,
      step: null,
      success_seq: null,
      error_message: null,
      favorite_accounts: [],
      input_search_account: null,
      loading: false,
      otp_config: null,
      withdraw_address_list: [],
      request_input_amount: '',
      asset_withdraw_fee_seq: null,
      fee_account_seq: null,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['currentUser']),
    ...mapState('auth', ['otps']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_selected_asset_withdraw_address() {
      return find(this.withdraw_address_list, {
        asset_seq: this.c_target_account_info.asset_seq,
      })
    },

    c_target_account_info() {
      return find(this.accounts, {
        seq: this.select_account_seq,
      })
    },

    c_otp_config() {
      return includes(this.otp_config.apply_actions, 'WITHDRAW')
    },
    c_selected_asset_info() {
      if (this.asset_seq !== 0) {
        return find(this.assets, {
          seq: this.asset_seq,
        })
      } else {
        return null
      }
    },
    c_available_transfer_balance() {
      return assetDecimal(
        this.c_target_account_info.asset_seq,
        this.c_target_account_info.balance
      )
        .minus(this.c_target_account_info.holding_balance)
        .toString()
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
  },
  mounted() {
    Promise.all([this.loadOtpConfig(), this.loadWithdrawAddressList()]).catch(
      (e) => this.$toasted.error(e.message)
    )

    if (localStorage.getItem(this.c_favorite_accounts_currentUser))
      this.favorite_accounts = JSON.parse(
        localStorage.getItem(this.c_favorite_accounts_currentUser)
      )
  },
  methods: {
    async loadOtpConfig() {
      const { config } = await fetchOtpConfig().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.otp_config = config
    },
    openTransferAccountModal(account_seq) {
      this.select_account_seq = account_seq
      this.transfer_account_modal = true
      this.params.asset_seq = this.asset_seq
    },
    openTransferWalletModal(account_seq) {
      this.select_account_seq = account_seq
      this.transfer_wallet_modal = true
      this.params.asset_seq = this.asset_seq
    },
    date,
    assetDecimal,
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
    Decimal,
    async loadWithdrawAddressList() {
      const { data } = await fetchWithdrawAddressList({
        is_valid: 'Y',
        no_paging: 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.withdraw_address_list = data
    },
    handleCreateWithdrawAddress() {
      createWithdrawAddress(this.params)
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.kyc_withdraw'))
          this.loadWithdrawAddressList()
          this.params.strBankCode = null
          this.params.strNm = null
          this.params.strAccountNo = null
          this.params.strResId = null
          this.params.address = null
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    async findAccountInfo() {
      await fetchAccount({
        account_seq_or_number: this.params.to_account,
        for_transfer: 1,
      })
        .then((result) => {
          if (result.account_info) {
            this.find_account = result.account_info
          } else {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account')
            )
          }
        })
        .catch((e) => {
          if (e.httpStatusCode === 403) {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account')
            )
          } else {
            this.$toasted.error(e.message)
          }
          this.find_account = null
        })
    },
    handleAccountTransfer() {
      this.loading = true
      createAccountTransfer({
        from_seq: this.select_account_seq,
        to_seq: this.find_account.seq,
        amount: this.params.amount,
        description: this.params.description,
      })
        .then((result) => {
          this.step = 'success'
          this.success_seq = result.seq
          this.params = {}
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => {
          this.step = 'fail'
          this.error_message = e.message
        })
        .finally(() => {
          this.loading = false
        })
    },
    checkStep() {
      if (
        this.step === null &&
        this.select_account_seq &&
        this.params.description &&
        this.find_account &&
        this.params.amount
      ) {
        this.step = 'check'
      } else {
        this.$toasted.error(this.$t('account_transfer.msg_required_data'))
      }
    },
    totalAvailableBalance() {
      if (this.c_active_accounts)
        this.params.amount = this.c_available_transfer_balance
      else
        this.$toasted.error(
          this.$t('account_transfer.msg_not_select_withdraw_account')
        )
    },
    stepReset() {
      this.step = null
      this.params.description = null
      this.params.amount = null
      this.params.address = null
      this.params.to_account = null
      this.find_account = null
    },
    goAccountDetail() {
      this.$router.push({
        name: 'account-transfer-detail',
        params: { transfer_seq: this.success_seq },
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
        <el-tab-pane :label="$t('account_transfer.transfer')">
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul :class="[$style.dealList]">
              <div :class="[$style.favoriteAsset]">
                <li
                  v-for="favorite in c_favorite_accounts"
                  :key="favorite.seq"
                  :class="[$style.deal_act]"
                >
                  <div class="account-box">
                    <div class="account-info">
                      <div class="account-title">
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
                        </strong>
                      </div>
                      <div class="amount">
                        {{
                          Decimal(favorite.balance).minus(
                            favorite.holding_balance
                          ) | codeDecimal(favorite.asset_code)
                        }}
                      </div>
                    </div>
                    <div class="account-number">
                      <span :class="[$style.accountText]">
                        {{ $t('wallet_page.withdraw_bank_address') }}
                      </span>
                      <span :class="[$style.account_number]">
                        {{ favorite.account_number }}
                      </span>
                      <button
                        class="btn-regular-black transfer-btn"
                        @click="openTransferAccountModal(favorite.seq)"
                      >
                        <span>
                          {{ $t('transfer') }}
                        </span>
                        <div class="img-wrap">
                          <img
                            src="@assets/img/longarrow-right-black.svg"
                            alt="화살표"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </li>
                <li
                  v-for="account in c_active_accounts"
                  :key="account.seq"
                  :class="[$style.deal_act]"
                >
                  <div class="account-box">
                    <div class="account-info">
                      <div class="account-title">
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
                        </strong>
                      </div>
                      <div class="amount">
                        {{
                          Decimal(account.balance).minus(
                            account.holding_balance
                          ) | codeDecimal(account.asset_code)
                        }}
                      </div>
                    </div>
                    <div class="account-number">
                      <span :class="[$style.accountText]">
                        {{ $t('wallet_page.withdraw_bank_address') }}
                      </span>
                      <span :class="[$style.account_number]">
                        {{ account.account_number }}
                      </span>
                      <button
                        class="btn-regular-black transfer-btn"
                        @click="openTransferAccountModal(account.seq)"
                      >
                        <span>
                          {{ $t('transfer') }}
                        </span>
                        <div class="img-wrap">
                          <img
                            src="@assets/img/longarrow-right-black.svg"
                            alt="화살표"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
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
        <el-tab-pane :label="$t('wallet_transfer')">
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul :class="[$style.dealList]">
              <div :class="[$style.favoriteAsset]">
                <li
                  v-for="favorite in c_favorite_accounts"
                  :key="favorite.seq"
                  :class="[$style.deal_act]"
                >
                  <div class="account-box">
                    <div class="account-info">
                      <div class="account-title">
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
                        </strong>
                      </div>
                      <div class="amount">
                        {{
                          Decimal(favorite.balance).minus(
                            favorite.holding_balance
                          ) | codeDecimal(favorite.asset_code)
                        }}
                      </div>
                    </div>
                    <div class="account-number">
                      <span :class="[$style.accountText]">
                        {{ $t('wallet_address') }}
                      </span>
                      <span :class="[$style.account_address]">
                        {{ favorite.address }}
                      </span>
                      <button
                        class="btn-regular-black transfer-btn"
                        @click="openTransferWalletModal(favorite.seq)"
                      >
                        <span>
                          {{ $t('transfer') }}
                        </span>
                        <div class="img-wrap">
                          <img
                            src="@assets/img/longarrow-right-black.svg"
                            alt="화살표"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </li>
                <li
                  v-for="account in c_active_accounts"
                  :key="account.seq"
                  :class="[$style.deal_act]"
                >
                  <div class="account-box">
                    <div class="account-info">
                      <div class="account-title">
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
                        </strong>
                      </div>
                      <div class="amount">
                        {{
                          Decimal(account.balance).minus(
                            account.holding_balance
                          ) | codeDecimal(account.asset_code)
                        }}
                      </div>
                    </div>
                    <div class="account-number">
                      <span :class="[$style.accountText]">
                        {{ $t('wallet_address') }}
                      </span>
                      <span :class="[$style.account_address]">
                        {{ account.address }}
                      </span>
                      <button
                        class="btn-regular-black transfer-btn"
                        @click="openTransferWalletModal(account.seq)"
                      >
                        <span>
                          {{ $t('transfer') }}
                        </span>
                        <div class="img-wrap">
                          <img
                            src="@assets/img/longarrow-right-black.svg"
                            alt="화살표"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
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
              <div :class="[$style.favoriteAsset]">
                <li
                  v-for="account in c_favorite_accounts"
                  :key="account.seq"
                  :class="[$style.deal_act]"
                >
                  <div class="account-box">
                    <div class="account-info">
                      <div class="account-title">
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
                        </strong>
                      </div>
                      <div class="amount">
                        {{
                          Decimal(account.balance).minus(
                            account.holding_balance
                          ) | codeDecimal(account.asset_code)
                        }}
                      </div>
                    </div>
                    <div class="account-number">
                      <span :class="[$style.accountText]">
                        {{ $t('wallet_page.withdraw_bank_address') }}
                      </span>
                      <span :class="[$style.account_number]">
                        {{ account.account_number }}
                      </span>
                      <button
                        class="btn-regular-black transfer-btn"
                        @click="openTransferAccountModal(account.seq)"
                      >
                        <span>
                          {{ $t('transfer') }}
                        </span>
                        <div class="img-wrap">
                          <img
                            src="@assets/img/longarrow-right-black.svg"
                            alt="화살표"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
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
                      {{ $t('no_favorite_list') }}
                    </p>
                  </div>
                </div>
              </div>
            </ul>
          </PerfectScrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 이체 계좌 모달창 -->
    <el-dialog
      :visible.sync="transfer_account_modal"
      width="40%"
      :append-to-body="true"
      class="transfer-modal"
      @close="stepReset"
    >
      <!-- 이체하기 -->
      <div class="transfer-box">
        <div v-if="step === null">
          <div class="row">
            <label>{{ $t('account_transfer.to_account_input') }}</label>

            <div class="form-wrap transfer-account-number">
              <input
                v-model="params.to_account"
                :placeholder="$t('please_enter_relative_account_number')"
              />
              <div class="btn-wrap">
                <button class="btn-white" @click="findAccountInfo">{{
                  $t('account_transfer.to_account_confirm')
                }}</button>
              </div>
            </div>
          </div>
          <div v-if="find_account" class="row">
            <label>{{ $t('account_transfer.to_account_user_name') }}</label>

            <div class="form-wrap">
              <div :class="[$style.textLabel]">
                {{
                  find_account.user_name ||
                    $t('account_transfer.not_search_user_name')
                }}
              </div>
            </div>
          </div>
          <div class="row">
            <label>{{ $t('account_transfer.transfer_amount') }}</label>

            <div class="form-wrap transfer-amount">
              <input
                slot="append"
                v-model="params.amount"
                :placeholder="$t('account_transfer.placeholder_amount')"
              />
              <div class="btn-wrap">
                <button
                  slot="append"
                  class="btn-white marginR-10"
                  @click="params.amount = null"
                >
                  <i class="fas fa-sync"></i>
                  {{ $t('account_transfer.delete_amount') }}
                </button>
                <button
                  slot="append"
                  class="btn-white"
                  @click="totalAvailableBalance"
                >
                  <i class="fas fa-coins"></i>
                  {{ $t('account_transfer.all_amount') }}
                </button>
              </div>
            </div>
          </div>
          <div class="row">
            <label>{{ $t('memo') }}</label>

            <div class="form-wrap">
              <input
                v-model="params.description"
                :class="[$style.textLabel]"
                :placeholder="$t('write_history_memo')"
              />
            </div>
          </div>
          <div class="btn-wrap btn-right">
            <button class="btn" @click="checkStep">
              <i class="fas fa-check"></i>
              {{ $t('account_transfer.transfer_btn') }}
            </button>
            <button
              class="btn-grey marginL-10"
              @click="transfer_account_modal = false"
              >{{ $t('cancel') }}</button
            >
          </div>
        </div>
        <div
          v-else-if="step === 'check'"
          v-loading="loading"
          class="step-check"
        >
          <h3 :class="[$style.transferInfoCheck]">
            {{ $t('account_transfer.transfer_info_check') }}
          </h3>
          <div class="box-white">
            <div class="row">
              <label>{{ $t('account_transfer.from_account_number') }}</label>

              <div class="form-wrap">
                <p>{{ c_target_account_info.account_number }}</p>
              </div>
            </div>
            <div class="row">
              <label>{{ $t('account_transfer.from_asset_title') }}</label>

              <div class="form-wrap">
                <p>{{ c_target_account_info.asset_title }}</p>
              </div>
            </div>
            <div class="row">
              <label>{{ $t('account_transfer.to_account_number') }}</label>

              <div class="form-wrap">
                <p>{{ find_account.account_number }}</p>
              </div>
            </div>
            <div v-if="find_account" class="row">
              <label>{{ $t('account_transfer.to_account_user_name') }}</label>

              <div class="form-wrap">
                <p>{{ find_account.user_name }}</p>
              </div>
            </div>
            <div class="row">
              <label>{{ $t('account_transfer.transfer_amount') }}</label>

              <div class="form-wrap">
                <p>{{ params.amount }}</p>
              </div>
            </div>
            <div class="row">
              <label>{{ $t('memo') }} </label>
              <div class="form-wrap">
                <p>{{ params.description }}</p>
              </div>
            </div>
          </div>
          <div class="btn-wrap btn-right">
            <button class="btn" @click="handleAccountTransfer">
              {{ $t('account_transfer.transfer_btn') }}
            </button>
            <button
              class="btn-grey marginL-10"
              @click="transfer_account_modal = false"
              >{{ $t('cancel') }}</button
            >
          </div>
        </div>
      </div>
      <div
        v-if="step === 'success'"
        :class="[$style.accountTransferWrap, $style.transferFail]"
      >
        <div class="notice">
          <div class="img-wrap">
            <img src="@assets/img/click.png" alt="클릭 아이콘" />
          </div>
          <h3>{{ $t('account_transfer.success_transfer') }}</h3>
          <div class="btn-wrap btn-center">
            <button class="btn" @click="goAccountDetail">
              {{ $t('account_transfer.transfer_list_detail') }}
            </button>
            <button
              class="btn-grey marginL-10"
              @click="transfer_account_modal = false"
              >{{ $t('cancel') }}</button
            >
          </div>
        </div>
      </div>
      <div v-else-if="step === 'fail'" class="step-fail">
        <div class="notice">
          <div class="img-wrap">
            <img src="@assets/img/fail-icon.png" alt="실패 아이콘" />
          </div>
          <h3>{{ $t('account_transfer.success_fail') }}</h3>
          <p class="error-message">{{ error_message }}</p>
          <div class="btn-wrap btn-center">
            <button class="btn-white" @click="stepReset">
              {{ $t('re_enter') }}
            </button>
            <button
              class="btn-grey marginL-10"
              @click="transfer_account_modal = false"
              >{{ $t('cancel') }}</button
            >
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 이체 지갑 모달창 -->
    <el-dialog
      v-if="c_selected_asset_info"
      :title="$t('wallet_transfer')"
      :class="[$style.withdrawModal]"
      :visible.sync="transfer_wallet_modal"
      :append-to-body="true"
      @close="transfer_wallet_modal = null"
    >
      <WithdrawForm
        v-if="transfer_wallet_modal"
        :modal_title="transfer_wallet_modal"
        :account_seq="select_account_seq"
        :asset_seq="asset_seq"
        @modal_close="transfer_wallet_modal = null"
      ></WithdrawForm>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/account-list.scss';
@import '@src/design/modal.scss';
@import '@src/design/deal-list.scss';
</style>

<style scoped>
.amount {
  float: right;
}

.account-box {
  overflow: hidden;
}

.account-box .transfer-btn {
  margin-left: 5px;
}

.account-box .transfer-btn span {
  padding-right: 5px;
}

.account-box .transfer-btn .img-wrap {
  float: right;
  width: 10px;
  transition: 0.2s;
}

.transfer-modal .step-fail {
  text-align: center;
}

.transfer-modal .img-wrap {
  width: 50px;
  margin: 20px auto;
}

.transfer-modal .account-info {
  padding: 15px;
  margin-bottom: 20px;
  text-align: left;
  background-color: #f2f9ff;
}

.transfer-modal .account-info .color-grey {
  padding-right: 10px;
}

.transfer-modal .notice,
.transfer-modal .notice .btn-wrap {
  text-align: center;
}

.transfer-modal .row label {
  color: #666;
}

.no-list .img-wrap.img-size img {
  width: 70%;
}
</style>
