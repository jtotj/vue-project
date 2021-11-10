<template>
    <div>
        <CoinList :tb-head-fixed="tbHeadFixed" @change="onChange" :emit-on-change="true"></CoinList>
    </div>
</template>
<script>

import { mapState } from 'vuex'
import _ from 'lodash'
import php from 'phpjs'
import CoinList from '@/components/CoinList';

export default {
    name: 'index',
    components: { CoinList },
    data () {
        return {
            tbHeadFixed: false,
            search_keyword: '',
            display_asset_code: false,
            sort_order: 'premium',
            order_type: 'DESC',
        };
    },
    methods: {
        handleScroll () {
            this.tbHeadFixed = window.scrollY > 92;
        },

        changeSort(sort_order) {
            if(sort_order != this.sort_order) {
                this.order_type = 'DESC';
            } else {
                this.order_type = this.order_type == 'DESC' ? 'ASC' : 'DESC';
            }

            this.sort_order = sort_order;
        },

        onChange(asset) {
            this.$router.push({ name: 'traderoom', params: { asset } });
        },
    },
    computed: {
        ...mapState({
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
            constants: state => state.common.constants,
        }),
        _() {
            return _;
        },
        php() {
            return php;
        },
        c_asset_list() {
            var asset_codes = this.fromPairs(this.constants.asset.asset_codes);
            return _.chain(this.constants.asset.assets).map(([asset, title]) => {
                var statistics = this.assets_statistics[asset];
                var asset_info = {
                    ...this.asset_settings[asset],
                    asset,
                    title,
                    yesterday_first: statistics.yesterday_first,
                    today_volume: statistics.today_volume,
                    percentage: (this.premiums[asset] / statistics.yesterday_first * 100 - 100).toFixed(2) * 1,
                    updown: statistics.yesterday_first > this.premiums[asset] ? 'down' : 'up',
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

                if(!~asset_info.title.indexOf(this.search_keyword) && !~asset_info.asset.indexOf(this.search_keyword.toUpperCase())) {
                    return false;
                }

                return true;
            }).orderBy([this.sort_order], [this.order_type.toLowerCase()]).value();
        }
    },
    beforeMount () {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>
