<template>
    <section>
        <div class="search">
            <i class="icon-magnifier"></i>
            <input type="text" :placeholder="$t('coin_name_symbol_name')" v-model="search_keyword">
        </div>
        <nav class="tab_m">
            <ul>
                <li class="on"><a data-tab="CCE">{{ $t('symbol_defalt') }}</a></li>
            </ul>
        </nav>
        <div class="list">
            <div :class="['thead', { 'fixed': tbHeadFixed }]">
                <table>
                    <colgroup><col width="29"><col width="*"><col width="23%"><col width="18%"><col width="26%"></colgroup>
                    <thead>
                        <tr>
                            <th scope="col" class="gage"></th>
                            <th scope="col" class="title" @click="display_asset_code = !display_asset_code">{{ display_asset_code ? this.$t('symbol_name')  : this.$t('coin_name')  }}<i class="change"></i></th>
                            <th scope="col" class="price" :data-sort="sort_order == 'premium' ? order_type : ''" @click="changeSort('premium')">{{ $t('present_price') }}<i class="sort"></i></th>
                            <th scope="col" class="per" :data-sort="sort_order == 'percentage' ? order_type : ''" @click="changeSort('percentage')">{{ $t('net_change') }}<i class="sort"></i></th>
                            <th scope="col" class="trade" :data-sort="sort_order == 'today_volume' ? order_type : ''" @click="changeSort('today_volume')">{{ $t('volume') }}<i class="sort"></i></th>
                        </tr>
                    </thead>
                </table>
            </div>
            <perfect-scrollbar class="history_tb" >
                <div class="tbody" >
                    <table id="tb_list" >
                        <colgroup>
                            <col width="5%">
                            <col width="*">
                            <col width="23%">
                            <col width="18%">
                            <col width="26%">
                        </colgroup>
                        <transition-group name="flip-list" tag="tbody">
                            <List :key="asset_info.asset" v-for="asset_info in c_asset_list" :asset_info = "asset_info" :asset_name="asset_info.asset" :display_asset_code="display_asset_code" :sort_order="sort_order" :order_type="order_type" @click.native="changeAsset(asset_info.asset)"></List>
                        </transition-group>
                    </table>
                </div>
            </perfect-scrollbar>
        </div>
        
    </section>
</template>

<style scoped>
.flip-list-move {
    transition: transform 1s;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import php from 'phpjs'
import List from './CoinList/ListBody.vue'

export default {
    name: 'CoinList',
    components: { List },
    props: {
        tbHeadFixed: {
            default: true,
        },
        emitOnChange: {
            default: false,
        },
    },
    data () {
        return {
            search_keyword: '',
            display_asset_code: false,
            sort_order: 'premium',
            order_type: 'DESC',
            isActive: true
        };
    },
    methods: {

        changeSort(sort_order) {
            if(sort_order != this.sort_order) {
                this.order_type = 'DESC';
            } else {
                this.order_type = this.order_type == 'DESC' ? 'ASC' : 'DESC';
            }

            this.sort_order = sort_order;
        },

        changeAsset(asset) {
            if (this.emitOnChange) {
                this.$emit('change', asset);
                return;
            }

            this.$store.dispatch('selectAsset', asset).then(() => {
                this.$router.push({ name: 'traderoom' });
            })
        }
    },
    computed: {
        ...mapState({
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
            constants: state => state.common.constants,
            s_asset: state => state.asset.s_asset
        }),
        ...mapGetters(['asset_list', 'is_logged']),
        _() {
            return _;
        },
        php() {
            return php;
        },
        asset_list_info() {
            return _.orderBy(this.asset_list, [this.sort_order], [this.order_type.toLowerCase()])
        },
        c_asset_list() {
            var asset_codes = this.fromPairs(this.constants.asset.asset_codes);
            return _.chain(this.constants.asset.assets).filter(([asset]) => this.asset_settings[asset].is_active === 'Y').map(([asset, title]) => {
                var statistics = this.assets_statistics[asset];
                var asset_info = {
                    ...this.asset_settings[asset],
                    asset,
                    title,
                    yesterday_first: statistics.yesterday_first,
                    today_first: statistics.today_first,
                    today_volume: statistics.today_volume,
                    percentage: (this.premiums[asset] / statistics.today_first * 100 - 100).toFixed(2) * 1,
                    updown: statistics.today_first > this.premiums[asset] ? 'down' : 'up',
                    asset_code: asset_codes[asset],
                    premium: this.premiums[asset],
                }

                if(asset_info.percentage === Infinity) asset_info.percentage = 0;

                // 캔들 계산
                var max_oc = ((statistics.today_first - this.premiums[asset]) > 0) ? statistics.today_first : this.premiums[asset];
                asset_info.line_css = {
                    height: Math.abs(((statistics.today_high - statistics.today_low) / 200 * 30)) + 1,
                    top: 30 - ((statistics.today_high + 100) / 200 * 30) + 1,
                }
                asset_info.plane_css = {
                    height: Math.abs(((statistics.today_first - this.premiums[asset]) / 200 * 30)) + 1,
                    top: 30 - ((max_oc + 100) / 200 * 30) + 1,
                }
                return asset_info;
            }).filter((asset_info) => {
                if(asset_info.is_active != 'Y') return false;

                if(!this.search_keyword.length) return true;
                if(!~asset_info.title.toUpperCase().indexOf(this.search_keyword.toUpperCase()) && !~asset_info.asset.indexOf(this.search_keyword.toUpperCase())) {
                    return false;
                }
                return true;
            }).orderBy([this.sort_order], [this.order_type.toLowerCase()]).value();
        }
    },
}
</script>
