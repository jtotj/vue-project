<template>
	<div class="invest">
		<div class="profile">
			<h2>{{ $t('my_holding_asset') }}</h2>
			<div class="my_box">
				<div class="left_col">
					<span class="name">{{ $t('holding_symbol_defalt') }}</span>
					<strong class="price">{{ php.number_format(estate_info.tradable_margin) }}</strong>
				</div>
				<div class="right_col">
					<span class="name">{{ $t('total_holding_asset') }}</span>
					<strong class="price">{{ php.number_format(estate_info.margin) }}</strong>
				</div>
				<div class="info" style="margin-top:20px;">
					<dl>
						<dt>{{ $t('total_transaction_amount') }}</dt>
						<dd>{{ php.number_format(estate_info.holding_balance) }}</dd>
					</dl>
					<dl>
						<dt>{{ $t('valuation_profit_loss') }}</dt>
						<dd :class="{ up: estate_info.evaluated_gain_loss > 0, down: estate_info.evaluated_gain_loss < 0 }">{{ php.number_format(estate_info.evaluated_gain_loss) }}</dd>
					</dl>
				</div>
				<div class="info" style="margin-top:10px;">
					<dl>
						<dt>{{ $t('total_evaluated') }}</dt>
						<dd :class="{ up: estate_info.evaluated_estate > 0, down: estate_info.evaluated_estate < 0 }">{{ php.number_format(estate_info.evaluated_estate) }}</dd>
					</dl>
					<dl>
						<dt>{{ $t('total_valuation_earnings_rate') }}</dt>
						<dd :class="{ up: estate_info.evaluated_precentage > 0, down: estate_info.evaluated_precentage < 0 }">{{ php.number_format(estate_info.evaluated_precentage, 2) }}%</dd>
					</dl>
				</div>
			</div>
		</div>
		<p class="coment">{{ $t('msg_symbol_defalt_estimated_value') }} <i class="ico_round">?</i></p>
        <div class="none_list" v-if="!c_trade_list.length">{{ $t('execution_order_not_exist') }}</div>
		<div class="trade" v-for="(trade_info, idx) in c_trade_list" :data-status="trade_info.status">
			<h2>{{ trade_info.trade_srl }} <span>{{ c_find_trade_list_account_number[idx].account_number }}</span></h2>
			<div class="my_box">
				<div class="left_col">
					<span class="name">{{ $t('entry') }}</span>
					<strong class="price">{{ php.number_format(trade_info.tick) }}</strong>
				</div>
				<div class="right_col">
					<span class="name">{{ $t('liquidation_reservation') }}</span>
					<strong class="price">{{ trade_info.use_auto_clear == 'Y' ? php.number_format(trade_info.auto_clear_tick) : '-' }}</strong>
				</div>
                <div class="info_wrap">
                    <div class="info">
                        <dl>
                            <dt>{{ $t('state') }}</dt>
                            <dd>{{ fromPairs(constants.trade.statuses)[trade_info.status] }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('item_code') }}</dt>
                            <dd>{{ fromPairs(constants.asset.asset_codes)[trade_info.asset] }}</dd>
                        </dl>
                    </div>
                    <div class="info">
                        <dl>
                            <dt>{{ $t('amount') }}</dt>
                            <dd>{{ trade_info.amount }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('mypage.average') }}</dt>
                            <dd>{{ fromPairs(constants.account.leverages)[trade_info.leverage] }}</dd>
                        </dl>
                    </div>
                    <div class="info">
                        <dl>
                            <dt>{{ $t('valuation_profit_loss') }}</dt>
                            <dd :class="{ up: trade_info.evaluated_gain_loss > 0, down: trade_info.evaluated_gain_loss < 0 }">{{ php.number_format(trade_info.evaluated_gain_loss) }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('fee') }}</dt>
                            <dd>{{ php.number_format(trade_info.total_fee) }}</dd>
                        </dl>
                    </div>
                    <div class="info">
                        <dl>
                            <dt>{{ $t('valuation_profit_loss_rate') }}</dt>
                            <dd :class="{ up: trade_info.evaluated_precentage > 0, down: trade_info.evaluated_precentage < 0 }">{{ php.number_format(trade_info.evaluated_precentage, 2) }}%</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('receipt') }}</dt>
                            <dd>{{ func.zdate(trade_info.regdate, 'y/m/d H:i:s') }}</dd>
                        </dl>
                    </div>
                </div>
			</div>
		</div>
	</div>
</template>

<style scoped>
    .invest { height: calc(100% - 70px); overflow-y: auto; overflow-x: hidden; padding-top:0px; }
    .info_wrap { border:1px solid #ddd; padding:5px 10px; border-radius:10px;}
    .info dl:first-child { border-right:1px solid #ddd; }
</style>

<script>
import php from 'phpjs'
import func from 'classes/func.inc';
import _ from 'lodash'
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'invest',
    computed: {
        estate_info() {
            var vm = this;

            var data = {
                margin: _.chain(vm.c_filter_trade_account).filter({ account_type: 'REAL' }).map('margin').sum().value(),
                holding_balance: _.chain(vm.c_filter_trade_account).filter({ account_type: 'REAL' }).map('holding_balance').sum().value(),
                evaluated_gain_loss: _.chain(vm.c_filter_trade_account).filter({ account_type: 'REAL' }).map('evaluated_gain_loss').sum().value(),
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

                accounts.push(account);
            })

            return accounts;
        },
        c_filter_trade_account() {
          return _.filter(this.c_accounts, { trade_type: this.trade_method })
        },
        c_find_trade_list_account_number() {
            const account_number = []
            _.forEach(this.c_trade_list, (data) => {
                let number = _.find(this.c_accounts, (e) => {
                    return e.account_srl === data.account_srl
                })
                if(number) {
                    account_number.push(number)
                }
            })
            return account_number
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
                            account_srl: val.account_srl,
                            trade_type: 'FUTURES',
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
            trade_list = _.filter(trade_list, { trade_type: this.trade_method })
            return trade_list;
        },
        ...mapGetters(['accounts']),
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
            futures: [],
            php,
            func,
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
        viewCopy(copy_srl) {
            this.s_copy_srl = copy_srl;

            this.$refs.modal.open();
        },
    }
}
</script>
