<template>
	<div class="fund" v-loading="!is_loaded || request_loading">
        <form @submit.prevent="submit">
            <table>
                <colgroup><col width="*"><col width="70px"></colgroup>
                <tbody v-if="c_pending_deposit">
                    <tr>
                        <td colspan="2">
                            <span class="readonly" data-role="depositor_name"><input type="text" readonly :value="c_pending_deposit.depositor_name"></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="readonly" data-role="request_amount"><input type="text" readonly :value="`${php.number_format(c_pending_deposit.request_amount)} CCE`"></span>
                        </td>
                    </tr>
                    <tr>
                        <td v-if="0" colspan="2">
                            <span v-if="!c_pending_deposit.txid || !c_pending_deposit.txid.length" data-role="txid"><input type="text" v-model="params.txid"></span>
                            <span v-else data-role="txid" class="readonly"><input type="text" readonly :value="c_pending_deposit.txid" :placeholder="$t('after_applying_entry')"></span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="2">
                            <span data-role="depositor_name"><input type="text" v-model="params.depositor_name"></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span data-role="request_amount"><input type="text" v-restrict.number v-model.number="params.request_amount"></span>
                        </td>
                    </tr>
                    <tr>
                        <td v-if="0" colspan="2">
                            <span data-role="txid" class="disabled"><input type="text" :placeholder="$t('after_applying_entry')" disabled></span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="0" class="total">
                <em>{{ $t('deposit_exchange') }}</em>
                <b v-if="c_pending_deposit">{{ c_pending_deposit.asset_price ? (c_pending_deposit.request_amount / c_pending_deposit.asset_price).toFixed(8) : $t('not_calculation') }}</b>
                <b v-else>{{ premiums['ETHKRW'] ? (((params.request_amount + '').length ? params.request_amount : 0) / premiums['ETHKRW']).toFixed(8) : $t('not_calculation') }}</b>{{ $t('balance.io_source_coin') }}
            </div>
            <div v-if="c_selected_account_info" class="btn" style="margin-top: 15px;">
                <template v-if="c_pending_deposit">
                    <a @click.prevent="cancelDeposit" class="reset"><i class="fa fa-ban" aria-hidden="true"></i> {{ $t('deposit_application_cancel') }}</a>
                    <!--<a  v-if="!c_pending_deposit.txid || !c_pending_deposit.txid.length" @click.prevent="setTxid" class="red"><i class="fa fa-check" aria-hidden="true"></i> {{ $t('trade_id_assign') }}</a>-->
                    <a @click.prevent="reApplyDeposit" class="red"><i class="fa fa-check" aria-hidden="true"></i> {{ $t('deposit_reapply') }}</a>
                </template>
                <template v-else>
                    <a @click.prevent="clear"><i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('reset') }}</a>
                    <a v-if="c_selected_account_info.account_type === 'REAL'" @click.prevent="requestDeposit" class="red">{{ $t('deposit_application') }}</a>
                    <a v-else @click.prevent="requestDemoDeposit" class="red">{{ $t('deposit_application') }}</a>
                </template>
            </div>
            <div class="able_info">
                <h4 v-if="0"><em>{{ $t('wallet_address') }}</em><b style="font-size: 12px;">{{ '0xd4a393c44aaa8b0a2302f33fdd79fe2fbe0f334c' }}</b></h4>
                <p><em>{{ $t('min_deposit_amount') }}</em><b>50,000</b>{{ $t('symbol_defalt') }}
</p>
            </div>
        </form>
        <div class="none_list" v-if="is_loaded && !deposit_list.length">{{ $t('msg_no_deposit_application') }}
</div>
		<div class="item" v-for="deposit_info in deposit_list" :data-status="deposit_info.status">
			<h2>{{ deposit_info.deposit_srl }} <span>{{ deposit_info.account_number }}</span></h2>
			<div class="my_box">
				<div class="left_col">
					<span class="name">{{ $t('application_amount') }}
</span>
					<strong class="price">{{ php.number_format(deposit_info.request_amount) }}</strong>
				</div>
				<div v-if="0" class="right_col">
					<span class="name">{{ $t('deposit_exchange') }}
</span>
					<strong class="price">{{ deposit_info.asset_price ? (deposit_info.request_amount / deposit_info.asset_price).toFixed(8) : $t('not_calculation') }}</strong>
				</div>
                <div class="info-wrap">
                    <div class="info">
                        <dl>
                            <dt>{{ $t('state') }}
    </dt>
                            <dd>{{ fromPairs(constants.deposit.statuses)[deposit_info.status] }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('receipt') }}
    </dt>
                            <dd>{{ func.zdate(deposit_info.regdate, 'y/m/d H:i:s') }}</dd>
                        </dl>
                    </div>
                    <div v-if="0" class="info">
                        <dl>
                            <dt>{{ $t('currency_pair') }}
    </dt>
                            <dd>{{ fromPairs(constants.asset.assets)[deposit_info.asset] }}</dd>
                        </dl>
                        <dl>
                            <dt>{{ $t('exchange_rate') }}
    </dt>
                            <dd>X = {{ php.number_format(deposit_info.asset_price) }}</dd>
                        </dl>
                    </div>
                </div>
				<div v-if="0" class="txid">
                    <span>{{ $t('transaction') }}
</span>
                    <p>{{ deposit_info.txid || $t('not_entered_transaction') }}</p>
				</div>
                
			</div>
		</div>
	</div>
</template>

<style scoped>
    .fund { height: calc(100% - 70px); overflow-y: auto; overflow-x: hidden; }
    .fund span[data-role="txid"]:before { content: $t('transaction'); }
    .info-wrap { border:1px solid #ddd; padding:5px 10px; border-radius:10px;}
    .info dl:first-child { border-right:1px solid #ddd; }
</style>

<script>
import php from 'phpjs'
import func from 'classes/func.inc'
import _ from 'lodash'
import { mapState, mapGetters } from 'vuex'
import * as depositApi from '@/api/deposit';

export default {
    name: 'deposit',
    created() {
        this.clear();
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.dettachListener();
    },
    computed: {
        // 대기중인 입금신청
        c_pending_deposit() {
            if(!this.c_selected_account_srl) return;

            return _.find(this.deposit_list, val => val.account_srl === this.c_selected_account_srl && val.status === 'PENDING');
        },
        ...mapGetters(['is_logged', 'accounts']),
        ...mapState({
            logged_info: state => state.auth.logged_info,
            constants: state => state.common.constants,
            es: state => state.common.eventsource,
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
            trade_method: state => state.common.trade_method
        }),
        c_selected_account_srl() {
            return Number(this.$route.params.account_srl);
        },
        c_selected_account_info() {
            return _.find(this.accounts, { account_srl: this.c_selected_account_srl })
        }
    },
    data() {
        return {
            is_loaded: true,
            request_loading: false,
            deposit_list: [],
            params: { },
            php,
            func,
            listen_events: ['depositApprove'],
        }
    },
    methods: {
        init() {
            this.is_loaded = false;
            Promise.all([this.loadDepositList()]).then(() => {
                this.is_loaded = true;
            }).catch(() => {
                this.is_loaded = true;
            })
        },

        clear() {
            this.params = {
                txid: '',
                depositor_name: this.logged_info.user_name,
                request_amount: '0',
            }
        },
        createDeposit() {
            return depositApi.createDepositPgCocofx(_.extend({}, this.params, {
                depositor_name: this.logged_info.user_name,
                account_srl: this.c_selected_account_srl,
            })).then(({ token, api_endpoint, merchant_id, deposit_srl }) => {
                const return_url = `${window.location.origin}/pg/cocofx/callback?${php.http_build_query({
                    deposit_srl,
                    account_srl: this.c_selected_account_srl,
                    to_name: this.$route.name,
                    trade: this.trade_method,
                })}`;
                window.location.href = `${api_endpoint}/payment?${php.http_build_query({ return_url, merchant_id, token })}`;
            })
        },
        requestDemoDeposit() {
            if(!this.is_logged || !this.c_selected_account_srl) return;

            this.request_loading = true;
            this.$dialog.confirm(this.$t('msg_read_deposit_care_points'), {
                type: 'hard',
                verification: this.$t('answer_read_withdraw_care_points'),
                okText: this.$t('continuation'),
                cancelText: this.$t('cancel'),
                verificationHelp: this.$t('continue_entry'),
            })
            .then(() => depositApi.createDeposit(_.extend({}, this.params, {
                depositor_name: this.logged_info.user_name,
                account_srl: this.c_selected_account_srl,
            })))
            .then(({ message }) => {
                this.$toasted.info(message);
                this.clear()

                return this.loadDepositList()
            }).then(() => {
                this.request_loading = false;
            })
            .catch(() => {
                this.request_loading = false;
            })
        },

        requestDeposit() {
            if(!this.is_logged || !this.c_selected_account_srl) return;

            this.request_loading = true;
            this.$dialog.confirm(this.$t('msg_read_deposit_care_points'), {
                type: 'hard',
                verification: this.$t('answer_read_withdraw_care_points'),
                okText: this.$t('continuation'),
                cancelText: this.$t('cancel'),
                verificationHelp: this.$t('continue_entry'),
            })
            .then(() => this.createDeposit())
            .then(({ message }) => {
                this.$toasted.info(message);
                this.clear();

                return this.loadDepositList()
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
                this.params = {
                    request_amount: pending_amount || 0,
                    txid: '',
                }

                return this.loadDepositList()
            })
            .then(() => this.createDeposit())
            .catch(() => {
                this.request_loading = false;
            })
        },

        setTxid() {
            if(!this.c_pending_deposit || !this.params.txid || !this.params.txid.length) return;

            this.request_loading = true;
            depositApi.setTxid(this.c_pending_deposit.deposit_srl, this.params.txid).then(({ message }) => {
                this.$toasted.info(message);
                this.clear();

                return this.loadDepositList()
            }).then(() => {
                this.request_loading = false;
            })
            .catch(() => {
                this.request_loading = false;
            })
        },

        loadDepositList() {
            return depositApi.fetchList({
                list_count: 10,
                account_srl: this.c_selected_account_srl,
                ...this.$route.query,
                ...this.$route.params,
            }).then(({ data, total_count, total_page, page_navigation }) => {
                this.deposit_list = data;
                this.total_count = total_count;
                this.total_page = total_page;
                this.page_navigation = page_navigation;
            })
        },

        handleEvent({ type, data }) {
            var vm = this;
            data = JSON.parse(data);

            switch(type) {
                case 'depositApprove':

                    vm.loadDepositList(() => {});

                    break;
            }
        },

        cancelDeposit() {
            if(!this.c_pending_deposit) return;

            this.request_loading = true;
            depositApi.cancelDeposit(this.c_pending_deposit.deposit_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.clear()

                return this.loadDepositList()
            }).then(() => {
                this.request_loading = false;
            })
            .catch(() => {
                this.request_loading = false;
            })
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
