<script>
import { fetchFinanceFund } from '@apis/finance'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import find from 'lodash/find'

export default {
  data() {
    return {
      info: null,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('assets', ['assets']),
    cs_execute_asset_info() {
      if (!this.info) return null
      return find(this.assets, { seq: this.info.execute_asset_seq })
    },
  },
  mounted() {
    this.loadFund()
  },
  methods: {
    fromPairs,
    date,
    async loadFund() {
      const { fund_info } = await fetchFinanceFund(this.$route.query.fund_seq)
      this.info = fund_info
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          금융자금상세
        </h2>
      </div>
      <div class="ordersWrap">
        <div v-if="info">
          <div class="offer-details limitation-section">
            <div class="offer-extra-fields">
              <div class="form-group">
                <label>{{ '금융상품유형' }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      fromPairs(constants.finance.fund.instrument_type)[
                        info.instrument_type
                      ]
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ '금융상품명' }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.instrument_title"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ '실행자산' }}</label>
                <div v-if="cs_execute_asset_info" class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="cs_execute_asset_info.code"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ '실행금액' }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.execute_amount"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ '실행계좌번호' }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.execute_account_number"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ '실행 시작일' }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="date('Y-m-d H:i:s', new Date(info.execute_start))"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ '만기일' }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="date('Y-m-d H:i:s', new Date(info.execute_end))"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ '등록일' }}</label>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
