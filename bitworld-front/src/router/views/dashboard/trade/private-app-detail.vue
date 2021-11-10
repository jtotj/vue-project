<script>
import {
  fetchPrivateApplication,
  rejectPrivateApplication,
  confirmPrivateApplication,
  cancelPrivateApplication,
  payPrivateApplication,
} from '@apis/application'
import { fetchPrivateDeal } from '@apis/deal'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import Decimal from 'decimal.js'

export default {
  page: {
    title: 'PrivateAppDetail',
    meta: [{ name: 'description', content: 'PrivateAppDetail' }],
  },
  data() {
    return {
      info: null,
      fields: null,
      field_values: null,

      forms: null,
      deal_form: [],
      deal_field_values: [],
      deal_info: null,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
      ...mapState('auth', ['currentUser']),
    }),
  },
  mounted() {
    this.loadDetailApp().then(() => {
      this.loadDealDetail()
    })
  },
  methods: {
    fromPairs,
    date,
    async loadDetailApp() {
      const {
        application_info,
        forms,
        field_values,
      } = await fetchPrivateApplication(this.$route.params.seq).catch((e) =>
        this.$toasted.error(e.message)
      )
      this.info = application_info
      this.field_values = field_values
      this.forms = forms
    },
    async loadDealDetail() {
      const { forms, field_values, deal_info } = await fetchPrivateDeal(
        this.info.deal_seq
      ).catch((e) => this.$toasted.error(e.message))
      this.deal_field_values = field_values
      this.deal_form = forms
      this.deal_info = deal_info
    },
    handlePayed() {
      payPrivateApplication(this.info.seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.pay'))
          this.loadDetailApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleConfirm() {
      confirmPrivateApplication(this.info.seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.trade_confirm'))
          this.loadDetailApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleReject() {
      rejectPrivateApplication(this.info.seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.trade_reject'))
          this.loadDetailApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleCancel() {
      cancelPrivateApplication(this.info.seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'))
          this.loadDetailApp()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    Decimal,
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ $t('private.app_detail') }}</span>
      </div>
    </div>
    <div class="orders-wrap">
      <div class="container">
        <div v-if="info">
          <div class="offer-details limitation-section">
            <div class="offer-extra-fields">
              <div class="form-group">
                <label>{{ $t('private.market_name') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.market_title"
                  />
                </div>
              </div>
              <div
                v-if="deal_info.escrow_type !== 'DISABLE'"
                class="form-group"
              >
                <label>{{ $t('wallet_page.withdraw_bank_address') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.account_number || info.target_account_number"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.app_amount') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      info.source_amount | codeDecimal(info.source_asset_code)
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.app_deal_price') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.price | codeDecimal(info.target_asset_code)"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.app_fee_amount') }}</label>
                <div class="form-wrap">
                  <input class="text-label" readonly :value="info.fee_amount" />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('status') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      fromPairs(constants.market.private_application.status)[
                        info.status
                      ]
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('registration_date') }}</label>

                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="date('Y-m-d H:i:s', new Date(info.regdate))"
                  />
                </div>
              </div>
              <template
                v-if="
                  deal_info &&
                    ~['DEALER', 'DISABLE'].indexOf(deal_info.escrow_type)
                "
              >
                <template
                  v-if="info.status === 'PENDING' || info.status === 'PAYED'"
                >
                  <div v-for="form in deal_form" :key="form.seq">
                    <h4 class="detail-title">{{ form.title }}</h4>
                    <div
                      v-for="field in deal_field_values"
                      :key="field.seq"
                      class="form-group"
                    >
                      <template v-if="form.seq === field.form_seq">
                        <label>{{ field.title }}</label>

                        <div class="form-wrap">
                          <div class="text-label">
                            {{ field.value }}
                            {{ field.option_title }}
                            <template v-for="field_option in field.options">
                              {{ field_option.title }}
                            </template>
                          </div>
                        </div>
                        <span class="explanation"></span>
                      </template>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>{{
                      $t('wallet_page.deposit_request_amount')
                    }}</label>
                    <div class="form-wrap">
                      <div class="text-label">
                        {{ Decimal(info.source_amount).mul(info.price) }}
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <template
                v-if="deal_info && deal_info.escrow_type === 'APPLICANT'"
              >
                <template
                  v-if="info.status === 'PENDING' || info.status === 'PAYED'"
                >
                  <div v-for="form in forms" :key="form.seq">
                    <h4 class="detail-title">{{ form.title }}</h4>
                    <div
                      v-for="field in field_values"
                      :key="field.seq"
                      class="form-group"
                    >
                      <template v-if="form.seq === field.form_seq">
                        <label>{{ field.title }}</label>
                        <div class="form-wrap">
                          <div class="text-label">
                            {{ field.value }}
                            {{ field.option_title }}
                            <template v-for="field_option in field.options">
                              {{ field_option.title }}
                            </template>
                          </div>
                        </div>
                        <span class="explanation"></span>
                      </template>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group big-btn">
      <template
        v-if="
          deal_info && ~['DEALER', 'DISABLE'].indexOf(deal_info.escrow_type)
        "
      >
        <a
          v-if="info.status === 'PENDING'"
          class="btn btn-default btn-save-offer"
          style="display:inline-block;margin:0 10px"
          @click="handlePayed"
          >{{ $t('pay') }}</a
        >
        <a
          v-if="info.status === 'PENDING' || info.status === 'PAYED'"
          class="btn btn-default"
          style="margin:0 10px"
          @click="handleCancel"
          >{{ $t('cancel') }}</a
        >
      </template>
      <template v-if="deal_info && deal_info.escrow_type === 'APPLICANT'">
        <template v-if="$route.query.type === 'Deal'">
          <a
            v-if="info.status === 'PENDING'"
            class="btn btn-default btn-save-offer"
            style="display:inline-block;margin:0 10px"
            @click="handlePayed"
            >{{ $t('payed') }}
          </a>
          <a
            v-if="info.status === 'PENDING'"
            class="btn btn-default"
            style="margin:0 10px"
            @click="handleReject"
            >{{ '거부' }}
          </a>
        </template>
        <template v-else>
          <a
            v-if="info.status === 'PENDING' || info.status === 'PAYED'"
            class="btn btn-default btn-save-offer"
            style="display:inline-block; margin:0 10px"
            @click="handleConfirm"
            >{{ $t('confirm') }}</a
          >
          <a
            v-if="
              !(
                info.status === 'CANCELED' ||
                info.status === 'CONFIRMED' ||
                info.status === 'REJECTED'
              )
            "
            class="btn btn-default"
            style="margin:0 10px"
            @click="handleCancel"
            >{{ $t('cancel') }}</a
          >
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
