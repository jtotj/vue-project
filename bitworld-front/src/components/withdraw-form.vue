<script>
import MaskedInput from 'vue-masked-input'
import includes from 'lodash/includes'
import map from 'lodash/map'
import find from 'lodash/find'
import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'
import { fetchAssetForm } from '@apis/form'
import { createWithdraw } from '@apis/withdraw'
import { fetchAssetWithdrawFees } from '@apis/asset'
import {
  createWithdrawAddress,
  deleteWithdrawAddress,
  fetchWithdrawAddressList,
} from '@apis/kyc'

import Decimal from 'decimal.js'

export default {
  components: {
    MaskedInput,
  },
  props: {
    asset_seq: {
      type: Number,
      default: 0,
    },
    account_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      asset_add_forms: [],
      request_input_amount: null,
      asset_withdraw_fee_seq: null,
      fee_account_seq: null,
      params: {
        asset_seq: null,
        strBankCode: null,
        strNm: null,
        strAccountNo: null,
        strResId: null,
        address: null,
      },
      withdraw_address_list: [],
      otp_config: null,
      token: '',

      asset_withdraw_fees: [],
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['otps']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_selected_asset() {
      if (this.asset_seq !== 0) {
        return find(this.assets, {
          seq: this.asset_seq,
        })
      } else {
        return null
      }
    },
    c_selected_asset_withdraw_address() {
      if (!this.withdraw_address_list.length) return null
      return find(this.withdraw_address_list, {
        asset_seq: this.c_selected_asset.seq,
      })
    },
    c_otp_config() {
      return includes(this.otp_config.apply_actions, 'WITHDRAW')
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
    c_selected_asset() {
      this.params.asset_seq = this.c_selected_asset.seq
    },
    // asset가 변경되면
    asset_seq() {
      Promise.all([this.loadWithdrawForm(), this.loadAssetWithdrawFees()])
    },
    asset_withdraw_fee_seq() {
      this.fee_account_seq = null
    },
    asset_withdraw_fees() {
      if (this.asset_withdraw_fees.length === 1) {
        this.asset_withdraw_fee_seq = this.asset_withdraw_fees[0].seq
      }
    },
  },
  mounted() {
    Promise.all([
      this.loadWithdrawAddressList(),
      this.loadWithdrawForm(),
      this.loadAssetWithdrawFees(),
    ]).catch((e) => this.$toasted.error(e.message))
    this.params.asset_seq = this.asset_seq
  },
  methods: {
    Decimal,
    fromPairs,
    async loadWithdrawForm() {
      const { forms } = await fetchAssetForm({
        asset_seq: this.asset_seq,
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
        const { data } = await fetchAssetWithdrawFees(this.asset_seq)

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
    handleDeleteWithdrawAddress() {
      if (this.c_selected_asset_withdraw_address) {
        deleteWithdrawAddress(this.c_selected_asset_withdraw_address.seq)
          .then(() => {
            this.$toasted.success(this.$t('kyc.delete_success_address'))
            this.loadWithdrawAddressList()
          })
          .catch((e) => this.$toasted.error(e.message))
      }
    },
    handleWithdraw() {
      createWithdraw({
        account_seq: this.account_seq,
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
          this.$router.push({
            name: 'Withdraw',
          })
        })
        .catch((e) => this.$toasted.error(e.message))
    },
  },
}
</script>

<template>
  <div :class="[$style.withdrawForm]">
    <!-- 출금 금액 -->
    <div :class="[$style.formGroup]">
      <div :class="[$style.inputGroup]">
        <label for="formControl">{{
          $t('wallet_page.withdraw_request_amount')
        }}</label>
        <input
          id="formControl"
          v-model="request_input_amount"
          :class="[$style.formControl]"
        />
      </div>
    </div>
    <div v-for="form in asset_add_forms" :key="form.seq" class="offer-details">
      <div :class="[$style.withdrawInfoWrap]">
        <div :class="[$style.infoTitleWrap]">
          <label :class="[$style.infoTitle]">{{ form.title }}</label>
          <p :class="[$style.bgGrey]" v-html="form.description"></p>
        </div>

        <div
          v-for="(field, idx) in form.fields"
          :key="field.seq"
          :class="[$style.withdrawInfo]"
        >
          <div v-if="field.is_required === 'Y'" class="required-img"></div>
          <div :class="[$style.formGroup]">
            <label>{{ field.title }}</label>

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
                  field.placeholder.length ? field.placeholder : $t('no_select')
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
              <el-select v-model="form.field_values[idx].options" multiple>
                <el-option
                  v-for="option in field.options"
                  :key="option.seq"
                  :label="option.title"
                  :value="option.seq"
                ></el-option>
              </el-select>
            </template>
            <span class="explanation">{{ field.description }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 출금주소 인증 -->
    <template
      v-if="!c_selected_asset_withdraw_address && c_selected_asset.plugin_seq"
    >
      <div class="offer-details payment-section">
        <template v-if="c_selected_asset.plugin === 'krw'">
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>{{ $t('kyc.select_bank') }}</label>
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
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>{{ $t('kyc.holder_name') }}</label>
              <div class="input-new-form">
                <el-input
                  v-model="params.strNm"
                  :placeholder="$t('kyc.holder_name')"
                ></el-input>
              </div>
            </div>
          </div>
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>{{ $t('kyc.birth') }}</label>
              <div class="input-new-form">
                <el-input
                  v-model="params.strResId"
                  :placeholder="$t('kyc.birth')"
                ></el-input>
              </div>
            </div>
          </div>
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>{{ $t('wallet_page.withdraw_bank_address') }}</label>
              <div class="input-new-form">
                <el-input
                  v-model="params.strAccountNo"
                  :placeholder="$t('wallet_page.withdraw_bank_address')"
                >
                  <el-button
                    slot="append"
                    class="withdraw-address-btn"
                    @click="handleCreateWithdrawAddress"
                  >
                    {{ $t('my_page.auth_withdraw_address') }}
                  </el-button>
                </el-input>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div :class="[$style.formGroup]">
            <div :class="[$style.inputGroup]">
              <label>{{ $t('kyc.address') }}</label>
              <div class="input-new-form">
                <el-input
                  v-model="params.address"
                  :placeholder="$t('kyc.address')"
                >
                  <el-button
                    slot="append"
                    class="withdraw-address-btn"
                    @click="handleCreateWithdrawAddress"
                  >
                    {{ $t('my_page.auth_withdraw_address') }}
                  </el-button>
                </el-input>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <!-- 출금 수수료 -->
    <div :class="[$style.formGroup]">
      <div :class="[$style.inputGroup]">
        <template v-if="c_selected_asset.use_withdraw_fee === 'Y'">
          <label>{{ $t('kiosk.choose_how_to_pay_the_fee') }}</label>

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
            <div :class="[$style.totalWithdrawalAmount]">
              {{
                c_s_withdraw_fee_info.fee_amount
                  | codeDecimal(c_s_withdraw_fee_info.fee_asset_info.code)
              }}
              <span v-if="c_s_withdraw_fee_info.fee_amount_type === 'RATIO'"
                >%</span
              >
              <span v-else>
                {{ c_s_withdraw_fee_info.fee_asset_info.code }}
              </span>
            </div>

            <template
              v-if="c_s_withdraw_fee_info.is_equal_account_required === 'N'"
            >
              <label>{{ $t('transaction_detail.select_pay_account') }}</label>
              <el-select v-model="fee_account_seq">
                <el-option
                  v-for="account in c_filter_account_by_fee_asset"
                  :key="account.seq"
                  :value="account.seq"
                  :label="account.title"
                >
                  {{ account.title || $t('no_alias') }}
                  {{ account.account_number }}
                </el-option>
              </el-select>
              <div v-if="c_s_fee_account_info">
                <label
                  >{{ $t('transaction_detail.pay_account_balance') }}:
                </label>
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
            {{ $t('private.free') }}
          </div>
        </template>
      </div>
    </div>
    <div :class="[$style.formGroup]">
      <div :class="[$style.inputGroup]">
        <label>
          {{ $t('wallet_page.withdraw_fee_total_amount') }}
        </label>
        <div :class="[$style.totalWithdrawalAmount]">
          {{ c_fee_same_asset_calc || '0' }}
          {{ c_selected_asset.code }}
          <template v-if="c_s_withdraw_fee_info">
            <span
              v-if="
                c_s_withdraw_fee_info.fee_asset_seq !==
                  c_s_withdraw_fee_info.asset_seq
              "
              >/ {{ c_fee_other_asset_calc || '0' }}
              {{ c_s_withdraw_fee_info.fee_asset_info.code }}</span
            >
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="c_selected_asset_withdraw_address"
      class="offer-details payment-section"
    >
      <template v-if="c_selected_asset_withdraw_address.asset_code === 'KRW'">
        <h4>{{ $t('wallet_page.withdraw_account_info') }}</h4>
        <div :class="[$style.formGroup]">
          <div :class="[$style.inputGroup]">
            <label>{{ $t('wallet_page.holder_name') }}</label>
            <el-input
              :disabled="true"
              :placeholder="c_selected_asset_withdraw_address.holder_name"
            ></el-input>
          </div>
        </div>
        <div :class="[$style.formGroup]">
          <div :class="[$style.inputGroup]">
            <label>{{ $t('wallet_page.bank_name') }}</label>
            <el-input
              :disabled="true"
              :placeholder="
                fromPairs(
                  constants.kyc.asset_withdraw_address_certification.bank_codes
                )[c_selected_asset_withdraw_address.bank_code]
              "
            ></el-input>
          </div>
        </div>
        <div :class="[$style.formGroup]">
          <div :class="[$style.inputGroup]">
            <label>
              {{ $t('wallet_page.withdraw_bank_address') }}
            </label>
            <el-input
              :disabled="true"
              :placeholder="c_selected_asset_withdraw_address.withdraw_address"
            ></el-input>
          </div>
        </div>
      </template>
      <template v-else>
        <div :class="[$style.formGroup]">
          <div :class="[$style.inputGroup]">
            <label>{{ $t('wallet_page.withdraw_address') }}</label>
            <el-input
              :disabled="true"
              :placeholder="c_selected_asset_withdraw_address.withdraw_address"
            >
              <el-button
                v-if="c_selected_asset_withdraw_address.asset_code !== 'KRW'"
                slot="append"
                class="withdraw-address-btn"
                @click="handleDeleteWithdrawAddress"
              >
                {{ $t('kyc.delete_withdraw_address') }}
              </el-button>
            </el-input>
          </div>
        </div>
      </template>
    </div>
    <template v-if="0">
      <div :class="[$style.formGroup]">
        <div :class="[$style.inputGroup]">
          <h4>{{ $t('otp.authenticode') }}</h4>
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
    <div :class="[$style.btnWrap]">
      <button :class="[$style.applyBtn]" @click="handleWithdraw">
        {{ $t('apply') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/withdraw-form.scss';
</style>
