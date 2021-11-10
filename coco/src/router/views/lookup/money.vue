<script>
import '@assets/css/lookup/money.css'
import { mapState } from 'vuex'
import Decimal from 'decimal.js'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import fromPairs from 'lodash/fromPairs'
import each from 'lodash/each'
import filter from 'lodash/filter'
import date from 'locutus/php/datetime/date'
import assetDecimal from '@utils/asset-decimal'
import AccountBalanceLog from '@components/account-balance-log'
import AssetSelector from '@components/asset-selector'

export default {
  page: {
    title: 'Money',
    meta: [{ name: 'description', content: 'Money' }],
  },
  components: {
    AssetSelector,
    AccountBalanceLog,
  },
  data() {
    return {
      search_target_asset: 0,
      link_modal: false,
      market_modal: false,
      search_keyword_asset: null,
      search_keyword_account: '',
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_asset_balance() {
      const asset_seqs = uniq(map(this.accounts, (val) => val.asset_seq))
      return fromPairs(
        map(asset_seqs, (asset_seq) => {
          let oTotalSum = new Decimal(0)

          each(
            filter(this.accounts, {
              asset_seq,
            }),
            ({ balance, holding_balance }) => {
              var available_balance = new Decimal(balance).minus(
                holding_balance
              )

              oTotalSum = oTotalSum.plus(available_balance)
            }
          )

          return [asset_seq, oTotalSum.toString()]
        })
      )
    },
    c_ccf_balance() {
      let oTotalSum = new Decimal(0)
      each(
        filter(this.accounts, {
          asset_code: 'CCF',
        }),
        ({ balance, holding_balance }) => {
          var available_balance = new Decimal(balance).minus(holding_balance)
          oTotalSum = oTotalSum.plus(available_balance)
        }
      )
      return oTotalSum.toString()
    },

    c_source_selected_market() {
      return filter(this.c_active_market, {
        source_asset_seq: this.select_market_source_asset,
      })
    },

    c_active_asset() {
      return filter(this.assets, { is_active: 'Y' }).filter(
        (asset_info) =>
          !this.search_keyword_asset ||
          asset_info.code
            .toLowerCase()
            .includes(this.search_keyword_asset.toLowerCase()) ||
          asset_info.title.includes(this.search_keyword_asset)
      )
    },
    c_search_account_info() {
      return filter(
        this.accounts,
        (account) =>
          !this.search_keyword_account ||
          account.title
            .toLowerCase()
            .includes(this.search_keyword_account.toLowerCase()) ||
          account.account_number.includes(this.search_keyword_account) ||
          account.asset_code
            .toLowerCase()
            .includes(this.search_keyword_account.toLowerCase())
      )
    },
  },
  methods: {
    fromPairs,
    date,

    paymentModalOpen(p) {
      this.link_modal = true
      this.payment_type = p
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
    Decimal,
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('business.view_your_account') }}
        </h2>
      </div>
      <div class="money">
        <div class="account-balance">
          <p class="f-left explanation">
            * {{ $t('business.calculate_late') }}
          </p>
          <div class="f-right amount-wrap">
            <span class="amount">
              {{ c_ccf_balance | codeDecimal('CCF') }}
            </span>
            <span class="code">CCF</span>
          </div>
        </div>
        <div class="asset-list">
          <h3>
            {{ $t('wallet_page.asset_list') }}
          </h3>
          <AssetSelector v-model="search_target_asset"></AssetSelector>
        </div>
        <div class="account-list">
          <h3>
            {{ $t('wallet_page.account_list') }}
          </h3>
          <AccountBalanceLog
            :asset_seq="search_target_asset"
          ></AccountBalanceLog>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/money.scss';
</style>
