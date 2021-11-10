<script>
import { fetchDirectMarkets, createDirectTransfer } from '@apis/market'
import { mapState } from 'vuex'
import assetDecimal from '@utils/asset-decimal'
import Decimal from 'decimal.js'
import filter from 'lodash/filter'
import find from 'lodash/find'

export default {
  data() {
    return {
      step: 'first',
      source_account_dialog: false,
      quan_dialog: false,
      target_account_dialog: false,
      params: {
        source_amount: 0,
      },

      markets: [],
      amount: 0,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    c_s_asset_info() {
      if (!this.$route.params.asset_code) return null

      return find(this.assets, { code: this.$route.params.asset_code })
    },
    c_available_markets() {
      if (!this.markets.length) return []
      return filter(
        filter(this.markets, (market) => {
          return (
            (market.source_asset_code === this.c_s_asset_info.code &&
              market.allow_bid === 'Y') ||
            (market.target_asset_code === this.c_s_asset_info.code &&
              market.allow_ask === 'Y')
          )
        }),
        { is_active: 'Y' }
      )
    },
    c_s_market() {
      if (!this.params.market_seq) return null
      return find(this.c_available_markets, {
        seq: this.params.market_seq,
      })
    },
    c_source_accounts() {
      if (!this.c_s_market) return []

      return filter(this.accounts, {
        asset_seq: this.c_s_market.source_asset_seq,
      })
    },
    c_target_accounts() {
      if (!this.c_s_market) return []

      return filter(this.accounts, {
        asset_seq: this.c_s_market.target_asset_seq,
      })
    },
    c_target_amount() {
      if (!this.params.source_amount) return null

      return assetDecimal(
        this.c_s_market.target_asset_seq,
        this.c_exchange_rate
      )
        .mul(this.params.source_amount)
        .toString()
    },
    c_exchange_rate() {
      if (!this.c_s_market) return 0

      return this.calcSpread(this.c_s_market, this.params.transfer_type)
    },
    c_s_target_account() {
      return find(this.accounts, { seq: this.params.target_account_seq })
    },
    c_s_source_account() {
      return find(this.accounts, { seq: this.params.source_account_seq })
    },
  },
  watch: {
    c_s_market() {
      if (this.c_s_market.source_asset_code === this.c_s_asset_info.code)
        this.$set(this.params, 'transfer_type', 'BID')
      else this.$set(this.params, 'transfer_type', 'ASK')
    },
  },
  mounted() {
    Promise.all([this.loadDirectMarkets()]).catch((e) => {
      this.$toasted.error(e.message, {
        theme: 'toasted-primary',
        containerClass: 'kiosk-toasted',
      })
    })
  },
  methods: {
    handleStepFirst() {
      this.step = 'first'
      this.params = {
        market_seq: null,
        source_account_seq: null,
        target_account_seq: null,
        source_amount: 0,
        transfer_type: null,
      }
    },
    handleStepSecond(market_seq) {
      this.step = 'second'
      this.$set(this.params, 'market_seq', market_seq)
    },
    handleStepThird() {
      createDirectTransfer(this.params)
        .then(() => {
          this.$store.dispatch('account/getAccounts')
          this.step = 'third'
        })
        .then(() => {
          setTimeout(() => {
            this.$router.go(-1)
          }, 3000)
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
    },
    async loadDirectMarkets() {
      const { data } = await fetchDirectMarkets()

      this.markets = data
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
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-re-img/icon_' +
          code.toLowerCase() +
          '.svg')
      } catch (e) {
        return default_img
      }
    },
    selectSourceAccount(account_seq) {
      if (this.params.source_account_seq === account_seq)
        return this.$set(this.params, 'source_account_seq', null)
      this.$set(this.params, 'source_account_seq', account_seq)
    },
    selectTargetAccount(target_account_seq) {
      if (this.params.target_account_seq === target_account_seq)
        return this.$set(this.params, 'target_account_seq', null)
      this.$set(this.params, 'target_account_seq', target_account_seq)
    },
    resetSourceParams() {
      this.params.source_account_seq = null
      this.source_account_dialog = false
    },
    resetTargetParams() {
      this.params.target_account_seq = null
      this.target_account_dialog = false
    },
    amountCalc(num) {
      switch (num) {
        case '+100':
          this.amount = Number(this.amount) + 100
          break
        case '+10':
          this.amount = Number(this.amount) + 10
          break
        case '+1':
          this.amount = Number(this.amount) + 1
          break
        case 'reset':
          this.amount = Number(0)
          break
        case 'max':
          this.amount =
            this.params.transfer_type === 'BID'
              ? new Decimal(this.c_s_target_account.balance)
                  .minus(this.c_s_target_account.holding_balance)
                  .toFixed(8)
                  .toString()
              : new Decimal(this.c_s_source_account.balance)
                  .minus(this.c_s_source_account.holding_balance)
                  .toFixed(8)
                  .toString()
          break
        case '50%':
          var balance =
            this.params.transfer_type === 'BID'
              ? new Decimal(this.c_s_target_account.balance).minus(
                  this.c_s_target_account.holding_balance
                )
              : new Decimal(this.c_s_source_account.balance).minus(
                  this.c_s_source_account.holding_balance
                )
          var per = new Decimal(50)
          var calc_amount = balance.mul(per.div(100))
          this.amount = calc_amount.toFixed(8).toString()
          break
        case '25%':
          balance =
            this.params.transfer_type === 'BID'
              ? new Decimal(this.c_s_target_account.balance).minus(
                  this.c_s_target_account.holding_balance
                )
              : new Decimal(this.c_s_source_account.balance).minus(
                  this.c_s_source_account.holding_balance
                )
          per = new Decimal(25)
          calc_amount = balance.mul(per.div(100))
          this.amount = calc_amount.toFixed(8).toString()
          break
        case '.':
          var _pattern0 = /^\d*[.]\d*$/

          if (_pattern0.test(String(this.amount))) return
          this.amount = this.amount + num
          break
        default:
          if (
            String(this.amount) === '0' &&
            num !== '.' &&
            !String(this.amount).startsWith('0.')
          )
            this.amount = String(this.amount).slice(0, 0)
          this.amount = this.amount + num
          break
      }
      this.$set(this.params, 'source_amount', this.amount)
    },
    amountDelete() {
      this.amount = this.amount.slice(0, -1)
      this.$set(this.params, 'source_amount', this.amount)
    },
    amountDialog() {
      if (this.c_s_source_account && this.c_s_target_account)
        return (this.quan_dialog = true)
      else
        this.$toasted.error('계좌를 모두 선택해주세요', {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
    },
    resetAmount() {
      this.amount = 0
      this.params.source_amount = null
      this.quan_dialog = false
    },
  },
}
</script>

<template>
  <div class="new-acc-wrap charge-wrap">
    <div v-if="step === 'first'" class="first-step">
      <div class="tit">
        <h4>{{ $t('kiosk_re.charge_tit_1', [c_s_asset_info.code]) }}</h4>
        <p>{{ $t('kiosk_re.charge_tit_2', [c_s_asset_info.code]) }}</p>
      </div>
      <div class="coin-list-wrap account-wrap">
        <div class="direct-market-scroll">
          <div
            v-for="market in c_available_markets"
            :key="market.seq"
            class="coin-box"
            @click="handleStepSecond(market.seq)"
          >
            <div class="row">
              <h4 class="left">{{ $t('private.private') }}</h4>
              <div class="right">
                <img :src="getAssetSrc(market.source_asset_code)" alt="" />
                <p>{{ market.source_asset_code }}</p>
              </div>
            </div>
            <div class="row">
              <h4 class="left">{{ $t('kiosk_re.charge_txt_1') }}</h4>
              <div
                v-if="market.source_asset_code === c_s_asset_info.code"
                class="right"
              >
                <p
                  >1 {{ market.source_asset_code }} =
                  {{
                    calcSpread(market, 'BID')
                      | codeDecimal(market.target_asset_code)
                  }}
                  {{ market.target_asset_code }}</p
                >
              </div>
              <div
                v-if="market.target_asset_code === c_s_asset_info.code"
                class="right"
              >
                <p
                  >1 {{ market.source_asset_code }} =
                  {{
                    calcSpread(market, 'ASK')
                      | codeDecimal(market.target_asset_code)
                  }}
                  {{ market.target_asset_code }}</p
                >
              </div>
            </div>
            <div class="row">
              <h4 class="left">{{ $t('kiosk_re.charge_txt_2') }}</h4>
              <div class="right">
                <p
                  >{{ market.source_asset_code }}/{{
                    market.target_asset_code
                  }}</p
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="step === 'second'" class="second-step">
      <div class="tit">
        <h4>{{ $t('kiosk_re.charge_tit_1', [c_s_asset_info.code]) }}</h4>
        <p>{{ $t('kiosk_re.charge_tit_3') }}</p>
      </div>
      <template v-if="c_s_market">
        <div class="coin-list-wrap account-wrap">
          <div class="coin-box">
            <div class="row">
              <h4 class="left">{{ $t('private.private') }}</h4>
              <div class="right">
                <img :src="getAssetSrc(c_s_market.source_asset_code)" alt="" />
                <p>{{ c_s_market.source_asset_code }}</p>
              </div>
            </div>
            <div class="row">
              <h4 class="left">{{ $t('kiosk_re.charge_txt_1') }}</h4>
              <div
                v-if="c_s_market.source_asset_code === c_s_asset_info.code"
                class="right"
              >
                <p
                  >1 {{ c_s_market.source_asset_code }} =
                  {{
                    calcSpread(c_s_market, 'BID')
                      | codeDecimal(c_s_market.target_asset_code)
                  }}
                  {{ c_s_market.target_asset_code }}</p
                >
              </div>
              <div
                v-if="c_s_market.target_asset_code === c_s_asset_info.code"
                class="right"
              >
                <p
                  >1 {{ c_s_market.source_asset_code }} =
                  {{
                    calcSpread(c_s_market, 'ASK')
                      | codeDecimal(c_s_market.target_asset_code)
                  }}
                  {{ c_s_market.target_asset_code }}</p
                >
              </div>
            </div>
            <div class="row">
              <h4 class="left">{{ $t('kiosk_re.charge_txt_2') }}</h4>
              <div class="right">
                <p
                  >{{ c_s_market.source_asset_code }}/{{
                    c_s_market.target_asset_code
                  }}</p
                >
              </div>
            </div>
          </div>
          <div class="coin-acc-choice sec-con">
            <h4
              ><span>{{ c_s_market.source_asset_code }}</span>
              {{ $t('private.account_select') }}</h4
            >
            <el-button
              v-if="!params.source_account_seq"
              class="char-btn"
              type="text"
              @click="source_account_dialog = true"
              >{{ $t('private.account_select') }}</el-button
            >
            <el-button
              v-else
              class="char-btn s-asset"
              type="text"
              @click="source_account_dialog = true"
            >
              <div class="acc-info">
                <div class="acc row">
                  <p>{{ $t('b2c_exchange.account_number') }}</p>
                  <p>{{ c_s_source_account.account_number }}</p>
                </div>
                <div class="balan row">
                  <p>{{ $t('business.bank_account_change') }}</p>
                  <p>{{
                    `${c_s_source_account.balance} ${c_s_source_account.code}`
                  }}</p>
                </div>
              </div>
            </el-button>
            <el-dialog
              :title="$t('private.account_select')"
              :visible.sync="source_account_dialog"
              class="acc-dialog"
            >
              <div class="acc-scroll">
                <div class="choice-acc-list">
                  <div
                    v-for="account in c_source_accounts"
                    :key="account.seq"
                    :class="[
                      'choice-acc-box',
                      { on: params.source_account_seq === account.seq },
                    ]"
                    @click="selectSourceAccount(account.seq)"
                  >
                    <div class="acc-info">
                      <div class="acc row">
                        <p>{{ $t('b2c_exchange.account_number') }}</p>
                        <p>{{ account.account_number }}</p>
                      </div>
                      <div class="balan row">
                        <p>{{ $t('business.bank_account_change') }}</p>
                        <p>{{ `${account.balance} ${account.code}` }}</p>
                      </div>
                    </div>
                    <span
                      class="
                      acc-chk-img
                      "
                    ></span>
                  </div>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="btn-cancel" @click="resetSourceParams">{{
                  $t('cancel')
                }}</el-button>
                <el-button
                  class="btn-comple"
                  type="primary"
                  @click="source_account_dialog = false"
                  >{{ $t('kiosk_re.complete') }}</el-button
                >
              </span>
            </el-dialog>
          </div>

          <div class="ccf-acc-choice sec-con">
            <h4
              >{{ c_s_market.target_asset_code }}
              {{ $t('private.account_select') }}</h4
            >
            <el-button
              v-if="!params.target_account_seq"
              class="char-btn"
              type="text"
              @click="target_account_dialog = true"
              >{{ $t('private.account_select') }}</el-button
            >

            <el-button
              v-else
              class="char-btn s-asset"
              type="text"
              @click="target_account_dialog = true"
            >
              <div class="acc-info">
                <div class="acc row">
                  <p>{{ $t('b2c_exchange.account_number') }}</p>
                  <p>{{ c_s_target_account.account_number }}</p>
                </div>
                <div class="balan row">
                  <p>{{ $t('business.bank_account_change') }}</p>
                  <p>{{
                    `${c_s_target_account.balance} ${c_s_target_account.code}`
                  }}</p>
                </div>
              </div>
            </el-button>
            <el-dialog
              :title="$t('private.account_select')"
              :visible.sync="target_account_dialog"
              class="acc-dialog"
            >
              <div class="acc-scroll">
                <div class="choice-acc-list">
                  <div
                    v-for="account in c_target_accounts"
                    :key="account.seq"
                    :class="[
                      'choice-acc-box',
                      { on: params.target_account_seq === account.seq },
                    ]"
                    @click="selectTargetAccount(account.seq)"
                  >
                    <div class="acc-info">
                      <div class="acc row">
                        <p>{{ $t('b2c_exchange.account_number') }}</p>
                        <p>{{ account.account_number }}</p>
                      </div>
                      <div class="balan row">
                        <p>{{ $t('business.bank_account_change') }}</p>
                        <p>{{ `${account.balance} ${account.code}` }}</p>
                      </div>
                    </div>
                    <span
                      class="
                      acc-chk-img
                      "
                    ></span>
                  </div>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="btn-cancel" @click="resetTargetParams">{{
                  $t('cancel')
                }}</el-button>
                <el-button
                  class="btn-comple"
                  type="primary"
                  @click="target_account_dialog = false"
                  >{{ $t('kiosk_re.complete') }}</el-button
                >
              </span>
            </el-dialog>
          </div>
          <div class="ref-quan sec-con">
            <h4>{{ $t('kiosk_re.charge_txt_3') }}</h4>
            <el-button class="char-btn" @click="amountDialog">
              <p class="quan">{{ params.source_amount }}</p>
              <p>{{ c_s_market.source_asset_code }}</p>
            </el-button>
            <el-dialog
              :title="$t('private.direct_source_amount')"
              :visible.sync="quan_dialog"
              class="quan-dialog"
            >
              <div class="calc-wrap">
                <div class="top">
                  <div class="row">
                    <h4 class="left">{{
                      $t('private.direct_source_amount')
                    }}</h4>
                    <div class="right">
                      <p
                        >{{ params.source_amount }}
                        {{ c_s_market.source_asset_code }}</p
                      >
                    </div>
                  </div>
                  <div class="row">
                    <h4 class="left">{{
                      $t('private.direct_target_amount')
                    }}</h4>

                    <div class="right">
                      <p
                        >{{
                          c_target_amount
                            | codeDecimal(c_s_market.target_asset_code)
                        }}
                        {{ c_s_market.target_asset_code }}</p
                      >
                    </div>
                  </div>
                </div>
                <div class="total">
                  <p
                    >{{ params.source_amount
                    }}<span>{{ c_s_market.source_asset_code }}</span></p
                  >
                </div>
                <div class="quan-pad">
                  <div class="row">
                    <div class="pad-box" @click="amountCalc('+100')">
                      <p>+100</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('+10')">
                      <p>+10</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('+1')">
                      <p>+1</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('reset')">
                      <p>{{ $t('b2c_exchange.reset') }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="pad-box" @click="amountCalc('1')">
                      <p>1</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('2')">
                      <p>2</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('3')">
                      <p>3</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('max')">
                      <p>{{ $t('kiosk_re.quan_max') }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="pad-box" @click="amountCalc('4')">
                      <p>4</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('5')">
                      <p>5</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('6')">
                      <p>6</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('50%')">
                      <p>50%</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="pad-box" @click="amountCalc('7')">
                      <p>7</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('8')">
                      <p>8</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('9')">
                      <p>9</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('25%')">
                      <p>25%</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="pad-box" @click="amountCalc('.')">
                      <p>.</p>
                    </div>
                    <div class="pad-box" @click="amountCalc('0')">
                      <p>0</p>
                    </div>
                    <div class="pad-box">
                      <p></p>
                    </div>
                    <div class="pad-box" @click="amountDelete">
                      <img src="@assets/kiosk-re-img/icon_back.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button class="btn-cancel" @click="resetAmount">{{
                  $t('cancel')
                }}</el-button>
                <el-button
                  class="btn-comple"
                  type="primary"
                  @click="quan_dialog = false"
                  >{{ $t('kiosk_re.input_complete') }}</el-button
                >
              </span>
            </el-dialog>
          </div>
          <div class="bottom">
            <div class="total-charge">
              <h4>{{ $t('kiosk_re.total_charge') }}</h4>
              <p v-if="params.transfer_type === 'ASK'"
                ><span>{{
                  c_target_amount | codeDecimal(c_s_market.target_asset_code)
                }}</span
                >{{ c_s_market.target_asset_code }}</p
              >
              <p v-else
                ><span>{{
                  params.source_amount
                    | codeDecimal(c_s_market.source_asset_code)
                }}</span
                >{{ c_s_market.source_asset_code }}</p
              >
            </div>
            <div class="bot-btn-wrap">
              <a
                class="btn-prev bot-btn"
                href="javascript:;"
                @click="handleStepFirst"
                >{{ $t('before') }}</a
              >
              <div class="btn-next bot-btn" @click="handleStepThird">{{
                $t('kiosk_re.charge_txt_5')
              }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="step === 'third'" class="third-step">
      <div class="com-wrap">
        <img src="@assets/kiosk-re-img/icon_ok.svg" alt="" />
        <h4>{{ $t('kiosk_re.charge_txt_6') }}</h4>
        <p>{{ $t('kiosk_re.charge_txt_7') }}</p>
      </div>
      <div class="bot-btn-wrap">
        <button class="btn-next bot-btn" @click="$router.go(-1)">
          {{ $t('success') }}
        </button>
      </div>
    </div>
  </div>
</template>
