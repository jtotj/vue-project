<template>
  <div class="left_panel">
    <InvestNav></InvestNav>
    
    <p class="coment"><span v-html="$t('msg_estimated_value')"></span><i class="ico_round">?</i></p>
    <div class="invest" v-loading="s_trade_loading">
      <div class="profile">
        <div class="summary">
          <div>
            <dl>
              <dt>{{ $t('total_transaction_amount') }}</dt>
              <dd><b>{{ php.number_format(estate_info.trade_margin) }}</b><span>{{ $t('symbol_defalt') }}</span></dd>
            </dl>
            <dl>
              <dt>{{ $t('total_evaluated_price') }}</dt>
              <dd><b>{{ php.number_format(estate_info.evaluated_estate) }}</b><span>{{ $t('symbol_defalt') }}</span></dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>{{ $t('total_valuation_profit_loss') }}</dt>
              <dd><b>{{ php.number_format(estate_info.evaluated_gain_loss) }}</b><span>{{ $t('symbol_defalt') }}</span></dd>
            </dl>
            <dl>
              <dt>{{ $t('total_valuation_earnings_rate') }}</dt>
              <dd><b :class="estate_info.evaluated_precentage > 0 ? 'up' : 'down'">{{ estate_info.evaluated_precentage > 0 ? '+' : '' }}{{ php.number_format(estate_info.evaluated_precentage, 2) }}</b><span>%</span></dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>{{ $t('earnest_balance') }}</dt>
              <dd><b>{{ php.number_format(estate_info.margin) }}</b><span>{{ $t('symbol_defalt') }}
</span></dd>
            </dl>
            <dl>
              <dt>{{ $t('transaction_possibility_amount') }}</dt>
              <dd><b>{{ php.number_format(estate_info.tradable_margin) }}</b><span>{{ $t('symbol_defalt') }}</span></dd>
            </dl>
          </div>
          <div>
            <dl>
              <dt>{{ $t('loss_cut_rate') }}</dt>
              <dd><b>{{ s_account_info ? s_account_info.losscut_ratio : '-' }}</b><span>%</span></dd>
            </dl>
            <dl>
              <dt>{{ $t('loss_cut_amount') }}</dt>
              <dd><b>{{ s_account_info ? php.number_format(s_account_info.losscut) : '-' }}</b><span>{{ $t('symbol_defalt') }}</span></dd>
            </dl>
          </div>
        </div>
        <template v-if="trade_method === 'MARGIN'">
        <div class="tb_header">
          <table>
            <colgroup>
              <col width="120">
              <col width="140">
              <col width="50">
              <col width="140">
              <col width="140">
              <col width="135">
              <col width="100">
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('holding_coin')}}</th>
                <th>{{ $t('Entry_number')}}</th>
                <th>{{ $t('position') }}</th>
                <th>{{ $t('entry_asking_price')}}</th>
                <th>{{ $t('evaluated_price') }}</th>
                <th>{{ $t('valuation_profit_loss_percent')}}</th>
                <th></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="tb_body">
          <table>
            <colgroup>
              <col width="120">
              <col width="140">
              <col width="50">
              <col width="140">
              <col width="140">
              <col width="135">
              <col width="100">
            </colgroup>
            <tbody>
              <template v-for="val in c_trade_list">
                <tr>
                  <td>
                    <span :class="['symbol', 'iCoin', val.asset]"></span>
                    <p class="coin_name">
                      <strong class="ko_name">{{ fromPairs(constants.asset.assets)[val.asset] }}</strong>
                      <span class="en_name">{{ fromPairs(constants.asset.asset_codes)[val.asset] }}</span>
                    </p>
                  </td>
                  <td><b>{{ php.number_format(val.amount, 8) }}</b><span class="unit">{{ fromPairs(constants.asset.asset_codes)[val.asset].split('/')[0] }}</span></td>
                  <td>
                    <em>{{ fromPairs(constants.trade.positions)[val.position] }}</em>
                  </td>
                  <td>
                    <em>{{ php.number_format(val.tick) }}</em>
                    <span class="unit">{{ $t('symbol_defalt') }}
</span>
                  </td>
                  <td>
                    <strong>{{ php.number_format(val.evaluated_estate) }} <span class="unit">{{ $t('symbol_defalt') }}
</span></strong>
                  </td>
                  <td>
                    <em :class="[val.evaluated_precentage > 0 ? 'up' : 'down']">{{ val.evaluated_precentage > 0 ? '+' : '' }}{{ php.number_format(val.evaluated_precentage, 2) }}</em><span class="unit">%</span>
                    <br />
                    <em>{{ val.evaluated_precentage > 0 ? '+' : '' }}{{ php.number_format(val.evaluated_gain_loss) }}</em>
                    <span class="unit">{{ $t('symbol_defalt') }}
</span>
                  </td>
                  <td class="order_btn">
                    <button v-if="val.status === 'PENDING'" @click.prevent="cancelTrade(val.trade_srl)" type="button">{{ $t('cancel') }}</button>
                    <button v-else @click.prevent="s_trade_srl = s_trade_srl == val.trade_srl ? null : val.trade_srl" type="button">{{ $t('order') }}</button>
                  </td>
                </tr>
                <tr class="order_tb" v-if="s_trade_srl == val.trade_srl">
                  <td colspan="7">
                    <div class="order_tb_input">
                      <p>
                        <template v-if="val.use_auto_clear === 'N'">
                          <vue-numeric v-restrict.number v-model.number="s_trade_params.auto_clear_tick" type="text"></vue-numeric>
                          <button type="button" @click.prevent="setAutoClear">{{ $t('limit_price_check') }}</button>
                        </template>
                        <template v-else>
                          <vue-numeric :value="val.auto_clear_tick" disabled type="text"></vue-numeric>
                          <button type="button" @click.prevent="unsetAutoClear">{{ $t('limit_price_cancel') }}</button>
                        </template>
                        <button type="button" @click.prevent="clearTrade" class="sell">{{ $t('market_price_liquidation') }}</button>
                      </p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="none_list" v-if="!c_trade_list.length">{{ $t('msg_no_holding_coin') }}</div>
        </template>
        <template v-else-if="trade_method === 'FUTURES'">
        <div class="tb_header">
          <table>
            <colgroup><col width="120"><col width="120"><col width="70"><col width="120"><col width="120"><col width="120"><col width="120"><col width="120"><col width="70"></colgroup>
            <thead>
              <tr>
                <th>{{ $t('holding_coin') }}</th>
                <th>{{ $t('future_name') }}</th>
                <th>{{ $t('position') }}</th>
                <th>{{ $t('holding_amount') }}</th>
                <th>{{ $t('average_price') }}</th>
                <th>{{ $t('current_price') }}</th>
                <th>{{ $t('valuation_profit_loss_rate') }}</th>
                <th>{{ $t('realization_net_profit') }}</th>
                <th></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="tb_body">
          <table>
            <colgroup><col width="120"><col width="120"><col width="70"><col width="120"><col width="120"><col width="120"><col width="120"><col width="120"><col width="70"></colgroup>

            <tbody>
              <template v-for="(val,idx) in c_trade_list">
                <tr>
                    <td>
                        <span :class="['symbol', 'iCoin', val.asset]"></span>
                        <p class="coin_name">
                            <strong class="ko_name">{{ fromPairs(constants.asset.assets)[val.asset] }}</strong>
                            <span class="en_name">{{ fromPairs(constants.asset.asset_codes)[val.asset] }}</span>
                        </p>
                    </td>
                    <td v-if="c_filter_futures.length">{{ c_filter_futures[idx].title }}</td>
                    <td>
                        <em>{{ fromPairs(constants.trade.positions)[val.position] }}</em>
                    </td>
                    <td>
                      <b>{{ php.number_format(val.amount, 8) }}</b>
                      <span class="unit">{{ fromPairs(constants.asset.asset_codes)[val.asset].split('/')[0] }}</span>
                    </td>
                    
                    <td>
                        <em>{{ php.number_format(val.tick) }}</em>
                        <span class="unit">CCE</span>
                    </td>
                    <td>
                        <strong>{{ php.number_format(0) }} <span class="unit">CCE</span></strong>
                    </td>
                    
                    <td>
                      <em :class="[val.evaluated_precentage > 0 ? 'up' : 'down']">{{ val.evaluated_precentage > 0 ? '+' : '' }}{{ php.number_format(val.evaluated_precentage, 2) }}</em><span class="unit">%</span>
                      <br />
                      <em>{{ val.evaluated_precentage > 0 ? '+' : '' }}{{ php.number_format(val.evaluated_gain_loss) }}</em>
                      <span class="unit">{{ $t('symbol_defalt') }}</span>
                    </td>
                    <td>{{ php.number_format(val.holding_gain_loss) }}  <span class="unit">CCE</span></td>
                    
                    
                    <td class="order_btn">
                        <button v-if="val.status === 'PENDING'" @click.prevent="cancelTrade(val.trade_srl)" type="button">{{ $t('cancel') }}</button>
                        <button v-else @click.prevent="s_trade_srl = s_trade_srl == val.trade_srl ? null : val.trade_srl" type="button">{{ $t('order') }}</button>
                    </td>
                </tr>
                <tr class="order_tb" v-if="s_trade_srl == val.trade_srl">
                  <td colspan="7">
                    <div class="order_tb_input">
                      <p>
                        
                        <button type="button" @click.prevent="clearFutureBalance" class="sell">{{ $t('market_price_liquidation') }}</button>
                      </p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="none_list" v-if="!c_trade_list.length">{{ $t('msg_no_holding_coin') }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .invest {
    height: calc(100% - 36px);
    overflow-y: auto;
    overflow-x: hidden;
  }

</style>

<script>
  import php from 'phpjs'
  import func from 'classes/func.inc'
import * as futureApi from '@/api/futures'
  import _ from 'lodash'
  import InvestNav from '@/components/InvestNav'
  import {
    mapState,
    mapGetters
  } from 'vuex'
  import * as tradeApi from '@/api/trade'
  import VueNumeric from 'vue-numeric'

  export default {
    name: 'invest',
    components: {
      InvestNav,
      VueNumeric
    },
    computed: {
      c_filter_futures() {
            const futures_title = []
            _.forEach(this.c_trade_list, (data) => {
                let future = _.find(this.futures, (e) => {
                    return e.future_srl === data.future_srl
                })
                if(future) {
                    futures_title.push(future)
                }
            })
            return futures_title
        },
      estate_info() {
        var vm = this;

        var data = {
          margin: _.chain(vm.c_accounts).filter({
            account_srl: this.s_account_info ? this.s_account_info.account_srl : 0
          }).map('margin').sum().value(),
          trade_margin: _.chain(vm.c_accounts).filter({
            account_srl: this.s_account_info ? this.s_account_info.account_srl : 0
          }).map('trade_margin').sum().value(),
          holding_balance: _.chain(vm.c_accounts).filter({
            account_srl: this.s_account_info ? this.s_account_info.account_srl : 0
          }).map('holding_balance').sum().value(),
          evaluated_gain_loss: _.chain(vm.c_accounts).filter({
            account_srl: this.s_account_info ? this.s_account_info.account_srl : 0
          }).map('evaluated_gain_loss').sum().value(),
        }

        data.evaluated_estate = data.margin + data.evaluated_gain_loss;
        data.tradable_margin = Math.max(data.margin - data.holding_balance, 0);
        data.evaluated_precentage = (data.margin + data.evaluated_gain_loss) / data.margin * 100 - 100;

        return data;
      },
      c_accounts() {
        var accounts = [];
        var vm = this;

        _.each(vm.accounts, (val, key) => {
          var account = _.extend({}, val);
          var account_trades = _.filter(vm.c_trade_list, {
            account_srl: account.account_srl
          });

          var trade_margin = _.chain(account_trades).map('trade_margin').sum().value(); // 주문 시 사용된 증거금의 합계 (수수료 제외)

          account.trade_margin = trade_margin;
          account.evaluated_gain_loss = _.chain(account_trades).filter({
            status: 'LINKED'
          }).map('evaluated_gain_loss').sum().value(); // 주문의 손익금 합계
          account.evaluated_estate = account.margin + account.evaluated_gain_loss + trade_margin; // 평가 자산
          account.evaluated_precentage = (trade_margin + account.evaluated_gain_loss) / trade_margin * 100 - 100; // 손익률

          accounts.push(account);
        })

        return accounts;
      },
      c_trade_list() {
        var trade_list = [];
        var vm = this;
        var target_datas = [].concat(vm.future_balances, vm.trade_list);

        target_datas = _.filter(target_datas, {
          account_srl: this.s_account_info ? this.s_account_info.account_srl : 0
        })

        _.each(target_datas, (val, key) => {
          var trade = {};
          var asset_setting = vm.asset_settings[val.asset];
          var current_tick = vm.premiumToTick(asset_setting, vm.premiums[val.asset]);
          var tick_unit_count_diff = 0;
          var trade_type = val.balance_srl || val.future_srl ? 'FUTURES' : 'MARGIN';

          switch (trade_type) {
            case 'MARGIN':
              trade = _.extend({}, val);
              tick_unit_count_diff = vm.diffTickUnitCount(asset_setting.tick_unit, current_tick, trade.tick);
              var trade_margin = trade.trade_margin;

              if (trade.position == 'PUT') tick_unit_count_diff *= -1;
              if (trade.status == 'PENDING') tick_unit_count_diff = 0;

              trade.trade_margin = trade_margin;
              break;

            case 'FUTURES':
              _.extend(trade, {
                trade_srl: val.trade_srl || val.balance_srl,
                asset: val.asset,
                future_srl: val.future_srl,
                trade_margin: val.trade_margin || (val.unit_price * Math.abs(val.amount) / val.leverage),
                tick: val.tick || val.average_tick,
                amount: Math.abs(val.amount),
                position: val.position || (val.amount < 0 ? 'PUT' : 'CALL'),
                evaluated_gain_loss: 0,
                evaluated_estate: 0,
                evaluated_precentage: 0,
                total_fee: val.unit_fee * Math.abs(val.amount),
                status: val.balance_srl ? 'LINKED' : 'PENDING'
              })

              tick_unit_count_diff = vm.diffTickUnitCount(asset_setting.tick_unit, current_tick, trade.tick);

              if (val.trade_srl && val.status != 'PENDING') return;

              if (trade.position == 'PUT') tick_unit_count_diff *= -1;
              if (trade.status == 'PENDING') tick_unit_count_diff = 0;

              break;
          }

          trade.evaluated_gain_loss = asset_setting.tick_unit_profit[trade_type] * tick_unit_count_diff * trade.amount; // 평가 손익
          trade.holding_gain_loss = trade.evaluated_gain_loss - trade.total_fee;
          trade.evaluated_estate = trade.trade_margin + trade.evaluated_gain_loss; // 평가 금액
          trade.evaluated_precentage = trade.evaluated_estate / trade.trade_margin * 100 - 100; // 손익률

          trade_list.push(trade);
        })

        return trade_list;
      },
      ...mapGetters(['accounts', 's_account_info']),
      ...mapState({
        logged_info: state => state.auth.logged_info,
        constants: state => state.common.constants,
        asset_settings: state => state.asset.settings,
        assets_statistics: state => state.asset.assets_statistics,
        trade_list: state => state.trade.unclosed_trades,
        premiums: state => state.asset.premiums,
        trade_method: state => state.common.trade_method,
        future_balances: state => state.future.future_balances
      })
    },
    data() {
      return {
        is_loaded: false,
        futures: [],
        s_trade_srl: null,
        s_trade_params: {},
        s_trade_loading: false,
        php,
        func,
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if(this.trade_method === 'FUTURES') {
          Promise.all([this.loadFutures()]).then(() => {
                    this.is_loaded = true
          })
        }
      },
      premiumToTick(asset_setting, premium) {

        return ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit;
      },

      // 호가단위 갯수의 차를 구함
      diffTickUnitCount(tick_unit, tick1, tick2) {

        return tick1 / tick_unit - tick2 / tick_unit;
      },
      loadFutures(callback) {
            return futureApi.fetchFutures({ asset: this.selected_asset }).then(({ data }) => {
                this.futures = data
            })
        },
        loadFutureBalances(callback) {
            return futureApi.fetchFutureBalance({ asset: this.selected_asset }).then(({data}) => {
                this.future_balances = data
            })
        },

      cancelTrade(trade_srl) {
        this.s_trade_loading = true;
        tradeApi.cancelTrade(trade_srl).then(({
          message
        }) => {
          this.$toasted.info(message);
          this.s_trade_loading = false;
        }).catch(() => {
          this.s_trade_loading = false;
        })
      },

      clearTrade() {
        this.s_trade_loading = true;
        tradeApi.clearTrade(this.s_trade_srl).then(({
          message
        }) => {
          this.$toasted.info(message);
          this.s_trade_loading = false;
        }).catch(() => {
          this.s_trade_loading = false;
        })
      },

      setAutoClear() {
        this.s_trade_loading = true;
        this.$store.dispatch('setAutoClear', {
          trade_srl: this.s_trade_srl,
          auto_clear_tick: this.s_trade_params.auto_clear_tick
        }).then(({
          message
        }) => {
          this.$toasted.info(message);
          this.s_trade_loading = false;
        }).catch(() => {
          this.s_trade_loading = false;
        });
      },

      unsetAutoClear() {
        this.s_trade_loading = true;
        this.$store.dispatch('unsetAutoClear', this.s_trade_srl).then(({
          message
        }) => {
          this.$toasted.info(message);
          this.s_trade_loading = false;
        }).catch(() => {
          this.s_trade_loading = false;
        });
      },
      clearFutureBalance() {
            var vm = this;
            this.s_trade_loading = true;
            var future_balance_info = _.find(vm.future_balances, { balance_srl: this.s_trade_srl });
            tradeApi.clearFutureBalance({
                account_srl: future_balance_info.account_srl,
                asset: future_balance_info.asset,
                tick: null,
                amount: Math.abs(future_balance_info.amount),
                position: future_balance_info.amount < 0 ? 'CALL' : 'PUT',
                future_srl: future_balance_info.future_srl
            }).then(({message}) => {
                this.s_trade_loading = false;
            }).catch((e) => {
                this.s_trade_loading = false;
            })
        },
    }
  }

</script>
