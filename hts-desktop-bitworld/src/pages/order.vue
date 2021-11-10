<template>
    <div class="left_panel">
        <InvestNav></InvestNav>
        <div class="invest" >
            <div class="history" style="padding:10px 10px;">
                <div class="thead">
                    <table>
                        <colgroup>
                            <col width="90" />
                            <col width="90" />
                            <col width="140" />
                            <col width="140" />
                            <col width="140" />
                            <col width="140" />
                            <col width="90" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th rowspan="2">{{ $t('order_time') }}</th>
                                <th>{{ $t('category') }}</th>
                                <th>{{ $t('entry_asking_price') }}</th>
                                <th>{{ $t('transaction_amount') }}</th>
                                <th>{{ $t('fee') }}</th>
                                <th>{{ $t('net_profit') }}</th>
                                <th rowspan="2">{{ $t('state') }}</th>
                            </tr>
                            <tr>
                                <th>{{ $t('position') }}</th>
                                <th>{{ $t('liquidation_asking_price') }}</th>
                                <th>{{ $t('Entry_number') }}</th>
                                <th>{{ $t('settlement_amount_fee') }}</th>
                                <th>{{ $t('realization_net_profit') }}</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div v-if="trade_method === 'MARGIN'" class="tbody" v-loading="history_loading">
                    <table>
                        <colgroup>
                            <col width="90" />
                            <col width="90" />
                            <col width="140" />
                            <col width="140" />
                            <col width="140" />
                            <col width="140" />
                            <col width="90" />
                        </colgroup>
                        <tbody>
                            <template v-for="trade in trade_history">
                                <tr :class="`bg${trade._no % 2}`">
                                    <td class="time" rowspan="2">
                                        {{ func.zdate(trade.regdate, 'Y.m.d') }}<br />
                                        {{ func.zdate(trade.regdate, 'H:i') }}
                                    </td>
                                    <td class="coin">{{ fromPairs(constants.asset.asset_codes)[trade.asset] }}</td>
                                    <td>
                                        <em>{{ php.number_format(trade.tick) }}</em>
                                        <span class="unit">{{ $t('symbol_defalt') }}</span>
                                    </td>
                                    <td>
                                        <em>{{ php.number_format(trade.trade_margin) }}</em>
                                        <span class="unit">{{ $t('symbol_defalt') }}</span>
                                    </td>
                                    <td>
                                        <em>{{ php.number_format(trade.total_fee) }}</em>
                                        <span class="unit">{{ $t('symbol_defalt') }}</span>
                                    </td>
                                    <td>
                                        <template v-if="trade.status === 'CLEARED'">
                                            <em :class="{ up: trade.gain_profit > 0, down: trade.gain_profit < 0 }">{{ php.number_format(trade.gain_profit) }}</em>
                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                        </template>
                                        <span v-else class="unit">-</span>
                                    </td>
                                    <td class="coin" rowspan="2">{{ fromPairs(constants.trade.statuses)[trade.status] }}</td>
                                </tr>
                                <tr :class="`bg${trade._no % 2}`">
                                    <td :class="['type', { minus: trade.position === 'PUT', plus: trade.position === 'CALL' }]">{{ fromPairs(constants.trade.positions)[trade.position] }}</td>
                                    <td>
                                        <template v-if="trade.status === 'CLEARED'">
                                            <em>{{ php.number_format(trade.cleared_tick) }}</em>
                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                        </template>
                                        <span v-else class="unit">-</span>
                                    </td>
                                    <td>
                                        <em>{{ php.number_format(trade.amount, 8) }}</em>
                                        <span class="unit">{{ fromPairs(constants.asset.asset_codes)[trade.asset].split('/')[0] }}</span>
                                    </td>
                                    <td>
                                        <template v-if="trade.status === 'CLEARED'">
                                            <em>{{ php.number_format(trade.trade_margin + trade.gain_profit - trade.total_fee) }}</em>
                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                        </template>
                                        <span v-else class="unit">-</span>
                                    </td>
                                    <td>
                                        <template v-if="trade.status === 'CLEARED'">
                                            <em :class="{ up: trade.gain_profit - trade.total_fee > 0, down: trade.gain_profit - trade.total_fee < 0 }">{{ php.number_format(trade.gain_profit - trade.total_fee) }}</em>
                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                        </template>
                                        <span v-else class="unit">-</span>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                <div v-else-if="trade_method === 'FUTURES'" class="tbody" v-loading="history_loading">
                    <table>
                        <colgroup>
                            <col width="90" />
                            <col width="90" />
                            <col width="140" />
                            <col width="140" />
                            <col width="140" />
                            <col width="140" />
                            <col width="90" />
                        </colgroup>
                        <tbody>
                            <template v-for="trade in trade_history">
                                <tr :class="`bg${trade._no % 2}`">
                                    <td class="time" rowspan="2">
                                        {{ func.zdate(trade.regdate, 'Y.m.d') }}<br />
                                        {{ func.zdate(trade.regdate, 'H:i') }}
                                    </td>
                                    <td class="coin">{{ fromPairs(constants.asset.asset_codes)[trade.asset] }}</td>
                                    <td>
                                        <em>{{ php.number_format(trade.tick) }}</em>
                                        <span class="unit">{{ $t('symbol_defalt') }}</span>
                                    </td>
                                    <td>
                                        <em>{{ php.number_format(trade.trade_margin) }}</em>
                                        <span class="unit">{{ $t('symbol_defalt') }}</span>
                                    </td>
                                    <td>
                                        <em>{{ php.number_format(trade.total_fee) }}</em>
                                        <span class="unit">{{ $t('symbol_defalt') }}</span>
                                    </td>
                                    <td>
                                        <template v-if="trade.status === 'LINKED'">
                                            <em :class="{ up: trade.gain_profit > 0, down: trade.gain_profit < 0 }">{{ php.number_format(trade.gain_profit) }}</em>
                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                        </template>
                                        <span v-else class="unit">-</span>
                                    </td>
                                    <td class="coin" rowspan="2">{{ fromPairs(constants.trade.statuses)[trade.status] }}</td>
                                </tr>
                                <tr :class="`bg${trade._no % 2}`">
                                    <td :class="['type', { minus: trade.position === 'PUT', plus: trade.position === 'CALL' }]">{{ fromPairs(constants.trade.positions)[trade.position] }}</td>
                                    <td>
                                        <template v-if="trade.status === 'LINKED'">
                                            <em>{{ php.number_format(trade.cleared_tick) }}</em>
                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                        </template>
                                        <span v-else class="unit">-</span>
                                    </td>
                                    <td>
                                        <em>{{ php.number_format(trade.amount, 8) }}</em>
                                        <span class="unit">{{ fromPairs(constants.asset.asset_codes)[trade.asset].split('/')[0] }}</span>
                                    </td>
                                    <td>
                                        <template v-if="trade.status === 'LINKED'">
                                            <em>{{ php.number_format(trade.trade_margin + trade.gain_profit - trade.total_fee) }}</em>
                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                        </template>
                                        <span v-else class="unit">-</span>
                                    </td>
                                    <td>
                                        <template v-if="trade.status === 'LINKED'">
                                            <em :class="{ up: trade.gain_profit - trade.total_fee > 0, down: trade.gain_profit - trade.total_fee < 0 }">{{ php.number_format(trade.gain_profit - trade.total_fee) }}</em>
                                            <span class="unit">{{ $t('symbol_defalt') }}</span>
                                        </template>
                                        <span v-else class="unit">-</span>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                <div class="none_list" v-if="!trade_history.length">{{ $t('no_transactional_information') }}</div>
            </div>
            <page-navigation v-if="!history_loading" :total_count="page_navigation.total_count" :total_page="page_navigation.total_page" :cur_page="$route.query.page || 1" :page_count="page_navigation.page_count"></page-navigation>
        </div>
    </div>
</template>

<style scoped>
.history .thead thead tr { border-bottom:1px solid #fff;}
tr.bg0 td { background-color: #fff; }
tr.bg1 td { background-color: #f9f9f9; }
tr.bg0:nth-child(odd) .time, tr.bg0:nth-child(odd) td:last-child { border-bottom:1px solid #ccc;}
tr.bg1:nth-child(odd) .time, tr.bg1:nth-child(odd) td:last-child  { border-bottom:1px solid #ccc;}
tr.bg0:nth-child(even) td{ border-bottom:1px solid #ccc;}
tr.bg1:nth-child(even) td{ border-bottom:1px solid #ccc;}
</style>

<script>
import InvestNav from '@/components/InvestNav'
import { mapGetters, mapState } from 'vuex';
import * as tradeApi from '@/api/trade'
import func from '@/classes/func.inc'
import php from 'phpjs'
import PageNavigation from '@/components/PageNavigation'
export default {
    name: 'history',
    components: { InvestNav, PageNavigation },
    data() {
        return {
            history_loading: false,
            trade_history: [],
            page_navigation: {},
            page: 1,
            php,
            func,
        }
    },
    watch: {
        '$route' (to, from) {
            this.page = this.$route.query.page || 1;
            this.loadTradeHistory();
        },
        s_account_srl() {
            if (this.page > 1) {
                this.$router.push({ name: this.$route.name, query: { } })
            } else {
                this.loadTradeHistory();
            }
        }
    },
    computed: {
        ...mapGetters(['is_logged', 's_account_info', 'constants']),
        ...mapState({
            s_account_srl: ({ account }) => account.s_account_srl,
            trade_method: state => state.common.trade_method
        })
    },
    mounted() {
        this.loadTradeHistory();
    },
    methods: {
        loadTradeHistory() {
            if(!this.is_logged) return Promise.resolve();

            this.history_loading = true;
            return tradeApi.fetchHistory({ ...this.$route.query, account_srl: this.s_account_srl, trade_type: this.trade_method }).then(({ data, page_navigation }) => {
                this.trade_history = data;
                this.page_navigation = page_navigation;
                this.history_loading = false;
            }).catch(() => {

                this.history_loading = false;
            });
        },
    }
}
</script>
