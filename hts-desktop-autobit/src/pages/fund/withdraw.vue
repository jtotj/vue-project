<template>
    <div class="fund" v-if="is_loaded">
        <form @submit.prevent="submit">
            <table>
                <colgroup><col width="*"><col width="70px"></colgroup>
                <tbody>
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
                <em>출금환산액</em><b>{{ premiums['ETHKRW'] ? ((params.request_amount.length ? params.request_amount : 0) / premiums['ETHKRW']).toFixed(8) : '(계산 불가)' }}</b>ETH
            </div>
            <div class="btn">
                <a @click.prevent="clear">초기화</a>
                <a @click.prevent="submit" class="blue">출금 신청</a>
            </div>
            <div class="able_info">
                <p><em>최소출금금액</em><b>50,000</b>USDT</p>
            </div>
        </form>
        <div class="none_list" v-if="!withdraw_list.length">출금 신청 내역이 없습니다.</div>
        <div class="item" v-for="withdraw_info in withdraw_list" :data-status="withdraw_info.status">
            <h2>{{ withdraw_info.withdraw_srl }} <span>{{ withdraw_info.account_number }}</span></h2>
            <div class="my_box">
                <div class="left_col">
                    <span class="name">신청금액</span>
                    <strong class="price">{{ php.number_format(withdraw_info.request_amount) }}</strong>
                </div>
                <div class="right_col">
                    <span class="name">출금환산액</span>
                    <strong class="price">{{ withdraw_info.asset_price ? (withdraw_info.request_amount / withdraw_info.asset_price).toFixed(8) : '(계산 불가)' }}</strong>
                </div>
                <div class="info">
                    <dl>
                        <dt>상태</dt>
                        <dd>{{ fromPairs(constants.withdraw.statuses)[withdraw_info.status] }}</dd>
                    </dl>
                    <dl>
                        <dt>접수</dt>
                        <dd>{{ func.zdate(withdraw_info.regdate, 'y/m/d H:i:s') }}</dd>
                    </dl>
                </div>
                <div class="info">
                    <dl>
                        <dt>통화쌍</dt>
                        <dd>{{ fromPairs(constants.asset.assets)[withdraw_info.asset] }}</dd>
                    </dl>
                    <dl>
                        <dt>환율</dt>
                        <dd>X = {{ php.number_format(withdraw_info.asset_price) }}</dd>
                    </dl>
                </div>
                <div class="txid">
                    <span>지갑주소</span>
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
import async from 'async'
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
    name: 'withdraw',
    created() {
        this.init();
    },
    beforeDestroy() {
        this.dettachListener();
    },
    computed: {
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
            is_loaded: false,
            withdraw_list: [],
            params: { request_amount: '0' },
            php,
            func,
            listen_events: ['withdrawApprove'],
        }
    },
    methods: {
        init() {
            var vm = this;
            async.auto({
                withdraw_list: (callback) => vm.loadWithdrawList(callback),
            }, function(error, result) {
                if(error) return console.log(error);

                vm.params.holder_name = vm.logged_info.user_name;
                vm.is_loaded = true;
            })
        },

        clear() {
            this.params = {
                request_amount: 0,
            }
        },

        submit() {
            var vm = this;
            var params = {
                account_srl: this.c_selected_account_srl,
                ...this.params,
                bank: '이더리움',
            }

            vm.$request(function(error, ret_obj) {
                if(error) return vm.$toasted.error(error.message);

                vm.clear();
                vm.$toasted.success(ret_obj.message);

                vm.loadWithdrawList(function() {});
            }, 'post', '/api/withdraw', params, false, false);
        },

        setTxid(withdraw_srl, txid) {
            var vm = this;

            vm.$request(function(error, ret_obj) {
                if(error) return vm.$toasted.error(error.message);

                vm.$toasted.success(ret_obj.message);
                vm.loadWithdrawList(function() {});
            }, 'put', `/api/withdraw/${withdraw_srl}`, { type: 'UPDATE', txid });
        },

        loadWithdrawList(callback) {
            var vm = this;
            vm.$request(function(error, ret_obj) {
                if(error) return error;

                vm.withdraw_list = ret_obj.data;
                vm.total_count = ret_obj.total_count;
                vm.total_page = ret_obj.total_page;
                vm.page_navigation = ret_obj.page_navigation;

                callback(error, ret_obj);
            }, 'get', '/api/withdraw', _.extend({ list_count: 10, account_srl: this.c_selected_account_srl }, vm.$route.query, vm.$route.params));
        },

        handleEvent({ type, data }) {
            var vm = this;
            data = JSON.parse(data);

            switch(type) {
                case 'withdrawApprove':

                    vm.loadWithdrawList(() => {});

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
