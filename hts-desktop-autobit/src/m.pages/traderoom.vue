<template>
    <div :class="['nosc_container', { order_info_only: selected_tab === 'HISTORY' }]" v-loading="s_trade_loading">
        <div class="price_info" ref="price_info">
            <table>
                <colgroup><col width="65%"><col width="35%"></colgroup>
                <tbody>
                    <tr v-for="tick in ticks" :data-status="tick.type === 'CALL' ? 'up' : 'down'" :class="[{ selected: current_tick === tick.premium }]">
                        <td :data-price="tick.type === 'CALL' ? 'up' : 'down'" @click="setPosition(tick.type, tick.premium)"><strong>{{ php.number_format(tick.premium) }}</strong></td>
                        <td>
                            <i class="bar" :style="{ width: tick.ratio + '%' }"></i>
                            <span>{{ tick.amount }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="order_info">
            <span data-role="select" style="margin-left: 0px;">
                <select v-model="selected_account_srl">
                    <option :value="0" v-if="!selected_account_srl">{{ accounts.length ? $t('trade_target_account_select') : $t('no_establishment_account') }}</option>
                    <option v-for="account in c_selectable_accounts" :value="account.account_srl">{{ account.account_number }} [{{ fromPairs(constants.trade.trade_types)[account.trade_type] }}|{{ fromPairs(constants.account.account_types)[account.account_type] }}]</option>
                </select>
            </span>
            <nav class="tab_i">
                <ul>
                    <li :class="[{ on: tab[0] === selected_tab }]" v-for="tab in tabs"><a :data-tab="tab[0]" @click.prevent="selected_tab = tab[0]">{{ tab[1] }}</a></li>
                </ul>
            </nav>
            <div class="tab_cnts" v-for="tab in tabs" v-if="tab[0] === selected_tab" :data-tab="tab[0]">
                <template v-if="tab[0] != 'HISTORY'">
                    <table>
                        <colgroup><col width="*"><col width="70px"></colgroup>
                        <tbody>
                            <tr>
                                <td>
                                    <span data-role="qty"><input type="text" v-model="target_amount[c_postition]"></span>
                                </td>
                                <td>
                                    <span data-role="select">
                                        <select v-model="trade_ratio" @change.prevent="setTradeRatio(trade_ratio)">
                                            <option :value="0">{{ $t('selection') }}
</option>
                                            <option v-for="val in [10, 25, 50]" :value="val">{{ val }}%</option>
                                            <option :value="100">{{ $t('possibility') }}
</option>
                                        </select>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span data-role="price"><input type="text" v-model="target_tick[c_postition]"></span>
                                </td>
                                <td>
                                    <a @click.prevent="target_tick[c_postition] = target_tick[c_postition] * 1 + asset_setting.tick_unit * 1"><i class="xi xi-plus"></i></a>
                                    <a @click.prevent="target_tick[c_postition] = target_tick[c_postition] * 1 - asset_setting.tick_unit * 1"><i class="xi xi-minus"></i></a>
                                </td>
                            </tr>
                            <tr v-if="trade_method === 'FUTURES'">
                                <td>
                                    <select v-model="selected_future_srl" class="future_list">
                                            <option selected disabled value=null>({{ $t('futures') }})</option>
                                            <option v-for="future in futures" :key="future.future_srl" :label="future.title" :value="future.future_srl">{{ future.title }}</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="trade_method === 'MARGIN'" class="total">
                        <em>{{ $t('order_total_amount') }}</em>
                        <b>{{ php.number_format(target_tick[c_postition] * target_amount[c_postition]) }}</b>{{ $t('symbol_defalt') }}
                    </div>
                    <div v-else class="total">
                        <em>{{ $t('order_total_amount') }}</em>
                        <b>{{  php.number_format((asset_setting.futures_price * target_amount[c_postition]) / (c_account_info.leverage || 1)) }}</b>{{ $t('symbol_defalt') }}
                    </div>
                    <div class="btn">
                        <a @click.prevent="clear">{{ $t('reset') }}
</a>
                        <a @click.prevent="trade" :class="tab[0] === 'BUY' ? 'red' : 'blue'">{{ tab[1] }}</a>
                    </div>
                    <div class="able_info">
                        <h4 v-if="trade_method === 'MARGIN'"><em>{{ $t('order_possibility') }}</em><b>{{ php.number_format(c_account_info.margin - c_account_info.holding_balance) }}</b>{{ $t('symbol_defalt') }}</h4>
                        <h4 v-else><em>{{ $t('order_possibility') }}</em><b>{{ php.number_format(c_account_info.available_amount) }}</b>{{ $t('count') }}</h4>
                        <p><em>{{ $t('min_order_amount') }}</em><b>{{ c_account_info ? php.number_format(asset_setting.min_trade_margin[c_account_info.trade_type]) : '-' }}</b>{{ $t('symbol_defalt') }}</p>
                        <p><em>{{ $t('fee') }}</em><b>{{ c_total_fee_ratio }}</b>%</p>
                    </div>
                </template>
                <template v-else>
                    <nav class="tab_m min">
                        <ul>
                            <li :class="[{ on: tab[0] === selected_history_tab }]" v-for="tab in history_tabs"><a @click.prevent="selected_history_tab = tab[0]">{{ tab[1] }}</a></li>
                        </ul>
                    </nav>
                    <div class="history" data-min="N">
                        <ul>
                            <li class="nodata" v-if="!c_histories.length">{{ c_history_nodata_msg }}</li>
                            <li v-for="(trade_info,idx) in c_histories">
                                <a @click.prevent="if(trade_info.status == 'PENDING') cancelTrade(trade_info.trade_srl) else if(trade_info.status ===  'LINKED' && trade_method === 'FUTURES') clearFutureBalance(trade_info.trade_srl) else if(trade_info.status == 'LINKED') clearTrade(trade_info.trade_srl)  ">
                                    <div class="tit">
                                        <span :class="['profit', trade_info.evaluated_gain_loss > 0 ? 'up' : 'down']">{{ $t('profits') }}: {{ php.number_format(trade_info.evaluated_gain_loss) }}</span>
                                        <span class="value">{{ fromPairs(constants.trade.positions)[trade_info.position] }} | {{ php.number_format(trade_info.tick) }}</span>
                                        <span v-if="c_filter_futures.length">{{ c_filter_futures[idx].title }}</span>
                                    </div>
                                    <div class="num">
                                        <span class="amount">{{ php.number_format(trade_info.amount, asset_setting.amount_decimal_point) }}</span>
                                        <span class="percent">{{ php.number_format(trade_info.evaluated_precentage, 2) }}%</span>
                                    </div>
                                    <div class="arr">
                                        <i :class="['xi', trade_info.action_icon]"></i>
                                    </div>
                                </a>
                                <div v-if="selected_history_tab === 'LINKED' && trade_method === 'MARGIN'">
                                    <template v-if="trade_info.use_auto_clear === 'N'">
                                        <input v-model.number="auto_clear_ticks[trade_info.trade_srl]" type="text">
                                        <button type="button" @click.prevent="setAutoClear(trade_info.trade_srl)">{{ $t('limit_price_check') }}</button>
                                    </template>
                                    <template v-else>
                                        <input :value="trade_info.auto_clear_tick" disabled type="text">
                                        <button type="button" @click.prevent="unsetAutoClear(trade_info.trade_srl)">{{ $t('limit_price_cancel') }}</button>
                                    </template>
                                </div>
                            </li>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .order_info_only .price_info { display: none; }
    .order_info_only .order_info { width: 100% !important; }
    .history li > div { text-align: right; }
    .history li > div input { box-sizing: border-box; height: 30px; padding: 0 15px; border: 1px solid #ddd; text-align: right; }
    .history li > div button { width: 120px; height: 30px; color: #fff; background: #23aab6; font-size: 14px; }
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import php from 'phpjs'
import async from 'async'
import * as tradeApi from '@/api/trade'
export default {
    name: 'traderoom',
    data () {
        return {
            past_tick: null,
            target_tick: { CALL: null, PUT: null },
            target_amount: { CALL: 0, PUT: 0 },
            tabs: [['BUY', this.$t('buy')], ['SELL', this.$t('sell')], ['HISTORY', this.$t('transactional_information')]],
            history_tabs: [['PENDING', this.$t('no_execution')], ['LINKED', this.$t('execution')]],
            selected_history_tab: 'PENDING',
            auto_clear_ticks: {},
            selected_tab: 'BUY',
            selected_account_srl: 0,
            is_loaded: false,
            orderbooks: {
                call: [],
                put: [],
            },
            s_trade_loading: false,
            futures: [],
            selected_future_srl: null,
            trade_ratio: 0,
            listen_events: ['tradeRequest', 'tradeClear', 'tradeLink', 'tradeCancel', 'withdrawApprove', 'depositApprove', 'orderbooks'],
        };
    },
    created() {
        this.past_tick = this.current_tick;
        this.init();
    },
    beforeDestroy() {
        this.dettachListener();
    },
    mounted() {
        this.$nextTick(() => {

            var parent_rect = this.$refs.price_info.getBoundingClientRect();
            var target_y = this.$refs.price_info.querySelector('tr.selected').getBoundingClientRect().y;
            target_y = target_y - parent_rect.y - parent_rect.height / 2 + this.$refs.price_info.querySelector('tr.selected').getBoundingClientRect().height;

            this.$refs.price_info.scrollTo(0, target_y);
        })

    },
    methods: {
        setAutoClear(trade_srl) {
            this.s_trade_loading = true;
            this.$store.dispatch('setAutoClear', {
                trade_srl,
                auto_clear_tick: this.auto_clear_ticks[trade_srl],
            }).then(({ message }) => {
                this.$toasted.info(message);
                this.s_trade_loading = false;
            }).catch(() => {
                this.s_trade_loading = false;
            });
        },

        unsetAutoClear(trade_srl) {
            this.s_trade_loading = true;
            this.$store.dispatch('unsetAutoClear', trade_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.s_trade_loading = false;
            }).catch(() => {
                this.s_trade_loading = false;
            });
        },

        premiumToTick(asset_setting, premium) {

            return ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit;
        },

        setPosition(position, tick) {
            console.log(this.$t('tick_click'), arguments)
            this.target_tick[position] = tick;
            this.selected_tab = position == 'CALL' ? 'BUY' : 'SELL';
        },

        clear() {
            this.target_tick[this.c_postition] = 0;
            this.target_amount[this.c_postition] = 0;
        },

        trade() {
            var vm = this;

            if(!vm.selected_account_srl) return vm.$toasted.error(this.$t('msg_account_select'));

            vm.$request(function(error, result) {
                if(error) return vm.$toasted.error(error.message);

                // vm.$toasted.success(`[주문 요청 알림] 주문번호: ${result.trade_srl}`)

                vm.clear();

            }, 'post', '/api/trade', {
                account_srl: vm.selected_account_srl,
                asset: vm.selected_asset,
                tick: vm.target_tick[vm.c_postition],
                amount: vm.target_amount[vm.c_postition],
                position: vm.c_postition,
                future_srl: vm.selected_future_srl
            }, false, false)
        },

        cancelTrade(trade_srl) {
            var vm = this;

            vm.$request(function(error, result) {
                if(error) return vm.$toasted.error(error.message);

            }, 'put', `/api/trade/${trade_srl}`, {
                type: 'CANCEL',
            }, false, false)
        },

        clearTrade(trade_srl) {
            var vm = this;

            vm.$request(function(error, result) {
                if(error) return vm.$toasted.error(error.message);

            }, 'put', `/api/trade/${trade_srl}`, {
                type: 'CLEAR',
            }, false, false)
        },

        init() {
            var vm = this;
            async.auto({
                futures: (callback) => vm.loadFutures(callback, vm.selected_asset),
                orderbooks: (callback) => vm.loadOrderbooks(callback, vm.selected_asset),
            }, function(error, result) {
                if(error) return console.log(error);
                vm.is_loaded = true;

                vm.attachListener();
            })
        },

        loadAccounts(callback) {
            var vm = this;
            vm.$request((error, { accounts }) => {
                vm.accounts = accounts;
                // vm.account_info = vm.account_info || accounts[0];
                // vm.selected_account_srl = vm.selected_account_srl || accounts[0].account_srl;

                (callback || function() {})(error);
            }, 'get', '/api/account');
        },

        loadOrderbooks(callback, asset) {

            var vm = this;
            vm.$request(function(error, ret_obj) {
                if(error) return error;

                var orderbooks = {};
                orderbooks.put = ret_obj.orderbooks.PUT;
                orderbooks.call = ret_obj.orderbooks.CALL;

                vm.orderbooks = orderbooks;

                (callback || function() {})(error);
            }, 'get', `/api/asset/${asset || vm.selected_asset}/orderbook`);
        },

        loadFutures(callback, asset) {
            if(!this.is_logged) return
            var vm = this;
            vm.$request(function(error, { data }) {
                if(error) return error;

                vm.futures = data;
                vm.selected_future_srl = vm.selected_future_srl;// || data[0].future_srl;

                (callback || function() {})(error);
            }, 'get', '/api/future', { asset: asset || vm.selected_asset });
        },

        loadFutureBalances(callback, asset) {

            var vm = this;
            vm.$request(function(error, { data }) {
                if(error) return error;

                vm.future_balances = data;

                (callback || function() {})(error);
            }, 'get', '/api/future/balance', { asset: asset || vm.selected_asset });
        },

        setTradeRatio(trade_ratio) {

            this.target_amount[this.c_postition] = this.c_account_info.available_amount / 100 * trade_ratio;
            this.target_amount[this.c_postition] = this.toFixedFloor(this.target_amount[this.c_postition], this.asset_setting.amount_decimal_point) * 1;
            this.trade_ratio = 0;
        },

        // 호가단위 갯수의 차를 구함
        diffTickUnitCount(tick_unit, tick1, tick2) {

            return tick1 / tick_unit - tick2 / tick_unit;
        },

        toFixedFloor(num, length) {
            const multiplyer = Math.pow(10, length);

            return Math.floor(num * multiplyer) / multiplyer;
        },

        handleEvent({ type, data }) {
            data = JSON.parse(data);

            switch(type) {
                case 'orderbooks':
                    if(data.asset != this.selected_asset) {
                        return;
                    }
                    this.orderbooks.call = data.orderbooks.CALL;
                    this.orderbooks.put = data.orderbooks.PUT;

                    break;
            }
        },
        clearFutureBalance(balance_srl) {
            var vm = this;
            this.s_trade_loading = true;
            var future_balance_info = _.find(vm.future_balances, { balance_srl });
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
        attachListener() {
            this.listen_events.forEach((event_name) => this.es.addEventListener(event_name, this.handleEvent))
        },

        dettachListener() {
            this.listen_events.forEach((event_name) => this.es.removeEventListener(event_name, this.handleEvent))
        }
    },
    computed: {
        ...mapGetters(['accounts', 'is_logged']),
        ...mapState({
            asset_settings: state => state.asset.settings,
            fee_settings: ({ asset }) => asset.fee_settings,
            trade_list: ({ trade }) => trade.unclosed_trades,
            premiums: state => state.asset.premiums,
            constants: state => state.common.constants,
            es: state => state.common.eventsource,
            trade_method: state => state.common.trade_method,
            future_balances: state => state.future.future_balances

        }),
        _() {
            return _;
        },
        php() {
            return php;
        },
        c_filter_futures() {
            const futures_title = []
            _.forEach(this.c_histories, (data) => {
                let future = _.find(this.futures, (e) => {
                    return e.future_srl === data.future_srl
                })
                if(future) {
                    futures_title.push(future)
                }
            })
            return futures_title
        },
        c_postition() {

            return this.selected_tab === 'BUY' ? 'CALL' : 'PUT';
        },
        c_account_info() {
            var account_info = _.chain(this.accounts).find({
                account_srl: this.selected_account_srl
            }).defaults({ account_srl: 0, margin: 0, holding_balance: 0, account_type: 'DEMO', leverage: 1, trade_type: 'MARGIN' }).value();

            // 수수료를 더하여 가능 수량을 지정
            var tick = this.target_tick[this.c_postition] * 1;
            tick *= 1 + this.c_total_fee_ratio / 100;

            account_info.available_amount = tick ? (account_info.margin - account_info.holding_balance) / (tick / account_info.leverage) : 0;
            account_info.available_amount = this.toFixedFloor(account_info.available_amount, this.asset_setting.amount_decimal_point) * 1;

            return account_info;
        },
        s_asset_fee() {
            if (!this.fee_settings) return null;

            const asset_fee = this.fee_settings.asset_fees[this.selected_asset];
            if (this.selected_asset && asset_fee && asset_fee.use_seperate_fee === 'Y') {
                return asset_fee;
            }

            return _.omit(this.fee_settings, 'asset_fees');
        },
        c_total_fee_ratio() {
            const s_account_info = _.find(this.accounts, { account_srl: this.selected_account_srl });
            const { use_seperate_fee = 'N' } = s_account_info || {};
            const total = _.chain(this.s_asset_fee)
                .pick('handling_fee', 'market_fee')
                .toPairs()
                .map(([key, val]) => {
                    val *= 1;

                    if (use_seperate_fee != 'Y') return val;

                    val *= s_account_info[key] / 100 + 1;

                    return val;
                })
                .sum()
                .value();

            return total;
        },
        orderbook_high() {

            return {
                CALL: _.chain(this.orderbooks.call).fromPairs().values().max().value(),
                PUT: _.chain(this.orderbooks.put).fromPairs().values().max().value(),
            }
        },
        ticks() {
            var premium = this.premium;
            if(!premium) return [];

            var asset_setting = this.asset_setting;
            var ticked_premium = this.current_tick;

            var ticks = [];
            var orderbooks = {
                CALL: _.fromPairs(this.orderbooks.call),
                PUT: _.fromPairs(this.orderbooks.put),
            }

            // 매도 호가
            for(var i = (this.current_tick > this.past_tick ? asset_setting.tick_limit : asset_setting.tick_limit - 1); i > 0; i--) {
                ticks.push({ premium: ticked_premium + i * asset_setting.tick_unit, type: 'PUT' });
            }

            // 현재 호가
            ticks.push({ premium: ticked_premium, type: this.current_tick > this.past_tick ? 'CALL' : 'PUT' });

            // 매수 호가
            for(i = 1; i <= (this.current_tick > this.past_tick ? asset_setting.tick_limit - 1 : asset_setting.tick_limit); i++) {
                ticks.push({ premium: ticked_premium - i * asset_setting.tick_unit, type: 'CALL' });
            }

            ticks = _.map(ticks, (tick) => {
                return {
                    ...tick,
                    ratio: (orderbooks[tick.type][tick.premium] || 0) / this.orderbook_high[tick.type] * 100,
                    amount: orderbooks[tick.type][tick.premium] || 0,
                }
            })

            return ticks;
        },
        premium() {

            return this.premiums[this.selected_asset];
        },
        asset_setting() {

            return this.asset_settings[this.selected_asset];
        },
        selected_asset() {

            return this.$route.params.asset;
        },
        current_tick() {

            return this.premiumToTick(this.asset_setting, this.premium);
        },

        c_trade_list() {
            var trade_list = [];
            var vm = this;

            if(!vm.c_account_info) return [];

            var target_datas = [].concat(vm.c_account_info.trade_type == 'FUTURES' ? vm.future_balances : [], this.trade_list);
            var account_info = vm.c_account_info;

            target_datas = _.filter(target_datas, { account_srl: account_info.account_srl });
            _.each(target_datas, (val, key) => {
                var trade = {};
                var asset_setting = vm.asset_settings[val.asset];
                var current_tick = vm.current_tick;
                var tick_unit_count_diff = 0;

                switch(account_info.trade_type) {
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

                trade.evaluated_gain_loss = asset_setting.tick_unit_profit[account_info.trade_type] * tick_unit_count_diff * trade.amount; // 평가 손익
                trade.tick_unit_count_diff = tick_unit_count_diff;
                trade.holding_gain_loss = trade.evaluated_gain_loss - trade.total_fee;
                trade.evaluated_estate = trade.trade_margin + trade.evaluated_gain_loss; // 평가 금액
                trade.evaluated_precentage = trade.evaluated_estate / trade.trade_margin * 100 - 100; // 손익률

                trade_list.push(trade);
            })

            return trade_list;
        },
        c_accounts() {
            var accounts = [];
            var vm = this;

            _.each(vm.accounts, (val, key) => {
                var account = _.extend({}, val);
                var account_trades = _.filter(vm.c_trade_list, { account_srl: account.account_srl });

                // var trade_margin = _.chain(account_trades).map('trade_margin').sum().value(); // 주문 시 사용된 증거금의 합계 (수수료 제외)

                account.evaluated_gain_loss = _.chain(account_trades).filter({ status: 'LINKED' }).map('evaluated_gain_loss').sum().value(); // 주문의 손익금 합계
                account.evaluated_estate = account.margin + account.evaluated_gain_loss; // 평가 자산
                account.evaluated_precentage = (account.margin + account.evaluated_gain_loss) / account.margin * 100 - 100; // 손익률
                account.losscut = (account.margin) * 0.2; // 로스컷

                accounts.push(account);
            })

            return accounts;
        },
        c_selectable_accounts() {
            return _.filter(this.accounts, { trade_type: this.trade_method, trader_type: 'DIRECT' })
        },
        c_histories() {
            return _.chain(this.c_trade_list).filter({ status: this.selected_history_tab }).map((trade_info) => {
                trade_info.action_icon = trade_info.status === 'PENDING' ? 'xi-close-thin' : 'xi-check-thin';

                return trade_info;
            }).value();
        },
        c_history_nodata_msg() {
            return this.selected_history_tab == 'PENDING' ? this.$t('msg_no_execution_no_history') : this.$t('msg_no_execution_history');
        }
    },
    watch: {
        current_tick(to, from) {
            this.past_tick = from;
        }
    }
}
</script>
