<template>
	<div class="pending" v-if="is_loaded">
        <span data-role="select">
            <select v-model="selected_account_srl" @change="loadTradeList()">
                <option :value="0">{{ accounts.length ? '전계좌 미체결 주문 조회' : '조회 가능 계좌가 없습니다.' }}</option>
                <option v-for="account in c_selectable_accounts" :value="account.account_srl">{{ account.account_number }} [{{ fromPairs(constants.trade.trade_types)[account.trade_type] }}|{{ fromPairs(constants.account.account_types)[account.account_type] }}]</option>
            </select>
        </span>
        <div class="none_list" v-if="!c_trade_list.length">미체결 주문이 존재하지 않습니다.</div>
		<div class="trade" v-for="trade_info in c_trade_list" :data-status="trade_info.status">
			<h2>{{ trade_info.trade_srl }} <span>{{ trade_info.account_number }}</span></h2>
			<div class="my_box">
				<div class="left_col">
					<span class="name">진입예약</span>
					<strong class="price">{{ php.number_format(trade_info.tick) }}</strong>
				</div>
				<div class="right_col">
					<span class="name">청산예약</span>
					<strong class="price">{{ trade_info.use_auto_clear == 'Y' ? php.number_format(trade_info.auto_clear_tick) : '-' }}</strong>
				</div>
                <div class="info">
                    <dl>
                        <dt>상태</dt>
                        <dd>{{ fromPairs(constants.trade.statuses)[trade_info.status] }}</dd>
                    </dl>
                    <dl>
                        <dt>종목코드</dt>
                        <dd>{{ fromPairs(constants.asset.asset_codes)[trade_info.asset] }}</dd>
                    </dl>
                </div>
				<div class="info">
					<dl>
						<dt>수량</dt>
						<dd>{{ trade_info.amount }}</dd>
					</dl>
					<dl>
						<dt>레버리지</dt>
						<dd>{{ fromPairs(constants.account.leverages)[trade_info.leverage] }}</dd>
					</dl>
				</div>
                <div class="info">
                    <dl>
                        <dt>접수</dt>
                        <dd>{{ func.zdate(trade_info.regdate, 'y/m/d H:i:s') }}</dd>
                    </dl>
                    <dl>
                        <dt>수수료</dt>
                        <dd>{{ php.number_format(trade_info.total_fee) }}</dd>
                    </dl>
                </div>
			</div>
		</div>
	</div>
</template>

<style scoped>
    .history { height: calc(100% - 36px); overflow-y: auto; overflow-x: hidden; }
</style>

<script>
import php from 'phpjs'
import func from 'classes/func.inc'
import async from 'async'
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
    name: 'history',
    created() {
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
            return _.filter(this.accounts, { trade_type: 'MARGIN', trader_type: 'DIRECT' })
        },
        ...mapState({
            logged_info: state => state.auth.logged_info,
            constants: state => state.common.constants,
            es: state => state.common.eventsource,
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
        })
    },
    data() {
        return {
            is_loaded: false,
            accounts: [],
            futures: [],
            trade_list: [],
            selected_account_srl: 0,
            php,
            func,
            listen_events: ['tradeRequest', 'tradeLink'],
        }
    },
    methods: {
        init() {
            var vm = this;
            async.auto({
                accounts: (callback) => vm.loadAccounts(callback),
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

        loadAccounts(callback) {
            var vm = this;
            vm.$request((error, { accounts }) => {
                vm.accounts = accounts;
                // vm.selected_account_srl = vm.selected_account_srl || accounts[0].account_srl;

                (callback || function() {})(error);
            }, 'get', '/api/account');
        },

        loadTradeList(callback) {
            var vm = this;
            vm.$request(function(error, { data }) {
                if(error) return error;

                vm.trade_list = data;

                (callback || function() {})()
            }, 'get', '/api/trade', { status: ['PENDING'].join(), account_srl: this.selected_account_srl || null, list_count: 50 });
        },

        handleEvent({ type, data }) {
            var vm = this;
            data = JSON.parse(data);

            switch(type) {
                case 'tradeRequest':
                case 'tradeLink':

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
