<template>
    <div style="height: 100%; overflow-y: auto;">
        <div class="sc_container bottom">
            <div class="container">
                <div class="table_sec left">
                    <table>
                        <colgroup><col width="50%"><col width="50%"></colgroup>
                        <tbody>
                            <tr v-for="tick in c_orderbooks.PUT" data-status="down" :class="[{ selected: current_tick == tick.premium }]">
                                <td class="rate">
                                    <i class="bar" :style="{ width: tick.ratio + '%' }"></i>
                                    <span>{{ tick.amount }}</span>
                                </td>
                                <td class="price" data-price="down"><strong>{{ php.number_format(tick.premium) }}</strong><span>{{ tick.ratio_today_first > 0 ? '+' : '' }}{{ php.number_format(tick.ratio_today_first, 2) }}%</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="info_sec">
                    <div class="box">
                        <p>
                            <b>거래량</b>
                            <span>{{ php.number_format(statistics['today_volume']) }}</span>
                        </p>
                        <p>
                            <b>거래금</b>
                            <span>98,282 백만원</span>
                        </p>
                        <p class="disc">
                            <span>(최근24시간)</span>
                        </p>
                    </div>
                    <div class="box">
                        <p>
                            <b>52주최고</b>
                            <span class="up">{{ php.number_format(statistics['52week_high']) }}</span>
                        </p>
                        <!-- <p class="disc">
                            <span>(2018.01.06)</span>
                        </p> -->
                        <p>
                            <b>52주최저</b>
                            <span class="down">{{ php.number_format(statistics['52week_low']) }}</span>
                        </p>
                        <!-- <p class="disc">
                            <span>(2017.09.25)</span>
                        </p> -->
                    </div>
                    <div class="box">
                        <p>
                            <b>전일시가</b>
                            <span>{{ php.number_format(statistics['yesterday_first']) }}</span>
                        </p>
                        <p>
                            <b>당일고가</b>
                            <span class="up">{{ php.number_format(statistics['today_high']) }}</span>
                        </p>
                        <p class="disc">
                            <span class="up">+0.09%</span>
                        </p>
                        <p>
                            <b>당일저가</b>
                            <span class="down">{{ php.number_format(statistics['today_low']) }}</span>
                        </p>
                        <p class="disc">
                            <span class="down">-2.46%</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="info_sec">

                    <div class="box">
                        <p>
                            <b>체결강도</b>
                            <span>+88.94%</span>
                        </p>
                    </div>
                    <div class="box table">
                        <p class="header">
                            <b>체결가</b>
                            <span>체결량</span>
                        </p>
                        <p v-for="val in c_linkbooks">
                            <b :class="[val.position == 'CALL' ? 'up' : 'down']">{{ php.number_format(val.premium) }}</b>
                            <span :class="[val.position == 'CALL' ? 'up' : 'down']">{{ php.number_format(val.amount, 5) }}</span>
                        </p>
                    </div>
                </div>
                <div class="table_sec right">
                    <table>
                        <colgroup><col width="50%"><col width="50%"></colgroup>
                        <tbody>
                            <tr v-for="tick in c_orderbooks.CALL" data-status="up" :class="[{ selected: current_tick == tick.premium }]">
                                <td class="price" data-price="up"><strong>{{ php.number_format(tick.premium) }}</strong><span>{{ tick.ratio_today_first > 0 ? '+' : '' }}{{ php.number_format(tick.ratio_today_first, 2) }}%</span></td>
                                <td class="rate">
                                    <i class="bar" :style="{ width: tick.ratio + '%' }"></i>
                                    <span>{{ tick.amount }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="sc_total">
            <table>
                <colgroup><col width="33.3333%"><col width="33.3333%"><col width="33.3333%"></colgroup>
                <tbody>
                    <tr>
                        <td>14.077</td>
                        <td>주문합계<span>(BTC)</span></td>
                        <td>9.126</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import async from 'async'
import _ from 'lodash'
import php from 'phpjs'

export default {
    data () {
        return {
            is_loaded: false,
            orderbooks: {
                call: [],
                put: [],
            },
            linkbooks: [],
            php,
            past_tick: null,
            listen_events: ['orderbooks', 'tradeamount'],
        };
    },
    created() {
        this.init();
    },
    beforeDestroy() {
        this.dettachListener();
    },
    methods: {

        init() {
            var vm = this;
            async.auto({
                orderbooks: (callback) => vm.loadOrderbooks(callback, vm.selected_asset),
                linkbooks: (callback) => vm.loadLinkbooks(callback),
            }, function(error, result) {
                if(error) return console.log(error);

                vm.is_loaded = true;

                vm.attachListener();
            })
        },

        premiumToTick(asset_setting, premium) {

            return ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit;
        },

        loadLinkbooks(callback) {

            var vm = this;
            vm.$request(function(error, { linkbooks }) {
                if(error) return error;

                vm.linkbooks = linkbooks;

                (callback || function() {})(error);
            }, 'get', `/api/asset/${vm.selected_asset}/linkbook`, { future_srl: 0 });
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

        loadAssetStatistics(callback, asset) {

            var vm = this;
            vm.$request(function(error, ret_obj) {
                if(error) return error;

                vm.statistics = _.omit(ret_obj, 'error', 'message');

                (callback || function() {})(error);
            }, 'get', `/api/asset/${asset || vm.selected_asset}/statistic`);
        },

        handleEvent({ type, data }) {
            var vm = this;
            data = JSON.parse(data);

            switch(type) {
                case 'orderbooks':
                    if(data.asset != this.selected_asset) {
                        return;
                    }
                    this.orderbooks.call = data.orderbooks.CALL;
                    this.orderbooks.put = data.orderbooks.PUT;

                    break;
                case 'tradeamount':
                    if(data.asset != vm.selected_asset) return;

                    vm.linkbooks.unshift(data);

                    if(vm.linkbooks.length > 30) {
                        vm.linkbooks.pop();
                    }

                    break;
            }
        },

        attachListener() {
            this.listen_events.forEach((event_name) => this.es.addEventListener(event_name, this.handleEvent))
        },

        dettachListener() {
            this.listen_events.forEach((event_name) => this.es.removeEventListener(event_name, this.handleEvent))
        }
    },
    computed: {
        ...mapState({
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
            constants: state => state.common.constants,
            es: state => state.common.eventsource,
        }),
        premium() {

            return this.premiums[this.selected_asset];
        },
        selected_asset() {

            return this.$route.params.asset;
        },
        current_tick() {

            return this.premiumToTick(this.asset_setting, this.premium);
        },
        asset_setting() {

            return this.asset_settings[this.selected_asset];
        },
        statistics() {
            return this.assets_statistics[this.selected_asset];
        },
        ticks() {
            var premium = this.premium;
            if(!premium) return [];

            var asset_setting = this.asset_setting;
            var ticked_premium = this.current_tick;

            var ticks = [];

            // 매도 호가
            for(var i = (this.current_tick > this.past_tick ? 9 : 8); i > 0; i--) {
                ticks.push({ premium: ticked_premium + i * asset_setting.tick_unit, type: 'PUT' });
            }

            // 현재 호가
            ticks.push({ premium: ticked_premium, type: this.current_tick > this.past_tick ? 'CALL' : 'PUT' });

            // 매수 호가
            for(i = 1; i <= (this.current_tick > this.past_tick ? 8 : 9); i++) {
                ticks.push({ premium: ticked_premium - i * asset_setting.tick_unit, type: 'CALL' });
            }

            return ticks;
        },

        c_linkbooks() {

            return this.linkbooks.slice(0, 15);
        },

        _() {
            return _;
        },

        orderbook_high() {

            return {
                CALL: _.chain(this.orderbooks.call).fromPairs().values().max().value(),
                PUT: _.chain(this.orderbooks.put).fromPairs().values().max().value(),
            }
        },

        c_orderbooks() {
            var orderbooks = {
                CALL: _.fromPairs(this.orderbooks.call),
                PUT: _.fromPairs(this.orderbooks.put),
            }

            var c_orderbooks = { CALL: [], PUT: [] }

            this.ticks.forEach((val) => {
                c_orderbooks[val.type].push({
                    premium: val.premium,
                    type: val.type,
                    ratio: (orderbooks[val.type][val.premium] || 0) / this.orderbook_high[val.type] * 100,
                    amount: orderbooks[val.type][val.premium] || 0,
                    ratio_today_first: val.premium / this.statistics['today_first'] * 100 - 100,
                })
            })

            return c_orderbooks;
        }
    },
    watch: {
        current_tick(to, from) {
            this.past_tick = from;
        },
    }
}
</script>
