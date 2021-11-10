<script>
import { mapGetters, mapState } from 'vuex'
import '@assets/css/b2c/b2c-exchange.css'
import '@assets/css/b2c/b2c-m-exchange.css'
import Decimal from 'decimal.js'
import filter from 'lodash/filter'
import {
  fetchPublicAggtrades,
  fetchPublicOrderbooks,
  fetchPublicKlines,
} from '@apis/market'
import coinHeader from '@components/b2c/b2c-m-coin-header'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import { encodeRoomName } from '@utils/socket'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import each from 'lodash/each'

export default {
  page: {
    title: 'exchange-quote',
    meta: [{ name: 'description', content: 'exchange-quote' }],
  },
  components: { coinHeader },
  sockets: {
    connect() {
      this.socketSubscribeRequest()
    },
  },
  data() {
    return {
      input: '',
      value1: '',
      value2: '',
      value3: 0,
      num: 1,
      aggtrades: [],
      orderbooks: null,
      klines52: [],
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
    c_high_kline52_info() {
      if (!this.klines52.length) return null

      return maxBy(this.klines52, 'high')
    },
    c_low_kline52_info() {
      if (!this.klines52.length) return null

      return minBy(this.klines52, 'low')
    },
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
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    this.socketSubscribe(true)
  },
  methods: {
    init() {
      this.socketSubscribe()
      this.socketSubscribeRequest()
      Promise.all([
        this.loadAggtrades(),
        this.loadOrderbooks(),
        this.load52WKlineList(),
      ]).catch((error) => {
        this.$toasted.error(error.message)
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
    onAggtrade(data) {
      if (data.market_seq !== this.s_market_info.seq) return

      this.aggtrades.unshift(data)
      if (this.aggtrades.length > 20) this.aggtrades.pop()
    },
    handleClick(tab, event) {},
    tabClick(tab, event) {},
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
    boxProgress(price, amount) {
      const cal = (price * amount * 100) / this.c_max_trading_price
      const toFix = cal.toFixed(2)
      return `width: ${toFix}%`
    },
  },
}
</script>

<template>
  <div :id="$style.mobile" :class="$style.mobilequote" class="mobilequote">
    <coinHeader />
    <div :class="[$style.quote]">
      <div :class="[$style.title]">
        <h2>{{ $t('b2c_exchange.asking_price_window') }}</h2>
      </div>
      <div :class="[$style.quoteArea, $style.clear]">
        <PerfectScrollbar :class="[$style.perfectScrollbar]">
          <div :class="[$style.quoteUpArea, $style.clear]">
            <ul v-if="orderbooks" :class="[$style.quoteUpGraph]">
              <li
                v-for="[call_price, call_amount] in orderbooks.SELL"
                :key="call_price"
                :class="$style.clear"
              >
                <div :class="$style.leftArea">
                  <div
                    :style="boxProgress(call_price, call_amount)"
                    :class="$style.box"
                  ></div>
                  <p :class="[$style.textR, $style.noSpace]">{{
                    call_price | trimDecimalZero | numberFormat
                  }}</p>
                </div>
                <div :class="$style.rightArea">
                  <p :class="[$style.up, $style.noSpace]">{{
                    call_amount | trimDecimalZero | numberFormat
                  }}</p>
                  <p :class="[$style.up, $style.floatR, $style.noSpace]"
                    >+1.02%</p
                  >
                </div>
                <div v-if="0" :class="[$style.alertArea]">
                  <div :class="[$style.quoteUpGraphOpacity]"></div>
                  <ul :class="[$style.blueAlert]">
                    <li :class="$style.clear">
                      <p :class="[$style.floatL]">{{
                        $t('b2c_exchange.average_price')
                      }}</p>
                      <p :class="[$style.floatR]">9,395.000 USDT</p>
                    </li>
                    <li :class="$style.clear">
                      <p :class="[$style.floatL]">{{
                        $t('b2c_exchange.cumulative_quantity')
                      }}</p>
                      <p :class="[$style.floatR]">2,185 BTC</p>
                    </li>
                    <li :class="$style.clear">
                      <p :class="[$style.floatL]">{{
                        $t('b2c_exchange.cumulative_amount')
                      }}</p>
                      <p :class="[$style.floatR]">1,586.000 USDT</p>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>

            <div :class="[$style.quoteIInfoTop]">
              <ul :class="[$style.quoteInfoBox, $style.tradeBox, $style.clear]">
                <li :class="$style.clear">
                  <div :class="[$style.floatL, $style.textL, $style.width50]">{{
                    $t('b2c_exchange.volume')
                  }}</div>
                  <div :class="[$style.floatL, $style.textR, $style.width50]"
                    ><template v-if="s_market_info.ticker.today_volume">
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
                <li :class="$style.clear">
                  <div :class="[$style.floatL, $style.textL, $style.width50]">{{
                    $t('b2c_exchange.transaction_price')
                  }}</div>
                  <div :class="[$style.floatL, $style.textR, $style.width50]"
                    ><template v-if="s_market_info.ticker.today_target_volume">
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
                <li :class="$style.clear">
                  <div :class="[$style.floatL, $style.textL, $style.width50]">
                    <p>{{ $t('b2c_exchange.week52_high') }}</p></div
                  >
                  <div :class="[$style.floatL, $style.textR, $style.width50]">
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
                  </div>
                </li>
                <li :class="$style.clear">
                  <div :class="[$style.floatL, $style.textL, $style.width50]">
                    <p>{{ $t('b2c_exchange.week52_minimum') }}</p>
                  </div>
                  <div :class="[$style.floatL, $style.textR, $style.width50]">
                    <p
                      v-if="klines52.length"
                      :class="[$style.down, $style.noSpace]"
                      >{{
                        c_low_kline52_info.low | trimDecimalZero | numberFormat
                      }}</p
                    >
                    <p v-else :class="[$style.down, $style.noSpace]">- </p>
                  </div>
                </li>
              </ul>
              <ul :class="[$style.quoteInfoBox, $style.dayBox]">
                <li :class="$style.clear">
                  <div :class="[$style.floatL, $style.textL, $style.width50]">
                    <p>{ $t('b2c_exchange.days_closing_price') }}</p>
                  </div>
                  <div :class="[$style.floatL, $style.textR, $style.width50]">
                    <template v-if="s_market_info.ticker.yesterday_close">
                      {{
                        s_market_info.ticker.yesterday_close
                          | trimDecimalZero
                          | numberFormat
                      }}
                    </template>
                    <template v-else>
                      -
                    </template>
                  </div>
                </li>
                <li :class="$style.clear">
                  <div :class="[$style.floatL, $style.textL, $style.width50]">
                    <p>{{ $t('b2c_exchange.same_day_high_price') }}</p>
                  </div>
                  <div :class="[$style.floatL, $style.textR, $style.width50]">
                    <p :class="[$style.up, $style.noSpace]"
                      ><template v-if="s_market_info.ticker.today_high">
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
                  </div>
                </li>
                <li :class="$style.clear">
                  <div :class="[$style.floatL, $style.textL, $style.width50]">
                    <p>{{ $t('b2c_exchange.low_price_on_the_day') }}</p>
                  </div>
                  <div :class="[$style.floatL, $style.textR, $style.width50]">
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
                  </div>
                </li>
              </ul>
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
                    <th colspan="2" :class="$style.clear">
                      <p :class="[$style.floatL]">{{
                        $t('b2c_exchange.tightening_strength')
                      }}</p>
                      <p :class="[$style.floatR, $style.noSpace]">+129.63%</p>
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
                :class="$style.clear"
              >
                <div :class="$style.rightArea">
                  <p :class="[$style.down, $style.noSpace]">{{
                    call_price | trimDecimalZero | numberFormat
                  }}</p>
                  <p :class="[$style.down, $style.floatR, $style.noSpace]"
                    >-1.02%</p
                  >
                </div>
                <div :class="$style.leftArea">
                  <div
                    :style="boxProgress(call_price, call_amount)"
                    :class="$style.box"
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
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/common.scss';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/b2c-m-exchange.scss';
</style>
