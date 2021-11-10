<script>
import '@src/assets/css/xeicon/xeicon.css'
import { mapGetters, mapState } from 'vuex'
import coinHeader from '@components/b2c/b2c-m-coin-header'
import PublicMarketChart from '@components/public-market-chart'
import TVChartContainer from '@components/TVChartContainer'
import filter from 'lodash/filter'
import { fetchPublicAggtrades, fetchPublicOrderbooks } from '@apis/market'
import { encodeRoomName } from '@utils/socket'
import Cookies from 'js-cookie'
import { CIQ } from '@/vendor/chartiq/js/chartiq.js'

export default {
  page: {
    title: 'exchange-chart',
    meta: [{ name: 'description', content: 'exchange-chart' }],
  },
  components: { coinHeader, PublicMarketChart, TVChartContainer },
  data() {
    return {
      input: '',
      num: 1,
      order_params: {},
      order_loading: false,
      aggtrades: [],
      orderbooks: null,
      s_chart: Cookies.get('c_chart') ? Cookies.get('c_chart') : 'tradingView',
      update: [],
      /* 보조지표 */
      interval_type: '30M',
      interval_types: [
        { period: 1, timeUnit: 'minute', title: '1M' },
        { period: 3, timeUnit: 'minute', title: '3M' },
        { period: 5, timeUnit: 'minute', title: '5M' },
        { period: 15, timeUnit: 'minute', title: '15M' },
        { period: 30, timeUnit: 'minute', title: '30M' },
        { period: 1, timeUnit: 'hour', title: '1H' },
        { period: 2, timeUnit: 'hour', title: '2H' },
        { period: 4, timeUnit: 'hour', title: '4H' },
        { period: 6, timeUnit: 'hour', title: '6H' },
        { period: 8, timeUnit: 'hour', title: '8H' },
        { period: 12, timeUnit: 'hour', title: '12H' },
        { period: 1, timeUnit: 'day', title: '1D' },
        { period: 3, timeUnit: 'day', title: '3D' },
        { period: 1, timeUnit: 'week', title: '1W' },
        { period: 1, timeUnit: 'month', title: '1MTH' },
      ],
      chart_styles: [
        ['candle', 'Candle'],
        ['bar', 'Bar'],
        ['colored_bar', 'Colored Bar'],
        ['line', 'Line'],
        ['hollow_candle', 'Hollow Candle'],
        ['mountain', 'Mountain'],
        ['baseline_delta', 'Baseline'],
        ['volume_candle', 'Volume Candle'],
        ['heikinashi', 'Heikin Ashi'],
        ['kagi', 'Kagi'],
        ['linebreak', 'Line Break'],
        ['renko', 'Renko'],
        ['rangebars', 'Range Bars'],
      ],
      chart_style: 'candle',
      show_study_modal: false,
      s_studies: [],
      study_list: null,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapGetters('marketPublic', [
      's_market_info',
      'target_assets',
      's_open_orders',
    ]),
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('account', {
      c_accounts({ accounts }) {
        return filter(accounts, {
          asset_seq: this.s_market_info
            ? this.s_market_info.target_asset_seq
            : null,
        })
      },
    }),
  },
  watch: {
    s_chart() {
      Cookies.set('c_chart', this.s_chart)
    },
  },
  created() {
    this.init()
  },
  mounted() {
    this.getStudyList()
  },
  methods: {
    updateStudies() {
      this.show_study_modal = true
    },
    getStudyList() {
      this.study_list = CIQ.Studies.getStudyList()
    },
    handleClick(tab, event) {},
    tabClick(tab, event) {},
    init() {
      this.initOrderParams()
      this.socketSubscribe()
      this.socketSubscribeRequest()

      Promise.all([this.loadAggtrades(), this.loadOrderbooks()]).catch(
        (error) => {
          this.$toasted.error(error.message)
        }
      )
    },
    socketSubscribeRequest() {
      const market_seq = this.s_market_info.seq

      this.$socket.client.emit('subscribe', {
        room_name: encodeRoomName('aggtrade', { market_seq }),
      })
    },
    socketSubscribe() {
      const market_seq = this.s_market_info.seq

      this.$socket.$subscribe(
        encodeRoomName('aggtrade', { market_seq }),
        this.onAggtrade
      )
    },
    initOrderParams() {
      this.order_params = {
        side_type: this.order_params.side_type || 'BUY',
        call_price: '',
        call_amount: '',
      }
    },
    onAggtrade(data) {
      this.aggtrades.unshift(data)
      if (this.aggtrades.length > 20) this.aggtrades.pop()
    },
    async loadAggtrades() {
      const { data } = await fetchPublicAggtrades({
        market_seq: this.s_market_info.seq,
        limit: 20,
      })

      this.aggtrades = data.reverse()
    },
    async loadOrderbooks() {
      const { data } = await fetchPublicOrderbooks({
        market_seq: this.s_market_info.seq,
      })

      this.orderbooks = data
    },
  },
}
</script>

<template>
  <div :id="$style.mobile" :class="$style.mobileChart" class="mobileChart">
    <div>
      <coinHeader />
      <div :class="[$style.coinName, $style.clear]">
        <div :class="[$style.totalArea]">
          <ul :class="[$style.priceBox]">
            <li>
              <span>{{ $t('b2c_exchange.today_hight') }}</span>
              <span :class="[$style.up, $style.noSpace]">{{
                s_market_info.ticker.today_high
              }}</span>
            </li>
            <li>
              <span>{{ $t('b2c_exchange.today_row') }}</span>
              <span :class="[$style.down, $style.noSpace]">{{
                s_market_info.ticker.today_low
              }}</span>
            </li>
            <li v-if="0">
              <span>{{ $t('b2c_exchange.tightening_strength') }}</span>
              <span :class="[$style.noSpace]"></span>
            </li>
          </ul>
          <ul :class="[$style.tradeBox]">
            <li>
              <span>{{ $t('b2c_exchange.h24_transaction_amount') }}</span>
              <span :class="[$style.noSpace]"
                ><template v-if="s_market_info.ticker.today_volume">
                  {{
                    s_market_info.ticker.today_volume
                      | trimDecimalZero
                      | numberFormat
                  }}
                  {{ s_market_info.source_asset_code }}
                </template>
                <template v-else>
                  -
                </template></span
              >
            </li>
            <li>
              <span>{{ $t('b2c_exchange.previous_days_closing_price') }}</span>
              <span :class="[$style.noSpace]"
                ><template v-if="s_market_info.ticker.today_target_volume">
                  {{
                    s_market_info.ticker.today_target_volume
                      | trimDecimalZero
                      | numberFormat
                  }}
                  {{ s_market_info.target_asset_code }}
                </template>
                <template v-else>
                  -
                </template></span
              >
            </li>
            <li>
              <span>{{ $t('b2c_exchange.previous_days_closing_price') }}</span>
              <span :class="[$style.noSpace]"
                ><template v-if="s_market_info.ticker.yesterday_close">
                  {{
                    s_market_info.ticker.yesterday_close
                      | trimDecimalZero
                      | numberFormat
                  }}
                  {{ s_market_info.target_asset_code }}
                </template>
                <template v-else>
                  -
                </template></span
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- <section :class="[$style.coinName, $style.clear]">
        <div :class="[$style.totalArea]">
          <ul :class="[$style.priceBox]">
            <li>
              <span>고가(당일)</span>
              <span :class="[$style.up, $style.noSpace]">300,000.00</span>
            </li>
            <li>
              <span>저가(당일)</span>
              <span :class="[$style.down, $style.noSpace]">721,000.00</span>
            </li>
            <li>
              <span>체결 강도</span>
              <span :class="[$style.noSpace]">111.44%</span>
            </li>
          </ul>
          <ul :class="[$style.tradeBox]">
            <li>
              <span>거래량(24H)</span>
              <span :class="[$style.noSpace]">2,513,926.00 BTC</span>
            </li>
            <li>
              <span>거래 금액(24H)</span>
              <span :class="[$style.noSpace]">861.6 억</span>
            </li>
            <li>
              <span>전일 총가</span>
              <span :class="[$style.noSpace]">6,817,000.00</span>
            </li>
          </ul>
        </div>
      </section> -->
      <!-- //차트 내역 -->
      <div :class="$style.marketPrice">
        <div v-if="s_chart === 'basicChart'" :class="$style.col">
          <dl>
            <dt>{{ $t('b2c_exchange.auxiliary_indicator') }}</dt>
            <dd
              ><button :class="$style.marketSubSelect" @click="updateStudies">{{
                $t('select')
              }}</button></dd
            >
          </dl>
          <dl>
            <dt>{{ $t('b2c_exchange.rod_type') }}</dt>
            <dd>
              <el-select v-model="interval_type" class="market-price-select">
                <el-option
                  v-for="(val, idx) in interval_types"
                  :key="idx"
                  :value="val.title"
                  :label="val.title"
                  >{{ val.title }}</el-option
                >
              </el-select>
            </dd>
          </dl>
          <dl>
            <dt>{{ $t('b2c_exchange.chart_type') }}</dt>
            <dd>
              <el-select v-model="chart_style" class="market-price-select">
                <el-option
                  v-for="[style, title] in chart_styles"
                  :key="title"
                  :value="style"
                  >{{ title }}</el-option
                >
              </el-select>
            </dd>
          </dl>
          <el-dialog
            :visible.sync="show_study_modal"
            :title="$t('b2c_exchange.unlimited_number')"
          >
            <div>
              <el-checkbox-group v-model="s_studies" class="study-checkbox">
                <el-checkbox
                  v-for="title in study_list"
                  :key="title"
                  :label="title"
                ></el-checkbox>
              </el-checkbox-group>
              <div :class="$style.studyButtonArea">
                <button
                  :class="$style.studyButton"
                  @click="show_study_modal = false"
                  >{{ $t('b2c_exchange.save') }}</button
                >
              </div>
            </div>
          </el-dialog>
        </div>
        <div :class="$style.chartBtnWrap">
          <span>
            <label for="basicChart"
              ><input
                id="basicChart"
                v-model="s_chart"
                type="radio"
                name="drone"
                value="basicChart"
                checked
              /><span :class="$style.chartBtn">{{
                $t('b2c_exchange.basic_chart')
              }}</span></label
            >
          </span>
          <span>
            <label for="tradingView"
              ><input
                id="tradingView"
                v-model="s_chart"
                type="radio"
                name="drone"
                value="tradingView"
              /><span :class="$style.chartBtn">{{
                $t('b2c_exchange.trading_view')
              }}</span></label
            >
          </span>
        </div>
      </div>
      <PublicMarketChart
        v-if="s_chart === 'basicChart'"
        ref="CIQ"
        :key="s_market_info.seq"
        :market_seq="s_market_info.seq"
        :chart_style="chart_style"
        :s_studies="s_studies"
        :interval_type="interval_type"
      ></PublicMarketChart>
      <TVChartContainer
        v-if="s_chart === 'tradingView'"
        :market_seq="s_market_info.seq"
      >
      </TVChartContainer>
      <!-- //차트 -->
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/b2c-m-exchange.scss';
@import '@src/design/b2c/common.scss';
</style>
