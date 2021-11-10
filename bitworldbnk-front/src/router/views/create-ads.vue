<script>
import { fetchPrivateDeal, createPrivateDeal } from '@apis/deal'
import { fetchPrivateMarkets } from '@apis/market'
import { createPrivateApplication } from '@apis/application'
import { fetchPrivateDealForm } from '@apis/form'
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
  page: {
    title: 'CreateAds',
    meta: [
      {
        name: 'description',
        content: 'CreateAds',
      },
    ],
  },
  components: { FormFieldFile },
  data() {
    return {
      btn_type: 'basic',
      offer_type: 'sell',
      change_on: null,
      change_array: [],
      reject_data: false,
      msg_confirm: false,
      add_phone: false,
      verify: false,
      not_receive: false,
      verification_code: '',
      my_phone_number: '',
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
      filter_account: [],
      find_asset: '',
      deal: '',
      deal_field_values: '',
      deal_forms: '',
      forms: [],
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
          this.$toasted.success(this.$t('toasted_msg.register'))
          this.$store.dispatch('account/getAccounts')
          this.$router.push({ name: 'private-deal' })
        })
        .catch((e) => (e ? this.$toasted.error(e.message) : null))
        .finally(() => {
          this.loading = false
          this.show_account = false
        })
    },
    createApplication() {
      createPrivateApplication({
        deal_seq: this.$route.params.deal_seq,
        account_seq: this.app_params.app_account,
        source_amount: this.app_params.app_amount,
        price: this.deal.min_price,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.register'))
          this.$store.dispatch('account/getAccounts')
          this.$router.push({ name: 'privateApplication' })
        })
        .catch((e) => (e ? this.$toasted.error(e.message) : null))
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
      const { deal_info, field_values, forms } = await fetchPrivateDeal(
        this.$route.params.deal_seq
      )
      this.deal = deal_info
      this.deal_field_values = field_values
      this.deal_forms = forms
    },
    init() {
      Promise.all([this.loadMarketList(), this.loadDeal()])
        .catch((e) => this.$toasted.error(e.message))
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
      this.loadPrivateDealForm().catch((e) => this.$toasted.error(e.message))
    },
    async loadPrivateDealForm() {
      const { forms } = await fetchPrivateDealForm({
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
  <div class="main">
    <div class="foreground-container">
      <div class="container">
        <div class="big-title-wrap">
          <div class="container">
            <span class="big-title">
              {{
                $route.params.offer_type === 'sell'
                  ? $t('private.deal_enroll')
                  : $t('private.app_enroll')
              }}
            </span>
          </div>
        </div>
        <div class="create-ads container">
          <div class="box-wrapper">
            <div class="create-body text-left">
              <div class="form-group offer_type">
                <div class="tabs">
                  <ul>
                    <li>
                      <router-link
                        :to="{
                          name: 'create-ads',
                          params: { offer_type: 'buy' },
                        }"
                      >
                        <span class="tab-text">{{ $t('buy') }}</span>
                      </router-link>
                    </li>
                    <li>
                      <router-link
                        :to="{
                          name: 'create-ads',
                          params: { offer_type: 'sell' },
                        }"
                      >
                        <span class="tab-text">{{ $t('sell') }}</span>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
              <form class="form">
                <div
                  v-if="$route.params.offer_type === 'sell'"
                  class="form-group coin-selector-wrapper"
                >
                  <label>{{ $t('private.select_market') }}</label>
                  <div class="col-sm-7">
                    <select
                      v-model="deal_params.market_seq"
                      class="form-control coin-selector"
                      @change="filterDealAccount"
                    >
                      <option value>({{ $t('select') }})</option>
                      <option
                        v-for="list in c_active_market"
                        :key="list.seq"
                        :value="list.seq"
                        >{{ list.title }}</option
                      >
                    </select>
                  </div>

                  <div v-if="c_deal_select_market" class="small-text">
                    {{ $t('private.fee_rate') }}:
                    {{ c_deal_select_market.deal_fee_rate }}%
                  </div>
                </div>
                <hr v-if="$route.params.offer_type === 'sell'" />
                <template v-if="$route.params.offer_type === 'sell'">
                  <div>
                    <div class="limitation-section">
                      <h3>{{ $t('private.deal_info_input') }}</h3>
                      <div class="offer-extra-fields">
                        <div class="form-group">
                          <label>{{ $t('private.deal_source_amount') }}</label>
                          <div class="form-wrap">
                            <input
                              v-model="deal_params.source_amount"
                              class="text-label"
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <label>
                            {{ $t('private.deal_source_min_amount') }}
                          </label>
                          <el-switch
                            v-model="deal_params.use_source_min_amount"
                            active-value="Y"
                            inactive-value="N"
                            style="margin-left: 5px;"
                          ></el-switch>

                          <div class="form-wrap">
                            <input
                              v-model="deal_params.source_min_amount"
                              class="text-label"
                              :disabled="
                                deal_params.use_source_min_amount === 'N'
                              "
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <label>{{ $t('private.deal_price') }}</label>

                          <div class="form-wrap">
                            <input
                              v-model="deal_params.min_price"
                              class="text-label"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div class="payment-section">
                    <h3>{{ $t('private.deal_enroll_account') }}</h3>
                    <div class="offer-extra-fields">
                      <div class="form-group payment_method">
                        <label>{{ $t('private.account_select') }}</label>
                        <div class="remi-colorized-field">
                          <select
                            v-model="deal_params.account_seq"
                            class="form-control coin-selector"
                          >
                            <template v-for="ac_list in filter_account">
                              <option :key="ac_list.seq" :value="ac_list.seq">
                                {{ ac_list.title }} :
                                {{ ac_list.account_number }}
                              </option>
                            </template>
                          </select>
                        </div>
                        <div v-if="c_deal_select_account" class="small-text">
                          {{ c_deal_select_account.asset_code }}잔액:
                          {{
                            Decimal(c_deal_select_account.balance).minus(
                              c_deal_select_account.holding_balance
                            ) | codeDecimal(c_deal_select_account.asset_code)
                          }}
                        </div>
                        <span class="explanation"></span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="form in forms"
                    :key="form.seq"
                    class="payment-section"
                  >
                    <h3>{{ form.title }}</h3>
                    <p v-html="form.description"></p>
                    <div class="offer-extra-fields">
                      <div
                        v-for="(field, idx) in form.fields"
                        :key="field.seq"
                        class="form-group"
                      >
                        <div
                          v-if="field.is_required === 'Y'"
                          class="required-img"
                          >*</div
                        >
                        <label>{{ field.title }}</label>

                        <div class="remi-colorized-field">
                          <template v-if="field.field_type === 'INPUT'">
                            <div class="form-wrap">
                              <input
                                v-model="form.field_values[idx].value"
                                :placeholder="field.placeholder"
                                class="text-label"
                              />
                            </div>
                          </template>
                          <template v-if="field.field_type === 'TEXTAREA'">
                            <div class="form-wrap">
                              <textarea
                                v-model="form.field_values[idx].value"
                                :placeholder="field.placeholder"
                                class="text-label"
                              ></textarea>
                            </div>
                          </template>
                          <template v-if="field.field_type === 'RADIO'">
                            <div
                              v-for="option in field.options"
                              :key="option.seq"
                              class="form-wrap"
                            >
                              <input
                                :id="`radio_${option.seq}`"
                                v-model="form.field_values[idx].option_seq"
                                :value="option.seq"
                                type="radio"
                                class="radio-label"
                              />
                              <label :for="`radio_${option.seq}`">
                                {{ option.title }}
                              </label>
                            </div>
                          </template>
                          <template v-if="field.field_type === 'SELECT'">
                            <select
                              v-model="form.field_values[idx].option_seq"
                              class="form-control coin-selector"
                            >
                              <template v-for="option in field.options">
                                <option :key="option.seq" :value="option.seq">{{
                                  option.title
                                }}</option>
                              </template>
                            </select>
                          </template>
                          <template v-if="field.field_type === 'CHECKBOX'">
                            <div
                              v-for="option in field.options"
                              :key="option.seq"
                              class="form-wrap"
                            >
                              <input
                                :id="`check_${option.seq}`"
                                v-model="form.field_values[idx].options"
                                :value="option.seq"
                                type="checkbox"
                                class="check-label"
                              />
                              <label :for="`check_${option.seq}`">
                                {{ option.title }}
                              </label>
                            </div>
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
                        </div>

                        <span class="explanation">{{ field.description }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group big-btn">
                    <a
                      class="btn btn-default btn-save-offer"
                      style="display:inline-block;"
                      @click="createDeal"
                      >{{ $t('Sale_registration') }}</a
                    >
                  </div>
                </template>
                <template
                  v-if="
                    $route.params.offer_type === 'buy' && $route.params.deal_seq
                  "
                >
                  <div class="limitation-section">
                    <h3>{{ $t('private.selected_deal_info') }}</h3>
                    <div class="offer-extra-fields">
                      <div class="form-group">
                        <label>{{
                          $t('private.deal_source_asset_title')
                        }}</label>

                        <div class="form-wrap">
                          <input
                            class="text-label"
                            readonly
                            :value="deal.source_asset_title"
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label>{{
                          $t('private.deal_total_source_amount')
                        }}</label>

                        <div class="form-wrap">
                          <input
                            class="text-label"
                            readonly
                            :value="
                              deal.source_amount
                                | codeDecimal(deal.source_asset_code)
                            "
                          />
                        </div>
                      </div>

                      <div class="form-group">
                        <label>{{ $t('private.deal_price') }}</label>

                        <div class="form-wrap">
                          <input
                            class="text-label"
                            readonly
                            :value="
                              deal.min_price
                                | codeDecimal(deal.target_asset_code)
                            "
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label>{{
                          $t('private.potential_source_amount')
                        }}</label>

                        <div class="form-wrap">
                          <input
                            class="text-label"
                            readonly
                            :value="
                              deal.potential_source_amount
                                | codeDecimal(deal.source_asset_code)
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-for="deal_form in deal_forms"
                    :key="deal_form.seq"
                    class="limitation-section"
                  >
                    <h4>{{ deal_form.title }}</h4>
                    <div class="offer-extra-fields">
                      <div
                        v-for="deal_field in deal_field_values"
                        :key="deal_field.seq"
                        class="form-group"
                      >
                        <template v-if="deal_form.seq === deal_field.form_seq">
                          <label>{{ deal_field.title }}</label>

                          <div class="form-wrap">
                            <input
                              v-if="deal_field.value.length !== 0"
                              class="text-label"
                              readonly
                              :value="deal_field.value"
                            />
                            <template
                              v-for="deal_field_option in deal_field.options"
                            >
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

                  <div class="limitation-section">
                    <h3>{{ $t('private.app_info_input') }}</h3>
                    <div class="offer-extra-fields">
                      <div class="form-group">
                        <label>{{ $t('private.app_amount') }}</label>

                        <div class="form-wrap">
                          <input
                            v-model="app_params.app_amount"
                            class="text-label"
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label>{{ $t('private.app_deal_price') }}</label>

                        <div class="form-wrap" style="margin-bottom:5px;">
                          <input
                            class="text-label"
                            readonly
                            :value="
                              deal.min_price
                                | codeDecimal(deal.target_asset_code)
                            "
                          />
                        </div>
                        <span class="add-balance">
                          {{ $t('retention') }} {{ deal.target_asset_code }}:
                          {{
                            c_add_balance | codeDecimal(deal.target_asset_code)
                          }}
                        </span>
                      </div>
                      <div class="form-group">
                        <label>{{ $t('private.pay_target_amount') }}</label>

                        <div class="form-wrap">
                          <input
                            v-model="c_target_amount"
                            class="text-label"
                            disabled
                          />
                        </div>
                        <template v-if="c_deal_buy_market_info">
                          <p class="fee">
                            {{ $t('private.fee') }}:
                            {{ c_deal_buy_market_info.fee_rate }}%
                          </p>
                          <p class="fee">
                            {{ $t('private.fee_calc') }}:
                            {{
                              $t('private.msg_fee_calc', [c_market_fee_calc])
                            }}
                          </p>
                        </template>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div class="payment-section">
                    <h3>{{ $t('private.app_account') }}</h3>
                    <div class="offer-extra-fields">
                      <div class="form-group payment_method">
                        <label>{{ $t('private.app_receive_account') }}</label>

                        <div class="remi-colorized-field">
                          <select
                            v-model="app_params.app_account"
                            class="form-control coin-selector"
                          >
                            <template v-for="ac_list in c_filter_app_account">
                              <option :key="ac_list.seq" :value="ac_list.seq">
                                {{ ac_list.title }} :
                                {{ ac_list.account_number }}
                              </option>
                            </template>
                          </select>
                        </div>

                        <span class="explanation"></span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group big-btn">
                    <a
                      class="btn btn-default btn-save-offer"
                      style="display:inline-block;"
                      @click="createApplication"
                      >{{ $t('private.app_enroll') }}</a
                    >
                  </div>
                </template>
                <template v-else-if="$route.params.offer_type === 'buy'">
                  <div class="limitation-section">
                    <div class="select-asset-buy">
                      <div class="img-wrap">
                        <img src="@assets/img/please-select-icon.png" />
                      </div>
                      <p>{{ $t('private.c2c_buy_select_asset') }}</p>
                    </div>
                  </div>
                  <div class="form-group big-btn">
                    <router-link
                      :to="{ name: 'home' }"
                      class="btn btn-default btn-save-offer"
                      >{{ $t('private.go_home') }}</router-link
                    >
                  </div>
                </template>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
