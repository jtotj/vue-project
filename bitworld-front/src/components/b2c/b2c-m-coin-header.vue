<script>
import { mapState, mapGetters } from 'vuex'
import filter from 'lodash/filter'

import '@assets/css/b2c/b2c-exchange.css'
import '@assets/css/b2c/b2c-m-exchange.css'
import '@assets/css/b2c/reset.css'
import Swiper from 'swiper/js/swiper.esm.bundle'
import 'swiper/css/swiper.css'
import {
  fetchPublicAggtrades,
  fetchPublicOrderbooks,
  fetchPublicKlines,
} from '@apis/market'
import { encodeRoomName } from '@utils/socket'
import number_format from 'locutus/php/strings/number_format'
import CoinList from '@components/b2c/b2c-coin-list'

export default {
  components: {
    CoinList,
  },
  data() {
    return {
      table_visible_modal: false,
      swiper: null,
      activeName: '',
      public_markets: [],
      aggtrades: [],
      klines: [],
      input_target_asset: '',

      search_coin: '',
      change_asset_title: false,
      sort_order: '',
      order_type: 'DESC',
    }
  },
  computed: {
    ...mapState('marketPublic', ['markets']),
    ...mapGetters('marketPublic', [
      's_market_info',
      'target_assets',
      's_open_orders',
    ]),
    ...mapState('auth', ['currentUser']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
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
  created() {
    this.init()
  },
  mounted() {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 4.5,
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  },
  methods: {
    init() {
      Promise.all([
        this.loadAggtrades(),
        this.loadOrderbooks(),
        this.load1DKlineList(),
      ]).catch((error) => {
        this.$toasted.error(error.message)
      })
    },

    tableVisibleMdoal() {
      this.table_visible_modal = true
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
    handleSelectMarket(market_info) {
      this.$store.dispatch('marketPublic/selectMarket', market_info)
      this.init()
      this.table_visible_modal = false
    },
    socketUnsubscribe() {},
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
    async load1DKlineList() {
      const { data } = await fetchPublicKlines({
        market_seq: this.s_market_info.seq,
        interval_type: '1D',
      })
      this.klines = data.reverse()
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
    number_format,
    changeSort(sort_order) {
      if (sort_order !== this.sort_order) {
        this.order_type = 'DESC'
      } else {
        this.order_type = this.order_type === 'DESC' ? 'ASC' : 'DESC'
      }

      this.sort_order = sort_order
    },
  },
}
</script>
<template>
  <div :id="$style.mobile">
    <section :class="[$style.coinName, $style.clear]">
      <div :class="[$style.nameArea, $style.clear]">
        <div :class="[$style.clear, $style.floatL, $style.marketPriceArea]">
          <h2
            :class="[
              {
                [$style[s_market_info.ticker.yesterday_vs_updown]]:
                  s_market_info.ticker.yesterday_vs_updown.length,
              },
            ]"
            >{{ s_market_info.ticker.price }}</h2
          >

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
              {{
                number_format(s_market_info.ticker.yesterday_vs_rate, 2)
              }}%</span
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
                src="@src/assets/img/b2c/up_triangle_m.png"
                alt="up"
              />
              ({{ s_market_info.ticker.yesterday_vs_sign
              }}{{ s_market_info.ticker.yesterday_vs }})
            </span>
          </div>
        </div>
        <!-- <div :class="[$style.clear, $style.floatR, $style.coinSearchArea]"> -->
        <div :class="[$style.coinSearchArea]">
          <p>
            <img v-if="0" src="@src/assets/img/b2c/bit_m.png" alt="bit coin" />
          </p>
          <div :class="[$style.hArea]">
            <h3>{{ s_market_info.title }}</h3>
            <span>{{ s_market_info.code }}</span>
          </div>
          <el-button
            type="text"
            class="searchArrow"
            :class="$style.searchArrow"
            @click="tableVisibleMdoal"
          >
            <div :class="[$style.searchCoin]">
              <img src="@src/assets/img/b2c/search_m.png" alt="search coin" />
            </div>
          </el-button>

          <el-dialog
            class="searchPopUp mobileSearchPopUp"
            :visible.sync="table_visible_modal"
            width="50%"
            :append-to-body="true"
          >
            <form :class="[$style.inputBox]" class="inputBox">
              <input
                v-model="search_coin"
                type="text"
                :placeholder="$t('b2c_exchange.coin_name_and_symbol_search')"
              />
              <img src="@src/assets/img/b2c/mobileSearch.png" alt="search" />
            </form>
            <el-tabs v-model="activeName">
              <el-tab-pane :label="$t('b2c_exchange.event')">
                <div :class="[$style.popBody]" class="popBody">
                  <table>
                    <colgroup>
                      <col width="32%" />
                      <col width="28%" />
                      <col width="18%" />
                      <col width="20%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>
                          <div
                            class="thContent"
                            :class="[$style.textR, $style.clear]"
                            @click="change_asset_title = !change_asset_title"
                          >
                            <p>
                              {{
                                change_asset_title
                                  ? $t('Coin_name')
                                  : $t('b2c_exchange.market_name')
                              }}
                            </p>
                            <img
                              src="@src/assets/img/b2c/icon_change_language.svg"
                              alt="change language"
                            />
                          </div>
                        </th>
                        <th
                          :class="$style.textR"
                          :data-sort="sort_order === 'price' ? order_type : ''"
                          @click="changeSort('price')"
                        >
                          <div class="thContent" :class="$style.clear">
                            <p>{{ $t('b2c_exchange.present_price') }}</p>
                            <div
                              :class="[
                                $style.upDownButton,
                                {
                                  [$style.activeUp]:
                                    sort_order === 'price' &&
                                    order_type === 'DESC',
                                },
                                {
                                  [$style.activeDown]:
                                    sort_order === 'price' &&
                                    order_type === 'ASC',
                                },
                              ]"
                            >
                              <div :class="[$style.upBtn]"></div>
                              <div :class="[$style.downBtn]"></div>
                            </div>
                          </div>
                        </th>
                        <th
                          :class="$style.textR"
                          :data-sort="
                            sort_order === 'yesterday_vs_rate' ? order_type : ''
                          "
                          @click="changeSort('yesterday_vs_rate')"
                        >
                          <div class="thContent" :class="$style.clear">
                            <p>{{
                              $t('b2c_exchange.compared_to_the_previous_day')
                            }}</p>
                            <div
                              :class="[
                                $style.upDownButton,
                                {
                                  [$style.activeUp]:
                                    sort_order === 'yesterday_vs_rate' &&
                                    order_type === 'DESC',
                                },
                                {
                                  [$style.activeDown]:
                                    sort_order === 'yesterday_vs_rate' &&
                                    order_type === 'ASC',
                                },
                              ]"
                            >
                              <div :class="[$style.upBtn]"></div>
                              <div :class="[$style.downBtn]"></div>
                            </div>
                          </div>
                        </th>
                        <th
                          :class="$style.textR"
                          :data-sort="
                            sort_order === 'today_volume' ? order_type : ''
                          "
                          @click="changeSort('today_volume')"
                        >
                          <div class="thContent" :class="$style.clear">
                            <p>{{ $t('b2c_exchange.transaction_price') }}</p>
                            <div
                              :class="[
                                $style.upDownButton,
                                {
                                  [$style.activeUp]:
                                    sort_order === 'today_volume' &&
                                    order_type === 'DESC',
                                },
                                {
                                  [$style.activeDown]:
                                    sort_order === 'today_volume' &&
                                    order_type === 'ASC',
                                },
                              ]"
                            >
                              <div :class="[$style.upBtn]"></div>
                              <div :class="[$style.downBtn]"></div>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <CoinList
                    :search_coin="search_coin"
                    :change_asset_title="change_asset_title"
                    :sort_order="sort_order"
                    :order_type="order_type"
                    :table_visible_modal="table_visible_modal"
                  />
                  <!-- <PerfectScrollbar v-if="0" :class="[$style.perfectScrollbar]">
                    <table>
                      <colgroup>
                        <col width="32%" />
                        <col width="28%" />
                        <col width="18%" />
                        <col width="20%" />
                      </colgroup>
                      <tbody>
                        <tr
                          v-for="market in c_is_filter_asset"
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
                                {{ market.title }}
                              </strong>
                              <p>
                                <em>{{ market.code }}</em>
                              </p>
                            </div>
                          </td>
                          <td>
                            <h5
                              v-if="market.ticker.price"
                              :class="[$style.up, $style.textR]"
                              >{{ market.ticker.price }}</h5
                            >
                            <h5 v-else :class="[$style.up, $style.textR]">-</h5>
                            <p v-if="0" :class="$style.textR"
                              >11,321,000<em>KRW</em></p
                            >
                            <p></p>
                          </td>
                          <td>
                            <p :class="[$style.up, $style.textR]">{{
                              number_format(market.ticker.yesterday_vs_rate, 2)
                            }}</p>
                          </td>
                          <td>
                            <p
                              v-if="market.ticker.today_volume"
                              :class="$style.textR"
                              >{{
                                market.ticker.today_volume
                                  | trimDecimalZero
                                  | numberFormat
                              }}</p
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </PerfectScrollbar> -->
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="0" :label="$t('b2c_exchange.won_pay')">
                <div :class="[$style.popBody]" class="popBody">
                  <table>
                    <colgroup>
                      <col width="32%" />
                      <col width="28%" />
                      <col width="18%" />
                      <col width="20%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>
                          <div
                            class="thContent"
                            :class="[$style.textR, $style.clear]"
                          >
                            <p :class="$style.floatL">{{ $t('Coin_name') }}</p>
                            <ul :class="$style.floatL">
                              <li
                                ><img
                                  src="@src/assets/img/b2c/topArrow.png"
                                  alt=""
                              /></li>
                              <li
                                ><img
                                  src="@src/assets/img/b2c/bottomArrow.png"
                                  alt=""
                              /></li>
                            </ul>
                          </div>
                        </th>
                        <th :class="$style.textR">
                          <div class="thContent" :class="$style.clear">
                            <p :class="$style.floatL">{{
                              $t('b2c_exchange.present_price')
                            }}</p>
                            <ul :class="$style.floatL">
                              <li
                                ><img
                                  src="@src/assets/img/b2c/topArrow.png"
                                  alt=""
                              /></li>
                              <li
                                ><img
                                  src="@src/assets/img/b2c/activeBottomArrow.png"
                                  alt=""
                              /></li>
                            </ul>
                          </div>
                        </th>
                        <th :class="$style.textR">
                          <div class="thContent" :class="$style.clear">
                            <p :class="$style.floatL">{{
                              $t('b2c_exchange.compared_to_the_previous_day')
                            }}</p>
                            <ul :class="$style.floatL">
                              <li
                                ><img
                                  src="@src/assets/img/b2c/topArrow.png"
                                  alt=""
                              /></li>
                              <li
                                ><img
                                  src="@src/assets/img/b2c/bottomArrow.png"
                                  alt=""
                              /></li>
                            </ul>
                          </div>
                        </th>
                        <th :class="$style.textR">
                          <div class="thContent" :class="$style.clear">
                            <p :class="$style.floatL">{{
                              $t('b2c_exchange.transaction_price')
                            }}</p>
                            <ul :class="$style.floatL">
                              <li
                                ><img
                                  src="@src/assets/img/b2c/topArrow.png"
                                  alt=""
                              /></li>
                              <li
                                ><img
                                  src="@src/assets/img/b2c/bottomArrow.png"
                                  alt=""
                              /></li>
                            </ul>
                          </div>
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <PerfectScrollbar :class="[$style.perfectScrollbar]">
                    <table>
                      <colgroup>
                        <col width="32%" />
                        <col width="28%" />
                        <col width="18%" />
                        <col width="20%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>
                            <div class="left">
                              <img
                                src="@src/assets/img/b2c/mobilePopStar.png"
                                alt=""
                              />
                            </div>
                            <div class="right">
                              <strong>
                                <img
                                  src="@src/assets/img/b2c/mobilePopCoinB.png"
                                  alt=""
                                />
                                {{ $t('bit_coin') }}
                              </strong>
                              <p><em>BTC/CCF</em></p>
                            </div>
                          </td>
                          <td>
                            <h5 :class="[$style.up, $style.textR]">9,389.00</h5>
                            <p :class="$style.textR">11,321,000<em>KRW</em></p>
                            <p></p>
                          </td>
                          <td>
                            <p :class="[$style.up, $style.textR]">+ 0.14%</p>
                          </td>
                          <td>
                            <p :class="$style.textR">5,149.62</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </PerfectScrollbar>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="0" label="CCF">
                <div :class="[$style.popBody]" class="popBody">
                  <table>
                    <colgroup>
                      <col width="32%" />
                      <col width="28%" />
                      <col width="18%" />
                      <col width="20%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>
                          <div
                            class="thContent"
                            :class="[$style.textR, $style.clear]"
                          >
                            <p :class="$style.floatL">{{ $t('Coin_name') }}</p>
                            <ul :class="$style.floatL">
                              <li
                                ><img
                                  src="@src/assets/img/b2c/topArrow.png"
                                  alt=""
                              /></li>
                              <li
                                ><img
                                  src="@src/assets/img/b2c/bottomArrow.png"
                                  alt=""
                              /></li>
                            </ul>
                          </div>
                        </th>
                        <th :class="$style.textR">
                          <div class="thContent" :class="$style.clear">
                            <p :class="$style.floatL">{{
                              $t('b2c_exchange.present_price')
                            }}</p>
                            <ul :class="$style.floatL">
                              <li
                                ><img
                                  src="@src/assets/img/b2c/topArrow.png"
                                  alt=""
                              /></li>
                              <li
                                ><img
                                  src="@src/assets/img/b2c/activeBottomArrow.png"
                                  alt=""
                              /></li>
                            </ul>
                          </div>
                        </th>
                        <th :class="$style.textR">
                          <div class="thContent" :class="$style.clear">
                            <p :class="$style.floatL">{{
                              $t('b2c_exchange.compared_to_the_previous_day')
                            }}</p>
                            <ul :class="$style.floatL">
                              <li
                                ><img
                                  src="@src/assets/img/b2c/topArrow.png"
                                  alt=""
                              /></li>
                              <li
                                ><img
                                  src="@src/assets/img/b2c/bottomArrow.png"
                                  alt=""
                              /></li>
                            </ul>
                          </div>
                        </th>
                        <th :class="$style.textR">
                          <div class="thContent" :class="$style.clear">
                            <p :class="$style.floatL">{{
                              $t('b2c_exchange.transaction_price')
                            }}</p>
                            <ul :class="$style.floatL">
                              <li
                                ><img
                                  src="@src/assets/img/b2c/topArrow.png"
                                  alt=""
                              /></li>
                              <li
                                ><img
                                  src="@src/assets/img/b2c/bottomArrow.png"
                                  alt=""
                              /></li>
                            </ul>
                          </div>
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <PerfectScrollbar :class="[$style.perfectScrollbar]">
                    <div class="noMarketArea">
                      <div class="noMarket" :class="[$style.textC]">
                        <img
                          src="@src/assets/img/b2c/noneIcon.png"
                          alt="none Icon"
                        />
                        <p>{{ $t('b2c_exchange.no_market') }}</p>
                      </div>
                    </div>
                  </PerfectScrollbar>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-dialog>
          <!-- //팝업 -->
        </div>
        <!-- <div :class="[$style.nameArea]">
          <div :class="[$style.clear]">
            <p :class="[$style.floatL]"
              ><img src="@src/assets/img/b2c/bit.png" alt="bit coin"
            /></p>
            <h3
              :class="[
                {
                  [$style[s_market_info.ticker.vs_updown]]: s_market_info.ticker.vs_updown.length,
                },
              ]"
              >{{ s_market_info.title }}</h3
            >
            <span>{{ s_market_info.code }}</span>
          </div>
          <div :class="[$style.clear]">
            <h2
              :class="[
                {
                  [$style[s_market_info.ticker.vs_updown]]: s_market_info.ticker.vs_updown.length,
                },
              ]"
              >{{ s_market_info.ticker.price | numberFormat }}</h2
            >
            <div
              :class="[
                $style.percentage,
                $style.noSpace,
                {
                  [$style[`${s_market_info.ticker.vs_updown}Background`]]:
                    s_market_info.ticker.vs_updown.length,
                },
              ]"
              >{{ s_market_info.ticker.vs_sign }}
              {{
                number_format(market.ticker.yesterday_vs_rate, 2) | numberFormat
              }}%</div
            >
          </div>
        </div>
        <div :class="[$style.clear, $style.yesterdayPoint]">
          <span>전일 대비</span>
          <span
            :class="[
              $style.noSpace,
              {
                [$style[s_market_info.ticker.vs_updown]]: s_market_info.ticker.vs_updown.length,
              },
            ]"
            >{{ s_market_info.ticker.vs_sign }}
            {{
              number_format(market.ticker.yesterday_vs_rate, 2) | numberFormat
            }}%</span
          >
          <span
            :class="[
              $style.noSpace,
              {
                [$style[s_market_info.ticker.vs_updown]]: s_market_info.ticker.vs_updown.length,
              },
            ]"
          >
            <img v-if="0" src="@src/assets/img/b2c/up_triangle.png" alt="up" />
            ({{ s_market_info.ticker.vs_sign
            }}{{ s_market_info.ticker.yesterday_vs | numberFormat }})
          </span>
        </div> -->
      </div>
    </section>
    <!-- //코인 이름 -->
    <section :class="$style.mobileSlide">
      <div :class="$style.coinArea" class="swiper-container b2c-m-menu">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :class="$style.coinAreaSection">
            <router-link :to="{ name: 'exchange-order' }">
              <!-- $t('wallet_page.have_asset') }}-->
              {{ $t('b2c_exchange.coin_order') }}
            </router-link>
          </div>
          <div class="swiper-slide" :class="$style.coinAreaSection">
            <router-link :to="{ name: 'exchange-quote' }">
              {{ $t('b2c_exchange.asking_price') }}
            </router-link>
          </div>
          <div class="swiper-slide" :class="$style.coinAreaSection">
            <router-link :to="{ name: 'exchange-chart' }">
              {{ $t('b2c_exchange.chart') }}
            </router-link>
          </div>
          <div class="swiper-slide" :class="$style.coinAreaSection">
            <router-link :to="{ name: 'exchange-price' }">
              {{ $t('b2c_exchange.quote') }}
            </router-link>
          </div>
          <div class="swiper-slide" :class="$style.coinAreaSection">
            <router-link :to="{ name: 'exchange-order-detail' }">
              {{ $t('b2c_exchange.order_details') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <!-- //슬라이드 -->
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/b2c-m-exchange.scss';
@import '@src/design/b2c/common.scss';

.upDownButton {
  display: inline-block;
  width: 6px;
  height: 9px;
  margin-left: 1px;
  div {
    display: block;
    width: 6px;
    height: 4px;
    cursor: pointer;
    background-size: cover !important;
    &:first-child {
      margin-bottom: 2px;
      background: url('@src/assets/img/b2c/icon_up_arrow.svg') no-repeat;
    }
    &:last-child {
      background: url('@src/assets/img/b2c/icon_down_arrow.svg') no-repeat;
    }
  }
  &.activeUp {
    .upBtn {
      background: url('@src/assets/img/b2c/icon_up_arrow_black.svg') no-repeat;
    }
  }
  &.activeDown {
    .downBtn {
      background: url('@src/assets/img/b2c/icon_down_arrow_black.svg') no-repeat;
    }
  }
}
</style>
