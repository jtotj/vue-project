<template>
    <div class="fund" v-loading="!is_loaded || request_loading">
        <form @submit.prevent="submit">
            <table>
                <colgroup><col width="*"><col width="70px"></colgroup>
                <tbody v-if="c_pending_withdraw">
                    <tr>
                        <td colspan="2">
                            <span data-role="holder_name" class="readonly"><input type="text" readonly :value="c_pending_withdraw.holder_name"></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span data-role="request_amount" class="readonly"><input type="text" readonly :value="c_pending_withdraw.request_amount"></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span data-role="bank_account" class="readonly"><input type="text" readonly :value="c_pending_withdraw.bank_account"></span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="2">
                            <span data-role="holder_name"><input type="text" v-model="params.holder_name"></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span data-role="request_amount"><input type="text" v-model="params.request_amount"></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span data-role="bank_account"><input type="text" v-model="params.bank_account"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="total">
                <em>{{ $t('deposit_exchange') }}</em>
                <b v-if="c_pending_withdraw">{{ c_pending_withdraw.asset_price ? (c_pending_withdraw.request_amount / c_pending_withdraw.asset_price).toFixed(8) : $t('not_calculation') }}</b>
                <b v-else>{{ premiums['ETHKRW'] ? (((params.request_amount + '').length ? params.request_amount : 0) / premiums['ETHKRW']).toFixed(8) : $t('not_calculation') }}</b>
                ETH
            </div>
            <div class="btn">
                <template v-if="c_pending_withdraw">
                    <a @click.prevent="cancelWithdraw" class="reset"><i class="fa fa-ban" aria-hidden="true"></i>{{ $t('withdrawal_application_cancel') }}</a>
                </template>
                <template v-else>
                    <a @click.prevent="clear"><i class="fa fa-refresh" aria-hidden="true"></i> {{ $t('reset') }}</a>
                    <a @click.prevent="requestWithdraw" class="red">{{ $t('withdrawal_application') }}</a>
                </template>
            </div>
            <div class="able_info">
                <p><em>{{ $t('min_withdrawal_amount') }}</em><b>50,000</b>{{ $t('symbol_defalt') }}</p>
            </div>
        </form>
        <div class="none_list" v-if="is_loaded && !withdraw_list.length">{{ $t('msg_no_withdrawal_application') }}
</div>
        <div class="item" v-for="withdraw_info in withdraw_list" :data-status="withdraw_info.status">
            <h2>{{ withdraw_info.withdraw_srl }} <span>{{ withdraw_info.account_number }}</span></h2>
            <div class="my_box">
                <div class="left_col">
                    <span class="name">{{ $t('application_amount') }}</span>
                    <strong class="price">{{ php.number_format(withdraw_info.request_amount) }}</strong>
                </div>
                <div class="right_col">
                    <span class="name">{{ $t('withdrawal_exchange') }}</span>
                    <strong class="price">{{ withdraw_info.asset_price ? (withdraw_info.request_amount / withdraw_info.asset_price).toFixed(8) : $t('not_calculation') }}</strong>
                </div>
                <div class="info">
                    <dl>
                        <dt>{{ $t('state') }}
</dt>
                        <dd>{{ fromPairs(constants.withdraw.statuses)[withdraw_info.status] }}</dd>
                    </dl>
                    <dl>
                        <dt>{{ $t('receipt') }}
</dt>
                        <dd>{{ func.zdate(withdraw_info.regdate, 'y/m/d H:i:s') }}</dd>
                    </dl>
                </div>
                <div class="info">
                    <dl>
                        <dt>{{ $t('currency_pair') }}
</dt>
                        <dd>{{ fromPairs(constants.asset.assets)[withdraw_info.asset] }}</dd>
                    </dl>
                    <dl>
                        <dt>{{ $t('exchange_rate') }}
</dt>
                        <dd>X = {{ php.number_format(withdraw_info.asset_price) }}</dd>
                    </dl>
                </div>
                <div class="txid">
                    <span>{{ $t('wallet_address') }}</span>
                    <p>{{ withdraw_info.bank_account }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .fund { height: calc(100% - 36px); overflow-y: auto; overflow-x: hidden; }
</style>

<script>
import php from 'phpjs'
import func from 'classes/func.inc'
import _ from 'lodash'
import { mapState, mapGetters } from 'vuex'
import * as withdrawApi from '@/api/withdraw';

export default {
    name: 'withdraw',
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
        // 대기중인 출금신청
        c_pending_withdraw() {
            if(!this.c_selected_account_srl) return;

            return _.find(this.withdraw_list, val => val.account_srl === this.c_selected_account_srl && val.status === 'PENDING');
        },
        ...mapGetters(['is_logged']),
        ...mapState({
            logged_info: state => state.auth.logged_info,
            constants: state => state.common.constants,
            es: state => state.common.eventsource,
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
        }),
        c_selected_account_srl() {
            return this.$route.params.account_srl;
        }
    },
    data() {
        return {
            is_loaded: true,
            withdraw_list: [],
            request_loading: false,
            php,
            func,
            listen_events: ['withdrawApprove'],
        }
    },
    methods: {
        init() {
            this.is_loaded = false;
            Promise.all([this.loadWithdrawList()]).then(() => {
                this.is_loaded = true;
            }).catch(() => {
                this.is_loaded = true;
            })
        },

        clear() {
            this.params = {
                bank: this.$t('balance.just_io_coin'),
                bank_account: '',
                holder_name: this.logged_info.user_name,
                request_amount: '0',
            }
        },

        requestWithdraw() {
            if(!this.is_logged || !this.c_selected_account_srl) return;

            this.request_loading = true;
            this.$dialog.confirm(this.$t('msg_read_withdraw_care_points'), {
                type: 'hard',
                verification: this.$t('answer_read_withdraw_care_points'),
                okText: this.$t('continuation'),
                cancelText: this.$t('cancel'),
                verificationHelp: this.$t('continue_entry'),
            })
            .then(() => withdrawApi.createWithdraw(_.extend({}, this.params, {
                holder_name: this.logged_info.user_name,
                account_srl: this.c_selected_account_srl,
            })))
            .then(({ message }) => {
                this.$toasted.info(message);
                this.request_loading = false;
                this.clear();

                return this.loadWithdrawList();
            }).catch(() => {
                this.request_loading = false;
            })
        },

        loadWithdrawList() {
            return withdrawApi.fetchList({
                list_count: 10,
                account_srl: this.c_selected_account_srl,
                ...this.$route.query,
                ...this.$route.params,
            }).then(({ data, total_count, total_page, page_navigation }) => {
                this.withdraw_list = data;
                this.total_count = total_count;
                this.total_page = total_page;
                this.page_navigation = page_navigation;
            })
        },

        cancelWithdraw() {
            if(!this.c_pending_withdraw) return;

            this.request_loading = true;
            withdrawApi.cancelWithdraw(this.c_pending_withdraw.withdraw_srl).then(({ message }) => {
                this.$toasted.info(message);
                this.clear();

                return this.loadWithdrawList()
            }).then(() => {
                this.request_loading = false;
            })
            .catch(() => {
                this.request_loading = false;
            })
        },

        handleEvent({ type, data }) {
            var vm = this;
            data = JSON.parse(data);

            switch(type) {
                case 'withdrawApprove':
                    vm.loadWithdrawList();
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
