<script>
import { createDeposit } from '@apis/deposit'
import { createWithdraw } from '@apis/withdraw'
import { fetchAssetForm } from '@apis/form'
import { fetchAddressList, createAddress } from '@apis/address'
import {
  fetchWithdrawAddressList,
  createWithdrawAddress,
  deleteWithdrawAddress,
} from '@apis/kyc'
import { fetchOtpConfig } from '@apis/config'
import FormFieldFile from '@components/form-field-file'
import MaskedInput from 'vue-masked-input'
import Qrcode from 'qrcode.vue'
import { mapState } from 'vuex'
import find from 'lodash/find'
import includes from 'lodash/includes'
import Decimal from 'decimal.js'
import fromPairs from 'lodash/fromPairs'
import map from 'lodash/map'
import { fetchAssetWithdrawFees } from '@apis/asset'
import filter from 'lodash/filter'

export default {
  components: {
    Qrcode,
    FormFieldFile,
    MaskedInput,
  },
  props: {
    modal_title: {
      type: String,
      default: null,
    },
    selected_account_info: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      request_input_amount: '',
      asset_add_forms: [],
      address_list: [],
      withdraw_address_list: [],
      otp_config: null,
      asset_withdraw_fee_seq: null,
      fee_account_seq: null,
      asset_withdraw_fees: [],
      show_qr: null,

      params: {
        asset_seq: this.selected_account_info.asset_seq || null,
        strBankCode: null,
        strNm: null,
        strAccountNo: null,
        strResId: null,
        address: null,
      },
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    ...mapState('auth', ['otps']),

    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_otp_config() {
      return includes(this.otp_config.apply_actions, 'WITHDRAW')
    },
    c_selected_asset_withdraw_address() {
      if (!this.withdraw_address_list.length) return null
      return (
        find(this.withdraw_address_list, {
          asset_seq: this.selected_account_info.asset_seq,
        }) || null
      )
    },
    c_selected_asset() {
      return find(this.assets, {
        seq: this.selected_account_info.asset_seq,
      })
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
    modal_title() {
      if (this.modal_title === 'deposit') {
        Promise.all([this.loadDepositForm(), this.loadAddressList()])
      } else if (this.modal_title === 'withdraw') {
        Promise.all([this.loadWithdrawForm(), this.loadAssetWithdrawFees()])
      }
    },
    asset_withdraw_fees() {
      if (this.asset_withdraw_fees.length === 1) {
        this.asset_withdraw_fee_seq = this.asset_withdraw_fees[0].seq
      }
    },
    asset_withdraw_fee_seq() {
      this.fee_account_seq = null
    },
  },
  mounted() {
    Promise.all([this.loadOtpConfig(), this.loadWithdrawAddressList()]).catch(
      (e) => this.$toasted.error(e.message)
    )
    if (this.modal_title === 'deposit') {
      Promise.all([this.loadDepositForm(), this.loadAddressList()])
    } else {
      Promise.all([this.loadWithdrawForm(), this.loadAssetWithdrawFees()])
    }
  },
  methods: {
    async loadDepositForm() {
      const { forms } = await fetchAssetForm({
        asset_seq: this.selected_account_info.asset_seq,
        target_type: 'ASSET_DEPOSIT',
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
    async loadWithdrawForm() {
      const { forms } = await fetchAssetForm({
        asset_seq: this.selected_account_info.asset_seq,
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
      if (this.c_selected_asset.use_withdraw_fee === 'Y') {
        const { data } = await fetchAssetWithdrawFees(this.c_selected_asset.seq)

        const arrange_fee = map(data, (info) => ({
          ...info,
          fee_asset_info: find(this.assets, { seq: info.fee_asset_seq }),
        }))
        this.asset_withdraw_fees = arrange_fee
      }
    },
    async loadAddressList() {
      const { data } = await fetchAddressList({
        is_valid: 'Y',
        list_count: 1,
        account_seq: this.selected_account_info.seq,
      }).catch((e) => this.$toasted.error(e.message))
      this.address_list = data
    },
    async loadWithdrawAddressList() {
      const { data } = await fetchWithdrawAddressList({
        is_valid: 'Y',
        no_paging: 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.withdraw_address_list = data
    },
    async loadOtpConfig() {
      const { config } = await fetchOtpConfig().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.otp_config = config
    },
    handleDeposit() {
      createDeposit({
        account_seq: this.selected_account_info.seq,
        request_amount: this.request_input_amount,
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
          this.$toasted.success(this.$t('toasted_msg.deposit_request'))
          this.$store.dispatch('account/getAccounts')
          this.$emit('modal_close')
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleWithdraw() {
      if (
        !this.c_selected_asset_withdraw_address &&
        this.c_selected_asset.plugin_seq !== 0
      )
        return this.$toasted.error('자산 주소를 입력해주세요')
      createWithdraw({
        account_seq: this.selected_account_info.seq,
        request_amount: this.request_input_amount,
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
          this.$toasted.success(this.$t('toasted_msg.withdraw_request'))
          this.$store.dispatch('account/getAccounts')
          this.$emit('modal_close')
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleCreateAddress() {
      createAddress({
        account_seq: this.selected_account_info.seq,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.create_account'))
          this.loadAddressList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    fromPairs,
    onCopy() {
      this.$toasted.success(this.$t('toasted_msg.copy'))
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
    handleDeleteWithdrawAddress() {
      deleteWithdrawAddress(this.c_selected_asset_withdraw_address.seq)
        .then(() => {
          this.$toasted.success(this.$t('kyc.delete_success_address'))
          this.loadWithdrawAddressList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    qrCopyOn() {
      this.$copyText('cocofxinfo').then(
        this.$toasted.success(this.$t('toasted_msg.copy'))
      )
    },
    Decimal,
  },
}
</script>

<template>
  <div class="withdrawal-wrap" :class="[$style.depositForm]">
    <div class="offer-details">
      <div class="form-group">
        <label>{{ $t('balance') }}</label>
        <div class="row">
          <div :class="[$style.formControl]">
            {{
              Decimal(selected_account_info.balance).minus(
                selected_account_info.holding_balance
              )
            }}
          </div>
        </div>
        <template
          v-if="
            c_selected_asset.plugin_seq === 0 ||
              modal_title === 'withdraw' ||
              c_selected_asset.plugin === 'krw'
          "
        >
          <label>
            {{
              modal_title === 'deposit'
                ? $t('wallet_page.deposit_request_amount')
                : $t('wallet_page.withdraw_request_amount')
            }}
          </label>
          <div class="row">
            <input
              v-model="request_input_amount"
              type="number"
              :class="[$style.formControl]"
            />
          </div>
          <template v-if="modal_title === 'withdraw'">
            <div class="form-group">
              <div :class="[$style.inputGroup]">
                <template v-if="c_selected_asset.use_withdraw_fee === 'Y'">
                  <label>{{ $t('choose_how_pay_fee') }}</label>

                  <el-select v-model="asset_withdraw_fee_seq">
                    <el-option
                      v-for="fee in asset_withdraw_fees"
                      :key="fee.seq"
                      :value="fee.seq"
                      :label="fee.fee_asset_info.title"
                    >
                      {{ fee.fee_asset_info.title }}
                    </el-option>
                  </el-select>
                  <template v-if="c_s_withdraw_fee_info">
                    <div class="form-group">
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
                      <span v-else>{{
                        c_s_withdraw_fee_info.fee_asset_info.code
                      }}</span>
                    </div>

                    <template
                      v-if="
                        c_s_withdraw_fee_info.is_equal_account_required === 'N'
                      "
                      class="form-group"
                    >
                      <label
                        >{{ $t('private.fee') }}
                        {{
                          $t('transaction_detail.pay_account_selection')
                        }}</label
                      >
                      <el-select
                        v-model="fee_account_seq"
                        :placeholder="
                          $t('private.fee') +
                            ' ' +
                            $t('transaction_detail.pay_account_selection_msg')
                        "
                      >
                        <el-option
                          v-for="account in c_filter_account_by_fee_asset"
                          :key="account.seq"
                          :value="account.seq"
                          :label="account.title"
                        >
                          {{ account.title || '별칭 없음' }}
                          {{ account.account_number }}
                        </el-option>
                      </el-select>
                      <div v-if="c_s_fee_account_info">
                        <label>{{
                          $t('transaction_detail.pay_account_balance')
                        }}</label>
                        {{
                          Decimal(c_s_fee_account_info.balance).minus(
                            c_s_fee_account_info.holding_balance
                          ) | codeDecimal(c_s_fee_account_info.asset_code)
                        }}

                        {{ c_s_fee_account_info.asset_code }}
                      </div>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <label>{{ $t('private.fee_rate') }}</label>
                  <div :class="[$style.totalWithdrawalAmount]">
                    {{ $t('free') }}
                  </div>
                </template>
              </div>
            </div>
            <div class="form-group">
              <label>
                {{ $t('wallet_page.withdraw_fee_total_amount') }}
              </label>
              <!-- 수수료 무료 -->
              <div :class="[$style.totalWithdrawalAmount]">
                {{ c_fee_same_asset_calc || '0' }}
                {{ c_selected_asset.code }}
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
          </template>
          <div
            v-for="form in asset_add_forms"
            :key="form.seq"
            class="offer-details payment-section"
          >
            <h4>{{ form.title }}</h4>
            <p>{{ form.description }}</p>
            <div class="offer-extra-fields">
              <div
                v-for="(field, idx) in form.fields"
                :key="field.seq"
                class="form-group"
              >
                <div
                  v-if="field.is_required === 'Y'"
                  class="required-img"
                ></div>
                <label>{{ field.title }}</label>
                <template v-if="field.field_type === 'INPUT'">
                  <input
                    v-model="form.field_values[idx].value"
                    :placeholder="field.placeholder"
                  />
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
                    >
                      {{ option.title }}</el-radio
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
                    >
                      {{ option.title }}</ElCheckbox
                    >
                  </ElCheckboxGroup>
                </template>
                <template v-if="field.field_type === 'FILE'">
                  <FormFieldFile
                    v-model="form.field_values[idx].value"
                    :field_seq="field.seq"
                  >
                  </FormFieldFile>
                </template>
                <template v-if="field.field_type === 'MULTISELECT'">
                  <el-select v-model="form.field_values[idx].options" multiple>
                    <el-option
                      v-for="option in field.options"
                      :key="option.seq"
                      :label="option.title"
                      :value="option.seq"
                    ></el-option>
                  </el-select>
                </template>

                <span class="explanation">
                  {{ field.description }}
                </span>
              </div>
            </div>
          </div>
          <template
            v-if="
              modal_title === 'withdraw' && !c_selected_asset_withdraw_address
            "
          >
            <div class="offer-details payment-section form-group">
              <template v-if="c_selected_asset.plugin === 'krw'">
                <div class="form-group">
                  <label>{{ $t('kyc.select_bank') }}</label>

                  <div class="input-new-form">
                    <el-select
                      v-model="params.strBankCode"
                      style="width:100%;"
                      :placeholder="$t('no_select')"
                    >
                      <el-option
                        v-for="bank in constants.kyc
                          .asset_withdraw_address_certification.bank_codes"
                        :key="bank[0]"
                        :label="bank[1]"
                        :value="bank[0]"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ $t('kyc.holder_name') }}</label>
                  <div class="row">
                    <div class="input-new-form">
                      <input
                        v-model="params.strNm"
                        :placeholder="$t('kyc.holder_name')"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>{{ $t('kyc.birth') }}</label>
                  <div class="row">
                    <div class="input-new-form">
                      <input
                        v-model="params.strResId"
                        :placeholder="$t('kyc.birth')"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ $t('wallet.account_number') }}</label>
                  <div class="row">
                    <div class="input-new-form">
                      <el-input
                        v-model="params.strAccountNo"
                        :placeholder="$t('wallet.account_number')"
                        ><button
                          slot="append"
                          class="withdraw-address-btn"
                          @click="handleCreateWithdrawAddress"
                        >
                          {{ $t('myprofile.withdraw_auth') }}</button
                        ></el-input
                      >
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="form-group">
                  <label>{{ $t('kyc.address') }}</label>
                  <div class="row">
                    <div class="input-new-form">
                      <input
                        v-model="params.address"
                        :placeholder="$t('kyc.address')"
                      />
                      <div class="btn-wrap">
                        <button
                          slot="append"
                          class="withdraw-address-btn"
                          @click="handleCreateWithdrawAddress"
                        >
                          {{ $t('my_page.auth_withdraw_address') }}</button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <div
            v-if="
              c_selected_asset_withdraw_address && modal_title === 'withdraw'
            "
            class="offer-details payment-section row"
          >
            <template
              v-if="c_selected_asset_withdraw_address.asset_code === 'KRW'"
            >
              <div class="form-group">
                <label>{{ $t('wallet_page.holder_name') }}</label>

                <div class="row">
                  <input
                    :disabled="true"
                    :placeholder="c_selected_asset_withdraw_address.holder_name"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('wallet_page.bank_name') }}</label>

                <div class="row">
                  <input
                    :disabled="true"
                    :placeholder="
                      fromPairs(
                        constants.kyc.asset_withdraw_address_certification
                          .bank_codes
                      )[c_selected_asset_withdraw_address.bank_code]
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('wallet_page.withdraw_bank_address') }}</label>

                <div class="row">
                  <input
                    :disabled="true"
                    :placeholder="
                      c_selected_asset_withdraw_address.withdraw_address
                    "
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="form-group">
                <label>{{ $t('wallet_page.withdraw_address') }}</label>

                <div class="row">
                  <input
                    :disabled="true"
                    :placeholder="
                      c_selected_asset_withdraw_address.withdraw_address
                    "
                  />

                  <div class="btn-wrap">
                    <button
                      v-if="
                        c_selected_asset_withdraw_address.asset_code !== 'KRW'
                      "
                      slot="append"
                      class="withdraw-address-btn"
                      @click="handleDeleteWithdrawAddress"
                    >
                      {{ $t('kyc.delete_withdraw_address') }}</button
                    >
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
    <template
      v-if="modal_title === 'withdraw' && otps.length > 1 && c_otp_config"
    >
      <div class="form-group">
        <h4>{{ $t('otp.authenticode') }}</h4>
        <div class="row">
          <MaskedInput
            v-model="token"
            style="font-family: monospace;"
            mask="### ###"
            placeholder="000 000"
            class="nickname_chg"
            type="text"
          />
        </div>
      </div>
    </template>
    <template
      v-else-if="
        c_selected_asset.plugin_seq &&
          modal_title === 'deposit' &&
          c_selected_asset.plugin !== 'krw'
      "
    >
      <div v-if="address_list.length !== 0" class="create-body">
        <div
          v-for="a_address in address_list"
          :key="a_address.seq"
          class="offer-details limitation-section row add-address"
        >
          <div class="offer-extra-fields">
            <div class="form-group">
              <label>{{ $t('wallet_page.qr_address') }}</label>
              <div class="row">
                <div class="deal-info">
                  {{ a_address.address }}
                  <button
                    v-clipboard:copy="a_address.address"
                    v-clipboard:success="onCopy"
                    class="oncopy"
                    style="float:right;"
                    >{{ $t('copy') }}</button
                  >
                </div>
              </div>
              <Qrcode
                class="qrcode"
                :value="a_address.address"
                size="200"
                style=" margin: 20px 0;text-align:center;"
              >
              </Qrcode>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="btn-wrap btn-between">
        <button @click="handleCreateAddress"
          >{{ $t('wallet_page.create_qr_address') }}
        </button>
        <button class="btn-grey marginL-10" @click="$emit('modal_close')">{{
          $t('cancel')
        }}</button>
      </div>
    </template>

    <!-- 입금 자산플러그인이 있을 때 QR코드 -->
    <template v-else-if="c_selected_asset.plugin !== 'eos'">
      <div v-if="address_list.length" :class="[$style.qrcode]">
        <div
          v-for="a_address in address_list"
          :key="a_address.seq"
          :class="[$style.accountAddressWrap]"
        >
          <div :class="[$style.accountAddress]">
            <label>{{ $t('wallet_page.qr_address') }}</label>
            <div :class="[$style.formGroup]">
              <div :class="[$style.inputGroup]">
                <span :class="[$style.address]">
                  {{ a_address.address }}
                </span>
                <button
                  :class="[$style.addressCopyBtn]"
                  @click.prevent.stop="onCopy(a_address.address)"
                  >{{ $t('copy') }}</button
                >
              </div>
            </div>
          </div>
          <div :class="[$style.qrcodeWrap]">
            <Qrcode :value="a_address.address" size="150"></Qrcode>
          </div>
        </div>
        <div class="btn-wrap btn-right marginR-10">
          <button class="btn-grey marginR-10" @click="$emit('modal_close')">{{
            $t('cancel')
          }}</button>
        </div>
      </div>
      <div v-else>
        <div class="btn-wrap btn-between">
          <el-button @click="handleCreateAddress">{{
            $t('wallet_page.create_qr_address')
          }}</el-button>
          <button class="btn-grey marginL-10" @click="$emit('modal_close')">{{
            $t('cancel')
          }}</button>
        </div>
      </div>
    </template>

    <!-- 자산 플러그인이 EOS일 때 -->
    <template v-if="c_selected_asset.plugin === 'eos'">
      <div :class="[$style.eosWrap]">
        <div :class="[$style.infoWrap]">
          <h1 :class="[$style.infoTitle]">
            {{ c_selected_asset.code }}
            {{ $t('wallet_page.deposit') }}
          </h1>
          <div :class="[$style.infoBox]">
            <p :class="[$style.infoText]">
              {{ $t('wallet_page.deposit_msg', [c_selected_asset.code]) }}
            </p>
            <p :class="[$style.infoText]">
              {{ $t('wallet_page.deposit_msg_1', [c_selected_asset.code]) }}
            </p>
          </div>
        </div>
        <div :class="[$style.stepWrap]">
          <h3 :class="[$style.stepTitle]">
            {{ $t('wallet_page.deposit_step_1', [c_selected_asset.title]) }}
          </h3>
          <div :class="[$style.stepBox]">
            <div
              v-for="a_address in address_list"
              :key="a_address.seq"
              :class="[$style.stepTextBox]"
            >
              <span :class="[$style.stepText]">
                {{
                  $t('wallet_page.deposit_step_1_1', [c_selected_asset.title])
                }}
              </span>
              <div :class="[$style.addressWrap]">
                {{ a_address.address }}
              </div>
            </div>
            <div :class="[$style.idCopyBox]">
              <div :class="[$style.idCopyMsg]">
                <p :class="[$style.caution]">
                  <i class="fas fa-exclamation-triangle"></i>
                  {{
                    $t('wallet_page.deposit_step_1_2', [c_selected_asset.code])
                  }}
                </p>
                <el-checkbox
                  v-if="address_list.length !== 0"
                  v-model="show_qr"
                  :class="[$style.checkBox]"
                >
                  <span :class="[$style.showText]">
                    확인했습니다.
                    {{
                      $t('wallet_page.deposit_step_1_3', [
                        c_selected_asset.code,
                      ])
                    }}
                  </span>
                </el-checkbox>
              </div>
              <div :class="[$style.copyBtnWrap]">
                <button
                  v-if="address_list.length !== 0"
                  class="oncopy marginL-10"
                  @click.prevent.stop="onCopy(address_list[0].address)"
                  >{{ $t('wallet_page.deposit_step_1_btn') }}
                </button>
                <button
                  v-else
                  :class="[$style.bidBtn]"
                  @click="handleCreateAddress"
                >
                  {{ $t('wallet_page.create_account_address') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="show_qr" :class="[$style.stepWrap]">
          <h3 :class="[$style.stepTitle]">
            {{ $t('wallet_page.deposit_step_2') }}
          </h3>
          <div :class="[$style.stepBox]">
            <div
              v-for="a_address in address_list"
              :key="a_address.seq"
              :class="[$style.qrCodeBox]"
            >
              <Qrcode
                value="cocofxinfo"
                size="150"
                :class="[$style.qrCode]"
              ></Qrcode>
            </div>
            <div :class="[$style.walletAddressWrap]">
              <div :class="[$style.walletAddress]">
                <h3 :class="[$style.walletAddressTitle]">
                  {{ $t('wallet_page.deposit_step_2_2') }}
                </h3>
                <div :class="[$style.walletAddressText]">cocofxinfo</div>
              </div>
            </div>
            <div :class="[$style.idCopyBox]">
              <div :class="[$style.copyBtnWrap]">
                <button :class="[$style.copyBtn]" @click="qrCopyOn">
                  {{ $t('wallet_page.deposit_step_2_btn') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div :class="[$style.noticeWrap]">
          <h4 :class="[$style.noticeTitle]">
            <i class="fas fa-exclamation-circle"></i>
            {{ $t('wallet_page.deposit_msg_2') }}
          </h4>
          <ul :class="[$style.noticeList]">
            <li>
              {{ $t('wallet_page.deposit_msg_2_1') }}
            </li>
            <li v-html="$t('wallet_page.deposit_msg_2_2')"></li>
          </ul>
        </div>
      </div>
      <div :class="[$style.btnWrap]">
        <button
          v-if="c_selected_asset.plugin_seq === 0"
          :class="[$style.applyBtn]"
          @click="handleDeposit"
          >{{ $t('apply') }}</button
        >
      </div>
    </template>
    <!-- <div
      v-if="
        address_list.length !== 0 ||
          modal_title === 'withdraw' ||
          (modal_title === 'deposit' && c_selected_asset.plugin_seq === 0)
      "
      class="btn-wrap btn-right"
    >
      <button v-if="modal_title === 'withdraw'" @click="handleWithdraw"
        >{{ $t('apply') }}
      </button>
      <button
        v-if="modal_title === 'deposit' && c_selected_asset.plugin_seq === 0"
        @click="handleDeposit"
        >{{ $t('apply') }}</button
      >
      <button class="btn-grey marginL-10" @click="$emit('modal_close')">{{
        $t('cancel')
      }}</button>
    </div> -->
  </div>
</template>

<style lang="scss" module>
@import '@design';

.depositForm .eosWrap .infoWrap {
  margin-bottom: 20px;
}

.depositForm .eosWrap .infoWrap .infoTitle {
  margin: 10px 0;
  font-size: 24px;
  font-weight: bold;
  line-height: 32px;
  color: #333;
}

.depositForm .eosWrap .infoWrap .infoBox .infoText {
  font-size: 14px;
  line-height: 22px;
  color: #999;
}

.depositForm .eosWrap .stepWrap {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.depositForm .eosWrap .stepWrap .stepTitle {
  padding-bottom: 10px;
  font-size: 16px;
  line-height: 24px;
  color: #333;
}

.depositForm .eosWrap .stepWrap .stepBox .qrCodeBox {
  padding: 10px 0;
  text-align: center;
}

.depositForm .eosWrap .stepWrap .stepBox .stepTextBox {
  margin-bottom: 10px;
}

.depositForm .eosWrap .stepWrap .stepBox .walletAddressWrap .walletAddress {
  margin-bottom: 10px;
}
.depositForm
  .eosWrap
  .stepWrap
  .stepBox
  .walletAddressWrap
  .walletAddress
  .walletAddressTitle {
  padding-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  color: #333;
}

.depositForm
  .eosWrap
  .stepWrap
  .stepBox
  .walletAddressWrap
  .walletAddress
  .walletAddressText {
  padding: 10px;
  font-size: 14px;
  line-height: 22px;
  background-color: white;
}

.depositForm .eosWrap .stepWrap .stepBox .idCopyBox .copyBtnWrap .copyBtn {
  padding: 6px 15px;
  font-size: 13px;
  line-height: 21px;
  color: #999;
  cursor: pointer;
  background-color: white;
  border: 1px solid #e5e5e5;
}

.depositForm .eosWrap .stepWrap .stepBox .stepTextBox .stepText {
  display: inline-block;
  width: 100%;
  padding-bottom: 5px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  color: #999;
}

.depositForm .eosWrap .stepWrap .stepBox .stepTextBox .addressWrap {
  padding: 10px;
  font-size: 14px;
  line-height: 22px;
  background-color: white;
}

.depositForm .eosWrap .stepWrap .stepBox .idCopyMsg .caution {
  font-size: 12px;
  line-height: 20px;
  color: red;
}

.depositForm .eosWrap .stepWrap .stepBox .idCopyMsg .checkBox {
  padding: 10px 0;
}

.depositForm .eosWrap .stepWrap .stepBox .idCopyMsg .checkBox .showText {
  color: #0068c1;
}

.depositForm .eosWrap .stepWrap .stepBox .copyBtnWrap .onCopy {
  padding: 6px 15px;
  font-size: 13px;
  line-height: 21px;
  color: #999;
  cursor: pointer;
  background-color: white;
  border: 1px solid #e5e5e5;
}

.depositForm .eosWrap .stepWrap .stepBox .depositNotice {
  padding: 10px;
  background-color: white;
  border: 1px solid #000;
}

.depositForm .eosWrap .noticeWrap {
  padding: 10px;
  border: 1px solid #e5e5e5;
}

.depositForm .eosWrap .noticeWrap .noticeTitle {
  padding-bottom: 5px;
  font-size: 14px;
  line-height: 22px;
  color: #333;
}

.depositForm .eosWrap .noticeWrap .noticeList {
  padding-left: 20px;
}

.depositForm .eosWrap .noticeWrap .noticeList li {
  font-size: 14px;
  line-height: 22px;
  color: #666;
  list-style: circle;
}
</style>
