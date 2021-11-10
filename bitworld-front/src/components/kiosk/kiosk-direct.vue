<script>
import KioskCoinList from '@components/kiosk/kiosk-coin-list'
import '@assets/css/kiosk/kiosk-direct.css'
import { mapState, mapGetters } from 'vuex'
import { fetchDirectMarkets, createDirectTransfer } from '@apis/market'
import assetDecimal from '@utils/asset-decimal'
import Decimal from 'decimal.js'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'

export default {
  components: {
    KioskCoinList,
  },
  data() {
    return {
      markets: [],
      params: {
        transfer_type: 'BID',
      },

      step: 'first',
      select_asset: {
        source_asset: 0,
        target_asset: 0,
      },
      source_asset_visible: false,
      target_asset_visible: false,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('account', ['accounts']),

    c_active_markets() {
      return filter(this.markets, {
        is_active: 'Y',
      })
    },
    c_selectable_source_assets() {
      if (!this.select_asset.target_asset) {
        const assets = uniq(
          map(this.c_active_markets, ({ source_asset_seq }) =>
            find(this.assets, {
              seq: source_asset_seq,
            })
          )
        )

        return assets
      }
      return uniq(
        map(
          filter(this.c_active_markets, {
            target_asset_seq: this.select_asset.target_asset,
          }),
          ({ source_asset_seq }) =>
            find(this.assets, {
              seq: source_asset_seq,
            })
        )
      )
    },
    c_selectable_target_assets() {
      if (!this.select_asset.source_asset) {
        const assets = uniq(
          map(this.c_active_markets, ({ target_asset_seq }) =>
            find(this.assets, {
              seq: target_asset_seq,
            })
          )
        )
        return assets
      }
      return uniq(
        map(
          filter(this.c_active_markets, {
            source_asset_seq: this.select_asset.source_asset,
          }),
          ({ target_asset_seq }) =>
            find(this.assets, {
              seq: target_asset_seq,
            })
        )
      )
    },
    c_selected_market() {
      return find(this.c_active_markets, {
        source_asset_seq: this.select_asset.source_asset,
        target_asset_seq: this.select_asset.target_asset,
      })
    },
    c_source_accounts() {
      if (!this.c_selected_market) return []

      return filter(this.accounts, {
        asset_seq: this.c_selected_market.source_asset_seq,
      })
    },
    c_target_accounts() {
      if (!this.c_selected_market) return []

      return filter(this.accounts, {
        asset_seq: this.c_selected_market.target_asset_seq,
      })
    },
    c_target_amount() {
      if (!this.params.source_amount) return null

      return assetDecimal(
        this.c_selected_market.target_asset_seq,
        this.c_exchange_rate
      )
        .mul(this.params.source_amount)
        .toString()
    },
    c_exchange_rate() {
      if (!this.c_selected_market) return 0

      return this.calcSpread(this.c_selected_market, this.params.transfer_type)
    },
    c_select_target_account() {
      return find(this.accounts, { seq: this.params.target_account_seq })
    },
    c_select_source_account() {
      return find(this.accounts, { seq: this.params.source_account_seq })
    },
  },
  watch: {
    source_asset_visible() {
      if (!this.source_asset_visible)
        document.body.classList.remove('popoverActive')
    },
    target_asset_visible() {
      if (!this.target_asset_visible)
        document.body.classList.remove('popoverActive')
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    setBodyClass() {
      var body = document.body
      body.classList.toggle('popoverActive')
    },
    greet: function(event) {
      alert('test' + this.name + '!')
      if (event) {
        alert(event.target.tagName)
      }
    },
    handleStepEvent() {
      this.step = 'second'
    },
    init() {
      Promise.all([this.loadMarkets()]).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
    },

    selectTargetAsset(seq) {
      if (this.s_target_asset === seq) {
        this.s_target_asset = null
      } else {
        this.s_target_asset = seq
      }
    },
    async loadMarkets() {
      const { data } = await fetchDirectMarkets()

      this.markets = data
    },

    resetParams() {
      this.params = {
        market_seq: null,
        source_account_seq: null,
        target_account_seq: null,
        source_amount: 0,
        transfer_type: null,
      }
    },
    assetDecimal,
    calcSpread(market, type) {
      const basic_rate = assetDecimal(
        market.target_asset_seq,
        market.basic_rate
      )
      const bid_spread_rate = new Decimal(market.bid_spread_rate)
      const ask_spread_rate = new Decimal(market.ask_spread_rate)

      switch (type) {
        case 'BID':
          return basic_rate.mul(bid_spread_rate.div(100).plus(1))
        case 'ASK':
          return basic_rate.mul(ask_spread_rate.div(-100).plus(1))
        default:
          break
      }
    },
    handleSubmitTransfer() {
      this.loading = true
      this.params.market_seq = this.c_selected_market.seq
      createDirectTransfer(this.params)
        .then(() =>
          this.$toasted.success(this.$t('toasted_msg.exchange'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        .then(() => this.$store.dispatch('account/getAccounts'))
        .then(() => {
          this.$emit('close_drawer')
          this.$emit('logout_event')
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        .finally(() => {
          this.loading = false
        })
    },
    selectCoin(seq) {
      this.select_asset.source_asset = seq
      this.source_asset_visible = false
    },
    targetCoin(seq) {
      this.select_asset.target_asset = seq
      this.target_asset_visible = false
    },

    Decimal,
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-img/coin-' + code + '.svg')
      } catch (e) {
        return default_img
      }
    },
  },
}
</script>

<template>
  <div>
    <KioskCoinList
      v-if="step === 'first'"
      v-model="select_asset"
      :step="step"
      @next_step="handleStepEvent"
    ></KioskCoinList>
    <div v-else :class="$style.kioskCoinList" class="kiosk-coin-list">
      <div :class="$style.container">
        <!-- 환전 정보 텍스트 -->
        <div
          :class="$style.transferTxt"
          v-html="
            this.params.transfer_type === 'BID'
              ? $t('kiosk.direct_exchange_txt', {
                  asset1: c_selected_market.source_asset_code,
                  asset2: c_selected_market.target_asset_code,
                })
              : $t('kiosk.direct_exchange_txt', {
                  asset1: c_selected_market.target_asset_code,
                  asset2: c_selected_market.source_asset_code,
                })
          "
        >
          <!-- <strong>{{ c_selected_market.source_asset_code }}</strong>
          <span>를 </span>
          <strong>{{ c_selected_market.target_asset_code }}</strong>
          <span>로 </span>
          <strong>환전</strong>
          <span> 합니다.</span> -->
        </div>
        <!-- //transferTxt -->
        <div :class="$style.buySellCoin">
          <div :class="[$style.buyCoin, { 'buy-coin': source_asset_visible }]">
            <div :class="$style.buyCoinTxt">
              <h2
                >{{ $t('act_buy') }} ({{ c_selected_market.target_asset_code }}
                <img src="@assets/kiosk-img/directex-arrow-right.svg" />
                {{ c_selected_market.source_asset_code }})</h2
              >
              <p
                >1 {{ c_selected_market.source_asset_code }} =
                {{
                  calcSpread(c_selected_market, 'BID')
                    | codeDecimal(c_selected_market.target_asset_code)
                }}
                {{ c_selected_market.target_asset_code }}</p
              >
            </div>
            <div ref="type_coin" :class="$style.buyCoinTit">
              <el-popover
                v-model="source_asset_visible"
                placement="bottom"
                width="1080"
                trigger="click"
                class="coin-popover"
              >
                <div class="coin-select">
                  <div :class="$style.kioskCoinList">
                    <div :class="$style.container">
                      <div :class="$style.coinBoxWrap">
                        <ul :class="$style.coinBox">
                          <li
                            v-for="source_asset in c_selectable_source_assets"
                            :key="source_asset.seq"
                            @click="selectCoin(source_asset.seq)"
                          >
                            <img :src="getAssetSrc(source_asset.code)" />
                            <span :class="$style.coinTit">{{
                              source_asset.code
                            }}</span>
                          </li>
                        </ul>

                        <!-- //coin-box -->
                      </div>
                      <div
                        v-if="0"
                        :class="$style.pageNavigation"
                        class="kiosk-page-nav"
                      >
                        <div :class="$style.pageBackBtn">
                          <img
                            src="@assets/kiosk-img/back-icon-white.svg"
                            alt=""
                          />
                        </div>
                        <ul :class="$style.page">
                          <li>
                            <span>A</span>
                          </li>
                          <li>
                            <span>B</span>
                          </li>
                          <li>
                            <span>C</span>
                          </li>
                          <li>
                            <span>D</span>
                          </li>
                          <li>
                            <span>E</span>
                          </li>
                          <li>
                            <span>F</span>
                          </li>
                          <li>
                            <span>G</span>
                          </li>
                          <li>
                            <span>H</span>
                          </li>
                          <li>
                            <span>I</span>
                          </li>
                          <li>
                            <span>J</span>
                          </li>
                          <li>
                            <span>K</span>
                          </li>
                        </ul>
                        <div :class="$style.pageNextBtn">
                          <img
                            src="@assets/kiosk-img/next-icon-white.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <el-button slot="reference" @click="setBodyClass">
                  <img
                    :src="getAssetSrc(c_selected_market.source_asset_code)"
                  />
                  <span>{{ c_selected_market.source_asset_code }}</span>
                  <img
                    v-if="!source_asset_visible"
                    :class="$style.down"
                    class="down"
                    src="@assets/kiosk-img/icon-down.svg"
                    alt="down"
                  />
                  <img
                    v-else
                    :class="$style.coinCancel"
                    class="coin-cancel"
                    src="@assets/kiosk-img/icon-coin-cancel.svg"
                    alt="cancel"
                  />
                </el-button>
              </el-popover>
            </div>
          </div>
          <div
            :class="[$style.sellCoin, { 'sell-coin': target_asset_visible }]"
          >
            <div :class="$style.sellCoinTxt">
              <h2
                >{{ $t('act_sell') }} ({{ c_selected_market.source_asset_code }}
                <img src="@assets/kiosk-img/directex-arrow-right.svg" />
                {{ c_selected_market.target_asset_code }})</h2
              >
              <p
                >1 {{ c_selected_market.source_asset_code }} =
                {{
                  calcSpread(c_selected_market, 'ASK')
                    | codeDecimal(c_selected_market.target_asset_code)
                }}
                {{ c_selected_market.target_asset_code }}</p
              >
            </div>
            <div :class="$style.sellCoinTit">
              <el-popover
                v-model="target_asset_visible"
                placement="bottom"
                width="1080"
                trigger="click"
                class="coin-popover"
              >
                <div class="coin-select">
                  <div :class="$style.kioskCoinList">
                    <div :class="$style.container">
                      <div :class="$style.coinBoxWrap">
                        <ul :class="$style.coinBox">
                          <li
                            v-for="target_asset in c_selectable_target_assets"
                            :key="target_asset.seq"
                            @click="targetCoin(target_asset.seq)"
                          >
                            <img :src="getAssetSrc(target_asset.code)" />
                            <span :class="$style.coinTit">{{
                              target_asset.code
                            }}</span>
                          </li>
                        </ul>

                        <!-- //coin-box -->
                      </div>
                      <div
                        v-if="0"
                        :class="$style.pageNavigation"
                        class="kiosk-page-nav"
                      >
                        <div :class="$style.pageBackBtn">
                          <img
                            src="@assets/kiosk-img/back-icon-white.svg"
                            alt=""
                          />
                        </div>
                        <ul :class="$style.page">
                          <li>
                            <span>A</span>
                          </li>
                          <li>
                            <span>B</span>
                          </li>
                          <li>
                            <span>C</span>
                          </li>
                          <li>
                            <span>D</span>
                          </li>
                          <li>
                            <span>E</span>
                          </li>
                          <li>
                            <span>F</span>
                          </li>
                          <li>
                            <span>G</span>
                          </li>
                          <li>
                            <span>H</span>
                          </li>
                          <li>
                            <span>I</span>
                          </li>
                          <li>
                            <span>J</span>
                          </li>
                          <li>
                            <span>K</span>
                          </li>
                        </ul>
                        <div :class="$style.pageNextBtn">
                          <img
                            src="@assets/kiosk-img/next-icon-white.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <el-button slot="reference" @click="setBodyClass">
                  <img
                    :src="getAssetSrc(c_selected_market.target_asset_code)"
                  />
                  <span>{{ c_selected_market.target_asset_code }}</span>
                  <img
                    v-if="!target_asset_visible"
                    :class="$style.down"
                    src="@assets/kiosk-img/icon-down.svg"
                    alt="down"
                  />
                  <img
                    v-else
                    :class="$style.coinCancel"
                    class="coin-cancel"
                    src="@assets/kiosk-img/icon-coin-cancel.svg"
                    alt="cancel"
                  />
                </el-button>
              </el-popover>
            </div>
          </div>
          <img
            src="@assets/kiosk-img/icon-exchange.svg"
            alt="transfer"
            :class="$style.iconExchange"
          />
        </div>
        <!-- //buy-sell-coin -->

        <div :class="$style.buySellMenu">
          <el-tabs
            v-model="params.transfer_type"
            type="border-card"
            class="buy-menu"
          >
            <el-tab-pane :label="$t('buy')" name="BID">
              <div class="kiosk-select-box">
                <h3
                  >{{ c_selected_market.target_asset_code }}
                  {{ $t('account') }}</h3
                >
                <el-select
                  v-model="params.target_account_seq"
                  :placeholder="
                    $t('kiosk.buy_with_coin_selected_account', {
                      code: c_selected_market.target_asset_code,
                    })
                  "
                >
                  <el-option
                    v-for="account in c_target_accounts"
                    :key="account.seq"
                    :value="account.seq"
                    :label="
                      account.title.length
                        ? account.title
                        : account.account_number
                    "
                  >
                  </el-option>
                </el-select>
                <p v-if="c_select_target_account" class="balance"
                  >{{ $t('balance') }}:
                  {{
                    Decimal(c_select_target_account.balance).minus(
                      c_select_target_account.holding_balance
                    ) | codeDecimal(c_select_target_account.code)
                  }}</p
                >
              </div>
              <div class="kiosk-select-box">
                <h3
                  >{{ c_selected_market.source_asset_code }}
                  {{ $t('account') }}</h3
                >
                <el-select
                  v-model="params.source_account_seq"
                  :placeholder="
                    $t('kiosk.receive_purchased_coin', {
                      code: c_selected_market.source_asset_code,
                    })
                  "
                >
                  <el-option
                    v-for="account in c_source_accounts"
                    :key="account.seq"
                    :value="account.seq"
                    :label="
                      account.title.length
                        ? account.title
                        : account.account_number
                    "
                  >
                  </el-option>
                </el-select>
                <p v-if="c_select_source_account" class="balance"
                  >{{ $t('balance') }}:
                  {{
                    Decimal(c_select_source_account.balance).minus(
                      c_select_source_account.holding_balance
                    ) | codeDecimal(c_select_source_account.code)
                  }}</p
                >
              </div>
              <div class="exchange-quantity">
                <h3
                  >{{ $t('private.direct_source_amount') }}
                  <span>({{ c_selected_market.source_asset_code }})</span></h3
                >
                <el-input-number v-model="params.source_amount">
                </el-input-number>
              </div>
              <div class="kiosk-select-box num">
                <h3
                  >{{ $t('private.direct_target_amount') }}
                  <span>({{ c_selected_market.target_asset_code }})</span>
                </h3>
                <el-input
                  disabled
                  :value="
                    c_target_amount
                      | codeDecimal(c_selected_market.target_asset_code)
                  "
                >
                </el-input>
              </div>
              <div class="kiosk-select-box direct-btn">
                <el-button class="cancel-btn" @click="$emit('close_drawer')">{{
                  $t('cancel')
                }}</el-button>
                <el-button class="buy-btn" @click="handleSubmitTransfer">{{
                  $t('buy')
                }}</el-button>
              </div>
            </el-tab-pane>
            <!-- ETH로 구매 -->

            <el-tab-pane :label="$t('sell')" name="ASK">
              <div class="kiosk-select-box">
                <h3
                  >{{ c_selected_market.source_asset_code }}
                  {{ $t('account') }}</h3
                >
                <el-select
                  v-model="params.source_account_seq"
                  :placeholder="
                    $t('kiosk.sell_with_coin_selected_account', {
                      code: c_selected_market.source_asset_code,
                    })
                  "
                >
                  <el-option
                    v-for="account in c_source_accounts"
                    :key="account.seq"
                    :value="account.seq"
                    :label="
                      account.title.length
                        ? account.title
                        : account.account_number
                    "
                  >
                  </el-option>
                </el-select>
                <p v-if="c_select_source_account" class="balance"
                  >{{ $t('balance') }}:
                  {{
                    Decimal(c_select_source_account.balance).minus(
                      c_select_source_account.holding_balance
                    ) | codeDecimal(c_select_source_account.code)
                  }}</p
                >
              </div>
              <div class="kiosk-select-box">
                <h3
                  >{{ c_selected_market.target_asset_code }}
                  {{ $t('account') }}</h3
                >
                <el-select
                  v-model="params.target_account_seq"
                  :placeholder="
                    $t('kiosk.receive_converted_coin', {
                      code: c_selected_market.target_asset_code,
                    })
                  "
                >
                  <el-option
                    v-for="account in c_target_accounts"
                    :key="account.seq"
                    :value="account.seq"
                    :label="
                      account.title.length
                        ? account.title
                        : account.account_number
                    "
                  >
                  </el-option>
                </el-select>
                <p v-if="c_select_target_account" class="balance"
                  >{{ $t('balance') }}:
                  {{
                    Decimal(c_select_target_account.balance).minus(
                      c_select_target_account.holding_balance
                    ) | codeDecimal(c_select_target_account.code)
                  }}</p
                >
              </div>
              <div class="exchange-quantity">
                <h3
                  >{{ $t('private.direct_source_amount') }}
                  <span>({{ c_selected_market.source_asset_code }})</span></h3
                >
                <el-input-number v-model="params.source_amount">
                </el-input-number>
              </div>
              <div class="kiosk-select-box num">
                <h3
                  >{{ $t('private.direct_target_amount') }}
                  <span>({{ c_selected_market.target_asset_code }})</span>
                </h3>
                <el-input
                  disabled
                  :value="
                    c_target_amount
                      | codeDecimal(c_selected_market.target_asset_code)
                  "
                >
                </el-input>
              </div>
              <div class="kiosk-select-box direct-btn">
                <el-button class="cancel-btn" @click="$emit('drawer_close')">{{
                  $t('cancel')
                }}</el-button>
                <el-button class="buy-btn" @click="handleSubmitTransfer">{{
                  $t('sell')
                }}</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-coin-list.scss';
</style>
