<template>
    <section>
        <div class="balances">
            <div class="search">
                <i class="icon-magnifier"></i> 
                <input type="text" :placeholder="this.$t('account_number')" v-model="search_keyword">
            </div>
            <div class="total">
                <dl>
                    <dt>{{ $t('total_holding_asset') }}</dt>
                    <dd>{{ php.number_format(c_total_margin) }} {{ $t('symbol_defalt') }}</dd>
                </dl>
            </div>
            <div class="sort_opt chk_01">
                <input type="checkbox" id="holding" v-model="except_demo" >
                <label for="holding">{{ $t('demo_account_exemption') }}</label>
                <p>
                    {{ $t('account_count') }}
                    <span>{{ c_accounts.length }}</span>
                    {{ $t('count') }}
                    <a><i class="ico_round">?</i></a>
                </p>
            </div>
            <ul class="balance_list">
                <li v-for="account_info in c_accounts">
                    <router-link :to="{ name: 'deposit', params: { account_srl: account_info.account_srl } }">
                        <div class="tit">
                            <span class="mark">
                                <img src="~assets/img/KRW.png" alt="">
                            </span>
                            <strong class="name"></strong>
                        </div>
                        <div class="num">
                            <span class="amount">{{ fromPairs(constants.account.trade_types)[account_info.trade_type] }} | {{ php.number_format(account_info.margin) }} USDT</span>
                            <span class="value">{{ account_info.account_number }} | {{ php.number_format(account_info.holding_balance) }} USDT</span>
                        </div>
                        <div class="arr">
                            <i class="xi xi-angle-right-thin"></i>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import php from 'phpjs'
import async from 'async'
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
    name: 'fund',
    created() {
        this.init();
    },
    data() {
        return {
            except_demo: false,
            is_loaded: false,
            accounts: [],
            search_keyword: '',
            php,
        }
    },
    computed: {
        c_total_margin() {
            return _.sumBy(this.c_accounts, 'margin');
        },
        c_accounts() {

            return _.filter(this.accounts, (account) => {
                if(this.except_demo && account.account_type == 'DEMO') return false;

                if(this.search_keyword.length && !~account.account_number.indexOf(this.search_keyword)) {
                    return false;
                }

                return true;
            })
        },
        ...mapState({
            logged_info: state => state.auth.logged_info,
            constants: state => state.common.constants,
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
        })
    },
    methods: {
        init() {
            var vm = this;
            async.auto({
                accounts: (callback) => vm.loadAccounts(callback),
            }, function(error, result) {
                if(error) return console.log(error);
                vm.is_loaded = true;
            })
        },

        loadAccounts(callback) {
            var vm = this;
            vm.$request((error, { accounts }) => {
                vm.accounts = accounts;
                vm.selected_account_srl = vm.selected_account_srl || accounts[0].account_srl;

                (callback || function() {})(error);
            }, 'get', '/api/account');
        },
    }

}
</script>
