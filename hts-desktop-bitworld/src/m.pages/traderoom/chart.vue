<template>
    <div class="nosc_container">
        <div v-if="s_chart === 'basicChart'" class="market_price">
            <dl v-if="0">
                <dt>Bitfinex</dt>
                <dd><b>8,457,056</b><span class="currency">($7,545.00)</span></dd>
            </dl>
            <dl>
                <dt>{{ $t('assistance_index') }}</dt>
                <dd><button class="" style="background: #fa474c; color: #fff; display: inline-block; padding: 2px 10px; border-radius: 5px;" @click="show_study_modal = true">{{ $t('selection') }}</button></dd>
            </dl>
            <dl>
                <dt>{{ $t('candle_type') }}</dt>
                <dd>
                    <select v-model="s_periodicity_type_idx">
                        <option v-for="(val, idx) in periodicity_types" :value="idx">{{ val.title }}</option>
                    </select>
                </dd>
            </dl>
            <dl>
                <dt>{{ $t('chart_type') }}</dt>
                <dd>
                    <select v-model="s_chart_style">
                        <option v-for="([ style, title ]) in chart_styles" :value="style">{{ title }}</option>
                    </select>
                </dd>
            </dl>
        </div>
        <div class="select_chart">
            <span>
                <label for="basicChart"><input type="radio" id="basicChart" name="drone" value="basicChart" v-model="s_chart" checked><span>{{ $t('basic_chart') }}</span></label>
            </span>
            <span>
                <label for="tradingView"><input type="radio" id="tradingView" name="drone" value="tradingView" v-model="s_chart"><span>{{ $t('trading_view') }}</span></label>
            </span>
        </div>
        <vue-modaltor :visible="show_study_modal" defaultWidth="100%">
            <template slot="close-icon">
            </template>
            <div style="margin-left: 5px;">{{ $t('msg_assistance_index_infinity') }}</div>
            <ul style="margin-top: 10px;" v-if="show_study_modal">
                <li style="float: left; margin: 2px 0px 2px 5px; width: 200px;" v-for="(name, title) in $refs.CIQ.getStudyList()">
                    <label><input type="checkbox" v-model="s_studies" :value="name" name="s_studies"><span>{{ title }}</span></label>
                </li>
            </ul>
            <div style="text-align: center; clear: both; padding-top: 20px;">
                <button style="text-align: center; background: #e95653; width: 120px; padding: 10px; display: inline-block; height: 100%; text-align: center; font-weight: bold; font-size: 13px; color: #fff;" @click="show_study_modal = false">{{ $t('save') }}</button>
            </div>
        </vue-modaltor>
        
       <ChartIQ v-if="s_chart === 'basicChart'" ref="CIQ" class="chart" :studies="s_studies" :asset="s_asset" :chart-style="s_chart_style" :periodicity="periodicity_types[s_periodicity_type_idx]"></ChartIQ>
        <TVChartContainer v-if="s_chart === 'tradingView'" class="chart" :symbol="s_asset" :libraryPath="s_libraryPath" :mobile="true"/>
    </div>
</template>

<style scoped>
.market_price {display:flex;overflow:hidden; padding:10px; background-color:#f3f9fb; border-top:1px solid #ddd; flex-wrap: wrap; justify-content: space-around;}
.market_price:after {content:''; display:block; clear:both}
.market_price > dl {display:flex; align-items: center; flex:1 1 40%; height:18px; line-height:18px; letter-spacing:1px; margin-bottom:10px;}
.market_price > dl:last-child {margin-bottom: 0;}
.market_price > dl:after {content:''; display:block; clear:both}
.market_price > dl > dt {margin-right:5px; padding-left:8px; color:#678e2f}
.market_price > dl > dt:after {content:''; display:block; position:absolute; left:0; top:9px; width:2px; height:2px; background:#999}
/* .market_price > dl > dd {overflow:hidden} */
.market_price > dl > dd > select {padding: 2px 30px 2px 5px; border-radius: 5px;}
.market_price > dl > dd > b {margin-right:5px; font-size:13px}
.market_price > dl > dd > .currency {font-size:11px; color:#999}
.checked{display:block;background:url(~assets/img/checked.svg);background-repeat:no-repeat;background-position:10px center}
</style>
<script>
    import TVChartContainer from '@/components/TVChartContainer'
    import ChartIQ from '@/components/ChartIQ';
    import Cookies from 'js-cookie';
    export default {
        components: { ChartIQ, TVChartContainer },
        data() {
            return {
                show_study_modal: false,
                periodicity_types: [
                    { period: 1, timeUnit: 'minute', title: this.$t('min_1') },
                    { period: 5, timeUnit: 'minute', title: this.$t('min_5') },
                    { period: 1, timeUnit: 'minute', interval: 10, title: this.$t('min_10') },
                    { period: 1, timeUnit: 'minute', interval: 15, title: this.$t('min_15') },
                    { period: 2, timeUnit: 'minute', interval: 15, title: this.$t('min_30') },
                    { period: 1, timeUnit: 'hour', title: this.$t('hour_1') },
                    { period: 4, timeUnit: 'hour', interval: 1, title: this.$t('hour_4') },
                    { period: 1, timeUnit: 'day', title: this.$t('day_1') },
                ],
                chart_styles: [['candle', 'Candle'], ['bar', 'Bar'], ['colored_bar', 'Colored Bar'], ['line', 'Line'], ['hollow_candle', 'Hollow Candle'], ['mountain', 'Mountain'], ['baseline_delta', 'Baseline'], ['volume_candle', 'Volume Candle'], ['heikinashi', 'Heikin Ashi'], ['kagi', 'Kagi'], ['linebreak', 'Line Break'], ['renko', 'Renko'], ['rangebars', 'Range Bars']],
                s_chart_style: 'candle',
                s_periodicity_type_idx: 0,
                s_studies: [],
                s_libraryPath: '../../static/tradingview-master/tradingview/',
                s_chart: Cookies.get('c_chart') ? Cookies.get('c_chart') : 'tradingView'
            }
        },
        computed: {
            s_asset() {
                return this.$route.params.asset;
            },
        },
        watch: {
            s_chart() {
                Cookies.set('c_chart', this.s_chart);
            }
        }
    }
</script>
<style lang="scss" scoped>
    html.mobile .select_chart {
        display: flex;
        justify-content: flex-end;
        padding: 10px;
    }
    html.mobile label {
        margin: 0 5px;
    }
    html.mobile label > input[type=radio]:checked + span:before {
        background: #2D3D51;
        line-height: 1.2;
    }
    html.mobile .select_chart label > input[type=radio] + span:before {
        width: 14px;
        height: 14px;
    }
    html.mobile .select_chart label > input[type=radio]:checked + span:before {
        font-size: 12px;
    }
    html.mobile label > input[type=radio] + span:before {
        top: 2px;
    }
</style>
