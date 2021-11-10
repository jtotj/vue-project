<script>
import Qrcode from 'qrcode.vue'
import map from 'lodash/map'
import find from 'lodash/find'
import { createAddress, fetchAddressList } from '@apis/address'
import { fetchOtpConfig } from '@apis/config'
import { fetchAssetForm } from '@apis/form'
import { createDeposit } from '@apis/deposit'
import FormFieldFile from '@components/form-field-file'
import { mapState } from 'vuex'

export default {
  components: {
    Qrcode,
    FormFieldFile,
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
      account: [],
      asset_add_forms: [],
      show_qr: null,
      request_input_amount: null,

      s_usdt_network: 'AUTO',
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),

    c_selected_asset() {
      if (this.asset_seq !== 0) {
        return find(this.assets, {
          seq: this.asset_seq,
        })
      } else {
        return null
      }
    },
  },
  watch: {
    // asset가 변경되면
    asset_seq() {
      this.loadDepositForm()
    },
  },
  mounted() {
    Promise.all([
      this.loadOtpConfig(),
      this.loadDepositForm(),
      this.loadAddressList(),
    ]).catch((e) => this.$toasted.error(e.message))
  },

  methods: {
    async loadDepositForm() {
      const { forms } = await fetchAssetForm({
        asset_seq: this.asset_seq,
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
    async loadOtpConfig() {
      const { config } = await fetchOtpConfig().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.otp_config = config
    },
    handleCreateAddress() {
      createAddress({
        account_seq: this.account_seq,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.create_account'))
          this.loadAddressList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    qrCopyOn() {
      this.$copyText('cocofxinfo').then(
        this.$toasted.success(this.$t('toasted_msg.copy'))
      )
    },
    onCopy(data) {
      this.$copyText(data).then(
        this.$toasted.success(this.$t('toasted_msg.copy'))
      )
    },
    async loadAddressList() {
      const { data } = await fetchAddressList({
        is_valid: 'Y',
        list_count: 1,
        account_seq: this.account_seq,
      }).catch((e) => this.$toasted.error(e.message))
      this.account = data
    },
    handleDeposit() {
      createDeposit({
        account_seq: this.account_seq,
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
          this.deposit_inquiry_modal = false
          this.$router.push({
            name: 'Deposit',
          })
        })
        .catch((e) => this.$toasted.error(e.message))
    },
  },
}
</script>

<template>
  <div :class="[$style.depositForm]">
    <div :class="[$style.formGroup]">
      <!-- 입금 자산플러그인이 0일 때 -->
      <template v-if="c_selected_asset.code === 'USDT'">
        <div :class="[$style.networkSelect]">
          <label for="formControl">{{ $t('s_usdt_protocol') }}</label>
          <el-select v-model="s_usdt_network">
            <el-option
              value="AUTO"
              :label="`ERC20 (${$t('auto')})`"
            ></el-option>
            <el-option
              value="MANUAL"
              :label="`OMNI, TRON (${$t('manual')})`"
            ></el-option>
          </el-select>
        </div>
      </template>
      <template
        v-if="
          c_selected_asset.plugin_seq === 0 ||
            c_selected_asset.plugin === 'krw' ||
            s_usdt_network === 'MANUAL'
        "
      >
        <div :class="[$style.formGroup]">
          <div :class="[$style.inputGroup]">
            <label for="formControl">{{
              $t('wallet_page.deposit_request_amount')
            }}</label>
            <input
              id="formControl"
              v-model="request_input_amount"
              :class="[$style.formControl]"
            />
          </div>
        </div>
        <div
          v-for="form in asset_add_forms"
          :key="form.seq"
          class="offer-details"
        >
          <label class="form-label">{{ form.title }}</label>
          <p class="bg-grey" v-html="form.description"></p>
          <div class="offer-extra-fields">
            <div
              v-for="(field, idx) in form.fields"
              :key="field.seq"
              class="form-group"
            >
              <div v-if="field.is_required === 'Y'" class="required-img"></div>
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
        <div :class="[$style.btnWrap]">
          <button :class="[$style.applyBtn]" @click="handleDeposit">{{
            $t('apply')
          }}</button>
        </div>
      </template>

      <!-- 입금 자산플러그인이 있을 때 QR코드 -->
      <template v-else-if="c_selected_asset.plugin !== 'eos'">
        <div v-if="account.length" :class="[$style.qrcode]">
          <div
            v-for="a_address in account"
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
        </div>
        <div v-else>
          <el-button @click="handleCreateAddress">{{
            $t('wallet_page.create_qr_address')
          }}</el-button>
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
                v-for="a_address in account"
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
                      $t('wallet_page.deposit_step_1_2', [
                        c_selected_asset.code,
                      ])
                    }}
                  </p>
                  <el-checkbox
                    v-if="account.length !== 0"
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
                    v-if="account.length !== 0"
                    :class="[$style.onCopy]"
                    @click.prevent.stop="onCopy(account[0].address)"
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
                v-for="a_address in account"
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
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/deposit-form.scss';
</style>
