<script>
import '@assets/css/payment.css'
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import find from 'lodash/find'
import { fetchMerchant, authenticateTransaction } from '@apis/pg'
import fromPairs from 'lodash/fromPairs'
import URI from 'urijs'
import LocaleSelect from '@components/LocaleSelect'
import Decimal from 'decimal.js'
import assetDecimal from '@utils/asset-decimal'

import { fetchDirectMarkets, createDirectTransfer } from '@apis/market'

export default {
  page: {
    title: 'PaymentMain',
    meta: [{ name: 'description', content: 'PaymentMain' }],
  },
  components: {
    LocaleSelect,
  },

  data() {
    return {
      exchange_visible: false,
      market_list: [],
      card_checked: null,
      params: {
        transfer_type: 'BID',
      },
      market_trade_modal: false,

      token: null,
      merchant: null,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('common', { constants: (state) => state.constants }),
    ...mapState('common', { config: (state) => state.config }),
    c_pay_available_accounts() {
      return filter(this.accounts, { asset_code: this.token.tx.asset_code })
    },
    c_display_terms() {
      return filter(this.config.terms, { display: 'Y' })
    },
    c_s_asset_info() {
      if (!this.token) return null

      return find(this.assets, { code: this.token.tx.asset_code })
    },
    c_market_list_by_asset() {
      if (!this.c_s_asset_info) return null

      return filter(this.market_list, (market) => {
        return (
          market.source_asset_seq === this.c_s_asset_info.seq ||
          market.target_asset_seq === this.c_s_asset_info.seq
        )
      }).filter((info) => {
        return info.is_active === 'Y'
      })
    },
    cs_market() {
      if (!this.params.market_seq) return null

      return find(this.c_market_list_by_asset, {
        seq: this.params.market_seq,
      })
    },
    c_select_source_account() {
      return find(this.accounts, { seq: this.params.source_account_seq })
    },
    c_select_target_account() {
      return find(this.accounts, { seq: this.params.target_account_seq })
    },
    c_exchange_rate() {
      if (!this.cs_market) return 0

      return this.calcSpread(this.cs_market, this.params.transfer_type)
    },

    c_target_accounts() {
      if (!this.cs_market) return []

      return filter(this.accounts, {
        asset_seq: this.cs_market.target_asset_seq,
      })
    },

    c_source_accounts() {
      if (!this.cs_market) return []

      return filter(this.accounts, {
        asset_seq: this.cs_market.source_asset_seq,
      })
    },

    c_target_amount() {
      if (!this.params.source_amount) return null

      return assetDecimal(this.cs_market.target_asset_seq, this.c_exchange_rate)
        .mul(this.params.source_amount)
        .toString()
    },
  },
  mounted() {
    Promise.all([
      this.tokenDecode(),
      this.getMerchantInfo(),
      this.getDirectMarkets(),
    ]).catch((e) => this.$toasted.error(e.message))
  },

  methods: {
    tokenDecode() {
      this.token = this.$jwt.decode(this.$route.query.token)
    },
    async getMerchantInfo() {
      const { merchant_info } = await fetchMerchant(
        this.token.tx.merchant_id
      ).catch((e) => e.message)
      this.merchant = merchant_info
    },
    async handleSubmit() {
      this.loading = true
      let ret_obj = null

      if (this.c_pay_available_accounts.length === 0)
        return this.$toasted.error(
          this.$t('account_transfer.not_exist_account')
        )
      if (!this.card_checked)
        return this.$toasted.error(
          this.$t('account_transfer.msg_not_select_withdraw_account')
        )

      try {
        ret_obj = await authenticateTransaction({
          ...this.$route.query,
          account_seq: this.card_checked,
        })
      } catch (e) {
        ret_obj = e
      }

      location.href = new URI(this.$route.query.return_url)
        .addQuery('error', ret_obj.error)
        .addQuery('message', ret_obj.message)
        .addQuery('nonce', ret_obj.nonce)
    },
    async getDirectMarkets() {
      const { data } = await fetchDirectMarkets()

      this.market_list = data
    },
    fromPairs,
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
          this.$toasted.success(this.$t('toasted_msg.exchange'))
          this.market_trade_modal = false
          this.exchange_visible = false
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    Decimal,
    handleCreateTransfer(market_seq, transfer_type) {
      this.resetParams()
      this.params.market_seq = market_seq
      this.params.transfer_type = transfer_type
      this.market_trade_modal = true
    },
  },
}
</script>

<template>
  <div class="payment">
    <div class="layout">
      <div class="content">
        <div class="left-content">
          <div class="top-bar">
            <div class="logo-wrap">
              <h1 class="logo">
                <img src="@src/assets/img/t_logo.svg" alt="Bit world 로고" />
              </h1>
            </div>
            <div v-if="token" class="total">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-shopping-bag-2"></i>
                  {{ token.tx.amount }} {{ token.tx.asset_code }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span class="fleft">{{ token.tx.title }}</span>
                    <span class="dollar"
                      >{{ token.tx.amount }} {{ token.tx.asset_code }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span class="fleft">{{
                      $t('pay_main.total_product')
                    }}</span>
                    <span class="dollar"
                      >{{ token.tx.amount }} {{ token.tx.asset_code }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span class="fleft">{{ $t('pay_main.total_sum') }}</span>
                    <span class="dollar"
                      >{{ token.tx.amount }} {{ token.tx.asset_code }}</span
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <LocaleSelect
              style="position:absolute; top:35px; right:24px; z-index:200;"
            ></LocaleSelect>
          </div>
          <form class="payment-method" @submit.prevent="handleSubmit">
            <div>
              <span>
                {{ $t('shop.shop_title') }}
              </span>

              <span class="manage">
                <a v-if="merchant" href="#">
                  {{ merchant.merchant_name }}
                </a>
              </span>
            </div>
            <PerfectScrollbar class="card-wrap">
              <ul v-if="token" class="card-list">
                <li
                  v-for="(account, index) in c_pay_available_accounts"
                  :key="index"
                >
                  <div class="img-wrap">
                    <div :class="[`payment-img ${token.tx.asset_code}`]"> </div>
                  </div>
                  <span class="card-type">{{
                    account.title || account.account_number
                  }}</span>
                  <span class="card-balance">
                    {{ account.balance }}
                  </span>
                  <div class="radio-wrap">
                    <el-radio v-model="card_checked" :label="account.seq">{{
                      $t('pay_main.pay_this_account')
                    }}</el-radio>
                  </div>
                </li>
              </ul>
              <div
                v-if="c_pay_available_accounts.length === 0"
                class="no-card-list"
              >
                <p>{{ $t('account_transfer.not_exist_account') }}</p>
              </div>
            </PerfectScrollbar>
            <div class="btn-wrap">
              <input
                class="payment-btn btn"
                type="submit"
                :value="$t('pay_main.footer_8')"
              />
            </div>
            <p class="addition"> {{ $t('pay_main.bill_show') }} Bit World </p>
            <div class="action-btn-wrap">
              <a class="f-left" @click="exchange_visible = true">{{
                $t('header.do_exchange')
              }}</a>
              <router-link
                :to="{ name: 'wallet' }"
                class="f-right"
                target="_blank"
                >{{ $t('wallet_page.account_create') }}</router-link
              >
            </div>
          </form>
        </div>

        <div class="right-content">
          <div class="img-wrap">
            <img
              src="@assets/img/payment-security.png"
              alt="결제 보안 이미지"
            />
          </div>
          <h2
            >{{ $t('pay_main.banner_text') }}<br />{{
              $t('pay_main.banner_text2')
            }}</h2
          >
          <p>{{ $t('pay_main.banner_text3') }}</p>
        </div>
      </div>
      <div class="footer">
        <a href="https://cocobnk.com/policy" target="_blank">{{
          $t('pay_main.footer_6')
        }}</a>
        <div class="footer-list">
          <ul>
            <li
              >ⓒ COCOBANK All rights reserved
              <i class="el-icon-lock"></i>
            </li>
          </ul>
        </div>
        <p>
          {{ $t('pay_main.footer_5') }}
          {{ $t('pay_main.footer_6') }}
          s{{ $t('pay_main.footer_7') }}
        </p>
      </div>
    </div>
    <el-dialog
      :visible.sync="exchange_visible"
      :title="$t('footer.direct_ex')"
      class="exchange-modal"
    >
      <ul>
        <li
          v-for="market in c_market_list_by_asset"
          :key="market.seq"
          class="exchange-list"
        >
          <div :class="[$style.infoWrap]">
            <div :class="[$style.title]">
              <div :class="[$style.coinItem]">
                <span
                  :class="`img-wrap coin-item ${market.source_asset_code}`"
                ></span>
              </div>
              <span :class="[$style.code]"
                >{{ market.source_asset_code }}/{{
                  market.target_asset_code
                }}</span
              >
            </div>
            <div :class="[$style.exchangeRate]">
              <ul>
                <li :class="[$style.shortList]">
                  <span>{{ $t('private.buy_calc_spread') }}</span>
                  {{
                    calcSpread(market, 'BID')
                      | codeDecimal(market.target_asset_code)
                  }}
                  {{ market.target_asset_code }}</li
                >
                <li :class="[$style.shortList]">
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
            <div :class="[$style.exchangeBox]">
              <div :class="[$style.amountWrap]">
                <strong :class="[$style.amount]"
                  >{{
                    assetDecimal(market.target_asset_seq, market.basic_rate)
                      | codeDecimal(market.target_asset_code)
                  }}
                  {{ market.target_asset_code }}</strong
                >
              </div>
              <div class="btn-wrap">
                <button
                  v-if="market.allow_bid === 'Y'"
                  class="btn-green"
                  @click="handleCreateTransfer(market.seq, 'BID')"
                  >{{ $t('buy') }}</button
                >
                <button
                  v-else
                  class="btn-green"
                  @click="$toasted.error($t('toasted_msg.not_allow_trade'))"
                  >{{ $t('buy') }}</button
                >
                <button
                  v-if="market.allow_ask === 'Y'"
                  class="btn-red marginL-10"
                  @click="handleCreateTransfer(market.seq, 'ASK')"
                  >{{ $t('sell') }}</button
                >
                <button
                  v-else
                  class="btn-red marginL-10"
                  @click="$toasted.error($t('toasted_msg.not_allow_trade'))"
                  >{{ $t('sell') }}</button
                >
              </div>
            </div>
          </div>
        </li>
      </ul>
    </el-dialog>

    <el-dialog
      :visible.sync="market_trade_modal"
      :title="$t('private.direct_market')"
      :append-to-body="true"
    >
      <el-form v-if="cs_market">
        <el-form-item :label="$t('private.cs_market_asset')">
          {{ cs_market.source_asset_code }}/{{ cs_market.target_asset_code }}
        </el-form-item>
        <el-form-item :label="$t('private.cs_market_basic_rate')">
          1 {{ cs_market.source_asset_code }} =
          {{
            assetDecimal(cs_market.target_asset_seq, cs_market.basic_rate)
              | codeDecimal(cs_market.target_asset_code)
          }}
          {{ cs_market.target_asset_code }}
        </el-form-item>
        <el-form-item :label="$t('private.transfer_type')">
          {{
            fromPairs(constants.market.direct_transfer.transfer_type)[
              params.transfer_type
            ]
          }}
        </el-form-item>
        <el-form-item :label="$t('private.exchange_rate')">
          {{ c_exchange_rate | codeDecimal(cs_market.target_asset_code) }}
        </el-form-item>
        <el-form-item
          :label="`${cs_market.target_asset_code} ${$t('account')}`"
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
          <p v-if="c_select_target_account" class="s_balance"
            >{{ c_select_target_account.code }} {{ $t('balance') }}:
            {{
              Decimal(c_select_target_account.balance).minus(
                c_select_target_account.holding_balance
              ) | codeDecimal(c_select_target_account.code)
            }}</p
          >
        </el-form-item>
        <el-form-item
          :label="`${cs_market.source_asset_code} ${$t('account')}`"
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
          <p v-if="c_select_source_account" class="s_balance"
            >{{ c_select_source_account.code }} {{ $t('balance') }}:
            {{
              Decimal(c_select_source_account.balance).minus(
                c_select_source_account.holding_balance
              ) | codeDecimal(c_select_source_account.code)
            }}</p
          >
        </el-form-item>
        <el-form-item :label="$t('private.direct_source_amount')">
          <el-input v-model="params.source_amount">
            <template slot="append">
              {{ cs_market.source_asset_code }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('private.direct_target_amount')">
          <el-input disabled :value="c_target_amount">
            <template slot="append">
              {{ cs_market.target_asset_code }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <button
            class="btn-grey marginR-10"
            @click.prevent="market_trade_modal = false"
            >{{ $t('cancel') }}</button
          >
          <button class="btn-submit" @click.prevent="handleSubmitTransfer">{{
            $t('private.submit_transfer')
          }}</button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
<style scoped>
.exchange-modal ul li.exchange-list {
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 10px;
  border: 1px solid #e5e5e5;
}
.fixedValue .exchange {
  float: right;
}
.btn-black,
.btn-grey,
.btn-submit,
.btn-red,
.btn-green {
  display: inline-block;
  padding: 10px 20px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
}
.btn-grey {
  background-color: #96a5b1;
}
.btn-submit {
  margin-left: 10px;
  background-color: #0068c1;
}
.btn-red {
  margin-left: 10px;
  background: #d32f2f;
}
.btn-green {
  background: #52b370;
}

@media (max-width: 768px) {
  .btn-black,
  .btn-grey,
  .btn-submit {
    padding: 5px 10px;
  }
}
</style>
