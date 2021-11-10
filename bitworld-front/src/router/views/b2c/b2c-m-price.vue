<script>
import coinHeader from '@components/b2c/b2c-m-coin-header'
import { fetchPublicTradeList } from '@apis/market'
import { mapGetters } from 'vuex'
import Decimal from 'decimal.js'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'exchange-price',
    meta: [{ name: 'description', content: 'exchange-price' }],
  },
  components: { coinHeader },
  data() {
    return {
      input: '',
      value1: '',
      value2: '',
      value3: 0,
      num: 1,
      trades: [],
    }
  },
  computed: {
    ...mapGetters('marketPublic', [
      's_market_info',
      'target_assets',
      's_open_orders',
    ]),
    ...mapGetters('auth', ['loggedIn']),
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([this.loadTradeList()]).catch((e) =>
        this.$toasted.error(e.message)
      )
    },
    handleClick(tab, event) {},
    tabClick(tab, event) {},
    Decimal,
    date,
    async loadTradeList() {
      if (!this.loggedIn) return

      const { data } = await fetchPublicTradeList({
        market_seq: this.s_market_info.seq,
      })

      this.trades = data
    },
  },
}
</script>

<template>
  <div :id="$style.mobile" :class="$style.mobilePrice" class="mobilePrice">
    <div>
      <coinHeader />
      <div :class="[$style.conclusion]">
        <table :class="[$style.conclusionTable]">
          <colgroup>
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>
          <thead>
            <tr>
              <th>{{ $t('b2c_exchange.execution_time') }}</th>
              <th
                >{{ $t('b2c_exchange.execution_price') }}({{
                  s_market_info.target_asset_code
                }})</th
              >
              <th
                >{{ $t('b2c_exchange.execution_quantity') }}({{
                  s_market_info.source_asset_title
                }})</th
              >
              <th
                >{{ $t('b2c_exchange.execution_amount') }}({{
                  s_market_info.target_asset_code
                }})</th
              >
            </tr>
          </thead>
        </table>
        <PerfectScrollbar :class="[$style.perfectScrollbar]">
          <table :class="[$style.conclusionTable]">
            <colgroup>
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
            </colgroup>
            <tbody>
              <tr v-for="trade in trades" :key="trade.seq">
                <td>{{ date('Y.m.d H:i:s', new Date(trade.regdate)) }}</td>
                <td :class="[$style.up]">{{
                  trade.price | trimDecimalZero | numberFormat
                }}</td>
                <td :class="[$style.up]">{{
                  trade.amount | trimDecimalZero | numberFormat
                }}</td>
                <td>{{
                  new Decimal(trade.price).mul(trade.amount).toString()
                    | trimDecimalZero
                    | numberFormat
                }}</td>
              </tr>
            </tbody>
          </table>
        </PerfectScrollbar>
      </div>
      <!-- //체결 -->
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/b2c-m-exchange.scss';
@import '@src/design/b2c/common.scss';
</style>
