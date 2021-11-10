<script>
import { mapGetters, mapState } from 'vuex'
import coinHeader from '@components/b2c/b2c-m-coin-header'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import { fetchPublicAggtrades } from '@apis/market'

export default {
  page: {
    title: 'exchange-order-detail',
    meta: [{ name: 'description', content: 'exchange-order-detail' }],
  },
  components: { coinHeader },
  data() {
    return {
      input: '',
      value1: '',
      value2: '',
      value3: 0,
      num: 1,
      aggtrades: [],
    }
  },
  computed: {
    ...mapGetters('marketPublic', [
      's_market_info',
      'target_assets',
      's_open_orders',
    ]),
    ...mapState('auth', ['currentUser']),
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('common', ['constants']),
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([this.loadAggtrades()]).catch((e) =>
        this.$toasted.error(e.message)
      )
    },
    date,
    fromPairs,
    async loadAggtrades() {
      const { data } = await fetchPublicAggtrades({
        market_seq: this.s_market_info.seq,
        limit: 20,
      })

      this.aggtrades = data.reverse()
    },
  },
}
</script>

<template>
  <div
    :id="$style.mobile"
    :class="$style.mobileOrderDetail"
    class="mobileOrderDetail"
  >
    <div>
      <coinHeader />
      <div :class="[$style.orderDate]">
        <table :class="[$style.orderTable]">
          <colgroup>
            <col width="172px" />
            <col width="132px" />
            <col width="117px" />
            <col width="145px" />
            <col width="69px" />
          </colgroup>
          <thead>
            <tr>
              <th rowspan="2">{{ $t('b2c_exchange.order_date_and_time') }}</th>
              <th rowspan="2">{{ $t('b2c_exchange.transaction_coin') }}</th>
              <th>{{ $t('b2c_exchange.order_quantity') }}</th>
              <th>{{ $t('b2c_exchange.order_price') }}</th>
              <th>{{ $t('b2c_exchange.state') }}</th>
              <!-- <th>주문취소</th> -->
            </tr>
            <tr>
              <th
                ><strong>{{ $t('b2c_exchange.untraded_quantity') }}</strong></th
              >
              <th
                ><strong>{{ $t('b2c_exchange.current_price') }}</strong></th
              >
              <th
                ><strong>{{ $t('b2c_exchange.division') }}</strong></th
              >
            </tr>
          </thead>
        </table>
        <div :class="[$style.tableScrollY]">
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <table :class="[$style.orderTable]">
              <colgroup>
                <col width="172px" />
                <col width="132px" />
                <col width="117px" />
                <col width="145px" />
                <col width="69px" />
              </colgroup>
              <tbody>
                <template v-for="open_order in s_open_orders">
                  <tr :key="`${open_order.seq}-1`">
                    <td rowspan="2">{{
                      date('Y.m.d H:i:s', new Date(open_order.regdate))
                    }}</td>
                    <td rowspan="2">{{ open_order.market_code }}</td>
                    <td :class="$style.noSpace">{{
                      open_order.call_amount | trimDecimalZero | numberFormat
                    }}</td>
                    <td :class="$style.noSpace">{{
                      open_order.call_price | trimDecimalZero | numberFormat
                    }}</td>
                    <td>{{
                      fromPairs(constants.market.public_order.status)[
                        open_order.status
                      ]
                    }}</td>
                  </tr>
                  <tr :key="`${open_order.seq}-2`">
                    <td>{{
                      open_order.executable_amount
                        | trimDecimalZero
                        | numberFormat
                    }}</td>
                    <td>{{ s_market_info.ticker.price }}</td>
                    <td
                      :class="
                        open_order.side_type === 'BUY' ? $style.up : $style.down
                      "
                      >{{
                        fromPairs(constants.market.public_order.side_type)[
                          open_order.side_type
                        ]
                      }}</td
                    >
                  </tr>
                </template>
              </tbody>
            </table>
          </PerfectScrollbar>
        </div>
      </div>
      <!-- //주문 -->
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/b2c-m-exchange.scss';
@import '@src/design/b2c/common.scss';
</style>
