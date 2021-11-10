<script>
import '@src/assets/css/xeicon/xeicon.css'
import '@assets/css/b2c/b2c-exchange.css'
import '@assets/css/b2c/reset.css'
import Swiper from 'swiper/js/swiper.esm.bundle'
import 'swiper/css/swiper.css'
import { mapState, mapGetters } from 'vuex'
import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import each from 'lodash/each'
import find from 'lodash/find'
import Decimal from 'decimal.js'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import {
  createPublicOrder,
  fetchPublicAggtrades,
  fetchPublicOrderbooks,
  fetchPublicTradeList,
  fetchPublicKlines,
  fetchPublicBalanceList,
  cancelPublicMarketOrder,
} from '@apis/market'

import PublicMarketChart from '@components/public-market-chart'
import TVChartContainer from '@components/TVChartContainer'
import { encodeRoomName } from '@utils/socket'
import date from 'locutus/php/datetime/date'
import number_format from 'locutus/php/strings/number_format'
import CoinSearch from '@components/b2c/b2c-coin-search'
import Cookies from 'js-cookie'
import { CIQ } from '@/vendor/chartiq/js/chartiq.js'

export default {
  page: {
    title: 'b2c-exchange',
    meta: [{ name: 'description', content: 'b2c-exchange' }],
  },
  components: { PublicMarketChart, CoinSearch, TVChartContainer },
  sockets: {
    connect() {
      this.socketSubscribeRequest()
    },
  },
  data() {
    return {
      coin_list_modal: false,
      swiper: null,
      slider: 0,
      num: 1,
      s_account_seq: null,
      order_params: {},
      order_loading: false,
      aggtrades: [],
      orderbooks: null,
      trades: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      klines: [],
      klines52: [],
      balance_list: [],
      loading: false,
      canceling_order_seqs: [],

      s_chart: Cookies.get('c_chart') ? Cookies.get('c_chart') : 'tradingView',
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
        { key: 'candle', title: 'Candle' },
        { key: 'bar', title: 'Bar' },
        { key: 'colored_bar', title: 'Colored Bar' },
        { key: 'line', title: 'Line' },
        { key: 'hollow_candle', title: 'Hollow Candle' },
        { key: 'mountain', title: 'Mountain' },
        { key: 'baseline_delta', title: 'Baseline' },
        { key: 'volume_candle', title: 'Volume Candle' },
        { key: 'heikinashi', title: 'Heikin Ashi' },
        { key: 'kagi', title: 'Kagi' },
        { key: 'linebreak', title: 'Line Break' },
        { key: 'renko', title: 'Renko' },
        { key: 'rangebars', title: 'Range Bars' },
      ],
      chart_style: 'candle',
      show_study_modal: false,
      s_studies: [],
      study_list: null,
    }
  },
  computed: {
    ...mapState('marketPublic', ['markets']),
    ...mapState('marketPublic', ['s_market_seq']),
    ...mapGetters('marketPublic', [
      's_market_info',
      'target_assets',
      's_open_orders',
    ]),
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('common', ['constants']),
    ...mapState('account', {
      c_accounts({ accounts }) {
        return filter(accounts, {
          asset_seq: this.s_market_info
            ? this.s_market_info.target_asset_seq
            : null,
        })
      },
      ticker_info() {
        const price = this.aggtrades[0] ? this.aggtrades[0].price : 0
        const yesterday_price = this.klines[0] ? this.klines[0].close : 0
        let yesterday_vs =
          price - yesterday_price === 'NaN' ? 0 : price - yesterday_price
        const yesterday_vs_rate =
          Math.abs((yesterday_vs / yesterday_price) * 100).toFixed(2) === 'NaN'
            ? '-'
            : Math.abs((yesterday_vs / yesterday_price) * 100).toFixed(2)
        const vs_sign = yesterday_vs === 0 ? '' : yesterday_vs < 0 ? '-' : '+'
        const vs_updown =
          yesterday_vs === 0 ? '' : yesterday_vs < 0 ? 'down' : 'up'
        yesterday_vs =
          `${Math.abs(yesterday_vs)}` === 'NaN'
            ? 0
            : `${Math.abs(yesterday_vs)}`

        return {
          price,
          yesterday_price,
          yesterday_vs,
          yesterday_vs_rate,
          vs_sign,
          vs_updown,
        }
      },
    }),
    c_max_trading_price() {
      const trading_amount_list = []
      let max_trading_price = null

      for (const item of this.orderbooks.BUY) {
        trading_amount_list.push(item[0] * item[1])
      }

      for (const item of this.orderbooks.SELL) {
        trading_amount_list.push(item[0] * item[1])
      }

      max_trading_price = Math.max(...trading_amount_list)

      return max_trading_price
    },
    cs_account_info() {
      if (!this.s_account_seq) return null

      const account_info = find(this.c_accounts, { seq: this.s_account_seq })
      if (!account_info) return null

      return {
        ...account_info,
        executable_balance: new Decimal(account_info.balance)
          .minus(account_info.holding_balance)
          .toString(),
      }
    },
    c_high_kline52_info() {
      if (!this.klines52.length) return null

      return maxBy(this.klines52, 'high')
    },
    c_low_kline52_info() {
      if (!this.klines52.length) return null

      return minBy(this.klines52, 'low')
    },
    cs_balance_info() {
      if (!this.balance_list.length) return null

      return find(this.balance_list, { market_seq: this.s_market_info.seq })
    },
    c_active_markets() {
      if (!this.markets.length) return []

      return filter(this.markets, { is_active: 'Y' })
    },
    c_chart_style() {
      return find(this.chart_styles, { title: this.chart_style })
    },
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

    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 7,
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  },
  beforeDestroy() {
    this.socketSubscribe(true)
  },
  methods: {
    init() {
      this.initOrderParams()
      this.socketSubscribe()
      this.socketSubscribeRequest()
      this.loading = true
      Promise.all([
        this.loadAggtrades(),
        this.loadOrderbooks(),
        this.loadTradeList(),
        this.load1DKlineList(),
        this.load52WKlineList(),
        this.loadBalanceList(),
      ])
        .catch((error) => {
          this.$toasted.error(error.message)
        })
        .finally(() => {
          this.loading = false
          this.$refs.ps_order_scrollbar.$el.scrollTop = 5000
        })
    },
    socketSubscribeRequest() {
      const market_seq = this.s_market_info.seq

      this.$socket.client.emit('subscribe', {
        room_name: encodeRoomName('aggtrade', { market_seq }),
      })
      this.$socket.client.emit('subscribe', {
        room_name: encodeRoomName('marketdepth', { market_seq, interval: 100 }),
      })
    },
    socketSubscribe(off = false) {
      const method = off ? 'off' : 'on'
      this.$socket.client[method]('public_market.aggtrade', this.onAggtrade)
      this.$socket.client[method](
        'public_market.market_depth_diff',
        this.onMarketDepthDiff
      )
      this.$socket.client[method]('public_market.trade', this.onTrade)
    },
    initOrderParams() {
      this.order_params = {
        side_type: this.order_params.side_type || 'BUY',
        call_price: '',
        call_amount: '',
      }
    },
    onAggtrade(data) {
      if (data.market_seq !== this.s_market_info.seq) {
        this.$store.dispatch('marketPublic/marketUpdate', data)
        this.$store.dispatch('marketPublic/volumeUpdate', data)
        return
      }
      this.$store.dispatch('marketPublic/marketUpdate', data)
      this.$store.dispatch('marketPublic/volumeUpdate', data)
      this.aggtrades.unshift(data)
      if (this.aggtrades.length > 20) this.aggtrades.pop()
    },
    onMarketDepthDiff(data) {
      if (data.market_seq !== this.s_market_info.seq) return

      each(Object.keys(this.orderbooks), (side_type) => {
        this.orderbooks[side_type] = filter(
          toPairs({
            ...fromPairs(this.orderbooks[side_type]),
            ...fromPairs(data[side_type]),
          }),
          ([, call_amount]) => new Decimal(call_amount).gt(0)
        )
      })
    },
    onTrade(data) {
      if (data.market_seq !== this.s_market_info.seq) return

      this.trades.unshift(data)
      if (this.trades.length > 20) this.trades.pop()
    },
    async load1DKlineList() {
      const { data } = await fetchPublicKlines({
        market_seq: this.s_market_info.seq,
        interval_type: '1D',
      })
      this.klines = data.reverse()
    },
    async load52WKlineList() {
      const end_time = new Date()
      const start_time = end_time
      start_time.setYear(start_time.getFullYear() - 1)
      const { data } = await fetchPublicKlines({
        market_seq: this.s_market_info.seq,
        interval_type: '1W',
        limit: '52',
      })
      this.klines52 = data.reverse()
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
    async loadTradeList() {
      if (!this.loggedIn) return

      const { data } = await fetchPublicTradeList({
        market_seq: this.s_market_info.seq,
      })

      this.trades = data
    },
    async loadBalanceList() {
      if (!this.loggedIn) return

      const { data } = await fetchPublicBalanceList()
      this.balance_list = data
    },
    handleCreateOrder() {
      if (!this.s_account_seq) return

      this.order_loading = true
      createPublicOrder({
        ...this.order_params,
        market_seq: this.s_market_info.seq,
        account_seq: this.s_account_seq,
      })
        .then(() => {
          this.$toasted.success(
            this.order_params.side_type === 'BUY'
              ? this.$t('b2c_exchange.buy_finish')
              : this.$t('b2c_exchange.sell_finish')
          )
        })
        .then(() => this.initOrderParams())
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.order_loading = false
        })
    },
    handleReset() {
      this.initOrderParams()
    },
    handleSelectMarket(market_info) {
      this.$store.dispatch('marketPublic/selectMarket', market_info)
      this.init()
    },
    handleSlideCallAmount() {
      if (!this.cs_account_info) return
      if (this.order_params.call_price <= 0) this.order_params.call_amount = 0
      else {
        const available_amount = new Decimal(
          this.cs_account_info.executable_balance / this.order_params.call_price
        )
        const slide = new Decimal(this.slider)
        this.order_params.call_amount = available_amount
          .mul(slide.div(100))
          .valueOf()
      }
    },
    async handleCancelOrder(order_seq) {
      const idx = this.canceling_order_seqs.length
      this.canceling_order_seqs.push(order_seq)
      try {
        await cancelPublicMarketOrder(order_seq)
      } catch (e) {
        this.$toasted.error(e.message)
      } finally {
        this.canceling_order_seqs.splice(idx, 1)
      }
    },
    getStudyList() {
      this.study_list = CIQ.Studies.getStudyList()
    },
    updateStudies() {
      this.show_study_modal = true
    },
    date,
    fromPairs,
    Decimal,
    number_format,
    boxProgress(price, amount) {
      const cal = (price * amount * 100) / this.c_max_trading_price
      const toFix = cal.toFixed(2)
      return `width: ${toFix}%`
    },
  },
}
</script>

<template>
  <div v-loading="loading" class="pc-exchange">
    <section :class="[$style.coinListSection]" class="coin-list-section">
      <div :class="[$style.container, $style.clear]">
        <div :class="$style.coinArea" class="swiper-container">
          <div class="swiper-wrapper">
            <div
              v-for="market in c_active_markets"
              :key="market.seq"
              class="swiper-slide"
              :class="[
                $style.coinAreaSection,
                { [$style.active]: market.seq === s_market_info.seq },
              ]"
              @click="handleSelectMarket(market)"
            >
              <strong :class="$style.noSpace"
                >{{ market.title }}
                <img
                  v-if="0"
                  :class="[$style.floatR, $style.slideStar]"
                  src="@assets/img/b2c/tradeVoidStar.png"
                  alt="star"
              /></strong>
              <p
                :class="[
                  $style.noSpace,
                  {
                    [$style[`${market.ticker.yesterday_vs_updown}`]]:
                      market.ticker.yesterday_vs_updown.length,
                  },
                ]"
                >{{ market.ticker.yesterday_vs_sign }}
                {{ number_format(market.ticker.yesterday_vs_rate, 2) }}%
                <img v-if="0" src="@assets/img/b2c/underArrow.png" alt=""
              /></p>
            </div>
          </div>
          <div class="swiper-button-next">
            <img src="@src/assets/img/b2c/slideRight.png" alt="search" />
          </div>
          <div class="swiper-button-prev">
            <img src="@src/assets/img/b2c/slideLeft.png" alt="search" />
          </div>
        </div>
        <!-- //슬라이드 -->
      </div>
    </section>
    <!-- // 코인 슬라이드 / 코인명/심볼 검색 -->

    <section :class="[$style.b2c]">
      <div :class="[$style.container, $style.clear]">
        <div :class="[$style.coinName, $style.clear]">
          <div :class="[$style.nameArea]">
            <div :class="[$style.clear]">
              <p v-if="0" :class="[$style.floatL]">
                <img src="@src/assets/img/b2c/bit.png" alt="bit coin" />
              </p>
              <h3>{{ s_market_info.title }}</h3>
              <span>{{ s_market_info.code }}</span>
            </div>
            <div :class="[$style.clear]">
              <h2
                :class="[
                  {
                    [$style[s_market_info.ticker.yesterday_vs_updown]]:
                      s_market_info.ticker.yesterday_vs_updown.length,
                  },
                ]"
              >
                <template v-if="s_market_info.ticker.price">
                  {{ s_market_info.ticker.price | numberFormat }}
                </template>
                <template v-else>
                  -
                </template>
              </h2>
              <div
                :class="[
                  $style.percentage,
                  $style.noSpace,
                  {
                    [$style[
                      `${s_market_info.ticker.yesterday_vs_updown}Background`
                    ]]: s_market_info.ticker.yesterday_vs_updown.length,
                  },
                ]"
                >{{ s_market_info.ticker.yesterday_vs_sign }}
                {{ number_format(s_market_info.ticker.yesterday_vs_rate, 2) }}
                %</div
              >
            </div>
            <div :class="[$style.clear, $style.yesterdayPoint]">
              <span>{{ $t('b2c_exchange.compared_to_the_previous_day') }}</span>
              <span
                :class="[
                  $style.noSpace,
                  {
                    [$style[s_market_info.ticker.yesterday_vs_updown]]:
                      s_market_info.ticker.yesterday_vs_updown.length,
                  },
                ]"
                >{{ s_market_info.ticker.yesterday_vs_sign }}
                {{ number_format(s_market_info.ticker.yesterday_vs_rate, 2) }}
                %</span
              >
              <span
                :class="[
                  $style.noSpace,
                  {
                    [$style[s_market_info.ticker.yesterday_vs_updown]]:
                      s_market_info.ticker.yesterday_vs_updown.length,
                  },
                ]"
              >
                <img
                  v-if="0"
                  src="@src/assets/img/b2c/up_triangle.png"
                  alt="up"
                />
                ({{ s_market_info.ticker.yesterday_vs_sign
                }}{{ s_market_info.ticker.yesterday_vs | numberFormat }})
              </span>
            </div>
          </div>
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
                <span>{{ $t('b2c_exchange.h24_volume') }}</span>
                <span :class="[$style.noSpace]">
                  <template v-if="s_market_info.ticker.today_volume">
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
                <span>{{ $t('b2c_exchange.h24_transaction_amount') }}</span>
                <span :class="[$style.noSpace]">
                  <template v-if="s_market_info.ticker.today_target_volume">
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
                <span>{{
                  $t('b2c_exchange.previous_days_closing_price')
                }}</span>
                <span :class="[$style.noSpace]">
                  <template v-if="s_market_info.ticker.yesterday_close">
                    {{
                      s_market_info.ticker.yesterday_close
                        | trimDecimalZero
                        | numberFormat
                    }}
                    {{ s_market_info.target_asset_code }}
                  </template>
                  <template v-else>
                    -
                  </template>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- //코인 이름 -->
        <!-- 코인 search list -->
        <CoinSearch :chart_type="s_chart" />
        <!-- //코인 list -->

        <!-- 보조지표&차트 -->
        <div
          :class="[
            s_chart === 'basicChart' ? $style.marketPriceBold : '',
            $style.marketPrice,
          ]"
        >
          <div v-if="s_chart === 'basicChart'" :class="$style.col">
            <dl>
              <dt>{{ $t('b2c_exchange.auxiliary_indicator') }}</dt>
              <dd
                ><button
                  :class="$style.marketSubSelect"
                  @click="updateStudies"
                  >{{ $t('select') }}</button
                ></dd
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
                    v-for="(val, idx) in chart_styles"
                    :key="idx"
                    :value="val.title"
                    >{{ val.title }}</el-option
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
                    v-for="(name, title) in study_list"
                    :key="title"
                    :label="name"
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
          :chart_style="
            c_chart_style === undefined ? 'candle' : c_chart_style.key
          "
          :s_studies="s_studies"
          :interval_type="interval_type"
        ></PublicMarketChart>
        <TVChartContainer
          v-if="s_chart === 'tradingView'"
          :market_seq="s_market_info.seq"
        >
        </TVChartContainer>
        <!-- //차트 -->

        <!-- 아래부터 그래프입니다. -->

        <div :class="[$style.quote]">
          <div :class="[$style.title]">
            <h2>{{ $t('b2c_exchange.asking_price_window') }}</h2>
          </div>
          <div :class="[$style.quoteArea, $style.clear]">
            <PerfectScrollbar
              id="ps-order-scrollbar"
              ref="ps_order_scrollbar"
              :class="[$style.perfectScrollbar]"
            >
              <div :class="[$style.quoteUpAreaWrap]">
                <div :class="[$style.quoteUpArea, $style.clear]">
                  <div :class="[$style.quoteUpGraphWrap]">
                    <ul v-if="orderbooks" :class="[$style.quoteUpGraph]">
                      <li
                        v-for="[call_price, call_amount] in orderbooks.SELL"
                        :key="call_price"
                        :class="[$style.clear]"
                        @click="order_params.call_price = call_price"
                      >
                        <div :class="[$style.leftArea]">
                          <div
                            :style="boxProgress(call_price, call_amount)"
                            :class="[$style.box]"
                          ></div>
                          <p :class="[$style.textR, $style.noSpace]">{{
                            call_amount | trimDecimalZero | numberFormat
                          }}</p>
                        </div>
                        <div :class="[$style.rightArea]">
                          <p :class="[$style.down, $style.noSpace]">{{
                            call_price | trimDecimalZero | numberFormat
                          }}</p>
                          <p
                            v-if="0"
                            :class="[
                              $style.down,
                              $style.floatR,
                              $style.noSpace,
                            ]"
                            >+1.02%</p
                          >
                        </div>
                        <div v-if="0" :class="[$style.alertArea]">
                          <div :class="[$style.quoteUpGraphOpacity]"></div>
                          <ul :class="[$style.blueAlert]">
                            <li :class="[$style.clear]">
                              <p :class="[$style.floatL]">{{
                                $t('b2c_exchange.average_price')
                              }}</p>
                              <p :class="[$style.floatR]">9,395.000 USDT</p>
                            </li>
                            <li :class="[$style.clear]">
                              <p :class="[$style.floatL]">{{
                                $t('b2c_exchange.cumulative_quantity')
                              }}</p>
                              <p :class="[$style.floatR]">2,185 BTC</p>
                            </li>
                            <li :class="[$style.clear]">
                              <p :class="[$style.floatL]">{{
                                $t('b2c_exchange.cumulative_amount')
                              }}</p>
                              <p :class="[$style.floatR]">1,586.000 USDT</p>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div :class="[$style.quoteIInfoTop]">
                    <ul
                      :class="[
                        $style.quoteInfoBox,
                        $style.tradeBox,
                        $style.clear,
                      ]"
                    >
                      <li :class="[$style.clear]">
                        <div
                          :class="[$style.floatL, $style.textL, $style.width50]"
                          >{{ $t('b2c_exchange.volume') }}</div
                        >
                        <div
                          :class="[$style.floatL, $style.textR, $style.width50]"
                        >
                          <template v-if="s_market_info.ticker.today_volume">
                            <strong>{{
                              s_market_info.ticker.today_volume
                                | trimDecimalZero
                                | numberFormat
                            }}</strong>
                            {{ s_market_info.source_asset_code }}
                          </template>
                          <template v-else>
                            -
                          </template>
                        </div>
                      </li>
                      <li :class="[$style.clear]">
                        <div
                          :class="[$style.floatL, $style.textL, $style.width50]"
                          >{{ $t('b2c_exchange.transaction_price') }}</div
                        >
                        <div
                          :class="[$style.floatL, $style.textR, $style.width50]"
                        >
                          <template
                            v-if="s_market_info.ticker.today_target_volume"
                          >
                            <strong>{{
                              s_market_info.ticker.today_target_volume
                                | trimDecimalZero
                                | numberFormat
                            }}</strong>
                            {{ s_market_info.target_asset_code }}
                          </template>
                          <template v-else>
                            -
                          </template></div
                        >
                      </li>
                    </ul>
                    <ul :class="[$style.quoteInfoBox, $style.weekBox]">
                      <li :class="[$style.clear]">
                        <div
                          :class="[$style.floatL, $style.textL, $style.width50]"
                        >
                          <p>{{ $t('b2c_exchange.week52_high') }}</p></div
                        >
                        <div
                          :class="[$style.floatL, $style.textR, $style.width50]"
                        >
                          <p
                            v-if="klines52.length"
                            :class="[$style.up, $style.noSpace]"
                            >{{
                              c_high_kline52_info.high
                                | trimDecimalZero
                                | numberFormat
                            }}</p
                          >
                          <p v-else :class="[$style.up, $style.noSpace]">-</p>
                          <p v-if="0" :class="[$style.noSpace]">{{
                            c_high_kline52_info.target_volume
                          }}</p>
                        </div>
                      </li>
                      <li :class="[$style.clear]">
                        <div
                          :class="[$style.floatL, $style.textL, $style.width50]"
                        >
                          <p>{{ $t('b2c_exchange.week52_minimum') }}</p>
                        </div>
                        <div
                          :class="[$style.floatL, $style.textR, $style.width50]"
                        >
                          <p
                            v-if="klines52.length"
                            :class="[$style.down, $style.noSpace]"
                            >{{
                              c_low_kline52_info.low
                                | trimDecimalZero
                                | numberFormat
                            }}</p
                          >
                          <p v-else :class="[$style.down, $style.noSpace]"
                            >-
                          </p>
                          <p v-if="0" :class="[$style.noSpace]">(2019.06.26)</p>
                        </div>
                      </li>
                    </ul>
                    <ul :class="[$style.quoteInfoBox, $style.dayBox]">
                      <li :class="[$style.clear]">
                        <div
                          :class="[$style.floatL, $style.textL, $style.width50]"
                        >
                          <p>{{ $t('b2c_exchange.days_closing_price') }}</p>
                        </div>
                        <div
                          :class="[$style.floatL, $style.textR, $style.width50]"
                        >
                          <p :class="[$style.noSpace]">
                            <template
                              v-if="s_market_info.ticker.yesterday_close"
                            >
                              {{
                                s_market_info.ticker.yesterday_close
                                  | trimDecimalZero
                                  | numberFormat
                              }}
                            </template>
                            <template v-else>
                              -
                            </template></p
                          >
                        </div>
                      </li>
                      <li :class="[$style.clear]">
                        <div
                          :class="[$style.floatL, $style.textL, $style.width50]"
                        >
                          <p>{{ $t('b2c_exchange.same_day_high_price') }}</p>
                        </div>
                        <div
                          :class="[$style.floatL, $style.textR, $style.width50]"
                        >
                          <p :class="[$style.up, $style.noSpace]">
                            <template v-if="s_market_info.ticker.today_high">
                              {{
                                s_market_info.ticker.today_high
                                  | trimDecimalZero
                                  | numberFormat
                              }}
                            </template>
                            <template v-else>
                              -
                            </template></p
                          >
                          <p v-if="0" :class="[$style.up, $style.noSpace]"
                            >+0.62%</p
                          >
                        </div>
                      </li>
                      <li :class="[$style.clear]">
                        <div
                          :class="[$style.floatL, $style.textL, $style.width50]"
                        >
                          <p>{{ $t('b2c_exchange.low_price_on_the_day') }}</p>
                        </div>
                        <div
                          :class="[$style.floatL, $style.textR, $style.width50]"
                        >
                          <p :class="[$style.down, $style.noSpace]"
                            ><template v-if="s_market_info.ticker.today_low">
                              {{
                                s_market_info.ticker.today_low
                                  | trimDecimalZero
                                  | numberFormat
                              }}
                            </template>
                            <template v-else>
                              -
                            </template></p
                          >
                          <p v-if="0" :class="[$style.down, $style.noSpace]"
                            >-0.62%</p
                          >
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </PerfectScrollbar>
            <!-- //호가 상승 그래프 -->
            <PerfectScrollbar :class="[$style.perfectScrollbar]">
              <div :class="[$style.quoteDownArea, $style.clear]">
                <div :class="[$style.quoteInfoBottom]">
                  <table>
                    <colgroup>
                      <col width="50%" />
                      <col width="50%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th v-if="0" colspan="2" :class="[$style.clear]">
                          <p :class="[$style.floatL]">{{
                            $t('b2c_exchange.tightening_strength')
                          }}</p>
                          <p :class="[$style.floatR, $style.noSpace]"
                            >+129.63%</p
                          >
                        </th>
                      </tr>
                      <tr>
                        <th>{{ $t('b2c_exchange.conclusion_price') }}</th>
                        <th>{{ $t('b2c_exchange.tightening_amount') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="aggtade in aggtrades" :key="aggtade.seq">
                        <td>
                          <p :class="[$style.floatL]">{{
                            aggtade.price | trimDecimalZero | numberFormat
                          }}</p>
                        </td>
                        <td>
                          <p
                            :class="[
                              $style.floatR,
                              aggtade.is_buyer_maker === 'Y'
                                ? $style.down
                                : $style.up,
                            ]"
                            >{{
                              aggtade.amount | trimDecimalZero | numberFormat
                            }}</p
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <ul v-if="orderbooks" :class="[$style.quoteDownGraph]">
                  <li
                    v-for="[call_price, call_amount] in orderbooks.BUY"
                    :key="call_price"
                    :class="[$style.clear]"
                    @click="order_params.call_price = call_price"
                  >
                    <div :class="[$style.rightArea]">
                      <p :class="[$style.up, $style.noSpace]">{{
                        call_price | trimDecimalZero | numberFormat
                      }}</p>
                      <p
                        v-if="0"
                        :class="[$style.up, $style.floatR, $style.noSpace]"
                        >-1.02%</p
                      >
                    </div>
                    <div :class="[$style.leftArea]">
                      <div
                        :style="boxProgress(call_price, call_amount)"
                        :class="[$style.box]"
                      ></div>
                      <p :class="[$style.textL, $style.noSpace]">{{
                        call_amount | trimDecimalZero | numberFormat
                      }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </PerfectScrollbar>
            <!-- //호가 하락 그래프 -->
          </div>
        </div>
        <!-- //호가 -->

        <div :class="$style.buying">
          <el-tabs v-model="order_params.side_type" class="order-tabs">
            <el-tab-pane
              v-for="[side_type, side_type_title] in constants.market
                .public_order.side_type"
              :key="side_type"
              :label="side_type_title"
              :name="side_type"
              :class="[$style.up]"
            >
              <template v-if="order_params.side_type === side_type">
                <form class="buying" @submit.prevent="handleCreateOrder">
                  <div :class="[$style.heldAssetsArea]">
                    <el-select
                      v-model="s_account_seq"
                      class="buying-login"
                      :disabled="!loggedIn || !c_accounts.length"
                      :placeholder="
                        !loggedIn
                          ? $t('available_after_login')
                          : c_accounts.length
                          ? $t('account_transfer.msg_select_asset_search')
                          : $t('b2c_exchange.accounts_that_can_be_traded')
                      "
                    >
                      <el-option
                        v-for="account in c_accounts"
                        :key="account.seq"
                        :value="account.seq"
                        :label="
                          account.title !== null && account.title.length
                            ? `${account.title} (${account.account_number})`
                            : account.account_number
                        "
                      ></el-option>
                    </el-select>
                    <div :class="[$style.assest]">
                      <strong
                        v-if="order_params.side_type === 'BUY'"
                        :class="[$style.noSpace]"
                      >
                        <template v-if="cs_account_info">
                          {{
                            cs_account_info.executable_balance
                              | codeDecimal(cs_account_info.asset_code)
                          }}
                        </template>
                        <template v-else
                          >—</template
                        >
                      </strong>
                      <strong v-else :class="[$style.noSpace]">
                        <template v-if="cs_balance_info && cs_account_info">
                          {{
                            cs_balance_info.amount
                              | codeDecimal(cs_account_info.asset_code)
                          }}
                        </template>
                        <template v-else
                          >—</template
                        >
                      </strong>
                      <span :class="[$style.noSpace]">{{
                        order_params.side_type === 'BUY'
                          ? s_market_info.target_asset_code
                          : s_market_info.source_asset_code
                      }}</span>
                    </div>
                  </div>
                  <ul :class="[$style.priceArea]">
                    <li :class="[$style.clear]">
                      <div :class="[$style.textBox]">
                        <p>{{ $t('b2c_exchange.order_classification') }}</p>
                      </div>
                      <div :class="[$style.selectBox]">
                        <p>{{ $t('b2c_exchange.limits') }}</p>
                      </div>
                    </li>
                    <li v-if="0" :class="[$style.clear]">
                      <div :class="[$style.textBox]">
                        <p>{{ $t('b2c_exchange.order_available') }}</p>
                      </div>
                      <div :class="[$style.selectBox]">
                        <p
                          ><strong v-if="cs_account_info">{{
                            (cs_account_info.executable_balance /
                              ticker_info.price)
                              | codeDecimal(cs_account_info.asset_code)
                          }}</strong
                          >{{ s_market_info.source_asset_code }}</p
                        >
                      </div>
                    </li>
                    <li :class="[$style.clear]">
                      <div :class="[$style.textBox]">
                        <p>{{ $t('b2c_exchange.order_price') }}</p>
                      </div>
                      <div :class="[$style.selectBox]">
                        <el-input-number
                          v-model="order_params.call_price"
                          class="order-price"
                          controls-position="right"
                        ></el-input-number>
                        <div :class="[$style.max_order]">
                          <span>{{
                            $t('b2c_exchange.maximum_order_price_quantity')
                          }}</span>
                          <span
                            v-if="cs_account_info"
                            :class="[$style.noSpace]"
                            >{{
                              order_params.call_price > 0
                                ? cs_account_info.executable_balance /
                                  order_params.call_price
                                : 0 | codeDecimal(cs_account_info.asset_code)
                            }}</span
                          >
                        </div>
                      </div>
                    </li>
                    <li :class="[$style.clear]">
                      <div :class="[$style.textBox]">
                        <p>{{ $t('b2c_exchange.order_quantity') }}</p>
                      </div>
                      <div
                        :class="[
                          $style.selectBox,
                          $style.inputBox,
                          $style.textR,
                        ]"
                      >
                        <el-input
                          v-model="order_params.call_amount"
                          :placeholder="$t('b2c_exchange.direct_input')"
                          @focus="slider = 0"
                        ></el-input>
                        <template>
                          <div :class="[$style.block]">
                            <el-slider
                              v-model="slider"
                              :step="25"
                              show-stops
                              @change="handleSlideCallAmount"
                            >
                            </el-slider>
                          </div>
                          <ul>
                            <li>0%</li>
                            <li>25%</li>
                            <li>50%</li>
                            <li>75%</li>
                            <li>100%</li>
                          </ul>
                        </template>
                      </div>
                    </li>
                    <li :class="[$style.line]"></li>
                    <li :class="[$style.totalPrice, $style.clear]">
                      <div :class="[$style.textBox, $style.orderAllPrice]">
                        <p>{{ $t('b2c_exchange.total_order_amount') }}</p>
                      </div>
                      <div :class="[$style.selectBox]">
                        <p
                          ><strong>{{
                            (order_params.call_price *
                              order_params.call_amount)
                              | codeDecimal(s_market_info.target_asset_code)
                          }}</strong
                          >{{ s_market_info.target_asset_code }}</p
                        >
                      </div>
                    </li>
                    <li>
                      <div :class="[$style.commission, $style.clear]">
                        <template
                          v-if="s_market_info.use_min_call_amount === 'Y'"
                        >
                          <div :class="[$style.textBox]">
                            <p>{{ $t('b2c_exchange.minimum_ask_quantity') }}</p>
                          </div>
                          <div :class="[$style.selectBox]">
                            <p :class="[$style.noSpace]"
                              >{{
                                s_market_info.min_call_amount
                                  | trimDecimalZero
                                  | numberFormat
                              }}
                              {{ s_market_info.source_asset_code }}</p
                            >
                          </div>
                        </template>
                        <div :class="[$style.textBox]">
                          <p>{{ $t('b2c_exchange.quantity_user_fee_rate') }}</p>
                        </div>
                        <div :class="[$style.selectBox]">
                          <p :class="[$style.noSpace]"
                            >{{
                              s_market_info.taker_fee_rate
                                | trimDecimalZero
                                | numberFormat
                            }}%</p
                          >
                        </div>
                        <div :class="[$style.textBox]">
                          <p>{{
                            $t('b2c_exchange.quantity_creator_fee_rate')
                          }}</p>
                        </div>
                        <div :class="[$style.selectBox]">
                          <p :class="[$style.noSpace]"
                            >{{
                              s_market_info.maker_fee_rate
                                | trimDecimalZero
                                | numberFormat
                            }}%</p
                          >
                        </div>
                      </div>
                    </li>
                    <li>
                      <div :class="[$style.buttonBox, $style.clear]">
                        <button
                          :class="$style.resetBackground"
                          @click.prevent="handleReset"
                          >{{ $t('b2c_exchange.reset') }}</button
                        >
                        <button
                          type="submit"
                          :class="{
                            [$style.upBackground]: side_type === 'BUY',
                            [$style.downBackground]: side_type === 'SELL',
                          }"
                          >{{ side_type_title }}</button
                        >
                      </div>
                    </li>
                  </ul>
                </form>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- //구매 -->

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
          <div :class="[$style.tableScrollY]">
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
        </div>
        <!-- //체결 -->

        <div :class="[$style.orderDate]">
          <table :class="[$style.orderTable]">
            <colgroup>
              <col width="12%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('b2c_exchange.order_date_and_time') }}</th>
                <th>{{ $t('b2c_exchange.transaction_coin') }}</th>
                <th>{{ $t('b2c_exchange.order_quantity') }}</th>
                <th>{{ $t('b2c_exchange.untraded_quantity') }}</th>
                <th>{{ $t('b2c_exchange.order_price') }}</th>
                <th>{{ $t('b2c_exchange.state') }}</th>
                <th>{{ $t('b2c_exchange.current_price') }}</th>
                <th>{{ $t('b2c_exchange.division') }}</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
          </table>
          <div :class="[$style.tableScrollY]">
            <PerfectScrollbar :class="[$style.perfectScrollbar]">
              <table :class="[$style.orderTable]">
                <colgroup>
                  <col width="12%" />
                  <col width="11%" />
                  <col width="11%" />
                  <col width="11%" />
                  <col width="11%" />
                  <col width="11%" />
                  <col width="11%" />
                  <col width="11%" />
                  <col width="11%" />
                </colgroup>
                <tbody>
                  <template v-for="open_order in s_open_orders">
                    <tr :key="`${open_order.seq}-1`">
                      <td>{{
                        date('Y.m.d H:i:s', new Date(open_order.regdate))
                      }}</td>
                      <td>{{ open_order.market_code }}</td>
                      <td :class="$style.noSpace">{{
                        open_order.call_amount | trimDecimalZero | numberFormat
                      }}</td>
                      <td :class="$style.noSpace">{{
                        open_order.executable_amount
                          | trimDecimalZero
                          | numberFormat
                      }}</td>
                      <td
                        ><strong :class="$style.noSpace">{{
                          open_order.call_price | trimDecimalZero | numberFormat
                        }}</strong></td
                      >
                      <td>{{
                        fromPairs(constants.market.public_order.status)[
                          open_order.status
                        ]
                      }}</td>
                      <td
                        ><strong :class="$style.noSpace">{{
                          s_market_info.ticker.price
                        }}</strong></td
                      >
                      <td
                        ><strong :class="[$style.up]">{{
                          fromPairs(constants.market.public_order.side_type)[
                            open_order.side_type
                          ]
                        }}</strong></td
                      >
                      <td>
                        <ElButton
                          type="danger"
                          :loading="
                            canceling_order_seqs.indexOf(open_order.seq) !== -1
                          "
                          size="mini"
                          @click.prevent="handleCancelOrder(open_order.seq)"
                          >{{ $t('cancel') }}</ElButton
                        >
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </PerfectScrollbar>
          </div>
        </div>
        <!-- //주문 -->
      </div>
    </section>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/common.scss';
</style>
