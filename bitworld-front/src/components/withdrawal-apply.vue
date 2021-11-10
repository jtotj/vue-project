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
      return find(this.withdraw_address_list, {
        asset_seq: this.selected_account_info.asset_seq,
      })
    },
    c_selected_asset() {
      return find(this.assets, {
        seq: this.selected_account_info.asset_seq,
      })
    },
    c_fee_calc() {
      if (
        this.request_input_amount &&
        this.c_selected_asset.withdraw_fee_type === 'PREPAY' &&
        this.c_selected_asset.withdraw_fee_amount_type === 'FIXED'
      ) {
        return this.request_input_amount
      } else if (
        this.request_input_amount &&
        this.c_selected_asset.withdraw_fee_type === 'PREPAY' &&
        this.c_selected_asset.withdraw_fee_amount_type === 'RATIO'
      ) {
        return this.request_input_amount
      } else if (
        this.request_input_amount &&
        this.c_selected_asset.withdraw_fee_type === 'POSTPAY' &&
        this.c_selected_asset.withdraw_fee_amount_type === 'FIXED'
      ) {
        let calc_fee = new Decimal(this.request_input_amount)
        calc_fee = calc_fee.minus(this.c_selected_asset.withdraw_fee_amount)
        return calc_fee.toString()
      } else if (
        this.request_input_amount &&
        this.c_selected_asset.withdraw_fee_type === 'POSTPAY' &&
        this.c_selected_asset.withdraw_fee_amount_type === 'RATIO'
      ) {
        let calc_fee = new Decimal(this.request_input_amount)
        let spread_rate = new Decimal(this.c_selected_asset.withdraw_fee_amount)
        calc_fee = calc_fee.mul(spread_rate.div(-100).plus(1))
        return calc_fee.toString()
      } else {
        return this.request_input_amount
      }
    },
  },
  watch: {
    modal_title() {
      if (this.modal_title === 'deposit') {
        Promise.all([this.loadDepositForm(), this.loadAddressList()])
      } else if (this.modal_title === 'withdraw') {
        this.loadWithdrawForm()
      }
    },
  },
  mounted() {
    Promise.all([this.loadOtpConfig(), this.loadWithdrawAddressList()]).catch(
      (e) => this.$toasted.error(e.message)
    )
    if (this.modal_title === 'deposit') {
      Promise.all([this.loadDepositForm(), this.loadAddressList()])
    } else {
      this.loadWithdrawForm()
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
      createWithdraw({
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
    Decimal,
  },
}
</script>

<template>
  <div class="withdrawal-wrap">
    <div class="offer-details">
      <div :class="[$style.formGroup]">
        <label>{{ $t('balance') }}</label>
        <div :class="[$style.inputGroup]">
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
          <div :class="[$style.inputGroup]">
            <input
              v-model="request_input_amount"
              :class="[$style.formControl]"
            />
          </div>
          <label>{{ $t('private.fee_rate') }}</label>
          <div :class="[$style.inputGroup]">
            <div
              v-if="
                c_selected_asset.withdraw_fee_type !== 'FREE' &&
                  c_selected_asset.withdraw_fee_amount_type === 'FIXED'
              "
              :class="[$style.formControl]"
            >
              {{
                c_selected_asset.withdraw_fee_amount
                  | codeDecimal(c_selected_asset.code)
              }}
              {{ c_selected_asset.code }}
            </div>
            <div
              v-else-if="
                c_selected_asset.withdraw_fee_type !== 'FREE' &&
                  c_selected_asset.withdraw_fee_amount_type === 'RATIO'
              "
              :class="[$style.formControl]"
            >
              {{ c_selected_asset.withdraw_fee_amount | codeDecimal('KRW') }}%
              {{ c_selected_asset.code }}
            </div>
            <div v-else :class="[$style.formControl]">
              {{
                fromPairs(constants.asset.withdraw_fee_type)[
                  c_selected_asset.withdraw_fee_type
                ]
              }}
            </div>
          </div>
          <label>{{ $t('wallet_page.withdraw_fee_total_amount') }}</label>
          <div :class="[$style.inputGroup]">
            <div :class="[$style.formControl, $style.fees]">
              {{ c_fee_calc }}
              {{ c_selected_asset.code }}
            </div>
          </div>

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
                :class="[$style.formGroup]"
              >
                <div
                  v-if="field.is_required === 'Y'"
                  class="required-img"
                ></div>
                <label>{{ field.title }}</label>
                <template v-if="field.field_type === 'INPUT'">
                  <el-input
                    v-model="form.field_values[idx].value"
                    :placeholder="field.placeholder"
                  >
                  </el-input>
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
              modal_title === 'withdraw' &&
                !c_selected_asset_withdraw_address &&
                c_selected_asset.plugin_seq
            "
          >
            <div class="offer-details payment-section">
              <template v-if="c_selected_asset.plugin === 'krw'">
                <div :class="[$style.formGroup]">
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
                <div :class="[$style.formGroup]">
                  <label>{{ $t('kyc.holder_name') }}</label>
                  <div :class="[$style.inputGroup]">
                    <div class="input-new-form">
                      <el-input
                        v-model="params.strNm"
                        :placeholder="$t('kyc.holder_name')"
                      ></el-input>
                    </div>
                  </div>
                </div>

                <div :class="[$style.formGroup]">
                  <label>{{ $t('kyc.birth') }}</label>
                  <div :class="[$style.inputGroup]">
                    <div class="input-new-form">
                      <el-input
                        v-model="params.strResId"
                        :placeholder="$t('kyc.birth')"
                      ></el-input>
                    </div>
                  </div>
                </div>
                <div :class="[$style.formGroup]">
                  <label>{{ $t('wallet.account_number') }}</label>
                  <div :class="[$style.inputGroup]">
                    <div class="input-new-form">
                      <el-input
                        v-model="params.strAccountNo"
                        :placeholder="$t('wallet.account_number')"
                        ><el-button
                          slot="append"
                          class="withdraw-address-btn"
                          @click="handleCreateWithdrawAddress"
                        >
                          {{ $t('myprofile.withdraw_auth') }}</el-button
                        ></el-input
                      >
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div :class="[$style.formGroup]">
                  <label>{{ $t('kyc.address') }}</label>
                  <div :class="[$style.inputGroup]">
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
                          {{ $t('my_page.auth_withdraw_address') }}</el-button
                        ></el-input
                      >
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
            class="offer-details payment-section"
          >
            <h4>{{ $t('wallet_page.withdraw_account_info') }}</h4>
            <p></p>
            <template
              v-if="c_selected_asset_withdraw_address.asset_code === 'KRW'"
            >
              <div :class="[$style.formGroup]">
                <label>{{ $t('wallet_page.holder_name') }}</label>

                <div :class="[$style.inputGroup]">
                  <el-input
                    :disabled="true"
                    :placeholder="c_selected_asset_withdraw_address.holder_name"
                  ></el-input>
                </div>
              </div>
              <div :class="[$style.formGroup]">
                <label>{{ $t('wallet_page.bank_name') }}</label>

                <div :class="[$style.inputGroup]">
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
              </div>
              <div :class="[$style.formGroup]">
                <label>{{ $t('wallet_page.withdraw_bank_address') }}</label>

                <div :class="[$style.inputGroup]">
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
              <div :class="[$style.formGroup]">
                <label>{{ $t('wallet_page.withdraw_address') }}</label>

                <div :class="[$style.inputGroup]">
                  <el-input
                    :disabled="true"
                    :placeholder="
                      c_selected_asset_withdraw_address.withdraw_address
                    "
                  >
                    <el-button
                      v-if="
                        c_selected_asset_withdraw_address.asset_code !== 'KRW'
                      "
                      slot="append"
                      class="withdraw-address-btn"
                      @click="handleDeleteWithdrawAddress"
                    >
                      {{ $t('kyc.delete_withdraw_address') }}</el-button
                    >
                  </el-input>
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
      <div :class="[$style.formGroup]">
        <h4>{{ $t('otp.authenticode') }}</h4>
        <div :class="[$style.inputGroup]">
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
          class="offer-details limitation-section add-address"
        >
          <div class="offer-extra-fields">
            <div :class="[$style.formGroup]">
              <label>{{ $t('wallet_page.qr_address') }}</label>
              <div :class="[$style.inputGroup]">
                <div class="deal-info">
                  {{ a_address.address }}
                  <el-button
                    v-clipboard:copy="a_address.address"
                    v-clipboard:success="onCopy"
                    class="address-copy-btn"
                    style="float:right;"
                    >{{ $t('copy') }}</el-button
                  >
                </div>
              </div>
              <Qrcode
                :value="a_address.address"
                size="200"
                style=" margin: 20px 0;text-align:center;"
              >
              </Qrcode>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <el-button type="primary" @click="handleCreateAddress"
          >{{ $t('wallet_page.create_qr_address') }}
        </el-button>
      </div>
    </template>

    <div class="text-right">
      <el-button
        v-if="modal_title === 'withdraw'"
        type="primary"
        @click="handleWithdraw"
        >{{ $t('apply') }}
      </el-button>
      <el-button
        v-if="modal_title === 'deposit' && c_selected_asset.plugin_seq === 0"
        type="primary"
        @click="handleDeposit"
        >{{ $t('apply') }}</el-button
      >
      <el-button @click="$emit('modal_close')">{{ $t('cancel') }}</el-button>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.inputGroup {
  padding-bottom: 20px;

  .fees {
    padding: 10px;
    background-color: #f4f4f4;
  }
}
</style>
