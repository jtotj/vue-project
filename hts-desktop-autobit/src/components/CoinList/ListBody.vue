<template>

    <tr :class="{ on: asset_info.asset === s_asset }"
        :data-status="asset_info.updown">
        <td class="gage">
            <label class="candle" v-if="0">
                <i class="plane" :style="asset_info.plane_css"></i>
                <i class="line" :style="asset_info.line_css"></i>
            </label>
        </td>
        <td class="title">
            <b>{{ display_asset_code ? asset_info.asset_code : asset_info.title }}</b>
            <span>{{ !display_asset_code ? asset_info.asset_code : asset_info.title }}</span>
        </td>
        <td class="price" :class="{ flash_up: ( premium === 'up'), flash_down : ( premium === 'down') }">
            {{ php.number_format(asset_info.premium) }}<span>{{ php.number_format(asset_info.today_first) }}{{ $t('symbol_defalt') }}</span>
        </td>
        <td class="per" :class="{ flash_up : ( percentage === 'up'), flash_down : ( percentage === 'down') }">
            {{ asset_info.percentage }}<i>%</i></td>
        <td class="trade">{{ php.number_format(asset_info.today_volume) }}</td>
    </tr>

</template>

<style scoped>
    .flip-list-move {
        transition: transform 1s;
    }
</style>

<script>
    import {
        mapState
    } from 'vuex'
    import _ from 'lodash'
    import php from 'phpjs'

    export default {
        name: 'List',
        data() {
            return {
                search_keyword: '',
                isActive: true,
                premium: '',
                percentage: ''
            }
        },
        props: {
            display_asset_code: Boolean,
            sort_order: String,
            order_type: String,
            asset_name: String,
            asset_info: Object,
        },
        methods: {
            changeAsset(asset) {
                if (this.emit_on_change) {
                    this.$emit('change', asset);
                    return;
                }

                this.$store.dispatch('selectAsset', asset).then(() => {
                    this.$router.push({
                        name: 'traderoom'
                    });
                })
            }
        },
        watch: {
            asset_info: {
                handler(val, oldVal) {
                    if (val.premium > oldVal.premium) {
                        this.premium = 'up'
                    }else if (val.premium < oldVal.premium) {
                        this.premium = 'down'
                    }
                    if (val.percentage > oldVal.percentage) {
                        this.percentage = 'up'
                    }else if(val.percentage < oldVal.percentage) {
                        this.percentage = 'down'
                    }
                }
            },
            deep: true
        },

        computed: {
            ...mapState({
                asset_settings: state => state.asset.settings,
                assets_statistics: state => state.asset.assets_statistics,
                premiums: state => state.asset.premiums,
                constants: state => state.common.constants,
                s_asset: state => state.asset.s_asset
            }),
            _() {
                return _;
            },
            php() {
                return php;
            }
        }
    }
</script>
