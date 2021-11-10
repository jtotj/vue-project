<script>
import '@assets/css/kiosk/kiosk-withdrawal.css'
import { mapState } from 'vuex'
import KioskAssetAccountSearch from '@components/kiosk/kiosk-asset-account-search'
import KioskVueDatePicker from '@components/kiosk/kiosk-vue-birth-datepicker/birth-datepicker'
import find from 'lodash/find'
import fromPairs from 'lodash/fromPairs'
import { fetchAssetForm } from '@apis/form'
import map from 'lodash/map'
import {
  createWithdrawAddress,
  deleteWithdrawAddress,
  fetchWithdrawAddressList,
} from '@apis/kyc'
import { createWithdraw } from '@apis/withdraw'
import Decimal from 'decimal.js'
import { fetchAssetWithdrawFees } from '@apis/asset'
import filter from 'lodash/filter'

export default {
  components: { KioskAssetAccountSearch, KioskVueDatePicker },

  data() {
    return {
      watched_date_picker: '',
      date_picker: '',
      search_visible: true,
      step: null,
      s_account_seq: 0,

      params: {
        asset_seq: null,
        strBankCode: null,
        strNm: null,
        strAccountNo: null,
        strResId: null,
        address: null,
      },
      withdraw_address_list: [],
      asset_add_forms: [],
      request_input_amount: null,
      error_msg: null,

      asset_withdraw_fee_seq: null,
      fee_account_seq: null,

      asset_withdraw_fees: [],

      kiosk_type: this.$route.path.indexOf('bank') !== -1 ? 'bank' : 'shop',
    }
  },
  computed: {
    ...mapState('assets', ['assets']),

    ...mapState('account', ['accounts']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_s_account_info() {
      if (this.s_account_seq === 0) return null

      return find(this.accounts, { seq: this.s_account_seq })
    },
    account_title() {
      let info_title = null
      if (this.c_s_account_info) {
        info_title = this.c_s_account_info.title
          ? `${this.c_s_account_info.title}(${
              this.c_s_account_info.account_number
            })`
          : `${this.$t('kiosk.no_account_alias')}(${
              this.c_s_account_info.account_number
            })`
      }

      return info_title
    },
    c_s_asset_info() {
      if (this.s_account_seq === 0) return null

      return find(this.assets, {
        seq: this.c_s_account_info.asset_seq,
      })
    },
    c_selected_asset_withdraw_address() {
      if (!this.withdraw_address_list.length) return null
      const withdraw_address_info = find(this.withdraw_address_list, {
        asset_seq: this.c_s_asset_info.seq,
      })

      if (!withdraw_address_info) return null
      return withdraw_address_info
    },
    c_fee_same_asset_calc() {
      if (!this.c_s_withdraw_fee_info) return this.request_input_amount

      if (
        this.request_input_amount &&
        this.c_s_withdraw_fee_info.fee_type === 'PREPAY' &&
        this.c_s_withdraw_fee_info.fee_amount_type === 'FIXED'
      ) {
        return this.request_input_amount
      } else if (
        this.request_input_amount &&
        this.c_s_withdraw_fee_info.fee_type === 'PREPAY' &&
        this.c_s_withdraw_fee_info.fee_amount_type === 'RATIO'
      ) {
        return this.request_input_amount
      } else if (
        this.request_input_amount &&
        this.c_s_withdraw_fee_info.fee_type === 'POSTPAY' &&
        this.c_s_withdraw_fee_info.fee_amount_type === 'FIXED'
      ) {
        let calc_fee = new Decimal(this.request_input_amount)
        calc_fee = calc_fee.minus(this.c_s_withdraw_fee_info.fee_amount)
        return calc_fee.toString()
      } else if (
        this.request_input_amount &&
        this.c_s_withdraw_fee_info.fee_type === 'POSTPAY' &&
        this.c_s_withdraw_fee_info.fee_amount_type === 'RATIO'
      ) {
        let calc_fee = new Decimal(this.request_input_amount)
        let spread_rate = new Decimal(this.c_s_withdraw_fee_info.fee_amount)
        calc_fee = calc_fee.mul(spread_rate.div(-100).plus(1))
        return calc_fee.toString()
      } else {
        return this.request_input_amount
      }
    },
    c_fee_other_asset_calc() {
      if (!this.c_s_withdraw_fee_info) return this.request_input_amount

      if (
        this.c_s_withdraw_fee_info.fee_type === 'PREPAY' &&
        this.c_s_withdraw_fee_info.fee_amount_type === 'FIXED'
      ) {
        return 0
      } else if (
        this.request_input_amount &&
        this.c_s_withdraw_fee_info.fee_type === 'PREPAY' &&
        this.c_s_withdraw_fee_info.fee_amount_type === 'RATIO'
      ) {
        let calc_fee = new Decimal(this.request_input_amount)
        return calc_fee
          .div(100)
          .mul(this.c_s_withdraw_fee_info.fee_amount)
          .toString()
      } else if (
        this.c_s_withdraw_fee_info.fee_type === 'POSTPAY' &&
        this.c_s_withdraw_fee_info.fee_amount_type === 'FIXED'
      ) {
        return this.c_s_withdraw_fee_info.fee_amount
      } else if (
        this.request_input_amount &&
        this.c_s_withdraw_fee_info.fee_type === 'POSTPAY' &&
        this.c_s_withdraw_fee_info.fee_amount_type === 'RATIO'
      ) {
        let calc_fee = new Decimal(this.request_input_amount)
        let spread_rate = new Decimal(this.c_s_withdraw_fee_info.fee_amount)
        calc_fee = calc_fee.mul(spread_rate.div(-100).plus(1))
        return calc_fee.toString()
      } else {
        return this.request_input_amount
      }
    },
    c_filter_account_by_fee_asset() {
      if (!this.asset_withdraw_fee_seq) return null

      return filter(this.accounts, {
        asset_seq: this.c_s_withdraw_fee_info.fee_asset_seq,
      })
    },
    c_s_withdraw_fee_info() {
      if (!this.asset_withdraw_fee_seq) return null

      return find(this.asset_withdraw_fees, {
        seq: this.asset_withdraw_fee_seq,
      })
    },
    c_s_fee_account_info() {
      if (!this.fee_account_seq) return null

      return find(this.accounts, { seq: this.fee_account_seq })
    },
  },
  watch: {
    s_account_seq() {
      Promise.all([
        this.loadWithdrawAddressList(),
        this.loadWithdrawForm(),
        this.loadAssetWithdrawFees(),
      ]).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.params.asset_seq = this.c_s_account_info.asset_seq
    },
    asset_withdraw_fee_seq() {
      this.fee_account_seq = null
    },
    asset_withdraw_fees() {
      if (this.asset_withdraw_fees.length === 1) {
        this.asset_withdraw_fee_seq = this.asset_withdraw_fees[0].seq
      }
    },
    request_input_amount(val) {
      if (val.search(/\.\./g) === -1) {
        val = val.replace(/[^0-9.]/g, '')
      } else {
        val = val.replace(/[^0-9]/g, '')
      }
      const parts = val.toString().split('.')
      let result = ''
      if (parts[1]) {
        result =
          parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          (parts[1] ? '.' + parts[1] : '')
      } else {
        result = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      this.request_input_amount = result
    },
    date_picker() {
      const watched_date = new Date(this.date_picker).toISOString()
      const split_t_date = watched_date.split('T')
      const replace_date = split_t_date[0].replace(/[^0-9]/g, '')
      const splited_date = replace_date.split('')
      splited_date.splice(0, 2)
      const joined_date = splited_date.join('')
      this.params.strResId = joined_date
    },
  },
  methods: {
    Decimal,
    fromPairs,
    async loadWithdrawForm() {
      const { forms } = await fetchAssetForm({
        asset_seq: this.c_s_account_info.asset_seq,
        target_type: 'ASSET_WITHDRAW',
      })
      this.asset_add_forms = map(forms, (form) => ({
        ...form,
        field_values: map(form.fields, (field) => ({
          field_seq: field.seq,
          value: '',
          option_seq: null,
          options: [],
        })),
      }))
    },
    async loadAssetWithdrawFees() {
      if (this.c_s_asset_info.use_withdraw_fee === 'Y') {
        const { data } = await fetchAssetWithdrawFees(this.c_s_asset_info.seq)

        const arrange_fee = map(data, (info) => ({
          ...info,
          fee_asset_info: find(this.assets, { seq: info.fee_asset_seq }),
        }))
        this.asset_withdraw_fees = arrange_fee
      }
    },
    async loadWithdrawAddressList() {
      const { data } = await fetchWithdrawAddressList({
        is_valid: 'Y',
        no_paging: 1,
      }).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.withdraw_address_list = data
    },
    handleCreateWithdrawAddress() {
      createWithdrawAddress(this.params)
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.kyc_withdraw'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.loadWithdrawAddressList()
          this.params.strBankCode = null
          this.params.strNm = null
          this.params.strAccountNo = null
          this.params.strResId = null
          this.params.address = null
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
    },
    handleDeleteWithdrawAddress() {
      if (this.c_selected_asset_withdraw_address) {
        deleteWithdrawAddress(this.c_selected_asset_withdraw_address.seq)
          .then(() => {
            this.$toasted.success(this.$t('kyc.delete_success_address'), {
              theme: 'toasted-primary',
              containerClass: 'kiosk-toasted',
            })
            this.loadWithdrawAddressList()
          })
          .catch((e) =>
            this.$toasted.error(e.message, {
              theme: 'toasted-primary',
              containerClass: 'kiosk-toasted',
            })
          )
      }
    },
    handleWithdraw() {
      createWithdraw({
        account_seq: this.s_account_seq,
        request_amount: this.removeComma(this.request_input_amount),
        asset_withdraw_fee_seq: this.asset_withdraw_fee_seq,
        fee_account_seq: this.fee_account_seq,
        field_values: map(
          [].concat(...map(this.asset_add_forms, (form) => form.field_values)),
          (field_value) => ({
            ...field_value,
            options: map(field_value.options, (option_seq) => ({
              option_seq,
            })),
          })
        ),
      })
        .then(() => {
          this.step = 'success'
          this.$emit('logout_event')
        })
        .catch((e) => {
          this.error_msg = e.message
          this.step = 'fail'
        })
    },
    accountAvailableAllBalance() {
      this.request_input_amount = new Decimal(this.c_s_account_info.balance)
        .minus(this.c_s_account_info.holding_balance)
        .toString()
    },
    removeComma(value) {
      value = value.replace(/,/g, '')
      return value
    },
    deleteWithdrawInfo() {
      this.search_visible = true
      this.params.asset_seq = null
      this.params.strBankCode = null
      this.params.strResId = null
      this.params.strNm = null
      this.params.strAccountNo = null
      this.params.address = null
      this.request_input_amount = null
      this.date_picker = ''
    },
  },
}
</script>

<template>
  <div :class="$style.kioskWithdrawal" class="kiosk-withdrawal">
    <div :class="$style.container">
      <KioskAssetAccountSearch
        v-if="search_visible"
        v-model="s_account_seq"
        :kiosk_type="kiosk_type"
        @close="search_visible = false"
      ></KioskAssetAccountSearch>
      <!-- 자산, 계좌 검색(kiosk-search 컴포넌트) 페이지 선택 후  -->
      <template v-else>
        <template v-if="step === null">
          <div :class="$style.scrollWrap">
            <div :class="$style.withdrawalAccount" class="kiosk-select-box">
              <h2>{{ $t('kyc.withdraw_info') }}</h2>
              <div :class="$style.accountTitleWrap">
                <el-input
                  class="user-info"
                  suffix-icon="el-icon-circle-close"
                  :placeholder="account_title"
                  :disabled="true"
                >
                </el-input>
                <button
                  :class="$style.accountSelectArea"
                  @click="deleteWithdrawInfo"
                />
              </div>
              <!-- <el-input
                class="user-info"
                :placeholder="account_title"
                :disabled="true"
              >
              </el-input> -->
              <ul>
                <li>
                  <span>{{ $t('price') }}</span>
                  <ul>
                    <li>{{
                      c_s_account_info.balance
                        | codeDecimal(c_s_account_info.asset_code)
                    }}</li>
                    <li>{{ c_s_account_info.asset_code }}</li>
                  </ul>
                </li>
                <li>
                  <span>{{ $t('kiosk.withdrawable_amount') }}</span>
                  <ul>
                    <li>{{
                      Decimal(c_s_account_info.balance).minus(
                        c_s_account_info.holding_balance
                      ) | codeDecimal(c_s_account_info.asset_code)
                    }}</li>
                    <li>{{ c_s_account_info.asset_code }}</li>
                  </ul>
                </li>
              </ul>
            </div>
            <template
              v-if="
                !c_selected_asset_withdraw_address && c_s_asset_info.plugin_seq
              "
            >
              <template v-if="c_s_asset_info.plugin === 'krw'">
                <div :class="$style.withdrawalAccount" class="kiosk-select-box">
                  <h2>{{ $t('kyc.select_bank') }}</h2>
                  <el-select
                    v-model="params.strBankCode"
                    :placeholder="$t('no_select')"
                  >
                    <el-option
                      v-for="bank in constants.kyc
                        .asset_withdraw_address_certification.bank_codes"
                      :key="bank[0]"
                      :label="bank[1]"
                      :value="bank[0]"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div
                  :class="$style.accountInfo"
                  class="account-info kiosk-select-box"
                >
                  <div>
                    <h2>{{ $t('kyc.birth') }}</h2>
                    <!-- <el-input
                      v-model="params.strResId"
                      type="number"
                      :placeholder="$t('kyc.birth')"
                    >
                    </el-input> -->
                    <KioskVueDatePicker
                      v-model="date_picker"
                      :close-on-set="true"
                      :placeholder="$t('kyc.birth')"
                      :high="true"
                      :year-first="true"
                      :min-year="1930"
                      :max-year="2002"
                      :delimiter="''"
                    />
                  </div>
                  <div>
                    <h2>{{ $t('kyc.holder_name') }}</h2>
                    <el-input
                      v-model="params.strNm"
                      type="text"
                      :placeholder="$t('kiosk.enter_account_holder')"
                    >
                    </el-input>
                  </div>
                </div>
                <div
                  :class="$style.certifiedNum"
                  class="certified kiosk-select-box num active"
                >
                  <div>
                    <h2>{{ $t('kiosk.account_number') }}</h2>
                  </div>
                  <div>
                    <el-input
                      v-model="params.strAccountNo"
                      :placeholder="$t('kiosk.enter_account')"
                      clearable
                    >
                    </el-input>
                    <el-button @click="handleCreateWithdrawAddress">{{
                      $t('kyc.withdraw_auth')
                    }}</el-button>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  :class="$style.certifiedNum"
                  class="certified kiosk-select-box num active"
                >
                  <div>
                    <h2>{{ $t('kiosk.account_number') }}</h2>
                  </div>
                  <div>
                    <el-input
                      v-model="params.address"
                      :placeholder="$t('kiosk.enter_account_number')"
                      clearable
                    >
                    </el-input>
                    <el-button @click="handleCreateWithdrawAddress">{{
                      $t('kyc.withdraw_auth')
                    }}</el-button>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <template v-if="c_s_asset_info.plugin === 'krw'">
                <div :class="$style.withdrawalAccount" class="kiosk-select-box">
                  <h2>{{ $t('wallet_page.bank_name') }}</h2>
                  <el-input
                    :disabled="true"
                    :placeholder="
                      fromPairs(
                        constants.kyc.asset_withdraw_address_certification
                          .bank_codes
                      )[c_selected_asset_withdraw_address.bank_code]
                    "
                  ></el-input>
                </div>
                <div
                  :class="$style.accountInfo"
                  class="account-info kiosk-select-box"
                >
                  <div>
                    <h2>{{ $t('kyc.holder_name') }}</h2>
                    <el-input
                      :disabled="true"
                      :placeholder="
                        c_selected_asset_withdraw_address.holder_name
                      "
                    ></el-input>
                  </div>
                </div>
                <div
                  :class="$style.certifiedNum"
                  class="certified kiosk-select-box num active"
                >
                  <div>
                    <h2>{{ $t('kiosk.account_number') }}</h2>
                  </div>
                  <div>
                    <el-input
                      :disabled="true"
                      :placeholder="
                        c_selected_asset_withdraw_address.withdraw_address
                      "
                    ></el-input>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  :class="$style.certifiedNum"
                  class="certified kiosk-select-box num active"
                >
                  <div>
                    <h2>{{ $t('wallet_page.deposit_step_2_2') }}</h2>
                  </div>
                  <div>
                    <el-input
                      :disabled="true"
                      :placeholder="
                        c_selected_asset_withdraw_address.withdraw_address
                      "
                    ></el-input>
                    <el-button @click="handleDeleteWithdrawAddress">{{
                      $t('kyc.delete_withdraw_address')
                    }}</el-button>
                  </div>
                </div>
              </template>
            </template>
            <div
              :class="[$style.transferQuantity, $style.mt70]"
              class="kiosk-select-box num"
            >
              <h2>{{ $t('wallet_page.withdraw_request_amount') }}</h2>
              <el-button class="full" @click="accountAvailableAllBalance">{{
                $t('account_transfer.all_amount')
              }}</el-button>
              <el-input
                v-model="request_input_amount"
                type="text"
                :placeholder="$t('kiosk.enter_withdrawal')"
                clearable
              >
              </el-input>
            </div>
            <template v-if="c_s_asset_info.use_withdraw_fee === 'Y'">
              <div
                :class="[$style.mt70, $style.certifiedNum]"
                class="kiosk-select-box"
              >
                <div>
                  <h2>{{ $t('kiosk.choose_how_to_pay_the_fee') }}</h2>
                  <p v-if="c_s_withdraw_fee_info">
                    {{ $t('private.fee_rate') }}
                    <strong>
                      {{
                        c_s_withdraw_fee_info.fee_amount
                          | codeDecimal(
                            c_s_withdraw_fee_info.fee_asset_info.code
                          )
                      }}
                      <span
                        v-if="c_s_withdraw_fee_info.fee_amount_type === 'RATIO'"
                        >%</span
                      >
                      <span v-else>
                        {{ c_s_withdraw_fee_info.fee_asset_info.code }}
                      </span></strong
                    >
                  </p>
                </div>
                <div>
                  <el-select v-model="asset_withdraw_fee_seq">
                    <el-option
                      v-for="fee in asset_withdraw_fees"
                      :key="fee.seq"
                      :value="fee.seq"
                      :label="fee.fee_asset_info.title"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <template v-if="c_s_withdraw_fee_info">
                <div
                  v-if="c_s_withdraw_fee_info.is_equal_account_required === 'N'"
                  :class="[
                    $style.transferQuantity,
                    $style.mt70,
                    $style.withdrawalAccount,
                  ]"
                  class="kiosk-select-box"
                >
                  <h2>{{ $t('transaction_detail.select_pay_account') }}</h2>
                  <el-select v-model="fee_account_seq">
                    <el-option
                      v-for="account in c_filter_account_by_fee_asset"
                      :key="account.seq"
                      :value="account.seq"
                      :label="account.title"
                    >
                      <span>
                        {{ account.title || $t('business.no_alias') }}
                        {{ account.account_number }}</span
                      >
                    </el-option>
                  </el-select>
                  <ul v-if="c_s_fee_account_info">
                    <li>
                      <span
                        >{{ $t('transaction_detail.pay_account_balance') }}:
                      </span>
                      <ul>
                        <li>
                          {{
                            Decimal(c_s_fee_account_info.balance).minus(
                              c_s_fee_account_info.holding_balance
                            ) | codeDecimal(c_s_fee_account_info.asset_code)
                          }}
                        </li>
                        <li> {{ c_s_fee_account_info.asset_code }}</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </template>
            </template>
            <template v-else>
              <div
                :class="[$style.transferQuantity, $style.mt70]"
                class="kiosk-select-box num"
              >
                <h2>{{ $t('private.fee_rate') }}</h2>

                <el-input :value="$t('private.free')" disabled> </el-input>
              </div>
            </template>
            <div
              v-for="form in asset_add_forms"
              :key="form.seq"
              :class="[$style.transferQuantity, $style.mt70, $style.addForm]"
            >
              <div class="kiosk-select-box">
                <div
                  v-for="(field, idx) in form.fields"
                  :key="field.seq"
                  class="form-group"
                >
                  <div
                    v-if="field.is_required === 'Y'"
                    :class="$style.requiredImg"
                    class="required-img"
                    >*</div
                  >
                  <h2>{{ field.title }}</h2>

                  <template v-if="field.field_type === 'INPUT'">
                    <el-input
                      v-model="form.field_values[idx].value"
                      :placeholder="field.placeholder"
                    ></el-input>
                  </template>
                  <template v-if="field.field_type === 'TEXTAREA'">
                    <textarea
                      v-model="form.field_values[idx].value"
                      :placeholder="field.placeholder"
                      :class="[$style.formControl]"
                    ></textarea>
                  </template>
                  <template v-if="field.field_type === 'RADIO'">
                    <div v-for="option in field.options" :key="option.seq">
                      <el-radio
                        v-model="form.field_values[idx].option_seq"
                        :label="option.seq"
                        >{{ option.title }}</el-radio
                      >
                    </div>
                  </template>
                  <template v-if="field.field_type === 'SELECT'">
                    <el-select
                      v-model="form.field_values[idx].option_seq"
                      :clearable="field.is_required !== 'Y'"
                      :placeholder="
                        field.placeholder.length
                          ? field.placeholder
                          : $t('no_select')
                      "
                    >
                      <el-option
                        v-for="option in field.options"
                        :key="option.seq"
                        :label="option.title"
                        :value="option.seq"
                      ></el-option>
                    </el-select>
                  </template>
                  <template v-if="field.field_type === 'CHECKBOX'">
                    <ElCheckboxGroup v-model="form.field_values[idx].options">
                      <ElCheckbox
                        v-for="option in field.options"
                        :key="option.seq"
                        :label="option.seq"
                        >{{ option.title }}</ElCheckbox
                      >
                    </ElCheckboxGroup>
                  </template>
                  <template v-if="field.field_type === 'FILE'">
                    <FormFieldFile
                      v-model="form.field_values[idx].value"
                      :field_seq="field.seq"
                    ></FormFieldFile>
                  </template>
                  <template v-if="field.field_type === 'MULTISELECT'">
                    <el-select
                      v-model="form.field_values[idx].options"
                      multiple
                    >
                      <el-option
                        v-for="option in field.options"
                        :key="option.seq"
                        :label="option.title"
                        :value="option.seq"
                      ></el-option>
                    </el-select>
                  </template>
                  <span :class="$style.explanation">{{
                    field.description
                  }}</span>
                </div>
              </div>
            </div>
            <div class="transfer">
              <el-button @click="step = 'check'">{{ $t('verify') }}</el-button>
            </div>
          </div>
        </template>

        <!-- 출금 전 최종 신청정보 확인 페이지 -->
        <template v-else-if="step === 'check'">
          <div :class="$style.accountCheck" class="account-check">
            <h2>{{
              $t('kiosk.confirm_withdrawal_application_information')
            }}</h2>
            <div :class="[$style.check]" class="kiosk-select-box">
              <h3>{{ $t('account_transfer.from_account_number') }}</h3>
              <span>{{ c_s_account_info.account_number }}</span>
            </div>
            <div :class="[$style.check]" class="kiosk-select-box">
              <h3>{{ $t('account_transfer.from_asset_title') }}</h3>
              <span>{{ c_s_asset_info.title }}</span>
            </div>
            <div :class="[$style.check]" class="kiosk-select-box">
              <h3>{{ $t('kiosk.transfer_quantity') }}</h3>
              <span>{{ request_input_amount }}</span>
            </div>
            <div :class="[$style.check]" class="kiosk-select-box">
              <h3>{{ $t('wallet_page.total_amount') }}</h3>
              <span
                >{{ c_fee_same_asset_calc || '0'
                }}{{ c_s_asset_info.code }}</span
              >
              <template v-if="c_s_withdraw_fee_info">
                <span
                  v-if="
                    c_s_withdraw_fee_info.fee_asset_seq !==
                      c_s_withdraw_fee_info.asset_seq
                  "
                  >{{ c_fee_other_asset_calc || '0' }}
                  {{ c_s_withdraw_fee_info.fee_asset_info.code }}</span
                >
              </template>
            </div>
          </div>
          <div class="transfer">
            <el-button @click="handleWithdraw">{{ $t('verify') }}</el-button>
          </div>
        </template>

        <!-- 출금 계좌 입력 후 이체 완료 시 로딩 페이지 -->
        <template v-else-if="step === 'success'">
          <div :class="$style.withdrawalSuccess">
            <img src="@assets/kiosk-img/icon-success.svg" alt="login success" />
            <p>{{ $t('account_transfer.success_withdraw') }}</p>
            <div class="kiosk-select-box">
              <el-button class="home-btn" @click="$emit('close_drawer')">
                {{ $t('kiosk.go_to_first') }}
              </el-button>
            </div>
          </div>
        </template>

        <!-- 출금 계좌 입력 후 이체 살패 시 로딩 페이지 -->
        <template v-else>
          <div :class="$style.withdrawalFail">
            <img src="@assets/kiosk-img/icon-fail.svg" alt="login fail" />
            <p>{{ $t('account_transfer.success_fail') }}</p>
            <p>{{ error_msg }}</p
            ><div class="kiosk-select-box">
              <el-button class="prev-btn" @click="step = null">{{
                $t('before')
              }}</el-button>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-withdrawal.scss';
</style>
