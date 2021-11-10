<script>
import { mapState, mapGetters } from 'vuex'
import { fetchDirectMarkets, createDirectTransfer } from '@apis/market'
import assetDecimal from '@utils/asset-decimal'
import Decimal from 'decimal.js'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'

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
      return filter(this.markets, {
        is_active: 'Y',
      })
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
    <div class="big-tit-wrap">
      <span :class="['big-tit', $style.title]">
        {{ $t('private.direct_market') }}
      </span>
    </div>
    <div class="coin-box-wrap">
      <div class="coin-box">
        <div
          class="coin-select please-coin-select"
          @click="s_source_open = !s_source_open"
        >
          <div class="coin-select-item">
            <div :class="['select-coin-icon', `${s_source_asset_code}`]"></div>
          </div>
          <div class="select-tag">
            <span>
              {{ s_source_asset || $t('private.direct_asset_select') }}
            </span>
          </div>

          <div :class="['drop-icon', { open: s_source_open }]">
            <img src="@assets/img/arrow-bottom.png" />
          </div>
          <div v-if="s_source_open" class="select-box">
            <div class="coin-select-box">
              <div v-if="s_source_asset" class="source">
                <ul
                  class="bot-body"
                  @click="
                    ;(s_source_asset = null),
                      (s_source_asset_code = null),
                      (s_source_asset_seq = null)
                  "
                >
                  <li>
                    <span>{{ $t('select_cancel') }}</span>
                  </li>
                </ul>
              </div>
              <div
                v-for="list in c_selectable_source_assets"
                :key="list.seq"
                class="source"
              >
                <ul
                  :class="{ selected: list.title === s_source_asset }"
                  class="bot-body"
                  @click="selectCoin(list.title, list.seq, list.code)"
                >
                  <li>
                    <div
                      :class="`${list.code}`"
                      class="coin-item"
                      style=" float:left; height:30px;margin-top: 10px;"
                    ></div>
                    <span>{{ list.title }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          class="coin-select please-asset-select"
          @click="s_target_open = !s_target_open"
        >
          <div class="coin-select-item">
            <div :class="['select-coin-icon', `${s_target_asset_code}`]"></div>
          </div>
          <div class="select-tag">
            <span>
              {{ s_target_asset || $t('private.transfer_asset_select') }}
            </span>
          </div>

          <div :class="['drop-icon', { open: s_target_open }]">
            <img src="@assets/img/arrow-bottom.png" />
          </div>
          <div v-if="s_target_open" class="select-box">
            <div class="coin-select-box">
              <div v-if="s_target_asset" class="source">
                <ul
                  class="bot-body"
                  @click="
                    ;(s_target_asset = null),
                      (s_target_asset_code = null),
                      (s_target_asset_seq = null)
                  "
                >
                  <li>
                    <span>{{ $t('select_cancel') }}</span>
                  </li>
                </ul>
              </div>
              <div
                v-for="list in c_selectable_target_assets"
                :key="list.seq"
                class="source"
              >
                <ul
                  :class="{ selected: list.title === s_target_asset }"
                  class="bot-body"
                  @click="targetCoin(list.title, list.seq, list.code)"
                >
                  <li>
                    <div
                      :class="`${list.code}`"
                      class="coin-item"
                      style=" float:left;height:30px;margin-top: 10px;"
                    ></div>
                    <span>{{ list.title }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box-wrapper">
        <div v-if="c_selected_market" class="asset-wrap">
          <div class="buy-wrap">
            <div class="buy-price-wrap price-wrap">
              <p class="buy-text">{{ $t('act_buy') }}</p>
              <div class="buy-price">
                <p v-if="c_selected_market" class="buy-price">
                  {{
                    calcSpread(c_selected_market, 'BID')
                      | codeDecimal(c_selected_market.target_asset_code)
                  }}
                  {{ c_selected_market.target_asset_code }}
                </p>
              </div>
            </div>
            <div class="btn-wrap">
              <div
                v-if="c_selected_market && c_selected_market.allow_bid === 'Y'"
                class="buy-btn"
                @click="handleCreateTransfer(c_selected_market.seq, 'BID')"
              >
                {{ $t('private.msg_transfer_buy', [s_target_asset_code]) }}
              </div>
              <div v-else class="buy-btn" @click="disableBtn">
                {{ $t('buy') }}
              </div>
            </div>
          </div>

          <div class="sale-wrap">
            <div class="sale-price-wrap price-wrap">
              <p class="sale-text">{{ $t('act_sell') }}</p>
              <div class="sale-price">
                <p v-if="c_selected_market" class="sale-price">
                  {{
                    calcSpread(c_selected_market, 'ASK')
                      | codeDecimal(c_selected_market.target_asset_code)
                  }}
                  {{ c_selected_market.target_asset_code }}
                </p>
              </div>
            </div>
            <div class="btn-wrap">
              <div
                v-if="c_selected_market && c_selected_market.allow_ask === 'Y'"
                class="sale-btn"
                @click="handleCreateTransfer(c_selected_market.seq, 'ASK')"
                >{{
                  $t('private.msg_transfer_sell', [s_target_asset_code])
                }}</div
              >
              <div v-else class="sale-btn" @click="disableBtn">
                {{ $t('sell') }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="asset-wrap">
          <div class="select-asset-wrap">
            <div class="img-wrap">
              <img
                src="@assets/img/please-select-icon.png"
                alt="손가락 아이콘"
              />
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
        @submit.prevent="handleSubmitTransfer"
      >
        <ElFormItem :label="$t('asset')">
          {{
            $t('private.transfer_asset_info', [
              c_selected_market.source_asset_code,
              c_selected_market.target_asset_code,
              params.transfer_type === 'BID' ? $t('buy') : $t('sell'),
            ])
          }}
        </ElFormItem>
        <ElFormItem :label="$t('private.basic_rate')">
          1 {{ c_selected_market.source_asset_code }} =
          {{
            assetDecimal(
              c_selected_market.target_asset_seq,
              c_selected_market.basic_rate
            ) | codeDecimal(c_selected_market.target_asset_code)
          }}
          {{ c_selected_market.target_asset_code }}
        </ElFormItem>
        <ElFormItem
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
        </ElFormItem>

        <ElFormItem
          :label="`${c_selected_market.target_asset_code} ${$t('account')}`"
        >
          <ElSelect
            v-model="params.target_account_seq"
            :placeholder="$t('select')"
          >
            <ElOption
              v-for="account in c_target_accounts"
              :key="account.seq"
              :value="account.seq"
              :label="
                account.title.length ? account.title : account.account_number
              "
            ></ElOption>
          </ElSelect>
          <p v-if="c_select_target_account" class="s_balance">
            {{ c_select_target_account.code }} {{ $t('balance') }}:
            {{
              Decimal(c_select_target_account.balance).minus(
                c_select_target_account.holding_balance
              ) | codeDecimal(c_select_target_account.code)
            }}
          </p>
        </ElFormItem>
        <ElFormItem
          :label="`${c_selected_market.source_asset_code} ${$t('account')}`"
        >
          <ElSelect
            v-model="params.source_account_seq"
            :placeholder="$t('select')"
          >
            <ElOption
              v-for="account in c_source_accounts"
              :key="account.seq"
              :value="account.seq"
              :label="
                account.title.length ? account.title : account.account_number
              "
            ></ElOption>
          </ElSelect>
          <p v-if="c_select_source_account" class="s_balance">
            {{ c_select_source_account.code }} {{ $t('balance') }}:
            {{
              Decimal(c_select_source_account.balance).minus(
                c_select_source_account.holding_balance
              ) | codeDecimal(c_select_source_account.code)
            }}
          </p>
        </ElFormItem>
        <ElFormItem :label="$t('private.direct_source_amount')">
          <ElInput v-model="params.source_amount">
            <template slot="append">
              {{ c_selected_market.source_asset_code }}
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem :label="$t('private.direct_target_amount')">
          <ElInput disabled :value="c_target_amount">
            <template slot="append">
              {{ c_selected_market.target_asset_code }}
            </template>
          </ElInput>
        </ElFormItem>
        <div style="text-align:center;">
          <ElButton
            v-if="params.transfer_type === 'BID'"
            type="primary"
            :class="`${params.transfer_type}`"
            @click="handleSubmitTransfer"
          >
            {{
              $t('private.msg_transfer_buy', [
                c_selected_market.target_asset_code,
              ])
            }}
          </ElButton>
          <ElButton
            v-else
            :class="`${params.transfer_type}`"
            @click="handleSubmitTransfer"
          >
            {{
              $t('private.msg_transfer_sell', [
                c_selected_market.target_asset_code,
              ])
            }}
          </ElButton>
          <ElButton @click="show_dialog = false">{{ $t('cancel') }}</ElButton>
        </div>
      </ElForm>
    </ElDialog>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/default.scss';
</style>
<style scoped>
.container {
  max-width: 980px;
}

.b2b-wrap {
  display: inline-block;
  width: 100%;
}

.direct-krw-market .big-tit-wrap {
  float: left;
  width: 20%;
  word-break: keep-all;
}

.big-tit-wrap .big-tit {
  margin: 0;
  font-size: 30px;
  font-weight: 500;
  line-height: 40px;
  letter-spacing: -1.65px;
}
.big-tit-wrap p {
  padding: 10px 0;
  font-size: 14px;
  line-height: 22px;
  color: #999;
  text-align: left;
}
.coin-box-wrap {
  box-sizing: border-box;
  float: right;
  width: 75%;
  padding: 20px;
  background-color: white;
  border: 1px solid #eee;
  box-shadow: 10px 10px 10px #f2f3f5;
}

.select-box {
  position: relative;
  top: 50px;
  z-index: 9;
  display: inline-block;
  float: left;
  width: 100%;
  height: 249px;
  overflow: auto;
  background-color: white;
  border: 1px solid #eee;
}

.coin-select {
  display: inline-block;
  width: calc(50% - 1%);
  margin-right: 2%;
  margin-left: 0;
}

.coin-select:last-child {
  margin-right: 0;
}

.coin-select-box {
  box-sizing: border-box;
  width: 100%;
  height: 250px;
  overflow: auto;
  color: #333;
  border-bottom: none;
}

.coin-select-box .source {
  background-color: white;
}

.coin-select-box .source ul li {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
}
.coin-select-box .source:first-child ul li {
  color: #b5b5b5;
}
.coin-select-box .source ul li:hover {
  color: #0068c1;
}

.coin-select-box .source ul li span {
  margin: 0;
}

.coin-select-box .coin-item {
  position: absolute;
  background-color: transparent;
}

.coin-select .coin-select-item {
  position: absolute;
  top: 10px;
  width: 30px;
  background-image: none;
}

.please-coin-select {
  border-bottom: 2px solid #e82800;
}
.please-asset-select {
  border-bottom: 2px solid #003ee8;
}

.coin-select .select-coin-icon {
  height: 30px;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: contain;
}

.coin-select span {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  height: 100%;
  margin: 0;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  letter-spacing: -1px;
}

.box-wrapper {
  width: 100%;
}

.buy-wrap,
.sale-wrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  padding: 15px;
  text-align: left;
  background: #f4f4f4;
}
.btn-wrap {
  display: inline-block;
  float: right;
  width: 30%;
}
.price-wrap .buy-price,
.price-wrap .sale-price {
  float: right;
}
.select-asset-wrap {
  box-sizing: border-box;
  width: 100%;
  padding: 30px 0;
  margin-top: 20px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  color: #eee;
  color: #333;
  text-align: center;
  background-color: #f4f4f4;
}
.select-asset-wrap .img-wrap {
  display: block;
  width: 40px;
  margin: 0 auto;
}
.select-asset-wrap .img-wrap img {
  width: 100%;
}
.select-asset-wrap p {
  padding: 10px 0;
}

.buy-price-wrap,
.sale-price-wrap {
  box-sizing: border-box;
  display: inline-block;
  width: 70%;
}
.buy-wrap {
  width: 100%;
  margin-top: 20px;
}

.buy-wrap .buy-text,
.sale-wrap .sale-text {
  display: inline-block;
  float: left;
  padding: 8px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.buy-wrap .buy-text {
  color: #e82800;
}

.sale-wrap .sale-text {
  color: #006adc;
}

.buy-wrap .buy-price,
.sale-wrap .sale-price {
  display: inline-block;
  padding: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
  color: #333;
  text-align: center;
}

.buy-wrap .buy-btn,
.sale-wrap .sale-btn {
  box-sizing: border-box;
  display: inline-block;
  float: right;
  width: 150px;
  padding: 10px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 22px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border: none;
}

.buy-wrap .buy-btn {
  background: #e82800;
}

.sale-wrap .sale-btn {
  background: #006adc;
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

@media (max-width: 1100px) {
  .btn-wrap {
    width: 100%;
  }
  .buy-wrap .buy-btn,
  .sale-wrap .sale-btn {
    float: none;
    width: 100%;
    margin-right: 0;
  }
  .buy-price-wrap,
  .sale-price-wrap {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .big-tit-wrap {
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
  .buy-price-wrap,
  .sale-price-wrap {
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
  .box-wrapper {
    margin-top: 20px;
  }
}
</style>
