<script>
import { mapState } from 'vuex'
import number_format from 'locutus/php/strings/number_format'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

export default {
  props: {
    table_visible_modal: {
      type: Boolean,
      default: false,
    },
    search_coin: {
      type: String,
      default: '',
    },
    change_asset_title: {
      type: Boolean,
      default: false,
    },
    sort_order: {
      type: String,
      default: 'price',
    },
    order_type: {
      type: String,
      default: 'DESC',
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('marketPublic', ['markets']),

    c_markets_filter() {
      let markets = filter(
        filter(
          this.markets,
          (market) =>
            !this.search_coin ||
            market.title
              .toLowerCase()
              .includes(this.search_coin.toLowerCase()) ||
            market.code.toLowerCase().includes(this.search_coin.toLowerCase())
        ),
        this.filters
      )
      if (this.sort_order !== '')
        markets = orderBy(
          markets,
          (market) => {
            return Number(market.ticker[this.sort_order])
          },
          [this.order_type.toLowerCase()]
        )
      return filter(markets, { is_active: 'Y' })
    },
  },
  methods: {
    number_format,
    handleSelectMarket(market_info) {
      this.$store.dispatch('marketPublic/selectMarket', market_info)
    },
  },
}
</script>
<template>
  <div
    :class="[
      { [$style.favoriteCoin]: !table_visible_modal },
      { ['popBody']: table_visible_modal },
    ]"
  >
    <template v-if="table_visible_modal">
      <PerfectScrollbar :class="[$style.perfectScrollbar]">
        <table>
          <colgroup>
            <col width="32%" />
            <col width="28%" />
            <col width="18%" />
            <col width="20%" />
          </colgroup>
          <transition-group name="flip-list" tag="tbody">
            <tr
              v-for="market in c_markets_filter"
              :key="market.seq"
              @click="handleSelectMarket(market)"
            >
              <td>
                <div class="left">
                  <img
                    v-if="0"
                    src="@src/assets/img/b2c/tradeStar.png"
                    alt="star"
                  />
                </div>
                <div class="right">
                  <strong>
                    <img
                      v-if="0"
                      src="@src/assets/img/b2c/mobilePopCoinB.png"
                      alt="코인"
                    />
                    {{ change_asset_title ? market.code : market.title }}
                  </strong>
                  <p>
                    <em>
                      {{ change_asset_title ? market.title : market.code }}
                    </em>
                  </p>
                </div>
              </td>
              <td>
                <h5
                  v-if="market.ticker.price"
                  :class="[$style.up, $style.textR]"
                  >{{
                    market.ticker.price | trimDecimalZero | numberFormat
                  }}</h5
                >
                <h5 v-else :class="[$style.up, $style.textR]">-</h5>
                <p v-if="0" :class="$style.textR">11,321,000<em>KRW</em></p>
                <p></p>
              </td>
              <td>
                <p :class="[$style.up, $style.textR]"
                  >{{ market.ticker.yesterday_vs_sign
                  }}{{
                    market.ticker.yesterday_vs_rate
                      ? number_format(market.ticker.yesterday_vs_rate, 2) + '%'
                      : '-'
                  }}
                </p>
              </td>
              <td>
                <p :class="$style.textR">{{
                  market.ticker.today_volume
                    ? market.ticker.today_volume
                    : '-' | trimDecimalZero | numberFormat
                }}</p>
              </td>
            </tr>
          </transition-group>
        </table>
      </PerfectScrollbar>
    </template>
    <template v-else>
      <PerfectScrollbar :class="[$style.perfectScrollbar]">
        <table>
          <colgroup>
            <col width="10%" />
            <col width="21%" />
            <col width="23%" />
            <col width="23%" />
            <col width="23%" />
          </colgroup>
          <transition-group name="flip-list" tag="tbody">
            <tr
              v-for="market in c_markets_filter"
              :key="market.seq"
              @click="handleSelectMarket(market)"
            >
              <td :class="$style.textL">
                <img
                  v-if="0"
                  src="@src/assets/img/b2c/tradeVoidStar.png"
                  alt="star"
                />
              </td>
              <td :class="$style.textL">
                <div :class="[$style.coinName]">
                  <h4>
                    {{ change_asset_title ? market.code : market.title }}
                  </h4>
                  <span>
                    {{ change_asset_title ? market.title : market.code }}
                  </span>
                </div>
              </td>
              <td>
                <div :class="[$style.coinPrice]">
                  <span
                    v-if="market.ticker.price"
                    :class="{
                      [$style[`${market.ticker.yesterday_vs_updown}`]]:
                        market.ticker.yesterday_vs_updown.length,
                    }"
                    >{{
                      market.ticker.price | trimDecimalZero | numberFormat
                    }}</span
                  >
                  <span
                    v-else
                    :class="{
                      [$style[`${market.ticker.yesterday_vs_updown}`]]:
                        market.ticker.yesterday_vs_updown.length,
                    }"
                    >{{ '-' }}</span
                  >
                </div>
              </td>
              <td>
                <div :class="[$style.coinPercentage]">
                  <p>
                    <span
                      :class="[
                        {
                          [$style[`${market.ticker.yesterday_vs_updown}`]]:
                            market.ticker.yesterday_vs_updown.length,
                        },
                      ]"
                    >
                      {{ market.ticker.yesterday_vs_sign
                      }}{{
                        market.ticker.yesterday_vs_rate
                          ? number_format(market.ticker.yesterday_vs_rate, 2) +
                            '%'
                          : '-'
                      }}
                    </span>
                  </p>
                </div>
              </td>
              <td>
                <div :class="[$style.coinPercentage]">
                  <p>
                    <em>
                      {{
                        market.ticker.today_volume
                          ? market.ticker.today_volume
                          : '-' | trimDecimalZero | numberFormat
                      }}
                    </em>
                  </p>
                </div>
              </td>
            </tr>
          </transition-group>
        </table>
      </PerfectScrollbar>
    </template>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/b2c-m-exchange.scss';
@import '@src/design/b2c/common.scss';
</style>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>
