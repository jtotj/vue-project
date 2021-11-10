<template>
	<div class="history" v-loading="!is_loaded">
        <span data-role="select">
            <select v-model="selected_account_srl" @change="loadTradeList()">
                <option :value="0">{{ accounts.length ? $t('view_total_account_details') : $t('no_inquiry_possibility_account') }}</option>
                <option v-for="account in c_selectable_accounts" :value="account.account_srl">{{ account.account_number }} [{{ fromPairs(constants.trade.trade_types)[account.trade_type] }}|{{ fromPairs(constants.account.account_types)[account.account_type] }}]</option>
            </select>
        </span>
        <div class="none_list" v-if="!c_trade_list.length && is_loaded">{{ $t('order_not_exist') }}
</div>
		<div class="trade" v-for="trade_info in c_trade_list" :data-status="trade_info.status">
			<h2>{{ trade_info.trade_srl }} <span>{{ trade_info.account_number }}</span></h2>
			<div class="my_box">
				<div class="left_col">
					<span class="name">{{ $t('entry') }}
</span>
					<strong class="price">{{ php.number_format(trade_info.tick) }}</strong>
				</div>
				<div class="right_col">
					<span class="name">{{ $t('liquidation') }}
</span>
					<strong class="price">{{ trade_info.status == 'CANCELD' ? '-' : php.number_format(trade_info.cleared_tick) }}</strong>
				</div>
                <div class="info-wrap">
                    <div class="info">
                        <dl>
                            <dt>{{ $t('state') }}
    </dt>
                            <dd>{{ fromPairs(constants.trade.statuses)[trade_info.status] }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('item_code') }}</dt>
                            <dd>{{ fromPairs(constants.asset.asset_codes)[trade_info.asset] }}</dd>
                        </dl>
                    </div>
                    <div class="info">
                        <dl>
                            <dt>{{ $t('amount') }}
    </dt>
                            <dd>{{ trade_info.amount }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('mypage.average') }}
    </dt>
                            <dd>{{ fromPairs(constants.account.leverages)[trade_info.leverage] }}</dd>
                        </dl>
                    </div>
                    <div class="info" v-if="trade_info.status != 'CANCELD'">
                        <dl>
                            <dt>{{ $t('net_profit') }}
    </dt>
                            <dd :class="{ 'up': trade_info.gain_profit > 0, 'down': trade_info.gain_profit < 0 }">{{ php.number_format(trade_info.gain_profit) }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('fee') }}
    </dt>
                            <dd>{{ php.number_format(trade_info.total_fee) }}</dd>
                        </dl>
                    </div>
                    <div class="info">
                        <dl>
                            <dt>{{ $t('receipt') }}
    </dt>
                            <dd>{{ func.zdate(trade_info.regdate, 'y/m/d H:i:s') }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('expiration') }}
    </dt>
                            <dd>{{ func.zdate(trade_info.closed_date, 'y/m/d H:i:s') }}</dd>
                        </dl>
                    </div>
                </div>
			</div>
		</div>
	</div>
</template>

<style scoped>
    .history { height: calc(100% - 70px); overflow-y: auto; overflow-x: hidden; }
    .info-wrap { border:1px solid #ddd; padding:5px 10px; border-radius:10px;}
    .info dl:first-child { border-right:1px solid #ddd; }
</style>

<script>
import php from 'phpjs'
import func from 'classes/func.inc'
import async from 'async'
import _ from 'lodash'
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'history',
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.dettachListener();
    },
    computed: {
        c_trade_list() {

            return this.trade_list;
        },
        c_selectable_accounts() {
            return _.filter(this.accounts, { trade_type: this.trade_method, trader_type: 'DIRECT' })
        },
        ...mapGetters(['accounts']),
        ...mapState({
            logged_info: state => state.auth.logged_info,
            constants: state => state.common.constants,
            es: state => state.common.eventsource,
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
            trade_method: state => state.common.trade_method
        })
    },
    data() {
        return {
            is_loaded: true,
            futures: [],
            trade_list: [],
            selected_account_srl: 0,
            php,
            func,
            listen_events: ['tradeClear', 'tradeLink', 'tradeCancel'],
        }
    },
    methods: {
        init() {
            var vm = this;
            vm.is_loaded = false;
            async.auto({
                trade_list: (callback) => vm.loadTradeList(callback),
            }, function(error, result) {
                if(error) return console.log(error);
                vm.attachListener();

                vm.is_loaded = true;
            })
        },

        premiumToTick(asset_setting, premium) {

            return ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit;
        },

        // 호가단위 갯수의 차를 구함
        diffTickUnitCount(tick_unit, tick1, tick2) {

            return tick1 / tick_unit - tick2 / tick_unit;
        },

        loadTradeList(callback) {
            var vm = this;
            vm.$request(function(error, { data }) {
                if(error) return error;

                vm.trade_list = data;

                (callback || function() {})()
            }, 'get', '/api/trade', { status: this.trade_method === 'MARGIN' ? ['CLEARED', 'CANCELD'] : ['CANCELD', 'LINKED'].join(), account_srl: this.selected_account_srl || null, list_count: 50, trade_type: this.trade_method });
        },

        handleEvent({ type, data }) {
            var vm = this;
            data = JSON.parse(data);

            switch(type) {
                case 'tradeClear':
                case 'tradeLink':
                case 'tradeCancel':

                    vm.loadTradeList();

                    break;
            }
        },

        attachListener() {
            this.listen_events.forEach((event_name) => this.es.addEventListener(event_name, this.handleEvent))
        },

        dettachListener() {
            this.listen_events.forEach((event_name) => this.es.removeEventListener(event_name, this.handleEvent))
        }
    }
}
</script>
