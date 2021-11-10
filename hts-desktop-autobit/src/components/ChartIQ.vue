<template>
    <div v-loading="loading" ref="chartContainer"></div>
</template>

<style scoped>
.chart { width: 100%; height: 655px; position: relative; transition:height 0.4s cubic-bezier(.37,-0.36,.06,.99);}
@media (max-width:1598px) {
    .chart{
        height:603px;
    }    
  }

@media (max-width:1279px) {
    .chart{
        height:579px;
    }    
  }
  
</style>
<script>
import _ from 'lodash';
import { mapState } from 'vuex'
import { CIQ } from '@/vendor/chartiq/js/chartiq.js'
import * as QuoteFeed from '@/classes/ChartIQDataLoader'
import '@/vendor/chartiq/css/stx-chart.css'
export default {
    name: 'ChartIQ',
    props: ['asset', 'periodicity', 'chartStyle', 'studies'],
    data() {
        return {
            listen_events: ['marketUpdate'],
            stxx: null,
            loading: false,
            s_studies: {},
        }
    },
    mounted() {
        this.createChart();
        this.attachListener();
    },

    computed: {
        ...mapState({
            asset_settings: state => state.asset.settings,
            premiums: state => state.asset.premiums,
            constants: state => state.common.constants,
            es: state => state.common.eventsource,
        }),
        c_symbol() {
            return this.asset.replace(/KRW$/, 'USDT');
        }
    },

    watch: {
        c_symbol(to) {
            this.changeSymbol(to);
        },
        periodicity(to) {
            this.changePeriodicity(to);
        },
        chartStyle(to) {
            this.changeChartStyle(to);
        },
        studies(to, from) {
            var removed = _.difference(from, to);
            var added = _.difference(to, from);

            removed.forEach(val => {
                CIQ.Studies.removeStudy(this.stxx, this.s_studies[val])
            })

            added.forEach(val => {
                if (val === 'ma') {
                    this.s_studies[val] = CIQ.Studies.addStudy(this.stxx, val, { Period: 20 });
                } else {
                    this.s_studies[val] = CIQ.Studies.addStudy(this.stxx, val);
                }
            })
        }
    },

    methods: {
        getStudyList() {
            return CIQ.Studies.getStudyList();
        },
        createChart() {
            var stxx = new CIQ.ChartEngine({ container: this.$refs.chartContainer, preferences: { labels: false, currentPriceLine: true, whitespace: 0 } });

            // Attach an automated quote feed to the chart to handle initial load, pagination and updates at preset intervals.
            stxx.attachQuoteFeed(QuoteFeed, { refreshInterval: 0, bufferSize: 200 });
            stxx.chart.defaultPlotField = 'Close';
            stxx.setPeriodicity(this.periodicity);
            stxx.setChartType(this.chartStyle)
            stxx.layout.crosshair = true;
            stxx.setChartType('candle');
            this.loading = true;
            stxx.newChart(this.c_symbol, null, null, () => {
                this.loading = false;
            });

            // Optionally set a market factory to the chart to make it market hours aware. Otherwise it will operate in 24x7 mode.
            // This is required for the simulator, or if you intend to also enable Extended hours trading zones.
            // stxx.setMarketFactory(CIQ.Market.Symbology.factory);

            // Extended hours trading zones -- Make sure this is instantiated before calling startUI as a timing issue with may occur
            // new CIQ.ExtendedHours({stx:stxx, filter:true});

            // Floating tooltip on mousehover
            // comment in the following line if you want a tooltip to display when the crosshair toggle is turned on
            // This should be used as an *alternative* to the HeadsUP (HUD).
            // new CIQ.Tooltip({stx:stxx, ohl:true, volume:true, series:true, studies:true});

            // Inactivity timer
            // new CIQ.InactivityTimer({stx:stxx, minutes:30});

            // Animation (using tension requires splines.js)
            // this.Animation = new CIQ.Animation(stxx, { tension: 0.3 });
            this.stxx = stxx;
        },

        changeSymbol() {
            this.loading = true;
            this.stxx.newChart(this.c_symbol, null, null, () => {
                this.loading = false;
            });
        },

        changePeriodicity() {
            this.loading = true;
            this.stxx.setPeriodicity(this.periodicity, () => {
                this.loading = false;
            });
        },

        changeChartStyle() {
            this.stxx.setChartType(this.chartStyle);
        },

        destroyChart() {
            if(!this.stxx) return;

            this.stxx.destroy();
            this.stxx = null;
        },

        attachListener() {
            this.listen_events.forEach((event_name) => this.es.addEventListener(event_name, this.handleEvent))
        },

        dettachListener() {
            this.listen_events.forEach((event_name) => this.es.removeEventListener(event_name, this.handleEvent))
        },

        handleEvent({ type, data }) {
            data = JSON.parse(data);

            switch(type) {
                case 'marketUpdate':
                    if(data.symbol != this.asset || this.loading) break;

                    this.stxx.updateChartData({
                        Close: data.last_price,
                        Volume: 1,
                        DT: new Date(data.timestamp)
                    }, null, {
                        fillGaps: true,
                        useAsLastSale: true
                    });

                    break;
            }
        },
    },

    beforeDestroy() {
        this.dettachListener();
        this.destroyChart();
    }
}
</script>
