<script>
import '@assets/css/transfer/account-transfer.css'
import AssetSelector from '@components/asset-selector'
import { mapState } from 'vuex'
import find from 'lodash/find'
import filter from 'lodash/filter'
import Decimal from 'decimal.js'
import fromPairs from 'lodash/fromPairs'
import {
  createFinanceReturn,
  createFinanceDividend,
  fetchFinanceInstrumentDivearnList,
  fetchFinanceDividendList,
  fetchFinanceInstrument,
} from '@apis/finance'
import map from 'lodash/map'
import moment from 'moment-timezone'
import reject from 'lodash/reject'

export default {
  page: {
    title: 'ProductSubscriptionList',
    meta: [{ name: 'description', content: 'ProductSubscriptionList' }],
  },
  components: {
    AssetSelector,
  },
  data() {
    return {
      asset_seq: Number(this.$route.query.asset_seq) || 0,
      input_search_account: '',
      s_account_seq: 0,
      return_modal: false,
      return_account_seq: null,
      amount: null,
      loading: false,

      divearn_list: [],
      dividend_modal: false,
      dividend_account_seqs: [],
      divearn_seqs: [],

      checked: false,

      dividend_list: [],
      instrument_info: null,
      no_divearn: false,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('finance', ['funds']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_s_asset_info() {
      if (!this.asset_seq) return null

      return find(this.assets, {
        seq: this.asset_seq,
      })
    },
    c_active_accounts() {
      const instrument_accounts = map(
        filter(this.accounts, (account) => {
          return (
            account.instrument_type !== 'LEGACY' && account.status === 'OPEN'
          )
        }),
        (account) => ({
          ...account,
          fund_info: find(this.funds, { fund_account_seq: account.seq }),
        })
      )
      if (!this.asset_seq) {
        return filter(
          instrument_accounts,
          (account) =>
            !this.input_search_account ||
            account.title
              .toLowerCase()
              .includes(this.input_search_account.toLowerCase()) ||
            account.account_number.includes(this.input_search_account)
        )
      }

      return filter(
        instrument_accounts,
        (account) =>
          account.asset_seq === this.asset_seq &&
          (!this.input_search_account ||
            account.title
              .toLowerCase()
              .includes(this.input_search_account.toLowerCase()) ||
            account.account_number.includes(this.input_search_account))
      )
    },
    c_s_finance_account() {
      if (!this.s_account_seq) return null

      return find(this.accounts, { seq: this.s_account_seq })
    },
    c_s_finance_account_fund() {
      if (!this.s_account_seq) return null

      return find(this.funds, { fund_account_seq: this.s_account_seq })
    },
    c_available_finance_return_accounts() {
      if (!this.c_s_finance_account_fund) return []

      return filter(this.accounts, (account) => {
        return (
          account.asset_code === this.c_s_finance_account_fund.asset_code &&
          account.instrument_type === 'LEGACY'
        )
      })
    },
    c_s_divearns_info() {
      if (!this.divearn_seqs.length) return []

      return map(this.divearn_seqs, (divearn_seq) => {
        return find(this.divearn_list, { seq: divearn_seq })
      })
    },
    c_available_finance_dividend_accounts() {
      if (!this.divearn_seqs.length) return []

      const divearns_asset_info = map(this.c_s_divearns_info, (divearn) => {
        return find(this.assets, {
          seq: divearn.asset_info.seq,
        })
      })
      return map(divearns_asset_info, (asset) => {
        return filter(this.accounts, (account) => {
          return (
            account.asset_code === asset.code &&
            account.instrument_type === 'LEGACY'
          )
        })
      })
    },
    c_s_fund_dividend_rate_amount() {
      if (!this.divearn_list.length) return []

      const dividend_multiplier = new Decimal(
        this.c_s_finance_account_fund.execute_amount
      )
        .div(this.instrument_info.total_opened_amount)
        .toString()

      return map(this.divearn_list, (divearn) => ({
        divearn_asset_seq: divearn.divearn_asset_seq,
        dividend_rate: new Decimal(dividend_multiplier).mul(100).toFixed(8),
        dividend_amount: new Decimal(dividend_multiplier)
          .mul(divearn.divearn_amount)
          .toFixed(8),
      }))
    },
  },
  mounted() {
    Promise.all([this.loadFinanceDividendList()]).catch((e) =>
      this.$toasted.error(e.message)
    )
  },
  methods: {
    Decimal,
    fromPairs,
    moment,
    showFundDetail(account_seq) {
      this.s_account_seq = account_seq
      this.$router.push({
        name: 'fund-info',
        query: { fund_seq: this.c_s_finance_account_fund.seq },
      })
    },
    showModal(account_seq, type) {
      this.s_account_seq = account_seq
      if (type === 'return') {
        this.return_modal = true
      } else {
        this.dividend_modal = true
        Promise.all([
          this.loadFinanceDivearnList(
            this.c_s_finance_account_fund.instrument_seq
          ),
          this.loadFinanceIntrument(
            this.c_s_finance_account_fund.instrument_seq
          ),
        ]).catch((e) => this.$toasted.error(e.message))
      }
    },
    async loadFinanceDivearnList(instrument_seq) {
      const { data } = await fetchFinanceInstrumentDivearnList(instrument_seq)
      const divearn_array = map(data, (divearn) => ({
        ...divearn,
        asset_info: find(this.assets, { seq: divearn.divearn_asset_seq }),
      }))
      if (!divearn_array.length) return (this.no_divearn = true)
      const available_divearn = reject(divearn_array, (divearn) => {
        return find(this.dividend_list, (dividend) => {
          return (
            dividend.instrument_seq === divearn.instrument_seq &&
            dividend.dividend_asset_seq === divearn.divearn_asset_seq &&
            this.c_s_finance_account_fund.seq === dividend.fund_seq
          )
        })
      })

      this.divearn_list = available_divearn
    },
    async loadFinanceIntrument(instrument_seq) {
      const { instrument_info } = await fetchFinanceInstrument(instrument_seq)

      this.instrument_info = instrument_info
    },
    async loadFinanceDividendList() {
      const { data } = await fetchFinanceDividendList({
        no_paging: 1,
      })
      this.dividend_list = data
    },
    resetParams() {
      this.s_account_seq = null
      this.return_account_seq = null
      this.dividend_account_seqs = []
      this.divearn_seqs = []
      this.checked = false
      this.no_divearn = false
    },
    handleReturn() {
      if (!this.checked)
        return this.$toasted.info('고지사항을 확인해주셔야 신청이 가능합니다.')
      this.loading = true
      createFinanceReturn({
        fund_seq: this.c_s_finance_account_fund.seq,
        return_account_seq: this.return_account_seq,
        amount: this.amount,
      })
        .then(() => {
          this.$toasted.success('반환되었습니다.')
          this.$store.dispatch('account/getAccounts')
          this.$store.dispatch('finance/getFunds')
        })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
          this.return_modal = false
        })
    },
    async handleSelectDividend() {
      if (!this.checked)
        return this.$toasted.info('고지사항을 확인해주셔야 수령이 가능합니다.')
      this.loading = true
      await this.$confirm('수령하시겠습니까?', '확인')
        .then(async () => {
          for (const divearn in this.divearn_seqs) {
            await createFinanceDividend({
              fund_seq: this.c_s_finance_account_fund.seq,
              divearn_seq: this.divearn_seqs[divearn],
              dividend_account_seq: this.dividend_account_seqs[divearn],
            })
              .then(() => {
                this.$toasted.success('수령하였습니다.')
              })
              .catch((e) => {
                this.$toasted.error(e.message)
              })
          }
        })
        .then(() => {
          Promise.all([
            this.$store.dispatch('account/getAccounts'),
            this.$store.dispatch('finance/getFunds'),
            this.loadFinanceDividendList(),
          ])
        })
        .catch((e) => {
          this.$toasted.error(e.message)
        })
        .finally(() => {
          this.loading = false
          this.dividend_modal = false
        })
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ '상품계좌 조회' }}</h2>
      </div>
      <div class="account-transfer">
        <div class="asset-list">
          <h3>
            {{ $t('wallet_page.asset_list') }}
          </h3>
          <AssetSelector v-model="asset_seq"></AssetSelector>
        </div>
        <div class="account-list">
          <h3>{{ '상품계좌목록' }}</h3>
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
              <PerfectScrollbar :class="[$style.perfectScrollbar]">
                <ul :class="[$style.dealList]">
                  <div :class="[$style.favoriteAsset]">
                    <li
                      v-for="account in c_active_accounts"
                      :key="account.seq"
                      :class="[$style.deal_act]"
                    >
                      <template>
                        <div :class="[$style.accountInfo]">
                          <div
                            v-if="0"
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
                              }}
                              / {{ account.asset_code }})</span
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
                              @click.prevent.stop="
                                onCopy(account.account_number)
                              "
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
                        <div class="btn-wrap">
                          <div :class="[$style.depositWithdrawLinks]">
                            <button
                              v-if="
                                account.fund_info.is_fully_returned !== 'Y' &&
                                  !(
                                    moment()
                                      .utc()
                                      .valueOf() >
                                      moment(
                                        account.fund_info.execute_start
                                      ).valueOf() &&
                                    moment()
                                      .utc()
                                      .valueOf() <
                                      moment(
                                        account.fund_info.execute_end
                                      ).valueOf()
                                  )
                              "
                              class="btn-green"
                              @click="showModal(account.seq, 'return')"
                            >
                              <span>
                                {{
                                  moment()
                                    .utc()
                                    .valueOf() >
                                  moment(
                                    account.fund_info.execute_start
                                  ).valueOf()
                                    ? '원금수령'
                                    : '가입취소'
                                }}
                              </span>
                            </button>
                            <button
                              v-if="
                                moment()
                                  .utc()
                                  .valueOf() >
                                  moment(
                                    account.fund_info.adjust_start
                                  ).valueOf() &&
                                  account.fund_info.is_fully_returned === 'Y'
                              "
                              @click="showModal(account.seq, 'dividend')"
                            >
                              {{ '배당수령' }}</button
                            >
                          </div>
                          <div :class="[$style.modifyLinkWrap]">
                            <button
                              class="btn marginL-10"
                              @click="showFundDetail(account.seq)"
                            >
                              {{ '금융자금상세' }}
                            </button>
                          </div>
                        </div>
                      </template>
                    </li>
                    <div
                      v-if="c_active_accounts.length === 0 && c_s_asset_info"
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-if="c_s_finance_account_fund"
      title="원금 수령"
      :visible.sync="return_modal"
      @close="resetParams"
    >
      <div v-loading="loading" :class="[$style.returnForm]">
        <div :class="[$style.formGroup]">
          <div :class="[$style.inputGroup]">
            <label>
              {{ '신청 전 숙지사항' }}
            </label>
            <div>
              <i class="el-icon-warning-outline marginR-10 color-pink"></i>
              <span class="color-pink">{{
                '원금을 수령해야 배당수령이 가능합니다.'
              }}</span>
            </div>
          </div>
          <div class="text-right">
            <el-checkbox v-model="checked">숙지하였습니다.</el-checkbox>
          </div>
        </div>
        <div :class="[$style.formGroup]">
          <div :class="[$style.inputGroup]">
            <label>
              {{ '반환 계좌선택' }}
            </label>
            <el-select v-model="return_account_seq" filterable>
              <el-option
                v-for="account in c_available_finance_return_accounts"
                :key="account.seq"
                :label="`${account.account_number} [${account.title}]`"
                :value="account.seq"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div
          v-if="c_s_finance_account_fund.instrument_type !== 'DIVEARN'"
          :class="[$style.formGroup]"
        >
          <div :class="[$style.inputGroup]">
            <label>
              {{ '반환 금액' }}
            </label>
            <input v-model="amount" :class="[$style.formControl]" />
          </div>
        </div>
        <div class="btn-wrap btn-right">
          <button :class="[$style.applyBtn]" @click="handleReturn">
            {{ $t('apply') }}
          </button>
          <button class="btn-grey marginL-10" @click="return_modal = false">{{
            $t('cancel')
          }}</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-if="c_s_finance_account_fund"
      title="배당 수령"
      :visible.sync="dividend_modal"
      @close="resetParams"
    >
      <div v-loading="loading" :class="[$style.returnForm]">
        <template v-if="divearn_list.length">
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>
                {{ '배당 수령 전 숙지사항' }}
              </label>
              <div>
                <i class="el-icon-warning-outline marginR-10 color-pink"></i>
                <span class="color-pink">{{
                  '자산별 배당금을 모두 수령하면 상품이 자동해지됩니다.'
                }}</span>
              </div>
            </div>
            <div class="text-right">
              <el-checkbox v-model="checked">숙지하였습니다.</el-checkbox>
            </div>
          </div>
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>
                {{ '배당 수령 가능 자산 선택' }}
              </label>
              <el-checkbox-group v-model="divearn_seqs">
                <el-checkbox
                  v-for="divearn in divearn_list"
                  :key="divearn.seq"
                  :label="divearn.seq"
                  >{{ divearn.asset_info.code }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <span>
                {{ '배당 수령 계좌선택' }}
              </span>
              <div
                v-for="(dividend, idx) in c_available_finance_dividend_accounts"
                :key="idx"
                class="select-group"
              >
                <label>
                  {{ c_s_divearns_info[idx].asset_info.code }}
                </label>
                <el-select v-model="dividend_account_seqs[idx]" filterable>
                  <el-option
                    v-for="account in dividend"
                    :key="account.seq"
                    :label="`${account.account_number} [${account.title}]`"
                    :value="account.seq"
                  >
                  </el-option>
                </el-select>
                <div>
                  <span>
                    배당률:
                    {{ c_s_fund_dividend_rate_amount[idx].dividend_rate }} /
                  </span>
                  <span>
                    배당금:
                    {{ c_s_fund_dividend_rate_amount[idx].dividend_amount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="c_s_finance_account_fund.instrument_type !== 'DIVEARN'"
            :class="[$style.formGroup]"
          >
            <div :class="[$style.inputGroup]">
              <label>
                {{ '반환 금액' }}
              </label>
              <input v-model="amount" :class="[$style.formControl]" />
            </div>
          </div>
        </template>
        <template v-else-if="no_divearn">
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>
                {{ '배당 수령 안내사항' }}
              </label>
              <div class="dividend-notice">
                <i class="el-icon-warning-outline marginR-10 color-pink"></i>
                <span class="color-pink">{{
                  '해당 상품에 배당이 없습니다.'
                }}</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>
                {{ '배당 수령 안내사항' }}
              </label>
              <div class="dividend-notice">
                <i class="el-icon-warning-outline marginR-10 color-pink"></i>
                <span class="color-pink">{{
                  '수령 가능한 배당금을 모두 수령하셨습니다.'
                }}</span>
              </div>
            </div>
          </div>
        </template>
        <div class="btn-wrap btn-right">
          <button
            v-if="divearn_list.length"
            :class="[$style.applyBtn]"
            @click="handleSelectDividend"
          >
            {{ '수령' }}
          </button>
          <button class="btn-grey marginL-10" @click="dividend_modal = false">{{
            $t('cancel')
          }}</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/account-list.scss';
.formGroup {
  margin-bottom: 20px;
  .inputGroup {
    label {
      margin-bottom: 10px;
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
.select-group {
  margin: 5px;
}
.dividend-notice {
  font-size: 18px;
  text-align: center;
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
