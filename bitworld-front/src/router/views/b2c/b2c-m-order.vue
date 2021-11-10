<script>
import { mapGetters, mapState } from 'vuex'
import Decimal from 'decimal.js'
import filter from 'lodash/filter'
import {
  createPublicOrder,
  fetchPublicAggtrades,
  fetchPublicOrderbooks,
  fetchPublicBalanceList,
} from '@apis/market'
import coinHeader from '@components/b2c/b2c-m-coin-header'
// import PublicMarketChart from '@components/public-market-chart'
import { encodeRoomName } from '@utils/socket'
import find from 'lodash/find'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import each from 'lodash/each'

export default {
  page: {
    title: 'exchange-order',
    meta: [{ name: 'description', content: 'exchange-order' }],
  },
  components: { coinHeader }, // PublicMarketChart
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
      num: 0,
      prices: [
        { value: '지정가', label: '지정가' },
        { value: '시장가', label: '시장가' },
      ],
      value: '',
      s_account_seq: null,
      order_params: {},
      order_loading: false,
      aggtrades: [],
      orderbooks: null,
      loading: false,
      balance_list: [],
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
    }),
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
    cs_balance_info() {
      if (!this.balance_list.length) return null

      return find(this.balance_list, { market_seq: this.s_market_info.seq })
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
  watch: {
    s_market_info() {
      this.init()
    },
  },
  beforeDestroy() {
    this.socketSubscribe(true)
  },
  created() {
    this.init()
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
        this.loadBalanceList(),
      ])
        .catch((error) => {
          this.$toasted.error(error.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    async loadBalanceList() {
      if (!this.loggedIn) return

      const { data } = await fetchPublicBalanceList()
      this.balance_list = data
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
    onAggtrade(data) {
      if (data.market_seq !== this.s_market_info.seq) return

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
    handleClick(tab, event) {},
    tabClick(tab, event) {},

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
    initOrderParams() {
      this.order_params = {
        side_type: this.order_params.side_type || 'BUY',
        call_price: '',
        call_amount: '',
      }
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
    handleCallAmount(percent) {
      if (!this.cs_account_info) return
      if (this.order_params.call_price <= 0) this.order_params.call_amount = 0
      else {
        const available_amount = new Decimal(
          this.cs_account_info.executable_balance / this.order_params.call_price
        )
        const slide = new Decimal(percent)
        this.order_params.call_amount = available_amount
          .mul(slide.div(100))
          .valueOf()
      }
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
  <div :id="$style.mobile" class="mbileExchangeOrder ">
    <coinHeader />

    <!-- //슬라이드 -->
    <section
      v-loading="loading"
      :class="[$style.orderArea, $style.clear]"
      class="orderArea"
    >
      <!-- 왼쪽 테이블창 -->
      <div :class="[$style.quoteArea, $style.quote, $style.floatL]">
        <PerfectScrollbar :class="$style.perfectScrollbar">
          <div
            :class="[$style.quoteUpArea, $style.quoteDownArea, $style.clear]"
          >
            <ul v-if="orderbooks" :class="[$style.quoteDownGraph]">
              <li
                v-for="[call_price, call_amount] in orderbooks.SELL"
                :key="call_price"
                :class="$style.clear"
              >
                <div :class="[$style.rightArea, $style.chartUp]">
                  <p :class="[$style.up, $style.noSpace]"
                    >{{ call_price | trimDecimalZero | numberFormat }}
                  </p>
                </div>
                <div :class="$style.leftArea">
                  <div
                    :style="boxProgress(call_price, call_amount)"
                    :class="[$style.box, $style.chartUp]"
                  ></div>
                  <p :class="[$style.textL, $style.noSpace]">{{
                    call_amount | trimDecimalZero | numberFormat
                  }}</p>
                </div>
              </li>
            </ul>
          </div>
          <!-- 상승 -->
          <div :class="[$style.quoteDownArea, $style.clear]">
            <ul v-if="orderbooks" :class="[$style.quoteDownGraph]">
              <li
                v-for="[call_price, call_amount] in orderbooks.BUY"
                :key="call_price"
                :class="$style.clear"
              >
                <div :class="[$style.rightArea, $style.chartDown]">
                  <p :class="[$style.down, $style.noSpace]"
                    >{{ call_price | trimDecimalZero | numberFormat }}
                  </p>
                </div>
                <div :class="$style.leftArea">
                  <div
                    :style="boxProgress(call_price, call_amount)"
                    :class="[$style.box, $style.chartDown]"
                  ></div>
                  <p :class="[$style.textL, $style.noSpace]">{{
                    call_amount | trimDecimalZero | numberFormat
                  }}</p>
                </div>
              </li>
            </ul>
          </div>
          <!-- //하락 -->
        </PerfectScrollbar>
      </div>
      <!-- 오른쪽 테이블창 -->
      <div :class="$style.buying">
        <el-tabs v-model="order_params.side_type">
          <el-tab-pane
            v-for="[side_type, side_type_title] in constants.market.public_order
              .side_type"
            :key="side_type"
            :label="side_type_title"
            :name="side_type"
            :class="$style.up"
          >
            <template v-if="order_params.side_type === side_type">
              <form class="buying" @submit.prevent="handleCreateOrder">
                <div :class="[$style.heldAssetsArea]">
                  <el-select
                    v-model="s_account_seq"
                    :class="$style.buyingLogin"
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
                <ul :class="$style.priceArea">
                  <li :class="$style.clear">
                    <div :class="$style.textBox">
                      <p>{{ $t('b2c_exchange.order_classification') }}</p>
                    </div>
                    <div :class="$style.selectBox" class="select-box">
                      <p>{{ $t('b2c_exchange.limits') }}</p>
                    </div>
                  </li>

                  <li :class="$style.clear">
                    <div :class="[$style.textBox]">
                      <p>{{
                        $t('b2c_exchange.maximum_order_price_quantity')
                      }}</p>
                    </div>
                    <div :class="[$style.selectBox]">
                      <p
                        ><strong v-if="cs_account_info">{{
                          order_params.call_price > 0
                            ? cs_account_info.executable_balance /
                              order_params.call_price
                            : 0 | codeDecimal(cs_account_info.asset_code)
                        }}</strong
                        >{{ s_market_info.source_asset_code }}</p
                      >
                    </div>
                  </li>
                  <li :class="$style.clear">
                    <div :class="[$style.textBox]">
                      <p>{{ $t('b2c_exchange.order_price') }}</p>
                    </div>
                    <div :class="$style.selectBox">
                      <el-input-number
                        v-model="order_params.call_price"
                        class="orderPrice"
                        controls-position="right"
                      ></el-input-number>
                      <!-- <div :class="$style.max_order">
                        <span>최대 주문 가능 수량</span>
                        <span :class="$style.noSpace">0.0000</span>
                      </div> -->
                    </div>
                  </li>
                  <li :class="$style.clear">
                    <ul>
                      <li :class="$style.textBox">
                        <p>{{ $t('b2c_exchange.order_quantity') }}</p>
                      </li>
                      <li
                        :class="[
                          $style.selectBox,
                          $style.inputBox,
                          $style.textR,
                        ]"
                      >
                        <el-input
                          v-model="order_params.call_amount"
                          :placeholder="$t('b2c_exchange.direct_input')"
                        ></el-input>
                      </li>
                    </ul>
                    <!-- <div :class="$style.block">
                      <el-slider v-model="value3" :step="25" show-stops>
                      </el-slider>
                    </div> -->
                    <ul>
                      <li
                        ><button @click.prevent="handleCallAmount(25)"
                          >25%</button
                        ></li
                      >
                      <li
                        ><button @click.prevent="handleCallAmount(50)"
                          >50%</button
                        ></li
                      >
                      <li
                        ><button @click.prevent="handleCallAmount(75)"
                          >75%</button
                        ></li
                      >
                      <li
                        ><button @click.prevent="handleCallAmount(100)"
                          >100%</button
                        ></li
                      >
                    </ul>
                  </li>
                  <li :class="$style.line"></li>
                  <li :class="[$style.totalPrice, $style.clear]">
                    <div :class="[$style.textBox, $style.orderAllPrice]">
                      <p>{{ $t('b2c_exchange.total_order_amount') }}</p>
                    </div>
                    <div :class="$style.selectBox">
                      <p
                        ><strong>{{
                          (order_params.call_price * order_params.call_amount)
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
                        <div :class="$style.textBox">
                          <p>{{ $t('b2c_exchange.minimum_ask_quantity') }}</p>
                        </div>
                        <div :class="$style.selectBox">
                          <p :class="$style.noSpace"
                            >{{
                              s_market_info.min_call_amount
                                | trimDecimalZero
                                | numberFormat
                            }}
                            {{ s_market_info.source_asset_code }}</p
                          >
                        </div>
                      </template>
                      <div :class="$style.textBox">
                        <p>{{ $t('b2c_exchange.quantity_user_fee_rate') }}</p>
                      </div>
                      <div :class="$style.selectBox">
                        <p :class="$style.noSpace"
                          >{{
                            s_market_info.taker_fee_rate
                              | trimDecimalZero
                              | numberFormat
                          }}%</p
                        >
                      </div>
                      <div :class="$style.textBox">
                        <p>{{
                          $t('b2c_exchange.quantity_creator_fee_rate')
                        }}</p>
                      </div>
                      <div :class="$style.selectBox">
                        <p :class="$style.noSpace"
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
      <!-- 차트 -->
      <!-- <PublicMarketChart
        ref="chart"
        :market_seq="s_market_info.seq"
        :class="$style.chart"
      ></PublicMarketChart> -->
      <!-- //오른쪽 매수 매도창 -->
    </section>
    <!-- //주문 창 -->
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/b2c-m-exchange.scss';
@import '@src/design/b2c/common.scss';
</style>
