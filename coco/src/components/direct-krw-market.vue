<script>
import { mapState, mapGetters } from 'vuex'
import { fetchDirectMarkets, createDirectTransfer } from '@apis/market'
import assetDecimal from '@utils/asset-decimal'
import Decimal from 'decimal.js'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import remove from 'lodash/remove'
import findIndex from 'lodash/findIndex'

export default {
  filters: {
    currency(value) {
      if (!value) return ''
      return value.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
  },
  data() {
    return {
      coin_select_modal: false,
      markets: [],
      params: {},
      show_dialog: false,
      loading: false,
      s_source_asset: null,
      s_source_asset_code: null,
      s_source_asset_seq: null,
      s_target_asset: null,
      s_target_asset_code: null,
      s_target_asset_seq: null,
      open_mobile_tab: null,
      selected_offer_type: 'buy',
      s_source_open: false,
      s_target_open: false,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('account', ['accounts']),

    c_active_markets() {
      const active_markets = filter(this.markets, { is_active: 'Y' })
      const gix_market = filter(active_markets, (market) => {
        return (
          market.source_asset_code === 'GIX' ||
          market.target_asset_code === 'GIX'
        )
      })

      remove(active_markets, (market) => {
        return (
          market.source_asset_code === 'GIX' ||
          market.target_asset_code === 'GIX'
        )
      })

      const index = findIndex(active_markets, (obj) => {
        return (
          obj.source_asset_code === 'SNF' && obj.target_asset_code === 'CCE'
        )
      })
      active_markets.splice(index, 0, ...gix_market)
      return active_markets
    },
    c_selectable_source_assets() {
      if (!this.s_target_asset_seq) {
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
            target_asset_seq: this.s_target_asset_seq,
          }),
          ({ source_asset_seq }) =>
            find(this.assets, {
              seq: source_asset_seq,
            })
        )
      )
    },
    c_selectable_target_assets() {
      if (!this.s_source_asset_seq) {
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
            source_asset_seq: this.s_source_asset_seq,
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
        source_asset_seq: this.s_source_asset_seq,
        target_asset_seq: this.s_target_asset_seq,
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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([this.loadMarkets()]).catch((e) =>
        this.$toasted.error(e.message)
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

    handleCreateTransfer(market_seq, transfer_type) {
      if (this.loggedIn) {
        this.resetParams()
        this.params.market_seq = market_seq
        this.params.transfer_type = transfer_type
        this.show_dialog = true
      } else {
        this.$router.push({ name: 'login-me' })
      }
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
      createDirectTransfer(this.params)
        .then(() => {
          this.$notify({
            title: this.$t('toasted_msg.title'),
            message: this.$t('toasted_msg.exchange'),
            type: 'success',
          })
          this.show_dialog = false
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    selectCoin(title, seq, code) {
      this.s_source_asset = title
      this.s_source_asset_code = code
      this.s_source_asset_seq = seq
    },
    targetCoin(title, seq, code) {
      this.s_target_asset = title
      this.s_target_asset_code = code
      this.s_target_asset_seq = seq
    },
    disableBtn() {
      if (this.s_source_asset === null) {
        this.$toasted.error(this.$t('private.please_select_asset'))
      } else if (
        this.c_selected_market.allow_bid === 'N' ||
        this.c_selected_market.allow_ask === 'N'
      ) {
        this.$toasted.error(this.$t('toasted_msg.not_allow_trade'))
      } else {
        this.$toasted.error(this.$t('toasted_msg.no_transfer'))
      }
    },
    Decimal,
  },
}
</script>

<template>
  <div class="direct-krw-market">
    <div class="coin-box-wrap">
      <div class="coin-box">
        <h3>
          {{ $t('direct_exchange.sell_buy_assets') }}
        </h3>
        <div
          class="coin-select please-coin-select"
          @click="s_source_open = !s_source_open"
        >
          <div class="coin-select-item">
            <div v-if="!s_source_asset" class="no-coin">
              <img src="@assets/img/coin-default.svg" />
            </div>
            <div :class="['select-coin-icon', `${s_source_asset_code}`]"></div>
          </div>
          <div class="select-tag">
            <span :class="{ active: s_source_asset }">
              {{ s_source_asset || $t('private.direct_asset_select') }}
            </span>
          </div>

          <div :class="['drop-icon', { open: s_source_open }]">
            <img src="@assets/img/arrow-bottom.svg" />
          </div>
          <div v-if="s_source_open" class="select-box">
            <div class="coin-select-box">
              <div
                v-if="s_source_asset"
                class="select-cancle"
                @click="
                  ;(s_source_asset = null),
                    (s_source_asset_code = null),
                    (s_source_asset_seq = null)
                "
              >
                <span>{{ $t('select_cancel') }}</span>
              </div>

              <div
                v-for="list in c_selectable_source_assets"
                :key="list.seq"
                class="source"
              >
                <div
                  class="source-asset asset-item"
                  :class="{ selected: list.title === s_source_asset }"
                  @click="selectCoin(list.title, list.seq, list.code)"
                >
                  <div :class="`${list.code}`" class="coin-item"></div>
                  <span>{{ list.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="coin-box">
        <h3>
          {{ $t('direct_exchange.replace_assets') }}
        </h3>
        <div
          class="coin-select please-asset-select"
          @click="s_target_open = !s_target_open"
        >
          <div class="coin-select-item">
            <div v-if="!s_target_asset" class="no-coin">
              <img src="@assets/img/coin-default.svg" />
            </div>
            <div :class="['select-coin-icon', `${s_target_asset_code}`]"></div>
          </div>
          <div class="select-tag">
            <span :class="{ active: s_target_asset }">
              {{ s_target_asset || $t('private.transfer_asset_select') }}
            </span>
          </div>

          <div :class="['drop-icon', { open: s_target_open }]">
            <img src="@assets/img/arrow-bottom.svg" />
          </div>
          <div v-if="s_target_open" class="select-box">
            <div class="coin-select-box">
              <div
                v-if="s_target_asset"
                class="select-cancle"
                @click="
                  ;(s_target_asset = null),
                    (s_target_asset_code = null),
                    (s_target_asset_seq = null)
                "
              >
                <span>{{ $t('select_cancel') }}</span>
              </div>
              <div
                v-for="list in c_selectable_target_assets"
                :key="list.seq"
                class="source"
              >
                <div
                  class="target-asset asset-item"
                  :class="{ selected: list.title === s_target_asset }"
                  @click="targetCoin(list.title, list.seq, list.code)"
                >
                  <div :class="`${list.code}`" class="coin-item"></div>
                  <span>{{ list.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box-wrapper">
        <div v-if="c_selected_market" class="asset-wrap">
          <div class="buy-wrap">
            <div class="buy-price-wrap price-wrap">
              <p class="buy-text new-buy-text">{{ $t('act_buy') }}</p>
              <div class="buy-price">
                <p v-if="c_selected_market" class="buy-price">
                  <span class="amount">
                    {{
                      calcSpread(c_selected_market, 'BID')
                        | codeDecimal(c_selected_market.target_asset_code)
                    }}
                  </span>
                  <span class="code">
                    {{ c_selected_market.target_asset_code }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="sale-wrap">
            <div class="sale-price-wrap price-wrap">
              <p class="sale-text new-sale-text">{{ $t('act_sell') }}</p>
              <div class="sale-price">
                <p v-if="c_selected_market" class="sale-price">
                  <span class="amount">
                    {{
                      calcSpread(c_selected_market, 'ASK')
                        | codeDecimal(c_selected_market.target_asset_code)
                    }}
                  </span>
                  <span class="code">
                    {{ c_selected_market.target_asset_code }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="exchange-rate-area clear">
            <div class="exchange-rate-tit">
              <h4>
                {{ $t('direct_exchange.ccm_exchange_rate') }}
              </h4>
              <span> ({{ $t('direct_exchange.buy_sell_percent') }}) </span>
            </div>
            <div class="exchange-rate-txt">
              <ul class="exchange-txt-wrap clear">
                <li class="txt-title">
                  <ul>
                    <li>&nbsp;</li>
                    <li>
                      {{ $t('direct_exchange.expected_property') }}
                    </li>
                    <li>
                      {{ $t('direct_exchange.preferential_property') }}
                    </li>
                  </ul>
                </li>
                <li class="txt-rete">
                  <ul>
                    <li class="buy">{{ $t('buy') }}</li>
                    <li class="txt-rete-right"
                      ><strong>23,798 </strong>
                      <span class="code">{{ s_target_asset_code }}</span>
                    </li>
                    <li class="txt-rete-right"
                      ><strong>2,644 </strong>
                      <span class="code"> {{ s_target_asset_code }}</span>
                    </li>
                  </ul>
                </li>
                <li class="txt-rete">
                  <ul>
                    <li class="sell">{{ $t('sell') }}</li>
                    <li class="txt-rete-right"
                      ><strong>23,798 </strong>
                      <span class="code"> {{ s_target_asset_code }}</span>
                    </li>
                    <li class="txt-rete-right"
                      ><strong>2,644 </strong>
                      <span class="code"> {{ s_target_asset_code }}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="buying-selling clear">
            <div class="btn-wrap">
              <!-- 구매 -->
              <div
                v-if="c_selected_market && c_selected_market.allow_bid === 'Y'"
                class="btn-green new-btn-green"
                @click="handleCreateTransfer(c_selected_market.seq, 'BID')"
              >
                {{ $t('private.msg_transfer_buy', [s_target_asset_code]) }}
              </div>
              <div v-else class="btn-green new-btn-green" @click="disableBtn">
                {{ $t('buy') }}
              </div>
              <!-- 판매 -->
              <div
                v-if="c_selected_market && c_selected_market.allow_ask === 'Y'"
                class="sale-btn new-sale-btn"
                @click="handleCreateTransfer(c_selected_market.seq, 'ASK')"
                >{{
                  $t('private.msg_transfer_sell', [s_target_asset_code])
                }}</div
              >
              <div v-else class="sale-btn new-sale-btn" @click="disableBtn">
                {{ $t('sell') }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="asset-wrap">
          <div class="select-asset-wrap">
            <div class="img-wrap">
              <img src="@assets/img/touch-property.png" alt="손가락 아이콘" />
            </div>
            <p>{{ $t('private.please_select_asset') }}</p>
          </div>
        </div>
      </div>
    </div>

    <ElDialog
      :visible.sync="show_dialog"
      width="500px"
      :append-to-body="true"
      :title="params.transfer_type === 'BID' ? $t('act_buy') : $t('act_sell')"
    >
      <ElForm
        v-if="c_selected_market"
        v-loading="loading"
        label-width="190px"
        label-position="left"
        @submit.native.prevent="handleSubmitTransfer"
      >
        <el-form-item :label="$t('asset')">
          {{
            $t('private.transfer_asset_info', [
              c_selected_market.source_asset_code,
              c_selected_market.target_asset_code,
              params.transfer_type === 'BID' ? $t('buy') : $t('sell'),
            ])
          }}
        </el-form-item>
        <!-- <el-form-item :label="$t('private.basic_rate')">
          1 {{ c_selected_market.source_asset_code }} =
          {{
            assetDecimal(
              c_selected_market.target_asset_seq,
              c_selected_market.basic_rate
            ) | codeDecimal(c_selected_market.target_asset_code)
          }}
          {{ c_selected_market.target_asset_code }}
        </el-form-item>
        <el-form-item
          :label="
            params.transfer_type === 'BID'
              ? $t('private.direct_transfer_buy')
              : $t('private.direct_transfer_sell')
          "
        >
          1 {{ c_selected_market.source_asset_code }} =
          <time v-if="params.transfer_type === 'BID'" class="time">
            {{
              calcSpread(c_selected_market, 'BID')
                | codeDecimal(c_selected_market.target_asset_code)
            }}
            {{ c_selected_market.target_asset_code }}
          </time>
          <time v-else>
            {{
              calcSpread(c_selected_market, 'ASK')
                | codeDecimal(c_selected_market.target_asset_code)
            }}
            {{ c_selected_market.target_asset_code }}
          </time>
        </el-form-item> -->

        <el-form-item
          :label="`${c_selected_market.target_asset_code} ${$t('account')}`"
        >
          <el-select
            v-model="params.target_account_seq"
            :placeholder="$t('select')"
          >
            <el-option
              v-for="account in c_target_accounts"
              :key="account.seq"
              :value="account.seq"
              :label="
                account.title.length ? account.title : account.account_number
              "
            ></el-option>
          </el-select>
          <p v-if="c_select_target_account" class="s_balance">
            {{ c_select_target_account.code }} {{ $t('balance') }}:
            {{
              Decimal(c_select_target_account.balance).minus(
                c_select_target_account.holding_balance
              ) | codeDecimal(c_select_target_account.code)
            }}
          </p>
        </el-form-item>
        <el-form-item
          :label="`${c_selected_market.source_asset_code} ${$t('account')}`"
        >
          <el-select
            v-model="params.source_account_seq"
            :placeholder="$t('select')"
          >
            <el-option
              v-for="account in c_source_accounts"
              :key="account.seq"
              :value="account.seq"
              :label="
                account.title.length ? account.title : account.account_number
              "
            ></el-option>
          </el-select>
          <p v-if="c_select_source_account" class="s_balance">
            {{ c_select_source_account.code }} {{ $t('balance') }}:
            {{
              Decimal(c_select_source_account.balance).minus(
                c_select_source_account.holding_balance
              ) | codeDecimal(c_select_source_account.code)
            }}
          </p>
        </el-form-item>
        <el-form-item :label="$t('private.direct_source_amount')">
          <el-input v-model="params.source_amount">
            <template slot="append">
              {{ c_selected_market.source_asset_code }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('private.direct_target_amount')">
          <el-input disabled :value="c_target_amount">
            <template slot="append">
              {{ c_selected_market.target_asset_code }}
            </template>
          </el-input>
        </el-form-item>
        <div class="btn-wrap text-right">
          <button class="btn-grey marginR-10" @click="show_dialog = false">
            {{ $t('cancel') }}
          </button>
          <button
            v-if="params.transfer_type === 'BID'"
            :class="`${params.transfer_type}`"
          >
            {{
              $t('private.msg_transfer_buy', [
                c_selected_market.target_asset_code,
              ])
            }}
          </button>
          <button v-else :class="`${params.transfer_type}`">
            {{
              $t('private.msg_transfer_sell', [
                c_selected_market.target_asset_code,
              ])
            }}
          </button>
        </div>
      </ElForm>
    </ElDialog>
  </div>
</template>

<style scoped>
.source {
  border-bottom: 1px solid #e5e5e5;
}
.source .asset-item {
  padding: 10px;
}

.direct-krw-market {
  box-sizing: border-box;
  float: left;
  width: 65%;
  height: 600px;
  padding: 30px;
  overflow: hidden;
  background: white;
  border: 1px solid black;
  border-radius: 5px;
}
.direct-krw-market .big-title-wrap {
  float: left;
  width: 20%;
  word-break: keep-all;
}

.select-box {
  position: absolute;
  top: 52px;
  left: 0;
  z-index: 9;
  display: inline-block;
  float: left;
  width: 100%;
  height: 249px;
  overflow: auto;
  background-color: white;
  border: 1px solid #e5e5e5;
}

.coin-box-wrap {
  overflow: hidden;
}

.coin-selector {
  overflow: hidden;
}
.coin-box-wrap .coin-box {
  float: left;
  width: 50%;
}

.coin-box-wrap .coin-box h3 {
  height: 50px;
}

.coin-select-box {
  box-sizing: border-box;
  width: 100%;
  height: 250px;
  color: #333;
  border-bottom: none;
}

.coin-select {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  width: 100%;
  padding: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.coin-select .select-tag span {
  color: #222;
}
.ja-JP .coin-select .select-tag span {
  font-size: 12px;
}
.coin-select:first-child .select-tag span.selected:first-child {
  border-right: 2px solid gray;
}

.coin-select:first-child .select-tag span.selected a {
  display: none;
}

.coin-select .coin-name {
  display: inline-block;
  margin: 0 10px;
}

.coin-select .select-tag {
  float: left;
  width: 230px;
}
.coin-select .drop-icon {
  float: right;
  width: 10px;
}

.coin-select .drop-icon.selected {
  display: none;
}

.coin-select .coin-select-item {
  float: left;
  width: 25px;
  height: 25px;
  margin-right: 10px;
}

.please-coin-select {
  border-bottom: 2px solid #52b370;
}
.please-asset-select {
  border-bottom: 2px solid #d32f2f;
}

.coin-select .select-coin-icon,
.coin-select .no-coin {
  height: 30px;
  background-repeat: no-repeat;
  background-size: 100%;
}

.select-cancle {
  padding: 10px;
  color: #999;
}

.select-cancle:hover {
  color: #222;
}

.source .asset-item:hover {
  background-color: #f9f9f9;
}
.source .asset-item .coin-item {
  float: left;
}

.box-wrapper {
  width: 100%;
}

.exchange-rate-area {
  padding: 20px;
  margin-top: 20px;
  overflow: hidden;
  background: white;
  border: solid 1px #000;
  border-radius: 5px;
}
.exchange-rate-area .exchange-rate-tit {
  float: left;
  width: 35%;
}
.exchange-rate-area .exchange-rate-tit span {
  color: #999;
}

.exchange-rate-area .exchange-rate-txt {
  float: left;
  width: 65%;
}

.exchange-rate-area .exchange-rate-txt .exchange-txt-wrap {
  display: flex;
}
.exchange-rate-area .exchange-rate-txt .exchange-txt-wrap .txt-title {
  width: 30%;
  text-align: right;
}

.exchange-rate-area .exchange-rate-txt .exchange-txt-wrap .txt-rete {
  width: 35%;
  text-align: center;
}

.txt-rete .buy,
.txt-rete .sell {
  margin: 0;
  font-weight: bold;
  text-align: right;
}

.txt-rete .buy {
  color: #51b370;
}

.txt-rete .sell {
  color: #d32f2f;
}

.txt-rete li,
.txt-title li {
  padding: 5px;
}

.exchange-rate-area .exchange-rate-txt .exchange-txt-wrap .txt-rete-right {
  text-align: right;
}

.buy-wrap,
.sale-wrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  padding: 24px;
  text-align: left;
  background: #f4f4f4;
  border-radius: 5px;
}
.buying-selling .btn-wrap {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  transition: 0.2s;
}
.buying-selling .btn-wrap div {
  box-sizing: border-box;
  float: left;
  width: 49%;
}

.buying-selling .btn-wrap .btn-green {
  margin-right: 2%;
}
.buying-selling .new-sale-btn,
.buying-selling .new-btn-green {
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  border-radius: 5px;
}
.buying-selling .new-sale-btn:hover,
.buying-selling .new-btn-green:hover {
  text-decoration: underline;
}
.price-wrap .buy-price,
.price-wrap .sale-price {
  float: right;
}
.select-asset-wrap {
  box-sizing: border-box;
  width: 100%;
  padding: 152px 0;
  overflow: hidden;
  text-align: center;
  background-color: #fbfbfc;
}
.select-asset-wrap .img-wrap {
  display: block;
  width: 54px;
  margin: 0 auto;
}
.select-asset-wrap .img-wrap img {
  width: 100%;
}

.select-asset-wrap p {
  margin-top: 20px;
}

.buy-price-wrap,
.sale-price-wrap {
  box-sizing: border-box;
  display: inline-block;
  width: 100%;
}
.buy-wrap {
  width: 100%;
}

.buy-wrap .buy-text,
.sale-wrap .sale-text {
  display: inline-block;
}

.buy-wrap .buy-price,
.sale-wrap .sale-price {
  display: inline-block;
  padding: 0;
  font-size: 20px;
  letter-spacing: 0;
}

.buy-wrap .btn-green,
.sale-wrap .sale-btn {
  box-sizing: border-box;
  display: inline-block;
  float: right;
  width: 150px;
  padding: 10px;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border: none;
}

.buy-wrap .btn-green {
  background: #e82800;
}
.buying-selling .new-btn-green {
  background: #52b370 !important;
}

.sale-wrap .sale-btn {
  background: #006adc;
}
.buying-selling .new-sale-btn {
  background: #d32f2f !important;
}

.asset-wrap {
  display: inline-block;
  width: 100%;
  padding-top: 20px;
}

.sale-wrap {
  width: 100%;
  margin-top: 20px;
}

.el-button.ASK {
  color: #fff;
  background: #006adc;
}

.img-box {
  position: relative;
  display: block;
  width: 100%;
  margin-top: 50px;
  text-align: center;
}

.img-box div {
  display: none;
}

.dialog-button-wrap {
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 1280px) {
  .coin-box-wrap {
    float: initial;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .big-title-wrap {
    width: 100%;
    margin-bottom: 20px;
  }
  .quick-trade {
    width: 100% !important;
  }
  .coin-box-wrap {
    width: 100%;
  }
  .container {
    padding: 0;
  }

  .buy-wrap,
  .sale-wrap {
    width: 100%;
  }

  .img-box {
    margin-top: 30px;
  }

  .img-box div {
    margin-right: 0;
    margin-bottom: 20px;
  }
  .coin-select {
    width: 100%;
    margin-right: 0;
  }
  .coin-select:first-child {
    margin-bottom: 20px;
  }
  .exchange-rate-area .exchange-rate-tit {
    float: initial;
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
  }
  .exchange-rate-area {
    padding: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #e5e5e5;
  }
  .exchange-rate-area .exchange-rate-txt {
    float: initial;
    width: 100%;
  }
  .exchange-rate-area .exchange-rate-txt .exchange-txt-wrap .txt-title {
    font-size: 13px;
    text-align: left;
  }
}

@media (max-width: 470px) {
  .buy-wrap .new-buy-text,
  .sale-wrap .new-sale-text {
    display: block;
    float: initial;
    margin-bottom: 12px;
    text-align: left;
  }
  .buy-wrap .buy-price,
  .price-wrap .sale-price {
    display: block;
    float: initial;
    text-align: left;
  }

  .buy-wrap {
    padding: 12px;
  }
}

@media (max-width: 1030px) {
  .direct-krw-market {
    height: auto;
  }
  .direct-krw-market .coin-box {
    float: none;
    width: 100%;
    padding-bottom: 20px;
  }
  .coin-select .select-tag {
    width: auto;
  }
}

@media (max-width: 768px) {
  .direct-krw-market {
    float: none;
    width: 100%;
    height: auto;
    margin-bottom: 40px;
  }
}
</style>
