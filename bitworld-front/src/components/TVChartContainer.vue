<template>
  <div>
    <div
      id="trading-view"
      v-loading="loading || !is_inited"
      :class="$style.tradingView"
    />
  </div>
</template>

<script>
import { widget } from '../../public/tradingview-master/tradingview'
import { mapState } from 'vuex'
import { fetchPublicKlines } from '@apis/market'
import { encodeRoomName } from '@utils/socket'
import split from 'lodash/split'

export default {
  name: 'TVChartContainer',
  props: {
    market_seq: {
      default: 2,
      type: Number,
    },
    mobile: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      loading: true,
      is_inited: false,
      channel_string: null,
      last_bar: null,
      subs: [],
      sub: null,
      history: {},
      market_info: null,
      tvWidget: null,
      listen_events: ['marketUpdate'],
      red: '#d24f45',
      blue: '#1261c4',
      green: '#26a69a',
      baseGreen: [
        'rgba( 38, 166, 154, 0.28)',
        'rgba( 38, 166, 154, 0.05)',
        'rgba( 38, 166, 154, 1)',
      ],
      baseRed: [
        'rgba( 210, 79, 79, 0.28)',
        'rgba( 210, 79, 79, 0.05)',
        'rgba( 210, 79, 79, 1)',
      ],
      baseBlue: [
        'rgba( 18, 97, 196, 0.28)',
        'rgba( 18, 97, 196, 0.05)',
        'rgba( 18, 97, 196, 1)',
      ],
    }
  },
  computed: {
    ...mapState('common', ['locale']),

    c_local() {
      return split(this.locale, '-', 1).toString()
    },
    c_up_bar() {
      return this.c_local === 'ko'
        ? this.red
        : this.c_local === 'ja'
        ? this.red
        : this.green
    },
    c_down_bar() {
      return this.c_local === 'ko'
        ? this.blue
        : this.c_local === 'ja'
        ? this.blue
        : this.red
    },
    c_base_up_bar() {
      return this.c_local === 'ko'
        ? this.baseRed
        : this.c_local === 'ja'
        ? this.baseRed
        : this.baseGreen
    },
    c_base_down_bar() {
      return this.c_local === 'ko'
        ? this.baseBlue
        : this.c_local === 'ja'
        ? this.baseBlue
        : this.baseRed
    },
  },
  watch: {
    market_seq() {
      this.loadMarketInfo()
    },
  },
  sockets: {
    connect() {
      this.socketSubscribeRequest()
    },
  },
  beforeDestroy() {
    this.socketSubscribe(true)
    this.destroyed()
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.loadMarketInfo()
        .then(() => {
          this.createChart()
        })
        .then(() => {
          this.socketSubscribe()
        })
        .finally(() => {
          this.loading = false
        })
    },
    dataFeed() {
      // resolutions
      const supportedResolutions = [
        '1',
        '3',
        '5',
        '15',
        '30',
        '60',
        '120',
        '240',
        '1D',
      ]
      const config = {
        supported_resolutions: supportedResolutions,
      }

      let that = this
      // data feed obj
      const dataFeed = {
        onReady: (cb) => {
          setTimeout(() => cb(config), 0)
        },
        searchSymbols: (
          userInput,
          exchange,
          symbolType,
          onResultReadyCallback
        ) => {},
        resolveSymbol: (
          symbolName,
          onSymbolResolvedCallback,
          onResolveErrorCallback
        ) => {
          var symbol_stub = {
            name: this.market_info.title,
            description: this.market_info.title,
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            ticker: this.market_info.title,
            exchange: 'bit-world',
            minmov: 1,
            pricescale: 1000,
            has_intraday: true,
            intraday_multipliers: ['1', '60'],
            supported_resolution: supportedResolutions,
            volume_precision: 8,
            data_status: 'streaming',
            currency_code: 'CCF',
          }

          setTimeout(function() {
            onSymbolResolvedCallback(symbol_stub)
          }, 0)
        },
        getBars: function(
          symbolInfo,
          resolution,
          from,
          to,
          onHistoryCallback,
          onErrorCallback,
          firstDataRequest
        ) {
          that
            .historyProvider(
              symbolInfo,
              resolution,
              from,
              to,
              onHistoryCallback,
              onErrorCallback,
              firstDataRequest
            )
            .then((bars) => {
              if (bars.length) {
                onHistoryCallback(bars, { noData: false })
              } else {
                onHistoryCallback(bars, { noData: true })
              }
            })
            .catch((err) => {
              onErrorCallback(err)
            })
        },
        subscribeBars: function(
          symbolInfo,
          resolution,
          onRealtimeCallback,
          subscribeUID,
          onResetCacheNeededCallback
        ) {
          that.subscribeBars(
            symbolInfo,
            resolution,
            onRealtimeCallback,
            subscribeUID,
            onResetCacheNeededCallback
          )
        },
        unsubscribeBars: function(subscriberUID) {
          that.unsubscribeBars(subscriberUID)
        },
      }
      return dataFeed
    },
    historyProvider(symbolInfo, resolution, from, to, first, limit) {
      var intervals = null

      switch (resolution) {
        case '1':
          intervals = '1M'
          break
        case '60':
          intervals = '1H'
          break
        case '1D':
          intervals = resolution
          break
      }

      const periodParams = {
        intervals: intervals,
        from: new Date(from * 1000),
        to: new Date(to * 1000),
      }

      const ohlc = fetchPublicKlines({
        interval_type: intervals,
        market_seq: this.market_seq,
        limit: 1000,
        start_time: periodParams.from,
        end_time: periodParams.to,
      }).then(({ data }) => {
        if (data.error === 1) {
          this.$toasted.error(data.error)
          return []
        }
        if (!data.length) {
          // console.log('asset data is empty')
          return []
        }
        if (data.length) {
          var bars = data.map((el) => {
            return {
              time: new Date(el.open_time).getTime(),
              low: el.low,
              high: el.high,
              open: el.open,
              close: el.close,
              volume: el.volume,
              is_bar_losed: false,
              is_last_bar: true,
            }
          })
          if (first) {
            this.last_bar = bars[bars.length - 1]
            this.history[symbolInfo.name] = { last_bar: this.last_bar }
          }
          return bars
        } else {
          return []
        }
      })
      return ohlc
    },
    subscribeBars(symbolInfo, resolution, updateCb, uid, resetCache) {
      this.channel_string = symbolInfo.name
      var newSub = {
        uid,
        resolution,
        symbolInfo,
        last_bar: this.history[symbolInfo.name].last_bar,
        listener: updateCb,
      }
      let subs = []
      subs[symbolInfo.name] = newSub
      this.subs = subs
      this.socketSubscribe()
    },
    unsubscribeBars(uid) {
      var subIndex = this.subs.findIndex((e) => e.c === uid)
      if (subIndex === -1) {
        return
      }
      this.sub = this.subs[subIndex]
      this.subs.splice(subIndex, 1)
    },
    socketSubscribeRequest() {
      const market_seq = this.market_seq

      this.$socket.client.emit('subscribe', {
        room_name: encodeRoomName('aggtrade', { market_seq }),
      })
    },
    socketSubscribe(off = false) {
      const method = off ? 'off' : 'on'
      this.$socket.client[method]('public_market.aggtrade', this.handleEvent)
    },
    handleEvent(data) {
      if (this.market_seq !== data.market_seq) return

      this.sub = this.subs[this.channel_string]
      var nowTime = new Date().getTime()
      if (nowTime < this.sub.last_bar.time) {
        return
      }
      this.last_bar = this.updateBar(data, this.sub, nowTime)
      // update bar
      this.sub.listener(this.last_bar)
      // update our own record of last_bar
      this.sub.last_bar = this.last_bar
    },
    updateBar(data, sub, nowTime) {
      var last_bar = sub.last_bar
      if (nowTime >= last_bar.time) {
        var _last_bar = {
          time: nowTime,
          open: last_bar.close,
          high: last_bar.close,
          low: last_bar.close,
          close: data.price,
          volume: 1,
        }
      } else {
        // update last_bar candle!
        if (data.price < last_bar.low) {
          last_bar.low = data.price
        } else if (data.price > last_bar.high) {
          last_bar.high = data.price
        }

        last_bar.volume = 1
        last_bar.close = data.price
        _last_bar = last_bar
      }
      return _last_bar
    },
    createChart() {
      const widgetOptions = {
        symbol: this.market_info.title,
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: this.dataFeed(),
        interval: '30',
        container_id: 'trading-view',
        library_path: '/tradingview-master/tradingview/',
        locale: this.c_local || 'ko',
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
          'header_saveload',
          'create_volume_indicator_by_default',
        ],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        auto_save_delay: 1,
        overrides: {
          'mainSeriesProperties.style': 1,
          // Candles styles
          'mainSeriesProperties.candleStyle.upColor': this.c_up_bar,
          'mainSeriesProperties.candleStyle.downColor': this.c_down_bar,
          'mainSeriesProperties.candleStyle.drawWick': true,
          'mainSeriesProperties.candleStyle.drawBorder': true,
          'mainSeriesProperties.candleStyle.borderColor': '',
          'mainSeriesProperties.candleStyle.borderUpColor': this.c_up_bar,
          'mainSeriesProperties.candleStyle.borderDownColor': this.c_down_bar,
          'mainSeriesProperties.candleStyle.wickUpColor': this.c_up_bar,
          'mainSeriesProperties.candleStyle.wickDownColor': this.c_down_bar,
          'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,

          // Hollow Candles styles
          'mainSeriesProperties.hollowCandleStyle.upColor': this.c_up_bar,
          'mainSeriesProperties.hollowCandleStyle.downColor': this.c_down_bar,
          'mainSeriesProperties.hollowCandleStyle.drawWick': true,
          'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
          'mainSeriesProperties.hollowCandleStyle.borderColor': '',
          'mainSeriesProperties.hollowCandleStyle.borderUpColor': this.c_up_bar,
          'mainSeriesProperties.hollowCandleStyle.borderDownColor': this
            .c_down_bar,
          'mainSeriesProperties.hollowCandleStyle.wickUpColor': this.c_up_bar,
          'mainSeriesProperties.hollowCandleStyle.wickDownColor': this
            .c_down_bar,

          // Heikin Ashi styles
          'mainSeriesProperties.haStyle.upColor': this.c_up_bar,
          'mainSeriesProperties.haStyle.downColor': this.c_down_bar,
          'mainSeriesProperties.haStyle.drawWick': true,
          'mainSeriesProperties.haStyle.drawBorder': true,
          'mainSeriesProperties.haStyle.borderColor': '',
          'mainSeriesProperties.haStyle.borderUpColor': this.c_up_bar,
          'mainSeriesProperties.haStyle.borderDownColor': this.c_down_bar,
          'mainSeriesProperties.haStyle.wickUpColor': this.c_up_bar,
          'mainSeriesProperties.haStyle.wickDownColor': this.c_down_bar,
          'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,

          // Bar styles
          'mainSeriesProperties.barStyle.upColor': this.c_up_bar,
          'mainSeriesProperties.barStyle.downColor': this.c_down_bar,
          'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
          'mainSeriesProperties.barStyle.dontDrawOpen': false,

          // Line styles
          'mainSeriesProperties.lineStyle.color': this.blue,
          'mainSeriesProperties.lineStyle.linewidth': 2,
          'mainSeriesProperties.lineStyle.priceSource': 'close',

          // Baseline styles
          'mainSeriesProperties.baselineStyle.baselineColor':
            'rgba( 117, 134, 150, 1)',
          'mainSeriesProperties.baselineStyle.topFillColor1': this
            .c_base_up_bar[0],
          'mainSeriesProperties.baselineStyle.topFillColor2': this
            .c_base_up_bar[1],
          'mainSeriesProperties.baselineStyle.bottomFillColor1': this
            .c_base_down_bar[1],
          'mainSeriesProperties.baselineStyle.bottomFillColor2': this
            .c_base_down_bar[0],
          'mainSeriesProperties.baselineStyle.topLineColor': this
            .c_base_up_bar[2],
          'mainSeriesProperties.baselineStyle.bottomLineColor': this
            .c_base_down_bar[2],
          'mainSeriesProperties.baselineStyle.topLineWidth': 2,
          'mainSeriesProperties.baselineStyle.bottomLineWidth': 2,
          'mainSeriesProperties.baselineStyle.priceSource': 'close',
          'mainSeriesProperties.baselineStyle.transparency': 50,
          'mainSeriesProperties.baselineStyle.baseLevelPercentage': 50,
        },
      }
      // eslint-disable-next-line new-cap
      const tvWidget = new widget(widgetOptions)
      tvWidget.onChartReady(() => {
        tvWidget.addCustomCSSFile('css/custom.css')

        // // get localstorage
        // const tradingviewSetting = localStorage.getItem('tradingviewSetting')
        // const parseDate = JSON.parse(tradingviewSetting)
        // custom css
        // // check localstorage
        // if (parseDate) {
        //   // load chart's data
        //   tvWidget.load(parseDate)
        // }
        // // when the device is mobile, remove a localStorage
        // if (
        //   this.mobile &&
        //   tvWidget.activeChart().symbol() === this.market_info.title
        // ) {
        //   localStorage.removeItem('tradingviewSetting')
        // }
        // // save chart's data in localstorage
        // tvWidget.subscribe('onAutoSaveNeeded', () => {
        //   tvWidget.save(function(data) {
        //     localStorage.setItem('tradingviewSetting', JSON.stringify(data))
        //   })
        // })
      })
      this.tvWidget = tvWidget
    },
    async loadMarketInfo() {
      const market_info = await this.$store.dispatch(
        'marketPublic/getMarket',
        this.market_seq
      )
      this.market_info = market_info
    },
    destroyed() {
      if (this.tvWidget !== null) {
        this.tvWidget.remove()
        this.tvWidget = null
      }
    },
  },
}
</script>
<style lang="scss" module>
@import '@design';
.tradingView {
  float: left;
  width: 930px;
  height: 650px;
  margin: 0 10px 10px 0;
}
iframe {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .tradingView {
    width: 100%;
    height: calc(100vh - 266px);
  }
}
</style>
