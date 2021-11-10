<template>
    <div :class="[layout_class, `page-${$route.name}`]">
        <TopNotice v-if="view_mode != 'main'"></TopNotice>
        <LayoutHeader :show_accounts="view_mode != 'main'"></LayoutHeader>
        <router-view v-if="view_mode == 'main'" :class="router_class"></router-view>
        <section class="sub_layout" v-else-if="view_mode === 'sub'">
            <router-view class="wrapper"></router-view>
        </section>
        <router-view class="join" v-else-if="view_mode === 'join'"></router-view>
        <section class="gird_sc" v-else>
            <div class="wrapper">
                <div class="coin_list"  v-if="$route.name === 'traderoom'">
                    <CoinList></CoinList>
                </div>
                <router-view :class="router_class"></router-view>

            </div>
        </section>
        <LayoutFooter></LayoutFooter>
    </div>
</template>

<script>
import 'assets/css/simple-line-icons/simple-line-icons.css';
import 'assets/css/font-awesome/css/font-awesome.css';
import 'assets/css/xeicon/xeicon.css';
import 'assets/css/fonts/NotoSans/stylesheets/NotoSansKR-Hestia.css';
import 'assets/css/style_global.css';
import 'assets/css/style_common.css';
import 'assets/css/style_pc.css';
import 'assets/css/style_pc_dark.scss';

import TopNotice from './TopNotice.vue';
import LayoutHeader from './Header.vue';
import LayoutFooter from './Footer.vue';
import CoinList from './CoinList.vue';
import async from 'async'
import { mapState, mapGetters } from 'vuex'
import php from 'phpjs'
import _ from 'lodash'

export default {
    name: 'Layout',
    components: { TopNotice, LayoutHeader, LayoutFooter, CoinList },
    props: ['view_mode', 'show_nav'],
    data () {
        return {
            es: null,
            show: false,
            is_aside_opened: false,
            is_inited: false,
            last_emit_data: {},
            notice: null,
            show_notice: true,
            accounts: [],
            futures: [],
            future_balances: [],
            trade_list: [],
        }
    },
    computed: {
        layout_class() {
            switch(this.view_mode) {
                case 'main':
                    return 'main';
                case 'trade':
                    return 'trade';
                default:
                    return 'exchange';
            }
        },

        router_class() {
            switch(this.view_mode) {
                default:
                    return null;
            }
        },
        ...mapState({
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
            constants: state => state.common.constants,
            logged_info: state => state.auth.logged_info,
        }),
        ...mapGetters([
            'is_logged',
        ]),
        is_in_traderoom() {
            return ~this.$route.path.split('/').indexOf('traderoom');
        },
        is_in_invest() {
            return ~this.$route.path.split('/').indexOf('invest');
        },
        is_in_fund() {
            return ~this.$route.path.split('/').indexOf('fund');
        },
        is_in_notice() {
            return ~this.$route.path.split('/').indexOf('notice');
        },
        show_footer() {
            if(this.is_in_fund && this.$route.params.account_srl) return false;

            return !this.is_in_traderoom && !this.is_in_invest;
        },
        c_selected_asset_info() {
            if(!this.$route.params.asset) return {};

            var asset = this.$route.params.asset;
            var statistics = this.assets_statistics[asset];
            var premium = this.premiums[asset];

            var info = {
                yesterday_vs: premium - statistics.yesterday_first,
                percentage: (premium / statistics.yesterday_first * 100 - 100).toFixed(2) * 1,
                premium
            }

            info.percentage = info.percentage === Infinity ? 0 : info.percentage;
            info.updown = info.yesterday_vs < 0 ? 'down' : 'up';

            return info;
        },
        php() {
            return php;
        },
        estate_info() {
            var vm = this;

            var data = {
                margin: _.chain(vm.c_accounts).filter({ account_type: 'REAL' }).map('margin').sum().value(),
                holding_balance: _.chain(vm.c_accounts).filter({ account_type: 'REAL' }).map('holding_balance').sum().value(),
                evaluated_gain_loss: _.chain(vm.c_accounts).filter({ account_type: 'REAL' }).map('evaluated_gain_loss').sum().value(),
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
                var account_trades = _.filter(vm.c_trade_list, { account_srl: account.account_srl });

                var trade_margin = _.chain(account_trades).map('trade_margin').sum().value(); // 주문 시 사용된 증거금의 합계 (수수료 제외)

                account.evaluated_gain_loss = _.chain(account_trades).filter({ status: 'LINKED' }).map('evaluated_gain_loss').sum().value(); // 주문의 손익금 합계
                account.evaluated_estate = account.margin + account.evaluated_gain_loss + trade_margin; // 평가 자산
                account.evaluated_precentage = (trade_margin + account.evaluated_gain_loss) / trade_margin * 100 - 100; // 손익률
                account.losscut = (account.margin + trade_margin) * 0.2; // 로스컷

                accounts.push(account);
            })

            return accounts;
        },
        c_trade_list() {
            var trade_list = [];
            var vm = this;
            var target_datas = [].concat(vm.future_balances, vm.trade_list);

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
    },
    created() {
        // var vm = this;
        // vm.init();
    },
    methods: {
        logout() {

            async.auto({
                logout: (callback) => this.$request(callback, 'delete', '/api/session', false, false),
                logged_info: (callback) => {
                    this.$request((error, data) => {
                        if(error) return callback(error);

                        callback(null, data.logged_info);
                    }, 'get', '/api/session', false, false)
                },
            }, (error, { logged_info }) => {
                if(error) return this.$toasted.error(error.message);

                this.$store.dispatch('login', logged_info);
            })
        },
        init() {
            var vm = this;
            async.auto({
                asset_settings(callback) {
                    vm.$request((error, { setting }) => callback(error, setting), 'get', '/api/setting/asset');
                },
                last_premiums: ['asset_settings', ({ asset_settings }, callback) => {
                    async.map(Object.keys(asset_settings), (asset, callback) => {

                        vm.$request((error, { premium_info }) => callback(error, [premium_info.asset, premium_info.value]), 'get', `/api/asset/${asset}/last`);
                    }, (error, result) => {
                        if(error) return callback(error);

                        return callback(null, vm.fromPairs(result));
                    })
                }],
                assets_statistics: ['asset_settings', ({ asset_settings }, callback) => {
                    async.map(Object.keys(asset_settings), (asset, callback) => {

                        vm.$request((error, result) => callback(error, [asset, result]), 'get', `/api/asset/${asset}/statistic`);
                    }, (error, result) => {
                        if(error) return callback(error);

                        return callback(null, vm.fromPairs(result));
                    })
                }],
                unclosed_trades: (callback) => {
                    if(!vm.is_logged) return callback(null, []);

                    vm.$request((error, { data }) => callback(error, data), 'get', '/api/trade', { status: ['PENDING', 'LINKED'].join(','), no_paging: 1 })
                },
                future_balances: (callback) => {
                    if(!vm.is_logged) return callback(null, []);

                    vm.$request((error, { data }) => callback(error, data), 'get', '/api/future/balance', { no_paging: 1 })
                },
                notice: (callback) => this.loadNotice(callback),
                accounts: (callback) => vm.loadAccounts(callback),
                trade_list: (callback) => vm.loadTradeList(callback),
            }, function(error, result) {
                if(error) return console.log(error);

                vm.$store.dispatch('setAssetSettings', result.asset_settings);
                vm.$store.dispatch('setAssetPremiums', result.last_premiums);
                vm.$store.dispatch('setUnclosedTrades', result.unclosed_trades);
                vm.$store.dispatch('setFutureBalances', result.future_balances);
                vm.$store.dispatch('setAssetsStatistics', result.assets_statistics);

                vm.connect();

                vm.is_inited = true;
            })
        },

        premiumToTick(asset_setting, premium) {

            return ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit;
        },

        // 호가단위 갯수의 차를 구함
        diffTickUnitCount(tick_unit, tick1, tick2) {

            return tick1 / tick_unit - tick2 / tick_unit;
        },

        loadNotice(callback) {
            this.$request((error, result) => {
                if(error) return callback(error);

                if(!result.notice_list.length) return callback(null);

                this.notice = result.notice_list.shift();

                callback(error);
            }, 'post', 'https://app.cocofx.com/notice', 'act=dispBoardNoticeList&module=board&mid=notice')
        },

        loadAccounts(callback) {
            if(!this.is_logged) return callback(null);

            var vm = this;
            vm.$request((error, { accounts }) => {
                vm.accounts = accounts;
                vm.selected_account_srl = vm.selected_account_srl || accounts[0].account_srl;

                (callback || function() {})(error);
            }, 'get', '/api/account');
        },

        loadTradeList(callback) {
            if(!this.is_logged) return callback(null);

            var vm = this;
            vm.$request(function(error, { data }) {
                if(error) return error;

                vm.trade_list = data;

                (callback || function() {})()
            }, 'get', '/api/trade', { list_count: 100 });
        },
        loadFutureBalances(callback) {
            if(!this.is_logged) return callback(null);

            var vm = this;
            vm.$request(function(error, { data }) {
                if(error) return error;

                vm.future_balances = data;

                (callback || function() {})(error);
            }, 'get', '/api/future/balance');
        },

        connect() {
            var vm = this;
            var es = new EventSource('/api/stream');

            this.es = es;

            vm.$store.dispatch('setEventSource', es);

            es.addEventListener('depositRequest', function({ data }) {

                vm.$toasted.success(this.$t('msg_deposit_request'));
                vm.$refs.notify.play();
            })

            es.addEventListener('withdrawRequest', function({ data }) {

                vm.$toasted.success(this.$t('msg_withdrawal_request'));
                vm.$refs.notify.play();
            })

            es.addEventListener('marketUpdate', function({ data }) {
                var premium = JSON.parse(data);

                vm.$store.dispatch('updateAssetPremium', { asset: premium.symbol, value: premium.last_price });
            })

            es.addEventListener('notifyTradeRequest', function({ data }) {
                data = JSON.parse(data);

                async.map(data.trade_srls, (trade_srl, callback) => {
                    vm.$request((error, { trade_info }) => callback(error, trade_info), 'get', `/api/trade/${trade_srl}`, {}, true)
                }, (error, trades) => {
                    if(error) return error;

                    vm.$store.dispatch('addTrades', trades);
                })
            })

            es.addEventListener('notifyTradeLink', function({ data }) {
                data = JSON.parse(data);
                var member_srl = data.member_srl;

                vm.$request((error, { data }) => {
                    if(error) return error;

                    vm.$store.dispatch('setMemberFutureBalances', { member_srl, future_balances: data })
                }, 'get', '/api/future/balance', { no_paging: 1, member_srl }, true);

                vm.$store.dispatch('setLinkedTrades', data.trade_srls);
            })

            es.addEventListener('notifyTradeCancel', function({ data }) {
                data = JSON.parse(data);

                vm.$store.dispatch('closeTrades', data.trade_srls);
            })

            es.addEventListener('notifyTradeClear', function({ data }) {
                data = JSON.parse(data);

                vm.$store.dispatch('closeTrades', data.trade_srls);
            })

            es.addEventListener('tradeRequest', function({ data }) {
                data = JSON.parse(data);
                vm.$toasted.success(this.$t('order_request', [data.trade_srls.join(', ')]))
            })

            es.addEventListener('tradeClear', function({ data }) {
                data = JSON.parse(data);
                vm.$toasted.success(this.$t('liquidation_notification', [data.trade_srls.join(', ')]))
            })

            es.addEventListener('tradeLink', function({ data }) {
                data = JSON.parse(data);
                vm.$toasted.success(this.$t('contract_notification', [data.trade_srls.join(', ')]))
            })

            es.addEventListener('tradeCancel', function({ data }) {
                data = JSON.parse(data);
                vm.$toasted.success(this.$t('cancel_notification', [data.trade_srls.join(', ')]))
            })

            es.addEventListener('withdrawApprove', function({ data }) {
                data = JSON.parse(data);
                vm.$toasted.success(this.$t('withdrawal_approval', [data.withdraw_srls.join(', ')]))
            })

            es.addEventListener('depositApprove', function({ data }) {
                data = JSON.parse(data);
                vm.$toasted.success(this.$t('deposit_approval', [data.deposit_srls.join(', ')]))
            })
        }
    },
    beforeDestroy() {
        if(this.es) this.es.close();
    },
    beforeRouteUpdate (to, from, next) {
        this.show = false;

        next();
    }
}
</script>
