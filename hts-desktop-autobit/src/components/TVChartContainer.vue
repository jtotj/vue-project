<template>
<div class="TVChartContainer" id="tv_chart_container"/>
</template>

<script>
import { widget } from '../../static/tradingview-master/tradingview';
import DataFeed from '../../static/tradingview-master/api';
import { mapState } from 'vuex';

export default {
  name: 'TVChartContainer',
  props: {
    symbol: {
      default: 'BTCKRW',
      type: String,
    },
    interval: {
      default: '1',
      type: String,
    },
    mobile: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      loading: false,
      tvWidget: null,
      listen_events: ['marketUpdate'],
      a_local: [],
      red: '#d24f45',
      blue: '#1261c4',
      green: '#26a69a',
      baseGreen: ['rgba( 38, 166, 154, 0.28)', 'rgba( 38, 166, 154, 0.05)', 'rgba( 38, 166, 154, 1)'],
      baseRed: ['rgba( 210, 79, 79, 0.28)', 'rgba( 210, 79, 79, 0.05)', 'rgba( 210, 79, 79, 1)'],
      baseBlue: ['rgba( 18, 97, 196, 0.28)', 'rgba( 18, 97, 196, 0.05)', 'rgba( 18, 97, 196, 1)']
    }
  },
  mounted() {
    this.createChart()
  },
  computed: {
    ...mapState({
        asset_settings: state => state.asset.settings,
        premiums: state => state.asset.premiums,
        constants: state => state.common.constants,
        es: state => state.common.eventsource,
        locale: state => state.common.locale,
    }),
    s_symbol() {
      return this.symbol.replace(/KRW$/, '/USDT');
    },
    s_local() {
      this.a_local = this.locale.split('-');
      return this.a_local[0];
    },
    s_up_bar() {
      return this.s_local === 'ko' ? this.red : (this.s_local === 'ja' ? this.red : this.green);
    },
    s_down_bar() {
      return this.s_local === 'ko' ? this.blue : (this.s_local === 'ja' ? this.blue : this.red);
    },
    s_base_up_bar() {
      return this.s_local === 'ko' ? this.baseRed : (this.s_local === 'ja' ? this.baseRed : this.baseGreen);
    },
    s_base_down_bar() {
      return this.s_local === 'ko' ? this.baseBlue : (this.s_local === 'ja' ? this.baseBlue : this.baseRed);
    }
  },
  watch: {
    s_symbol() {
      this.setSymbol();
    },
  },
  methods: {
    createChart() {
      const widgetOptions = {
        symbol: this.s_symbol,
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: DataFeed,
        interval: this.interval,
        theme: 'Dark',
        container_id: 'tv_chart_container',
        library_path: '/static/tradingview-master/tradingview/',
        locale: this.s_local || 'ko',
        timezone: 'Asia/Seoul',
        time_frames: [
          { text: '30d', resolution: '30', description: '30 Days' },
          { text: '5d', resolution: '30', description: '5 Days' },
          { text: '1d', resolution: '1', description: '1 Days' },
        ],
        disabled_features: [
          'header_layouttoggle',
          'header_compare',
          'header_symbol_search',
          'header_saveload'
        ],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        auto_save_delay: 1,
        overrides: {
          'mainSeriesProperties.style': 1,
          // Candles styles
          'mainSeriesProperties.candleStyle.upColor': this.s_up_bar,
          'mainSeriesProperties.candleStyle.downColor': this.s_down_bar,
          'mainSeriesProperties.candleStyle.drawWick': true,
          'mainSeriesProperties.candleStyle.drawBorder': true,
          'mainSeriesProperties.candleStyle.borderColor': '',
          'mainSeriesProperties.candleStyle.borderUpColor': this.s_up_bar,
          'mainSeriesProperties.candleStyle.borderDownColor': this.s_down_bar,
          'mainSeriesProperties.candleStyle.wickUpColor': this.s_up_bar,
          'mainSeriesProperties.candleStyle.wickDownColor': this.s_down_bar,
          'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,

          // Hollow Candles styles
          'mainSeriesProperties.hollowCandleStyle.upColor': this.s_up_bar,
          'mainSeriesProperties.hollowCandleStyle.downColor': this.s_down_bar,
          'mainSeriesProperties.hollowCandleStyle.drawWick': true,
          'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
          'mainSeriesProperties.hollowCandleStyle.borderColor': '',
          'mainSeriesProperties.hollowCandleStyle.borderUpColor': this.s_up_bar,
          'mainSeriesProperties.hollowCandleStyle.borderDownColor': this.s_down_bar,
          'mainSeriesProperties.hollowCandleStyle.wickUpColor': this.s_up_bar,
          'mainSeriesProperties.hollowCandleStyle.wickDownColor': this.s_down_bar,

          // Heikin Ashi styles
          'mainSeriesProperties.haStyle.upColor': this.s_up_bar,
          'mainSeriesProperties.haStyle.downColor': this.s_down_bar,
          'mainSeriesProperties.haStyle.drawWick': true,
          'mainSeriesProperties.haStyle.drawBorder': true,
          'mainSeriesProperties.haStyle.borderColor': '',
          'mainSeriesProperties.haStyle.borderUpColor': this.s_up_bar,
          'mainSeriesProperties.haStyle.borderDownColor': this.s_down_bar,
          'mainSeriesProperties.haStyle.wickUpColor': this.s_up_bar,
          'mainSeriesProperties.haStyle.wickDownColor': this.s_down_bar,
          'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,

          // Bar styles
          'mainSeriesProperties.barStyle.upColor': this.s_up_bar,
          'mainSeriesProperties.barStyle.downColor': this.s_down_bar,
          'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
          'mainSeriesProperties.barStyle.dontDrawOpen': false,

          // Line styles
          'mainSeriesProperties.lineStyle.color': this.blue,
          'mainSeriesProperties.lineStyle.linewidth': 2,
          'mainSeriesProperties.lineStyle.priceSource': 'close',

          // Baseline styles
          'mainSeriesProperties.baselineStyle.baselineColor': 'rgba( 117, 134, 150, 1)',
          'mainSeriesProperties.baselineStyle.topFillColor1': this.s_base_up_bar[0],
          'mainSeriesProperties.baselineStyle.topFillColor2': this.s_base_up_bar[1],
          'mainSeriesProperties.baselineStyle.bottomFillColor1': this.s_base_down_bar[1],
          'mainSeriesProperties.baselineStyle.bottomFillColor2': this.s_base_down_bar[0],
          'mainSeriesProperties.baselineStyle.topLineColor': this.s_base_up_bar[2],
          'mainSeriesProperties.baselineStyle.bottomLineColor': this.s_base_down_bar[2],
          'mainSeriesProperties.baselineStyle.topLineWidth': 2,
          'mainSeriesProperties.baselineStyle.bottomLineWidth': 2,
          'mainSeriesProperties.baselineStyle.priceSource': 'close',
          'mainSeriesProperties.baselineStyle.transparency': 50,
          'mainSeriesProperties.baselineStyle.baseLevelPercentage': 50
        }
      };
      // eslint-disable-next-line new-cap
      const tvWidget = new widget(widgetOptions);
        tvWidget.onChartReady(() => {
        // custom css
        tvWidget.addCustomCSSFile('css/custom.css')
        // // get sessionstorage
        // const tradingviewSetting = sessionStorage.getItem('tradingviewSetting');
        // const parseDate = JSON.parse(tradingviewSetting)
        // // check sessionstorage
        // if(parseDate) {
        //   // load chart's data
        //   tvWidget.load(parseDate)
        // }
        // // when the device is mobile, remove a sessionStorage
        // if(this.mobile && tvWidget.activeChart().symbol() === this.s_symbol) {
        //   sessionStorage.removeItem('tradingviewSetting')
        // }
        // // save chart's data in sessionstorage

        // tvWidget.subscribe('onAutoSaveNeeded', () => {
        //   tvWidget.save(function(data) {
        //     sessionStorage.setItem('tradingviewSetting', JSON.stringify(data));
        //   })
        // })
      });
      this.tvWidget = tvWidget;
    },
    setSymbol() {
      this.tvWidget.setSymbol(this.s_symbol, this.interval)
    },
    setChart() {
      this.$emit('setChart');
    },
  },
}
</script>

<style lang="scss" scoped>
  .TVChartContainer {
    border-top: 2px solid #eee;
    transition:height 0.4s cubic-bezier(.37,-0.36,.06,.99);
    height: 693px;
  }
  @media (max-width:1598px) {
    .TVChartContainer{
        height:601px;
    }    
  }

</style>
