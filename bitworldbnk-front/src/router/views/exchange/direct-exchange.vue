<script>
import '@assets/css/direct-market.css'
import { fetchDirectMarkets, createDirectTransfer } from '@apis/market'
import assetDecimal from '@utils/asset-decimal'
import Decimal from 'decimal.js'
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import find from 'lodash/find'
import remove from 'lodash/remove'
import findIndex from 'lodash/findIndex'

export default {
  page: {
    title: 'DirectExchange',
    meta: [
      {
        name: 'description',
        content: 'DirectExchange',
      },
    ],
  },
  filters: {
    currency(value) {
      if (!value) return ''
      return value.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
    },
  },
  data() {
    return {
      markets: [],
      params: {},
      show_dialog: false,
      loading: false,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_source_accounts() {
      if (!this.cs_market) return []

      return filter(this.accounts, {
        asset_seq: this.cs_market.source_asset_seq,
      })
    },
    c_target_accounts() {
      if (!this.cs_market) return []

      return filter(this.accounts, {
        asset_seq: this.cs_market.target_asset_seq,
      })
    },
    cs_market() {
      if (!this.params.market_seq) return null

      return find(this.markets, {
        seq: this.params.market_seq,
      })
    },
    c_target_amount() {
      if (!this.params.source_amount) return null

      return assetDecimal(this.cs_market.target_asset_seq, this.c_exchange_rate)
        .mul(this.params.source_amount)
        .toString()
    },
    c_exchange_rate() {
      if (!this.cs_market) return 0

      return this.calcSpread(this.cs_market, this.params.transfer_type)
    },
    c_active_market() {
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
    c_select_target_account() {
      return find(this.accounts, { seq: this.params.target_account_seq })
    },
    c_select_source_account() {
      return find(this.accounts, { seq: this.params.source_account_seq })
    },
  },
  created() {
    this.resetParams()
    Promise.all([this.loadMarkets()]).catch((e) =>
      this.$toasted.error(e.message)
    )
  },
  methods: {
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
    handleCreateTransfer(market_seq, transfer_type) {
      this.resetParams()
      this.params.market_seq = market_seq
      this.params.transfer_type = transfer_type
      this.show_dialog = true
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
          this.$store.dispatch('account/getAccounts')
          this.show_dialog = false
        })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    Decimal,
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('footer.direct_ex') }}
        </h2>
      </div>
      <div class="direct-exchange">
        <ul>
          <template v-for="market in c_active_market">
            <li :key="market.seq" class="direct-list">
              <div class="left-info">
                <h4 class="coin-name">
                  {{ market.source_asset_code }} /
                  {{ market.target_asset_code }}
                </h4>
                <ul class="short-list">
                  <li>
                    <span class="color-grey">
                      {{ $t('private.buy_calc_spread') }}
                    </span>
                    <span class="nospace">
                      {{
                        calcSpread(market, 'BID')
                          | codeDecimal(market.target_asset_code)
                      }}
                      {{ market.target_asset_code }}
                    </span>
                  </li>
                  <li>
                    <span class="color-grey">
                      {{ $t('private.sell_calc_spread') }}
                    </span>
                    <span class="nospace">
                      {{
                        calcSpread(market, 'ASK')
                          | codeDecimal(market.target_asset_code)
                      }}
                      {{ market.target_asset_code }}
                    </span>
                  </li>
                </ul>
              </div>
              <div class="right-info">
                <div class="amount-wrap">
                  <span class="amount">
                    {{
                      assetDecimal(market.target_asset_seq, market.basic_rate)
                        | codeDecimal(market.target_asset_code)
                    }}
                  </span>
                  <span class="code">
                    {{ market.target_asset_code }}
                  </span>
                </div>
                <div class="act-wrap">
                  <a
                    v-if="market.allow_bid === 'Y'"
                    class="links btn-green"
                    @click="handleCreateTransfer(market.seq, 'BID')"
                    >{{ $t('buy') }}</a
                  >
                  <a
                    v-if="market.allow_ask === 'Y'"
                    class="links btn-red marginL-10"
                    @click="handleCreateTransfer(market.seq, 'ASK')"
                    >{{ $t('sell') }}</a
                  >
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <el-dialog
      :visible.sync="show_dialog"
      :title="$t('private.direct_market')"
      :append-to-body="true"
      class="direct-exchange-modal"
    >
      <el-form
        v-if="cs_market"
        v-loading="loading"
        label-width="180px"
        label-position="left"
        @submit.native.prevent="handleSubmitTransfer"
      >
        <el-form-item :label="$t('private.cs_market_asset')"
          >{{ cs_market.source_asset_code }}/{{
            cs_market.target_asset_code
          }}</el-form-item
        >
        <el-form-item :label="$t('private.cs_market_basic_rate')">
          1 {{ cs_market.source_asset_code }} =
          <span>
            {{
              assetDecimal(cs_market.target_asset_seq, cs_market.basic_rate)
                | codeDecimal(cs_market.target_asset_code)
            }}
          </span>
          {{ cs_market.target_asset_code }}
        </el-form-item>
        <el-form-item :label="$t('private.transfer_type')">
          <el-radio-group v-model="params.transfer_type">
            <el-radio-button
              v-for="val in constants.market.direct_transfer.transfer_type"
              :key="val[0]"
              :label="val[0]"
              >{{ val[1] }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('private.exchange_rate')">{{
          c_exchange_rate | codeDecimal(cs_market.target_asset_code)
        }}</el-form-item>
        <el-form-item
          :label="
            `${cs_market.target_asset_code} ${$t('business.bank_account')}`
          "
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
          :label="
            `${cs_market.source_asset_code} ${$t('business.bank_account')}`
          "
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
            <!-- <template slot="prepend">
              <i
                v-if="params.transfer_type === 'ASK'"
                class="el-icon-minus"
              ></i>
              <i v-else class="el-icon-plus"></i>
            </template> -->
            <template slot="append">{{ cs_market.source_asset_code }}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('private.direct_target_amount')">
          <el-input disabled :value="c_target_amount">
            <!-- <template slot="prepend">
              <i
                v-if="params.transfer_type === 'BID'"
                class="el-icon-minus"
              ></i>
              <i v-else class="el-icon-plus"></i>
            </template> -->
            <template slot="append">{{ cs_market.target_asset_code }}</template>
          </el-input>
        </el-form-item>
        <div class="btn-wrap btn-right">
          <button>
            {{ $t('private.submit_transfer') }}
          </button>
          <a class="btn-grey marginL-10" @click="show_dialog = false">{{
            $t('cancel')
          }}</a>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
.btn-grey {
  padding: 5.6px 20px;
}
</style>
