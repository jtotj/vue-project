<script>
import { fetchDirectMarkets, createDirectTransfer } from '@apis/market'
import assetDecimal from '@utils/asset-decimal'
import Decimal from 'decimal.js'
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import find from 'lodash/find'

export default {
  page: {
    title: 'DirectMarket',
    meta: [
      {
        name: 'description',
        content: 'DirectMarket',
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
      return filter(this.markets, { is_active: 'Y' })
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
          this.show_dialog = false
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span :class="['big-tit', 'color-white', $style.title]">
          {{ $t('footer.direct_ex') }}
        </span>
      </div>
    </div>
    <div class="container">
      <div class="main-deal">
        <ul class="deal-list">
          <template v-for="market in c_active_market">
            <li :key="market.seq" class="deal-act">
              <div class="wrap">
                <div class="left-info">
                  <strong class="tit">
                    {{ market.source_asset_code }} /
                    {{ market.target_asset_code }}
                  </strong>
                  <ul class="short-list">
                    <li>
                      <span>
                        {{ $t('private.buy_calc_spread') }}
                      </span>
                      {{
                        calcSpread(market, 'BID')
                          | codeDecimal(market.target_asset_code)
                      }}
                      {{ market.target_asset_code }}
                    </li>
                    <li>
                      <span>
                        {{ $t('private.sell_calc_spread') }}
                      </span>
                      {{
                        calcSpread(market, 'ASK')
                          | codeDecimal(market.target_asset_code)
                      }}
                      {{ market.target_asset_code }}
                    </li>
                  </ul>
                </div>
                <div class="right-info">
                  <div class="multiple">
                    <div class="money">
                      <span>
                        {{
                          assetDecimal(
                            market.target_asset_seq,
                            market.basic_rate
                          ) | codeDecimal(market.target_asset_code)
                        }}
                      </span>
                      {{ market.target_asset_code }}
                      <div class="act-wrap">
                        <a
                          v-if="market.allow_bid === 'Y'"
                          class="links buy-btn"
                          @click="handleCreateTransfer(market.seq, 'BID')"
                          >{{ $t('buy') }}</a
                        >
                        <a
                          v-if="market.allow_ask === 'Y'"
                          class="links sell-btn"
                          @click="handleCreateTransfer(market.seq, 'ASK')"
                          >{{ $t('sell') }}</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <ElDialog
      :visible.sync="show_dialog"
      width="500px"
      :title="$t('private.direct_market')"
    >
      <ElForm
        v-if="cs_market"
        v-loading="loading"
        label-width="180px"
        label-position="left"
        @submit.prevent="handleSubmitTransfer"
      >
        <ElFormItem :label="$t('private.cs_market_asset')"
          >{{ cs_market.source_asset_code }}/{{
            cs_market.target_asset_code
          }}</ElFormItem
        >
        <ElFormItem :label="$t('private.cs_market_basic_rate')">
          1 {{ cs_market.source_asset_code }} =
          <span>
            {{
              assetDecimal(cs_market.target_asset_seq, cs_market.basic_rate)
                | codeDecimal(cs_market.target_asset_code)
            }}
          </span>
          {{ cs_market.target_asset_code }}
        </ElFormItem>
        <ElFormItem :label="$t('private.transfer_type')">
          <ElRadioGroup v-model="params.transfer_type">
            <ElRadioButton
              v-for="val in constants.market.direct_transfer.transfer_type"
              :key="val[0]"
              :label="val[0]"
              >{{ val[1] }}</ElRadioButton
            >
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem :label="$t('private.exchange_rate')">{{
          c_exchange_rate | codeDecimal(cs_market.target_asset_code)
        }}</ElFormItem>
        <ElFormItem :label="`${cs_market.target_asset_code} ${$t('account')}`">
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
              c_select_target_account.balance
                | codeDecimal(c_select_target_account.code)
            }}
          </p>
        </ElFormItem>
        <ElFormItem :label="`${cs_market.source_asset_code} ${$t('account')}`">
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
              c_select_source_account.balance
                | codeDecimal(c_select_source_account.code)
            }}
          </p>
        </ElFormItem>
        <ElFormItem :label="$t('private.direct_source_amount')">
          <ElInput v-model="params.source_amount">
            <template slot="prepend">
              <i
                v-if="params.transfer_type === 'ASK'"
                class="el-icon-minus"
              ></i>
              <i v-else class="el-icon-plus"></i>
            </template>
            <template slot="append">{{ cs_market.source_asset_code }}</template>
          </ElInput>
        </ElFormItem>
        <ElFormItem :label="$t('private.direct_target_amount')">
          <ElInput disabled :value="c_target_amount">
            <template slot="prepend">
              <i
                v-if="params.transfer_type === 'BID'"
                class="el-icon-minus"
              ></i>
              <i v-else class="el-icon-plus"></i>
            </template>
            <template slot="append">{{ cs_market.target_asset_code }}</template>
          </ElInput>
        </ElFormItem>
        <div class="btnWrap">
          <ElButton @click="show_dialog = false">{{ $t('cancel') }}</ElButton>
          <ElButton type="primary" @click="handleSubmitTransfer">
            {{ $t('private.submit_transfer') }}
          </ElButton>
        </div>
      </ElForm>
    </ElDialog>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/default.scss';

.title {
  color: #000;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  float: right;
  padding: 0;
}
</style>
