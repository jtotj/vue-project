<template>
    <div class="left_panel" v-loading="panel_loading">
        <div class="inner" style="width:100%; height:auto; margin-bottom:5px;">
                <h3>
                    <span>{{ $t('symbol_defalt_io') }}</span>
                    <button type="button" @click.prevent="refreshAccounts"><i class="xi xi-refresh"></i></button>
                </h3>
                <dl class="amount">
                    <dt>{{ $t('holding_price') }}</dt>
                    <dd>
                        <strong>{{ s_account_info ? php.number_format(s_account_info.margin) : '-' }}</strong>
                        <span class="unit">{{ $t('symbol_defalt') }}</span>
                    </dd>
                </dl>
                <div class="definition">
                    <dl>
                        <dt>{{ $t('trade_waiting') }}</dt>
                        <dd>
                            <em>{{ s_account_info ? php.number_format(s_account_info.holding_balance) : '-' }}</em>
                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                            <!-- <button type="button">{{ $t('show') }}</button> -->
                        </dd>
                    </dl>
                    <dl>
                        <dt>{{ $t('withdrawal_possibility') }}</dt>
                        <dd>
                            <em>{{ s_account_info ? php.number_format(s_account_info.margin - s_account_info.holding_balance) : '-' }}</em>
                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                            <i class="ico_round" v-tooltip="$t('about_withdraw_available')">?</i>
                        </dd>
                    </dl>
                </div>
            </div>
        <div class="wallet">
            <perfect-scrollbar tag="div" class="inner">
                <dl class="total">
                    <dt>{{ $t('total_holding_asset') }}</dt>
                    <dd><strong class="point_red">{{ s_account_info ? php.number_format(s_account_info.margin) : '-' }}</strong><span class="unit">{{ $t('symbol_defalt') }}</span></dd>
                </dl>
                <div class="srch_box_wrap">
                    <div class="srch_box">
                        <div class="srch">
                            <input v-model="search_keyword" type="text">
                            <button type="button"><i class="icon-magnifier"></i></button>
                        </div>
                        <div class="chk_opt" v-if="0"><label><input type="checkbox"/><span>{{ $t('only_holding_coin') }}</span></label></div>
                    </div>
                </div>
                <div class="table_wrap" style="border-radius:10p; overflow:auto;">
                    <table>
                        <thead>
                            <tr>
                                <th style="border:none; background:none;">{{ $t('coin_name') }}</th>
                                <th style="border:none; background:none;">{{ $t('holding_specific_gravity') }}</th>
                                <th style="border:none; background:none;">{{ $t('holding_amount') }}</th>
                                <th style="border:none; background:none;">{{ $t('evaluated_price') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="coin in c_coin_list">
                                <td>
                                    <span :class="['symbol', 'iCoin', coin.asset]"></span>
                                    <p class="coin_name">
                                        <strong class="ko_name">{{ coin.asset_title }}</strong>
                                        <span class="en_name">{{ coin.asset_code.split('/')[0] }}</span>
                                    </p>
                                </td>
                                <td class="weight">
                                    <span>{{ php.number_format(coin.hold_percentage, 2) }}%</span>
                                    <i class="bar" :style="{ width: `${coin.hold_percentage}%` }"></i>
                                </td>
                                <td>
                                    <p>
                                        <em>{{ php.number_format(coin.amount) }}</em>
                                        <span class="unit">{{ coin.asset_code.split('/')[0] }}</span>
                                    </p>
                                </td>
                                <td>{{ coin.evaluated_estate === null ? $t('left_equal') : `${php.number_format(coin.evaluated_estate)} CCE` }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </perfect-scrollbar>

            <perfect-scrollbar tag="div" class="io_box">
                <div class="io_title">{{ $t('io_history') }}</div>
                <div class="type_sel">
                    <span v-html="$t('about_view_all_equity_io_log')"></span>
                    <select v-model="io_type">
                        <option v-for="val in [['deposit', $t('deposit')], ['withdraw', $t('withdrawal') ], ['union', $t('union')]]" :value="val[0]">{{ val[1] }}</option>
                    </select>
                </div>
                <div class="io_list" >
                    <ul class="list-head">
                        <li class="head-item">{{ $t('balance.segregation') }}</li> 
                        <li class="head-item">{{ $t('sum') }}</li> 
                        <li class="head-item">{{ $t('state') }}</li> 
                        <li class="head-item">{{ $t('balance.check_time') }}</li> 
                    </ul>
                    <ul v-for="val in c_union_list" class="io-item">
                        <li :class="['type', val.class]">{{ val.type }}</li>
                        <li class="amount">
                            <em>{{ php.number_format(val.request_amount) }}</em>
                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                        </li>
                        <li class="status">{{ val.status }}</li>
                        <li class="time">
                            {{ func.zdate(val.regdate, 'Y-m-d') }}
                            {{ func.zdate(val.regdate, 'H:i') }}
                        </li>
                    </ul>
                </div>
            </perfect-scrollbar>
        </div>

        <div class="io_panel" >
            
            <div class="inner" >
                
                <div class="tab_btn" data-tab="io">
                    <a href="#" @click.prevent="selected_tab = tab[0]" type="button" :class="[{ on: tab[0] === selected_tab }, tab[0]]" v-for="tab in tabs">{{ tab[1] }}</a>
                </div>

                <div class="tab_cnt" data-tab="io">
                    <div v-for="tab in tabs" v-show="tab[0] === selected_tab" v-loading="request_loading && tab[0] != 'io_list'" :class="[{ on: tab[0] === selected_tab }, tab[0]]">
                        <template v-if="tab[0] === 'withdrawal'">
                            <dl>
                                <dt>{{ $t('once_withdrawal_limit') }}</dt>
                                <dd>
                                    <em>∞</em>
                                    <span class="unit">{{ $t('symbol_defalt') }}</span>
                                </dd>
                                <dt>{{ $t('daily_withdrawal_limit') }}<button type="button" @click.prevent v-tooltip="$t('msg_guide_limit')">{{ $t('guide_limit') }}</button></dt>
                                <dd><em>∞</em>{{ $t('remain') }}</dd>
                            </dl>
                            <dl v-if="otp_token_required" class="input">
                                <dt>{{ $t('otp_authentication_number') }}</dt>
                                <dd class="addr">
                                    <input v-restrict.number v-model="withdraw_params.otp_token" @keyup="handleOtpKeyup" maxlength="6" type="text" />
                                </dd>
                            </dl>
                            <dl v-else class="input">
                                <dt>{{ $t('withdrawal_accounts') }}</dt>
                                <dd v-if="0">
                                    {{ s_account_info ? s_account_info.account_number : $t('cmd_select_account') }}
                                </dd>
                                <dd>
                                    <select v-model="select_account_srl">
                                        <option selected disabled value=null>{{ $t('please_select_account') }}</option>
                                        <option v-for="account in c_trade_type_account" :key="account.account_srl" :value="account.account_srl">{{ account.account_number }}</option>
                                    </select>
                                </dd>
                                <dt>{{ $t('withdrawal_amount_symbol_defalt') }}</dt>
                                <dd class="addr">
                                    <template v-if="c_pending_withdraw">{{ php.number_format(c_pending_withdraw.request_amount) }} CCE</template>
                                    <template v-else>
                                        <vue-numeric v-restrict.number v-model.number="withdraw_params.request_amount" type="text"></vue-numeric>
                                        <button type="button" @click="withdraw_params.request_amount = s_account_info ? s_account_info.margin : 0">{{ $t('full_amount') }}</button>
                                    </template>
                                </dd>
                                <dt>{{ $t('eth_wallet_address') }}</dt>
                                <dd class="wallet">
                                    <template v-if="c_pending_withdraw">{{ c_pending_withdraw.bank_account }}</template>
                                    <input v-else v-model="withdraw_params.bank_account" type="text">
                                </dd>
                            </dl>
                            <div class="warning2">
                                <strong>
                                    <i>!</i>
                                    {{ $t('msg_withdrawal_must_read') }}
                                </strong>
                                <ul>
                                    <li>{{ $t('msg_1_withdrawal_application_time_required') }} </li>
                                    <li>{{ $t('msg_2_withdrawal_application_cancel_request') }} </li>
                                    <li>{{ $t('msg_3_withdrawal_only_io_coin_remit') }} </li>
                                    <li>{{ $t('msg_4_withdrawal_blockchain_allow') }} </li>
                                    <li>{{ $t('msg_5_withdrawal_deposit_add_different') }} </li>
                                    <li>{{ $t('msg_6_transmission_errors_not_restore') }}</li>
                                </ul>
                                <ul class="io_btn">
                                    <li v-if="c_pending_withdraw"><button class="reset" @click.prevent="cancelWithdraw"><i class="fa fa-ban" aria-hidden="true"></i>{{ $t('withdrawal_application_cancel') }} </button></li>
                                    <template v-else>
                                        <li><button class="reset" @click.prevent="withdraw_params = { request_amount: 0, bank_account: '' }; otp_token_required = false;"><i class="fa fa-refresh" aria-hidden="true"></i>{{ $t('reset') }} </button></li>
                                        <li>
                                            <button type="button" @click.prevent="requestWithdraw" class="withdraw">{{ otps.length && !otp_token_required ?  $t('otp_authentication') : $t('withdrawal_application') }}</button>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </template>
                        <template v-else-if="tab[0] === 'io_list'">
                           <div class="type_sel">
                                <select v-model="io_type">
                                    <option v-for="val in [['deposit', $t('deposit')], ['withdraw', $t('withdrawal') ], ['union', $t('union')]]" :value="val[0]">{{ val[1] }}</option>
                                </select>
                            </div>
                            <div class="list">
                                <perfect-scrollbar tag="div" v-loading="loading" class="tb_body">
                                    <table>
                                        <colgroup><col width="50"><col width="*"><col width="50"><col width="80"><col width="90"></colgroup>
                                        <thead>
                                            <tr>
                                                <th>{{ $t('balance.segregation') }}</th>
                                                <th>{{ $t('sum') }}</th>
                                                <th></th>
                                                <th style="text-align:left;">{{ $t('state') }}</th>
                                                <th>{{ $t('balance.check_time') }}</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr v-for="val in c_union_list">
                                                <td :class="['type', val.class]">{{ val.type }}</td>
                                                <td class="amount">
                                                    <em>{{ php.number_format(val.request_amount) }}</em>
                                                    <span class="unit">{{ $t('symbol_defalt') }}</span>
                                                </td>
                                                <td class="name"></td>
                                                <td class="status">{{ val.status }}</td>
                                                <td class="time">
                                                    {{ func.zdate(val.regdate, 'Y-m-d') }}<br />
                                                    {{ func.zdate(val.regdate, 'H:i') }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </perfect-scrollbar>
                              <!--  <p v-html="$t('about_view_all_equity_io_log')"></p> -->
                            </div> 
                        </template>
                        <template v-else>
                            <div class="txt1">
                                <p class="deposit-notice">{{ $t('CCE_deposit_msg') }}</p>
                                <p class="deposit-notice">{{ $t('CCE_deposit_msg2') }}</p>
                                <p class="deposit-notice">{{ $t('CCE_deposit_msg3') }}</p>
                            </div>
                            <dl v-if="0">
                                <dt>{{ $t('deposit_coin') }}</dt>
                                <dd>{{ $t('balance.io_coin') }}</dd>
                                <dt style="width: 55px;">{{ $t('wallet_address') }}</dt>
                                <dd style="width: calc(100% - 55px);">
                                    <v-popover>
                                        0xd4a393c44aaa8b0a2302f33fdd79fe2fbe0f334c
                                        <template slot="popover">
                                            <img src="~assets/img/ethqr.jpg" />
                                        </template>
                                    </v-popover>
                                </dd>
                            </dl>
                            <dl class="input">
                                <dt>{{ $t('deposit_account') }}</dt>
                               <!-- <dd v-if="s_account_info">
                                    {{ s_account_info ? s_account_info.account_number : $t('please_select_account') }}
                                </dd>-->
                                <dd>
                                    <select v-model="select_account_srl">
                                        <option selected disabled value=null>{{ $t('please_select_account') }}</option>
                                        <option v-for="account in c_trade_type_account" :key="account.account_srl" :value="account.account_srl">{{ account.account_number }}</option>
                                    </select>
                                </dd>
                                <dt>{{ $t('deposit_amount_symbol_defalt') }}</dt>
                                <dd v-if="c_pending_deposit">
                                    {{ c_pending_deposit.asset_price ? (c_pending_deposit.request_amount / c_pending_deposit.asset_price).toFixed(8) : $t('not_calculation')}} {{ $t('balance.io_source_coin') }}
                                    ({{ php.number_format(c_pending_deposit.request_amount) }} {{ $t('symbol_defalt') }})
                                </dd>
                                <dd v-else class="addr">
                                    <vue-numeric v-restrict.number v-model.number="deposit_params.request_amount" type="text"></vue-numeric>
                                </dd>
                                <dt v-if="0">{{$t('transaction')}}</dt>
                                <dd v-if="0" class="txid">
                                    <template v-if="c_pending_deposit">
                                        <input v-if="!c_pending_deposit.txid || !c_pending_deposit.txid.length" v-model="deposit_params.txid" :disabled="!c_pending_deposit" type="text">
                                        <template v-else>{{ c_pending_deposit.txid }}</template>
                                    </template>
                                    <input v-else :disabled="true" :placeholder="$t('after_applying_entry')" type="text">
                                </dd>
                            </dl>
                            <div class="warning">
                                <strong>
                                    <i>!</i>{{ $t('msg_deposit_must_read') }}
                                  
                                </strong>
                                <ul>
                                    <li>{{ $t('msg_1_io_coin_only_wallet_address_') }} </li>
                                    <li>{{ $t('msg_2_deposit_application_cancel_allow') }} </li>
                                    <li>{{ $t('msg_3_trade_id_apply_deposit_completion') }} </li>
                                    <li>{{ $t('msg_4_apply_account_time_required') }} </li>
                                    <li>{{ $t('msg_5_transmission_errors_not_restore') }} </li>
                                    <li>{{ $t('msg_6_deposit_process_stop') }} </li>
                                    <li>{{ $t('msg_7_deposit_confirm_process') }} </li>
                                    <li>{{ $t('msg_8_deposit_available_time') }} </li>
                                </ul>
                                <ul v-if="s_account_info" class="io_btn">
                                    <template v-if="c_pending_deposit">
                                        <li><button type="button" @click.prevent="cancelDeposit" class="reset"><i class="fa fa-ban" aria-hidden="true"></i>{{ $t('deposit_application_cancel') }}</button></li>
                                        <!--<li v-if="!c_pending_deposit.txid || !c_pending_deposit.txid.length"><button type="button" @click.prevent="setTxid" class="deposit"><i class="fa fa-check" aria-hidden="true"></i>{{ $t('trade_id_assign') }}</button></li>-->
                                        <li><button type="button" @click.prevent="reApplyDeposit" class="deposit"><i class="fa fa-check" aria-hidden="true"></i>{{ $t('deposit_reapply') }}</button></li>
                                    </template>
                                    <template v-else>
                                        <li><button class="reset" @click.prevent="deposit_params = { request_amount: 0 }"><i class="fa fa-refresh" aria-hidden="true"></i>{{ $t('reset') }} </button></li>
                                        <li v-if="s_account_info.account_type === 'REAL'"><button type="button" @click.prevent="requestRealDeposit" class="deposit">{{ $t('deposit_application') }}</button></li>
                                        <li v-else><button type="button" @click.prevent="requestDemoDeposit" class="deposit">{{ $t('deposit_application') }}</button></li>
                                    </template>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import _ from 'lodash'
import php from 'phpjs'
import func from '@/classes/func.inc'
import * as depositApi from '@/api/deposit';
import * as withdrawApi from '@/api/withdraw';
import VueNumeric from 'vue-numeric'
import filter from 'lodash/filter'

export default {
    name: 'balances',
    components: { VueNumeric },
    computed: {
        ...mapState({
            asset_settings: state => state.asset.settings,
            trade_list: state => state.trade.unclosed_trades,
            premiums: state => state.asset.premiums,
            trade_method: ({ common }) => common.trade_method,
            otps: ({ auth }) => auth.otps,
        }),
        ...mapGetters(['s_account_info', 'constants', 'is_logged', 'logged_info', 'accounts']),
        c_trade_type_account() {
            return filter(this.accounts, {trade_type: this.trade_method})
        },
        c_union_list() {
            var constants = this.constants;
            var deposits = _.map(this.deposit_list, val => _.chain(val).pick('regdate', 'request_amount', 'status').extend({ class: 'plus', type: this.$t('deposit'), status: this.fromPairs(constants.deposit.statuses)[val.status] }).value());
            var withdraws = _.map(this.withdraw_list, val => _.chain(val).pick('regdate', 'request_amount', 'status').extend({ class: 'minus', type: this.$t('withdrawal'), status: this.fromPairs(constants.withdraw.statuses)[val.status] }).value());
            var union = [];

            switch(this.io_type) {
                case 'deposit':
                    union = union.concat(deposits);
                    break;
                case 'withdraw':
                    union = union.concat(withdraws);
                    break;
                case 'union':
                    union = union.concat(deposits, withdraws);
                    break;
            }

            return _.sortBy(union, ['regdate']).reverse();
        },

        // 대기중인 입금신청
        c_pending_deposit() {
            if(!this.s_account_info) return;

            return _.find(this.deposit_list, val => val.account_srl === this.s_account_info.account_srl && val.status === 'PENDING');
        },

        // 대기 중인 출금신청
        c_pending_withdraw() {
            if(!this.s_account_info) return;

            return _.find(this.withdraw_list, val => val.account_srl === this.s_account_info.account_srl && val.status === 'PENDING');
        },

        c_trade_list() {
            var trade_list = [];
            var vm = this;
            var target_datas = [].concat(vm.trade_list);

            _.each(target_datas, (val, key) => {
                var trade = {};
                var asset_setting = vm.asset_settings[val.asset];
                var current_tick = vm.premiumToTick(asset_setting, vm.premiums[val.asset]);
                var tick_unit_count_diff = 0;
                var trade_type = val.balance_srl || val.future_srl ? 'FUTURES' : 'MARGIN';

                switch(trade_type) {
                    case 'MARGIN':
                        trade = _.extend({}, val);
                        tick_unit_count_diff = vm.diffTickUnitCount(asset_setting.tick_unit, current_tick, trade.tick);
                        var trade_margin = trade.trade_margin;

                        if(trade.position == 'PUT') tick_unit_count_diff *= -1;
                        if(trade.status == 'PENDING') tick_unit_count_diff = 0;

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

                        if(val.trade_srl && val.status != 'PENDING') return;

                        if(trade.position == 'PUT') tick_unit_count_diff *= -1;
                        if(trade.status == 'PENDING') tick_unit_count_diff = 0;

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

        c_coin_list() {
            if(!this.s_account_info) return [];

            var list = [];
            var total = this.s_account_info.margin + this.s_account_info.holding_balance;
            var trade_list = _.filter(this.c_trade_list, { account_srl: this.s_account_info.account_srl });

            list = _.chain(this.trade_list).map('asset').uniq().map(asset => {
                var asset_trades = _.filter(trade_list, { asset });

                return {
                    asset,
                    asset_code: this.fromPairs(this.constants.asset.asset_codes)[asset],
                    asset_title: this.fromPairs(this.constants.asset.assets)[asset],
                    amount: _.sumBy(asset_trades, 'amount'),
                    hold_percentage: _.sumBy(asset_trades, 'trade_margin') / total * 100,
                    evaluated_estate: _.sumBy(asset_trades, 'evaluated_estate')
                }
            }).value();

            list.unshift({
                asset: 'CCEKRW',
                asset_code: 'CCE/CCE',
                asset_title: this.$t('white'),
                amount: this.s_account_info.margin,
                hold_percentage: this.s_account_info.margin / total * 100,
                evaluated_estate: this.s_account_info.margin,
            })

            return list.filter((asset_info) => {
                if(!this.search_keyword.length) return true;

                if(!~asset_info.asset_title.indexOf(this.search_keyword) && !~asset_info.asset_code.indexOf(this.search_keyword.toUpperCase())) {
                    return false;
                }

                return true;
            });
        }
    },
    data() {
        return {
            php,
            tabs: [['deposit', this.$t('symbol_defalt_charge')], ['withdrawal', this.$t('withdrawal_application')], ['io_list', this.$t('io_history')]],
            selected_tab: 'deposit',
            io_type: 'deposit',
            deposit_list: [],
            withdraw_list: [],
            withdraw_params: {
                request_amount: 0,
                bank_account: '',
                otp_token: '',
            },
            deposit_params: {
                request_amount: 0,
                txid: '',
            },
            loading: false,
            request_loading: false,
            panel_loading: false,
            search_keyword: '',
            otp_token_required: false,
            func,
            select_account_srl: null,
        }
    },
    watch: {
        s_account_info(to) {
            if(!to) {
                this.deposit_list = [];
                this.withdraw_list = [];
            }

            this.autoLoad();
            this.select_account_srl = this.s_account_info.account_srl
        },
        selected_tab(to) {
            // if(to != 'io_list') return;

            this.autoLoad();
        },
        io_type(to) {
            this.autoLoad();
        },
        select_account_srl() {
            this.selectAccount(this.select_account_srl)
        }
    },
    mounted() {
        if(this.s_account_info) {
            this.loadDepositList();
            this.select_account_srl = this.s_account_info.account_srl
        }
    },
    methods: {

        premiumToTick(asset_setting, premium) {

            return ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit;
        },

        // 호가단위 갯수의 차를 구함
        diffTickUnitCount(tick_unit, tick1, tick2) {

            return tick1 / tick_unit - tick2 / tick_unit;
        },
        selectAccount(account_srl) {
            this.$store.dispatch('selectAccount', account_srl);
        },
        autoLoad() {
            if(!this.s_account_info) return;

            if(this.selected_tab == 'io_list') {
                switch(this.io_type) {
                    case 'deposit':
                        return this.loadDepositList();
                    case 'withdraw':
                        return this.loadWithdrawList();
                    case 'union':
                        this.loading = true;
                        return Promise.all([this.loadWithdrawList(), this.loadDepositList()]).then(() => {
                            this.loading = false;
                        }).catch(() => {
                            this.loading = false;
                        });
                };
            } else {
                switch(this.selected_tab) {
                    case 'deposit':
                        return this.loadDepositList();
                    case 'withdrawal':
                        return this.loadWithdrawList();
                };
            }
        },

        loadDepositList() {
            if(this.io_type != 'union') this.loading = true;

            this.deposit_list = [];
            return depositApi.fetchList({ account_srl: this.s_account_info.account_srl }).then(({ data }) => {
                this.deposit_list = data;
                if(this.io_type != 'union') this.loading = false;
            })
        },

        loadWithdrawList() {
            this.loading = true;

            this.withdraw_list = [];
            return withdrawApi.fetchList({ account_srl: this.s_account_info.account_srl }).then(({ data }) => {
                this.withdraw_list = data;
                if(this.io_type != 'union') this.loading = false;
            })
        },

        refreshAccounts() {
            this.panel_loading = true;
            this.$store.dispatch('getAccounts').then(() => {
                this.panel_loading = false;
            }).catch(() => {
                this.panel_loading = false;
            })
        },

        requestWithdraw() {
            if(!this.is_logged || !this.s_account_info) return;

            const errorHandler = () => {
                this.request_loading = false;
                this.otp_token_required = false;
                this.withdraw_params.otp_token = '';
            }

            (async() => {
                this.request_loading = true;
                if(!this.otp_token_required) {
                    await this.$dialog.confirm(this.$t('msg_read_withdraw_care_points'), {
                        type: 'hard',
                        verification: this.$t('answer_read_withdraw_care_points'),
                        okText: this.$t('continuation'),
                        cancelText: this.$t('cancel'),
                        verificationHelp: this.$t('continue_entry'),
                    })
                }

                if (this.otps.length && !this.otp_token_required) {
                    this.otp_token_required = true;
                    this.request_loading = false;
                    return;
                }

                const { message } = await withdrawApi.createWithdraw(_.extend({}, this.withdraw_params, {
                    holder_name: this.logged_info.user_name,
                    account_srl: this.s_account_info.account_srl,
                }))

                this.$toasted.info(message);
                this.otp_token_required = false;
                this.request_loading = false;
                this.resetWithdrawParams();

                await this.loadWithdrawList()
            })()
            .catch(errorHandler);
        },

        requestRealDeposit() {
            if(!this.is_logged || !this.s_account_info) return;

            this.request_loading = true;
            this.$dialog.confirm(this.$t('msg_read_deposit_care_points'), {
                type: 'hard',
                verification: this.$t('answer_read_withdraw_care_points'),
                okText: this.$t('continuation'),
                cancelText: this.$t('cancel'),
                verificationHelp: this.$t('continue_entry'),
            })
            .then(() => this.createRealDeposit())
            .catch(() => {
                this.request_loading = false;
            })
        },

        requestDemoDeposit() {
            if(!this.is_logged || !this.s_account_info) return;

            this.request_loading = true;
            this.$dialog.confirm(this.$t('msg_read_deposit_care_points'), {
                type: 'hard',
                verification: this.$t('answer_read_withdraw_care_points'),
                okText: this.$t('continuation'),
                cancelText: this.$t('cancel'),
                verificationHelp: this.$t('continue_entry'),
            })
            .then(() => depositApi.createDeposit(_.extend({}, this.deposit_params, {
                depositor_name: this.logged_info.user_name,
                account_srl: this.s_account_info.account_srl,
            })))
            .then(({ message }) => {
                this.$toasted.info(message);
                this.deposit_params = {
                    request_amount: 0,
                    txid: '',
                }

                return this.loadDepositList()
            }).then(() => {
                this.request_loading = false;
            })
            .catch(() => {
                this.request_loading = false;
            })
        },

        createRealDeposit() {
            depositApi.createDepositPgCocofx(_.extend({}, this.deposit_params, {
                depositor_name: this.logged_info.user_name,
                account_srl: this.s_account_info.account_srl,
            })).then(({ token, api_endpoint, merchant_id, deposit_srl }) => {
                const return_url = `${window.location.origin}/pg/cocofx/callback?${php.http_build_query({
                    deposit_srl,
                    to_name: this.$route.name,
                    trade: this.trade_method,
                })}`;

                window.location.href = `${api_endpoint}/payment?${php.http_build_query({ return_url, merchant_id, token })}`;
            })
        },

        cancelDeposit(amount) {
            if(!this.c_pending_deposit) return;

            this.request_loading = true;
            depositApi.cancelDeposit(this.c_pending_deposit.deposit_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.deposit_params = {
                    request_amount: amount || 0,
                    txid: '',
                }

                return this.loadDepositList()
            }).then(() => {
                this.request_loading = false;
            })
            .catch(() => {
                this.request_loading = false;
            })
        },

        reApplyDeposit() {
            this.request_loading = true
            const pending_amount = this.c_pending_deposit.request_amount
            depositApi.cancelDeposit(this.c_pending_deposit.deposit_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.deposit_params = {
                    request_amount: pending_amount || 0,
                    txid: '',
                }

                return this.loadDepositList()
            })
            .then(() => this.createRealDeposit())
            .catch(() => {
                this.request_loading = false;
            })
        },

        cancelWithdraw() {
            if(!this.c_pending_withdraw) return;

            this.request_loading = true;
            withdrawApi.cancelWithdraw(this.c_pending_withdraw.withdraw_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.resetWithdrawParams();

                return this.loadWithdrawList()
            }).then(() => {
                this.request_loading = false;
            })
            .catch(() => {
                this.request_loading = false;
            })
        },

        resetWithdrawParams() {
            this.withdraw_params = {
                request_amount: 0,
                bank_account: '',
                otp_token: '',
            };
        },

        handleOtpKeyup(event) {
            if(event.target.value.length !== 6) {
                return;
            }

            event.target.blur();
            this.requestWithdraw();
        },

        setTxid() {
            if(!this.c_pending_deposit) return;

            this.request_loading = true;
            depositApi.setTxid(this.c_pending_deposit.deposit_srl, this.deposit_params.txid).then(({ message }) => {
                this.$toasted.info(message);
                this.deposit_params = {
                    txid: '',
                }

                return this.loadDepositList()
            }).then(() => {
                this.request_loading = false;
            })
            .catch(() => {
                this.request_loading = false;
            })
        },
    }
}
</script>
