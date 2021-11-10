<script>
import '@assets/css/kiosk/kiosk-withdrawal.css'
import '@assets/css/kiosk/kiosk-certified.css'

import { fetchPrivateDeal, createPrivateDeal } from '@apis/deal'
import { fetchPrivateMarkets } from '@apis/market'
import { createPrivateApplication } from '@apis/application'
import { fetchPrivateMarketForm } from '@apis/form'
import { mapState } from 'vuex'
import FormFieldFile from '@components/form-field-file'
import find from 'lodash/find'
import filter from 'lodash/filter'
import sumBy from 'lodash/sumBy'
import fromPairs from 'lodash/fromPairs'
import map from 'lodash/map'
import assetDecimal from '@utils/asset-decimal'
import Decimal from 'decimal.js'

export default {
  components: { FormFieldFile },
  props: {
    deal_seq: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      market_list: [],
      deal_params: {
        market_seq: this.$route.query.market_seq || '',
        account_seq: '',
        source_amount: '',
        use_source_min_amount: 'N',
        source_min_amount: '',
        use_source_max_amount: 'N',
        source_max_amount: '',
        use_min_price: 'Y',
        min_price: '',
        use_max_price: 'N',
        max_price: '',
      },
      app_params: {
        app_account: '',
        app_amount: '',
        app_price: '',
      },
      step: null,
      filter_account: [],
      find_asset: '',
      deal: '',
      deal_field_values: '',
      deal_forms: '',
      forms: [],

      error_message: null,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_filter_app_account() {
      return filter(this.accounts, {
        asset_code: this.deal.source_asset_code,
      })
    },
    c_active_market() {
      return filter(this.market_list, { is_active: 'Y' })
    },
    c_selected_wallet() {
      return filter(this.accounts, { asset_code: this.deal.target_asset_code })
    },
    c_add_balance() {
      return sumBy(this.c_selected_wallet, (data) =>
        Number(data.balance)
      ).toFixed(8)
    },
    c_target_asset_seq() {
      return find(this.assets, { code: this.deal.target_asset_code })
    },
    c_target_amount() {
      if (!this.app_params.app_amount) return null

      return assetDecimal(this.c_target_asset_seq.seq, this.deal.min_price)
        .mul(this.app_params.app_amount)
        .toString()
    },
    c_deal_select_market() {
      return find(this.c_active_market, { seq: this.deal_params.market_seq })
    },
    c_deal_select_account() {
      return find(this.accounts, { seq: this.deal_params.account_seq })
    },
    c_market_fee_calc() {
      return this.c_target_amount * (this.c_deal_buy_market_info.fee_rate / 100)
    },
    c_deal_buy_market_info() {
      return find(this.c_active_market, { seq: this.deal.market_seq })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    fromPairs,
    createDeal() {
      createPrivateDeal({
        ...this.deal_params,
        field_values: map(
          [].concat(...map(this.forms, (form) => form.field_values)),
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
          this.$store.dispatch('account/getAccounts')
          this.$emit('logout_event')
        })
        .catch((e) => {
          this.step = 'fail'
          this.error_message = e.message
        })
        .finally(() => {
          this.loading = false
        })
    },
    createApplication() {
      createPrivateApplication({
        deal_seq: this.deal_seq,
        account_seq: this.app_params.app_account,
        source_amount: this.app_params.app_amount,
        price: this.deal.min_price,
      })
        .then(() => {
          this.step = 'success'
          this.$store.dispatch('account/getAccounts')
          this.$emit('logout_event')
        })
        .catch((e) => {
          this.step = 'fail'
          this.error_message = e.message
        })
        .finally(() => {
          this.loading = false
          this.show_account = false
        })
    },
    async loadMarketList() {
      const { data } = await fetchPrivateMarkets()
      this.market_list = data
    },
    async loadDeal() {
      if (this.deal_seq) {
        const { deal_info, field_values, forms } = await fetchPrivateDeal(
          this.deal_seq
        )
        this.deal = deal_info
        this.deal_field_values = field_values
        this.deal_forms = forms
      }
    },
    init() {
      Promise.all([this.loadMarketList(), this.loadDeal()])
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        .finally(() => {
          this.loading = false
        })
    },
    filterDealAccount() {
      if (this.deal_params.market_seq !== null)
        this.find_asset = find(this.c_active_market, {
          seq: this.deal_params.market_seq,
        })
      this.filter_account = filter(this.accounts, {
        asset_seq: this.find_asset.source_asset_seq,
      })
      this.loadPrivateDealForm().catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
    },
    async loadPrivateDealForm() {
      const { forms } = await fetchPrivateMarketForm({
        market_seq: this.deal_params.market_seq,
        target_type: 'MARKET_PRIVATE_DEAL',
      })

      this.forms = map(forms, (form) => ({
        ...form,
        field_values: map(form.fields, (field) => ({
          field_seq: field.seq,
          value: '',
          option_seq: null,
          options: [],
        })),
      }))
    },
    Decimal,
  },
}
</script>

<template>
  <div :class="$style.kioskWithdrawal" class="kiosk-withdrawal">
    <div :class="$style.container">
      <template v-if="step === null && !deal_seq">
        <PerfectScrollbar
          :class="$style.perfectScrollbar"
          class="c2c-scrollbar"
        >
          <div :class="$style.withdrawalAccount" class="kiosk-select-box">
            <h2>
              {{ $t('kiosk.select_market') }}
            </h2>
            <el-select
              v-model="deal_params.market_seq"
              class="user-info"
              @change="filterDealAccount"
            >
              <el-option
                v-for="list in c_active_market"
                :key="list.seq"
                :value="list.seq"
                :label="list.title"
              >
              </el-option>
            </el-select>
            <ul v-if="c_deal_select_market">
              <li>
                <span>{{ $t('kiosk.reduction_rate') }}</span>
                <ul>
                  <li>{{ c_deal_select_market.deal_fee_rate }}%</li>
                </ul>
              </li>
            </ul>
          </div>
          <div :class="$style.transferAccount2" class="kiosk-select-box">
            <h2>{{ $t('kiosk.sales_quantity') }}</h2>
            <el-input v-model="deal_params.source_amount"></el-input>
          </div>
          <div :class="$style.transferAccount2" class="kiosk-select-box">
            <h2>{{ $t('kiosk.minimum_purchase_quantity') }}</h2>
            <el-switch
              v-model="deal_params.use_source_min_amount"
              active-value="Y"
              inactive-value="N"
              style="margin-left: 5px;"
            ></el-switch>
            <el-input
              v-model="deal_params.source_min_amount"
              class="switch-input"
              :disabled="deal_params.use_source_min_amount === 'N'"
            ></el-input>
          </div>
          <!-- 이체 계좌 확인 후 계좌 회원 명 확인 란 -->
          <div :class="$style.transferQuantity" class="kiosk-select-box num">
            <h2>{{ $t('kiosk.selling_price_per_piece') }}</h2>

            <el-input v-model="deal_params.min_price"></el-input>
          </div>
          <div :class="$style.transferQuantity" class="kiosk-select-box num">
            <h2>{{ $t('kiosk.account_for_registration_of_sales') }}</h2>
            <el-select v-model="deal_params.account_seq" class="user-info">
              <el-option
                v-for="account in filter_account"
                :key="account.seq"
                :value="account.seq"
                :label="account.title || account.account_number"
              >
              </el-option>
            </el-select>
          </div>

          <div :class="$style.kioskKyc">
            <template v-for="form in forms">
              <div
                v-for="(field, idx) in form.fields"
                :key="field.seq"
                class="kiosk-kyc-form kiosk-select-box"
              >
                <h2
                  >{{ field.title }}
                  <strong
                    v-if="field.is_required === 'Y'"
                    :class="$style.required"
                    >*</strong
                  ></h2
                >
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
                    class="form-control"
                  ></textarea>
                </template>
                <template v-if="field.field_type === 'RADIO'">
                  <template v-for="option in field.options">
                    <el-radio
                      :key="option.seq"
                      v-model="form.field_values[idx].option_seq"
                      :label="option.seq"
                      >{{ option.title }}</el-radio
                    >
                  </template>
                </template>
                <template v-if="field.field_type === 'SELECT'">
                  <el-select
                    v-model="form.field_values[idx].option_seq"
                    :clearable="field.is_required !== 'Y'"
                    :placeholder="
                      field.placeholder.length
                        ? field.placeholder
                        : $t('kiosk.no_choice')
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
                    :class="$style.formFIle"
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
                <span
                  :class="$style.explanation"
                  v-html="field.description"
                ></span>
              </div>
            </template>
          </div>
          <div class="transfer">
            <el-button @click="createDeal">{{ $t('enrollment') }}</el-button>
          </div>
        </PerfectScrollbar>
      </template>
      <template v-else-if="step === null && deal_seq">
        <div
          :class="$style.perfectScrollbar"
          class="c2c-scrollbar"
          style="

height: 1600px;
    overflow: auto;"
        >
          <div :class="$style.withdrawalAccount" class="kiosk-select-box">
            <h2>{{ $t('kiosk.purchase_assets') }}</h2>
            <el-input :value="deal.source_asset_title" disabled></el-input>
          </div>

          <div :class="$style.withdrawalAccount" class="kiosk-select-box">
            <h2>{{ $t('kiosk.minimum_purchase_quantity') }}</h2>
            <el-input :value="deal.source_min_amount" disabled></el-input>
          </div>
          <!-- 이체 계좌 확인 후 계좌 회원 명 확인 란 -->
          <div :class="$style.withdrawalAccount" class="kiosk-select-box num">
            <h2>{{ $t('kiosk.available_quantity') }}</h2>
            <el-input
              :value="
                deal.potential_source_amount
                  | codeDecimal(deal.source_asset_code)
              "
              disabled
            ></el-input>
          </div>

          <div :class="$style.kioskKyc">
            <div v-for="form in deal_forms" :key="form.seq">
              <div
                v-for="field in deal_field_values"
                :key="field.seq"
                class="kiosk-kyc-form kiosk-select-box"
              >
                <template v-if="form.seq === field.form_seq">
                  <h2>{{ field.title }} </h2>
                  <template>
                    <el-input :value="field.value" disabled></el-input>
                    <span
                      :class="$style.explanation"
                      v-html="field.description"
                    ></span>
                  </template>
                  <template v-for="option in field.options">
                    <el-input
                      :key="option.seq"
                      :value="option.title"
                    ></el-input>
                  </template>
                </template>
              </div>
            </div>
          </div>
          <div :class="$style.withdrawalAccount" class="kiosk-select-box num">
            <h2>{{ $t('kiosk.purchase_quantity') }}</h2>
            <el-input v-model="app_params.app_amount"></el-input>
          </div>
          <div :class="$style.withdrawalAccount" class="kiosk-select-box num">
            <h2>{{ $t('kiosk.price_per_piece') }}</h2>
            <el-input
              :value="deal.min_price | codeDecimal(deal.target_asset_code)"
              disabled
            ></el-input>
            <ul>
              <li>
                <span>{{ $t('retention') }} {{ deal.target_asset_code }}:</span>
                <ul>
                  <li>{{
                    c_add_balance | codeDecimal(deal.target_asset_code)
                  }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div :class="$style.withdrawalAccount" class="kiosk-select-box num">
            <h2>{{ $t('kiosk.quantity_to_be_paid') }}</h2>
            <el-input :value="c_target_amount" disabled></el-input>
            <ul v-if="c_deal_buy_market_info">
              <li>
                <span>{{ $t('private.fee') }}:</span>
                <ul>
                  <li>{{ c_deal_buy_market_info.fee_rate }}%</li>
                </ul>
              </li>
              <li>
                <span> {{ $t('private.fee_calc') }}:</span>
                <ul>
                  <li>{{ $t('private.msg_fee_calc', [c_market_fee_calc]) }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div :class="$style.withdrawalAccount" class="kiosk-select-box">
            <h2>{{ $t('kiosk.select_account_to_receive') }}</h2>
            <el-select
              v-model="app_params.app_account"
              class="user-info"
              @change="filterDealAccount"
            >
              <el-option
                v-for="list in c_filter_app_account"
                :key="list.seq"
                :value="list.seq"
                :label="list.title || list.account_number"
              >
              </el-option>
            </el-select>
          </div>
          <div class="transfer">
            <el-button @click="createApplication">{{
              $t('enrollment')
            }}</el-button>
          </div>
        </div>
      </template>
    </div>

    <!-- 출금 계좌 입력 후 이체 완료 시 로딩 페이지 -->
    <div v-if="step === 'success'" :class="$style.withdrawalSuccess">
      <img src="@assets/kiosk-img/icon-success.svg" alt="login success" />
      <p>{{ $t('kiosk.registration_was_successful') }}</p>
      <div class="kiosk-select-box">
        <el-button class="home-btn" @click="$emit('close_drawer')">
          {{ $t('kiosk.go_to_first') }}
        </el-button>
      </div>
    </div>

    <!-- 출금 계좌 입력 후 이체 살패 시 로딩 페이지 -->
    <div v-if="step === 'fail'" :class="$style.withdrawalFail">
      <img src="@assets/kiosk-img/icon-fail.svg" alt="login fail" />
      <p>{{ $t('kiosk.registration_failed') }}</p>
      <p>{{ error_message }}</p>
      <div class="kiosk-select-box">
        <el-button class="prev-btn" @click="step = null">{{
          $t('kiosk.previous')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-withdrawal.scss';
@import '@src/design/kiosk/kiosk-certified.scss';

.explanation {
  font-size: 35px;
  font-style: normal;
  line-height: normal;
  color: #0068c1;
}
</style>
