<template>
  <div v-loading="loading" class="kiosk-re-deal-detail">
    <div v-if="step === null" class="re-container detail-container">
      <!-- title -->
      <h2 class="detail-title" v-html="$t('kiosk_re.detail_tit')"></h2>
      <p class="detail-subtitle">
        {{ $t('kiosk_re.detail_sub') }}
      </p>
      <!-- info-box -->
      <template v-if="c_params">
        <div class="detail-info-box">
          <p class="detail-num">{{ `No. ${$route.query.no}` }}</p>
          <ul class="detail-list">
            <li class="detail-item">
              <div class="detail-left">{{ $t('kiosk_re.pur_assets') }}</div>
              <div class="detail-right">
                <span
                  class="asset-symbol"
                  :class="c_params.source_asset_code"
                ></span>
                <span>{{ c_params.source_asset_code }}</span>
              </div>
            </li>
            <li class="detail-item">
              <div class="detail-left">{{ $t('market_balance.quantity') }}</div>
              <div class="detail-right fw-bold">{{
                c_params.potential_source_amount
              }}</div>
            </li>
            <li class="detail-item">
              <div class="detail-left">{{ $t('kiosk_re.seller') }}</div>
              <div class="detail-right">{{ c_params.user_name }}</div>
            </li>
          </ul>
        </div>

        <div class="detail-info-scroll">
          <!-- Source account -->
          <div
            v-if="~['BOTH', 'DEALER'].indexOf(deal_info.escrow_type)"
            class="coin-acc-choice sec-con"
          >
            <div class="acc-choice-top">
              <h4
                ><span>{{ c_params.source_asset_code }}</span>
                {{ $t('kiosk_re.acc_receive') }}</h4
              >
              <router-link
                :to="{
                  name: 'kiosk-re-new-account',
                  params: { asset_code: c_params.source_asset_code },
                }"
              >
                <img src="@assets/kiosk-re-img/icon_newplus.svg" alt="" />
                {{ $t('kiosk_re.new_acc_tit_1') }}
              </router-link>
            </div>

            <el-button
              v-if="!params.account_seq"
              class="char-btn"
              type="text"
              @click="acc_app_dialog = true"
              >{{ $t('private.account_select') }}</el-button
            >
            <el-button
              v-else
              class="char-btn s-asset"
              type="text"
              @click="acc_app_dialog = true"
            >
              <div class="acc-info">
                <div class="acc row">
                  <p>{{ $t('b2c_exchange.account_number') }}</p>
                  <p>{{ c_s_source_account.account_number }}</p>
                </div>
                <div class="balan row">
                  <p>{{ $t('business.bank_account_change') }}</p>
                  <p>{{
                    `${c_s_source_account.balance} ${c_s_source_account.code}`
                  }}</p>
                </div>
              </div>
            </el-button>
            <el-dialog
              :title="$t('private.account_select')"
              :visible.sync="acc_app_dialog"
              class="acc-dialog"
            >
              <div class="acc-scroll">
                <div class="choice-acc-list">
                  <div
                    v-for="account in c_source_available_account"
                    :key="account.seq"
                    :class="[
                      'choice-acc-box',
                      { on: params.account_seq === account.seq },
                    ]"
                    @click="selectSourceAccount(account.seq)"
                  >
                    <div class="acc-info">
                      <div class="acc row">
                        <p>{{ $t('b2c_exchange.account_number') }}</p>
                        <p>{{ account.account_number }}</p>
                      </div>
                      <div class="balan row">
                        <p>{{ $t('business.bank_account_change') }}</p>
                        <p>{{ `${account.balance} ${account.code}` }}</p>
                      </div>
                    </div>
                    <span
                      class="
                        acc-chk-img
                        "
                    ></span>
                  </div>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="btn-cancel" @click="resetSourceParams">{{
                  $t('cancel')
                }}</el-button>
                <el-button
                  class="btn-comple"
                  type="primary"
                  @click="acc_app_dialog = false"
                  >{{ $t('kiosk_re.complete') }}</el-button
                >
              </span>
            </el-dialog>
          </div>

          <!-- Target account -->
          <div
            v-if="~['BOTH', 'APPLICANT'].indexOf(deal_info.escrow_type)"
            class="coin-acc-choice sec-con"
          >
            <div class="acc-choice-top">
              <h4
                ><span>{{ c_params.target_asset_code }}</span>
                {{ $t('transaction_detail.select_pay_account') }}</h4
              >
              <router-link
                :to="{
                  name: 'kiosk-re-charge',
                  params: { asset_code: c_params.target_asset_code },
                }"
              >
                <img src="@assets/kiosk-re-img/icon_newplus.svg" alt="" />
                {{ c_params.target_asset_code }}
                {{ $t('kiosk_re.charge_txt_5') }}
              </router-link>
            </div>
            <el-button
              v-if="!params.target_account_seq"
              class="char-btn"
              type="text"
              @click="acc_dialog = true"
              >{{ $t('private.account_select') }}</el-button
            >

            <el-button
              v-else
              class="char-btn s-asset"
              type="text"
              @click="acc_dialog = true"
            >
              <div class="acc-info">
                <div class="acc row">
                  <p>{{ $t('b2c_exchange.account_number') }}</p>
                  <p>{{ c_s_target_account.account_number }}</p>
                </div>
                <div class="balan row">
                  <p>{{ $t('business.bank_account_change') }}</p>
                  <p>{{
                    `${c_s_target_account.balance} ${c_s_target_account.code}`
                  }}</p>
                </div>
              </div>
            </el-button>
            <el-dialog
              :title="$t('private.account_select')"
              :visible.sync="acc_dialog"
              class="acc-dialog"
            >
              <div class="acc-scroll">
                <div class="choice-acc-list">
                  <div
                    v-for="account in c_target_available_account"
                    :key="account.seq"
                    :class="[
                      'choice-acc-box',
                      { on: params.target_account_seq === account.seq },
                    ]"
                    @click="selectTargetAccount(account.seq)"
                  >
                    <div class="acc-info">
                      <div class="acc row">
                        <p>{{ $t('b2c_exchange.account_number') }}</p>
                        <p>{{ account.account_number }}</p>
                      </div>
                      <div class="balan row">
                        <p>{{ $t('business.bank_account_change') }}</p>
                        <p>{{ `${account.balance} ${account.code}` }}</p>
                      </div>
                    </div>
                    <span
                      class="
                        acc-chk-img
                        "
                    ></span>
                  </div>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="btn-cancel" @click="resetTargetParams">{{
                  $t('cancel')
                }}</el-button>
                <el-button
                  class="btn-comple"
                  type="primary"
                  @click="acc_dialog = false"
                  >{{ $t('kiosk_re.complete') }}</el-button
                >
              </span>
            </el-dialog>
          </div>

          <!-- Target === KRW -->
          <div v-else class="seller-info-wrapper">
            <p class="seller-info-title">{{
              $t('kiosk_re.seller_acc_info')
            }}</p>
            <div
              v-for="deal_form in deal_forms"
              :key="deal_form.seq"
              class="limitation-section"
            >
              <!-- <h4>{{ deal_form.title }}</h4> -->
              <div class="offer-extra-fields">
                <div
                  v-for="deal_field in deal_field_values"
                  :key="deal_field.seq"
                  class="form-group"
                >
                  <template v-if="deal_form.seq === deal_field.form_seq">
                    <label>{{ deal_field.title }}</label>

                    <div class="form-wrap">
                      <p class="form-value-wrap">
                        <span class="text-label"
                          >{{
                            deal_field.value || deal_field.option_title
                          }}&nbsp;
                        </span>
                        <span
                          class="explanation"
                          v-html="deal_field.description"
                        ></span>
                      </p>

                      <template v-for="deal_field_option in deal_field.options">
                        <input
                          :key="deal_field_option.seq"
                          class="text-label"
                          readonly
                          :value="deal_field_option.title"
                        />
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <p v-if="0" class="krw-text">{{ $t('kiosk_re.krw_txt') }}</p>
          </div>

          <div
            v-for="form in forms"
            :key="form.seq"
            class="kiosk-detail-form-wrap"
          >
            <template>
              <h2 class="kiosk-detail-form-title">{{ form.title }}</h2>
              <div
                v-for="(field, idx) in form.fields"
                :key="field.seq"
                class="kiosk-kyc-form kiosk-select-box kiosk-detail-form"
              >
                <h2 class="kiosk-detail-field-title"
                  >{{ field.title }}
                  <strong v-if="field.is_required === 'Y'">*</strong></h2
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
                    popper-class="detail-form-popper"
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
                    class="form-file"
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
                <span v-html="field.description"></span>
              </div>
            </template>
          </div>
        </div>
        <!-- bottom -->
        <div class="bottom">
          <div class="total-charge">
            <h4>{{ $t('kiosk_re.total_payble') }}</h4>
            <p
              ><span>{{
                AssetCodeDecimal(
                  c_params.target_asset_code,
                  c_params.use_follow_direct_market === 'Y'
                    ? new Decimal(c_params.direct_market_basic_rate).mul(
                        c_params.spread_ratio
                      )
                    : c_params.min_price
                )
                  .mul(c_params.potential_source_amount)
                  .toString() | codeDecimal(c_params.target_asset_code)
              }}</span
              >{{ c_params.target_asset_code }}</p
            >
          </div>
          <div class="bot-btn-wrap">
            <a class="btn-prev bot-btn" @click="$router.go(-1)">{{
              $t('before')
            }}</a>
            <template
              v-if="
                ~['APPLICANT', 'DEALER', 'DISABLE'].indexOf(
                  deal_info.escrow_type
                )
              "
            >
              <button
                class="btn-next bot-btn"
                :disabled="loading"
                @click="createApplication"
              >
                {{ $t('kiosk_re.purch_reser') }}
              </button>
            </template>
            <button
              v-else
              class="btn-next bot-btn"
              :disabled="loading"
              @click="createApplication"
            >
              {{ $t('kiosk_re.buy') }}
            </button>
          </div>
        </div>
      </template>
    </div>
    <div v-else class="re-container">
      <div class="third-step">
        <div class="com-wrap">
          <img src="@assets/kiosk-re-img/icon_ok.svg" alt="" />
          <h4>{{ $t('kiosk_re.buy_suc') }}</h4>
          <p>{{ $t('kiosk_re.charge_txt_7') }}</p>
        </div>
        <div class="bot-btn-wrap">
          <router-link :to="{ name: 'kiosk-re-home' }" class="btn-next bot-btn">
            {{ $t('success') }}
          </router-link>
        </div>
      </div>
    </div>
    <!-- KRW 구매예약 모달 -->
    <el-dialog
      :title="$t('kiosk_re.krw_dialog_tit')"
      :visible.sync="krw_dialog"
      class="krw-dialog"
    >
      <div class="txt">
        <p>{{ $t('kiosk_re.krw_dialog_txt_1') }}</p>
        <p>{{ $t('kiosk_re.krw_dialog_txt_2') }}</p>
      </div>

      <!-- info -->
      <div v-if="deal_info" class="info-detail-wrap">
        <div class="detail-list">
          <div class="detail-no">
            {{ `No. ${$route.query.no}` }}
          </div>
          <div class="detail-item">
            <p class="detail-left">{{ $t('kiosk_re.pur_assets') }}</p>
            <div class="detail-code">
              <div
                :class="deal_info.source_asset_code"
                class="asset-symbol"
              ></div>
              <p class="detail-right fw-bold">{{
                deal_info.source_asset_code
              }}</p>
            </div>
          </div>
          <div class="detail-item">
            <p class="detail-left">{{ $t('market_balance.quantity') }}</p>
            <p class="detail-right fw-bold">{{
              `${deal_info.potential_source_amount} ${
                deal_info.source_asset_code
              }`
            }}</p>
          </div>
          <!-- //// -->
          <div v-for="deal_form in deal_forms" :key="deal_form.seq">
            <!-- <h4>{{ deal_form.title }}</h4> -->
            <div class="offer-extra-fields">
              <div
                v-for="deal_field in deal_field_values"
                :key="deal_field.seq"
                class="form-group"
              >
                <template v-if="deal_form.seq === deal_field.form_seq">
                  <label>{{ deal_field.title }}</label>

                  <div class="form-wrap">
                    <p class="form-value-wrap">
                      <span
                        v-if="deal_field.value.length !== 0"
                        class="text-label"
                        >{{ deal_field.value }}&nbsp;
                      </span>
                      <span
                        v-if="!deal_field.value"
                        class="explanation"
                        v-html="deal_field.description"
                      ></span>
                    </p>

                    <template v-for="deal_field_option in deal_field.options">
                      <input
                        :key="deal_field_option.seq"
                        class="text-label"
                        readonly
                        :value="deal_field_option.title"
                      />
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- //// -->
          <div class="detail-item">
            <p class="detail-left">{{ $t('kiosk_re.seller') }}</p>
            <p class="detail-right">{{ deal_info.user_name }}</p>
          </div>
          <div class="detail-item">
            <p class="detail-left">지불 금액</p>
            <p class="detail-right color-blue"
              >{{
                `${AssetCodeDecimal(
                  deal_info.target_asset_code,
                  deal_info.min_price
                )
                  .mul(deal_info.potential_source_amount)
                  .toString()}`
              }}
              {{ deal_info.target_asset_code }}</p
            >
          </div>
        </div>
      </div>

      <div class="buy-info">
        <p class="warning">{{ $t('kiosk_re.krw_dialog_txt_3') }}</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button class="btn-cancel" @click="krw_dialog = false">{{
          $t('cancel')
        }}</el-button>
        <el-button
          class="btn-comple"
          type="primary"
          @click="setPayPrivateApplication"
          >{{ $t('kiosk_re.buy_reserv') }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import { fetchPrivateDeal } from '@apis/deal'
import {
  createPrivateApplication,
  payPrivateApplication,
  confirmPrivateApplication,
} from '@apis/application'
import Decimal from 'decimal.js'
import { AssetCodeDecimal } from '@utils/asset-decimal'
import find from 'lodash/find'
import { fetchPrivateMarketForm } from '@apis/form'
import map from 'lodash/map'
import FormFieldFile from '@components/form-field-file'

export default {
  components: {
    FormFieldFile,
  },
  data() {
    return {
      loading: false,
      step: null,
      acc_app_dialog: false,
      acc_dialog: false,
      check_app_account: false,
      krw_dialog: false,
      deal_info: null,
      deal_forms: [],
      deal_field_values: [],
      params: {},
      krw_seq: null,

      forms: [],
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    c_params() {
      return this.deal_info
    },
    c_source_available_account() {
      return filter(this.accounts, {
        asset_code: this.deal_info.source_asset_code,
      })
    },
    c_target_available_account() {
      return filter(this.accounts, {
        asset_code: this.deal_info.target_asset_code,
      })
    },
    c_s_source_account() {
      if (!this.params.account_seq) return null
      return find(this.accounts, { seq: this.params.account_seq })
    },
    c_s_target_account() {
      if (!this.params.target_account_seq) return null
      return find(this.accounts, { seq: this.params.target_account_seq })
    },
  },
  mounted() {
    Promise.all([this.loadDealInfo()])
      .then(() => {
        this.loadApplicationForm()
      })
      .catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
  },
  methods: {
    async loadApplicationForm() {
      const { forms } = await fetchPrivateMarketForm({
        market_seq: this.deal_info.market_seq,
        target_type: 'MARKET_PRIVATE_APPLICATION',
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
    async createDealerApplication() {
      try {
        const { seq } = await createPrivateApplication({
          deal_seq: this.deal_info.seq,
          account_seq: this.params.account_seq,
          target_account_seq: 0,
          source_amount: this.deal_info.potential_source_amount,
          price: this.deal_info.min_price,
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
        this.krw_seq = seq
        this.krw_dialog = true
      } catch (e) {
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      }
    },
    async createApplication() {
      this.loading = true
      await createPrivateApplication({
        deal_seq: this.deal_info.seq,
        account_seq: this.params.account_seq,
        target_account_seq: this.params.target_account_seq,
        source_amount: this.deal_info.potential_source_amount,
        price: this.deal_info.min_price,
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
        .then(({ seq }) => {
          if (~['DEALER', 'DISABLE'].indexOf(this.deal_info.escrow_type)) {
            this.krw_seq = seq
            this.krw_dialog = true
          } else {
            this.step = 'complete'
            setTimeout(() => {
              this.$router.push({ name: 'kiosk-re-home' })
            }, 3000)
          }
        })
        .catch((e) => {
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    async setPayPrivateApplication() {
      try {
        await payPrivateApplication(this.krw_seq).then(() => {
          this.krw_dialog = false
          this.step = 'complete'
          setTimeout(() => {
            this.$router.push({ name: 'kiosk-re-home' })
          }, 3000)
        })
      } catch (e) {
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      }
    },
    setConfirmPrivateApplication() {
      confirmPrivateApplication(this.krw_seq)
        .then(() => {
          this.krw_dialog = false
          this.step = 'complete'
          setTimeout(() => {
            this.$router.push({ name: 'kiosk-re-home' })
          }, 3000)
        })
        .catch((e) => {
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        })
    },
    selectSourceAccount(account_seq) {
      if (this.params.account_seq === account_seq)
        return this.$set(this.params, 'account_seq', null)
      this.$set(this.params, 'account_seq', account_seq)
    },
    selectTargetAccount(target_account_seq) {
      if (this.params.target_account_seq === target_account_seq)
        return this.$set(this.params, 'target_account_seq', null)
      this.$set(this.params, 'target_account_seq', target_account_seq)
    },
    async loadDealInfo() {
      const { deal_info, forms, field_values } = await fetchPrivateDeal(
        this.$route.query.deal_seq
      )

      this.deal_info = deal_info
      this.deal_forms = forms
      this.deal_field_values = field_values
    },
    resetSourceParams() {
      this.params.account_seq = null
      this.acc_app_dialog = false
    },
    resetTargetParams() {
      this.params.target_account_seq = null
      this.acc_dialog = false
    },
    AssetCodeDecimal,
    Decimal,
  },
}
</script>
<style scoped>
.asset-symbol {
  display: inline-block;
  width: 52px;
  height: 52px;
  margin-right: 17px;
  background-repeat: no-repeat;
  background-size: cover;
}

.re-container {
  width: 980px;
  margin: 0 auto;
}

.detail-title {
  padding: 80px 0 14px;
  font-size: 46px;
  font-weight: 400;
  line-height: normal;
  color: #383838;
  text-align: center;
}

.strong {
  font-size: 46px;
  font-weight: 700;
  line-height: normal;
}

.detail-subtitle {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5;
  color: #757575;
  text-align: center;
}

.detail-info-box {
  padding: 50px;
  margin-top: 60px;
  background-color: #fff;
  border-radius: 20px;
}

.detail-info-box .detail-num {
  font-size: 32px;
  font-weight: 700;
  color: #363636;
}

.detail-info-scroll {
  height: 680px;
  margin-top: 40px;
  overflow-y: scroll;
}

.detail-info-box .detail-item {
  display: flex;
  margin-top: 30px;
}
.detail-info-box .detail-item .detail-left {
  min-width: 181px;
  font-size: 32px;
  color: #7e7e7e;
}
.detail-info-box .detail-item .detail-right {
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: 500;
  color: #363636;
}

.detail-info-box .detail-item .detail-right.fw-bold {
  font-weight: bold;
}

.acc-choice-top {
  display: flex;
  justify-content: space-between;
}

.acc-choice-top a {
  display: flex;
  align-items: center;
  margin: 60px 0 30px;
  font-size: 30px;
  font-weight: 500;
}

.acc-choice-top a img {
  margin-right: 12px;
}

/* form */
.seller-info-wrapper {
  margin-top: 50px;
}

.seller-info-wrapper .seller-info-title {
  font-size: 32px;
  font-weight: 700;
  color: #363636;
}
.seller-info-wrapper .limitation-section {
  width: 100%;
  padding: 40px;
  margin-top: 30px;
  background-color: #fff;
  border-radius: 20px;
}

.seller-info-wrapper .limitation-section .form-group {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.seller-info-wrapper .limitation-section .form-group:last-child {
  margin-bottom: 0;
}

.seller-info-wrapper .limitation-section label {
  font-size: 32px;
  color: #7e7e7e;
}

.seller-info-wrapper .limitation-section .form-group label {
  width: 200px;
}

.seller-info-wrapper span,
.seller-info-wrapper .limitation-section .text-label {
  height: auto;
  padding: 0;
  font-size: 32px;
  font-weight: 500;
  line-height: normal;
  color: #363636;
  border: none;
}

.seller-info-wrapper .limitation-section .explanation {
  color: #7e7e7e;
}
.re-kiosk .bot-btn-wrap .btn-next:disabled {
  background: #9a9a9a;
}
.form-value-wrap {
  display: flex;
  align-items: center;
}

.krw-text {
  margin-top: 60px;
  font-size: 32px;
  font-weight: 500;
  line-height: 36px;
  color: #ff3030;
  text-align: center;
}

/* modal */
.info-detail-wrap {
  padding: 0 80px;
}

.info-detail-wrap .detail-no {
  margin-bottom: 22px;
  font-size: 32px;
  font-weight: 700;
  color: #363636;
}

.info-detail-wrap .detail-item {
  display: flex;
  margin-bottom: 30px;
}

.info-detail-wrap .detail-left,
.info-detail-wrap .form-group label {
  width: 230px;
  font-size: 32px;
  line-height: normal;
  color: #7e7e7e;
}
.info-detail-wrap .detail-right {
  font-size: 32px;
  font-weight: 500;
  color: #363636;
}

.info-detail-wrap .detail-code {
  display: flex;
  align-items: center;
}

.info-detail-wrap .form-group {
  display: flex;
}

.info-detail-wrap .form-group .form-wrap .text-label,
.info-detail-wrap .form-group .form-wrap .explanation {
  padding: 0;
  font-size: 32px;
  font-weight: 500;
  line-height: normal;
  color: #363636;
  border: none;
}
</style>
