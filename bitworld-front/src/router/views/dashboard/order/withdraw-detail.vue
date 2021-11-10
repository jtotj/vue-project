<script>
import OrderNav from '@components/OrderNav'
import { fetchWithdraw } from '@apis/withdraw'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'Withdraw-detail',
    meta: [
      {
        name: 'description',
        content: 'Withdraw-detail',
      },
    ],
  },
  components: {
    OrderNav,
  },
  data() {
    return {
      info: null,
      fields: null,
      forms: null,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  mounted() {
    this.loadWithdraw()
  },
  methods: {
    fromPairs,
    date,
    async loadWithdraw() {
      const { withdraw_info, field_values, forms } = await fetchWithdraw(
        this.$route.query.seq
      )
      this.info = withdraw_info
      this.fields = field_values
      this.forms = forms
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{
          $t('wallet_page.withdraw_apply_detail')
        }}</span>
      </div>
    </div>
    <div class="orders-wrap">
      <div class="container">
        <OrderNav></OrderNav>
        <div v-if="info">
          <div class="offer-details limitation-section">
            <div class="offer-extra-fields">
              <div class="form-group">
                <label>{{ $t('wallet_page.asset_title') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.asset_title"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('wallet_page.request_amount') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.request_amount | codeDecimal(info.asset_code)"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('status') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="fromPairs(constants.withdraw.status)[info.status]"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.transfer_regdate') }}</label>

                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="date('Y-m-d H:i:s', new Date(info.regdate))"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="form in forms"
            :key="form.seq"
            class="offer-details limitation-section"
          >
            <h4>{{ form.title }}</h4>
            <div class="offer-extra-fields">
              <template v-for="field in fields">
                <div
                  v-if="form.seq === field.form_seq"
                  :key="field.seq"
                  class="form-group"
                >
                  <label>{{ field.title }}</label>
                  <div class="form-wrap">
                    <input
                      v-if="field.value.length !== 0"
                      class="text-label"
                      readonly
                      :value="field.value"
                    />
                    <template v-for="field_option in field.options">
                      <input
                        :key="field_option.seq"
                        class="text-label"
                        readonly
                        :value="field_option.title"
                      />
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
