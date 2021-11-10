<script>
import { fetchPublicKlines } from '@apis/market'
import { encodeRoomName } from '@utils/socket'
import difference from 'lodash/difference'
import find from 'lodash/find'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  props: {
    market_seq: {
      type: Number,
      default: 2,
    },
    interval_type: {
      type: String,
      default: '',
    },
    chart_style: {
      type: String,
      default: 'candle',
    },
    s_studies: {
      type: Array,
      default: () => [],
    },
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /* 차트 */
      CIQ: null,
      loading: true,
      is_inited: false,
      market_info: null,
      last_suggested_start_date: null,
      stxx: null,
      added_study: [],
    }
  },
  computed: {
    ...mapGetters('marketPublic', ['s_market_info']),
  },
  watch: {
    market_seq() {
      this.loadMarketInfo()
    },
    interval_type(to) {
      this.changeIntervalType(to)
    },
    chart_style(to) {
      this.changeChartStyle(to)
    },
    s_studies(to, from) {
      var removed = difference(from, to)
      var added = difference(to, from)
      this.addedStduy(added)

      if (!removed.length) return
      this.removedStudy(removed)
    },
  },
  created() {
    this.init()
  },
  sockets: {
    connect() {
      this.socketSubscribeRequest()
    },
  },
  beforeDestroy() {
    this.socketSubscribe(true)
  },
  methods: {
    init() {
      this.loading = true
      this.loadMarketInfo()
        .then(() => Promise.all([this.loadChartLib()]))
        .then(() => this.socketSubscribe())
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    addedStduy(added) {
      var added_study = {}

      added.forEach((val) => {
        if (val === 'ma') {
          added_study = this.s_studies[val] = this.CIQ.Studies.addStudy(
            this.stxx,
            val,
            {
              Period: 20,
            }
          )
        } else {
          added_study = this.s_studies[val] = this.CIQ.Studies.addStudy(
            this.stxx,
            val
          )
        }
      })
      this.added_study.push(added_study)
    },
    removedStudy(removed) {
      var removed_study = removed.toString()

      var removed_find = find(this.added_study, { type: removed_study })

      removed.forEach((val) => {
        this.CIQ.Studies.removeStudy(this.stxx, removed_find)
      })
    },
    updateActiveStudy() {
      let active_studies

      active_studies = _.chain(this.stxx.layout.studies)
        .keys()
        .map((n) => {
          let re = /[(]/g
          let re_string = n.search(re)

          if (re_string !== -1) {
            n = n.slice(0, re_string).trim()
          }
          return n
        })
        .value()

      return active_studies
    },
    // getStudyList() {
    //   return this.CIQ.Studies.getStudyList()
    // },
    changeIntervalType() {
      this.loading = true

      this.stxx.setPeriodicity(
        this.intervalTypeToPeriodicity(this.interval_type),
        () => {
          this.loading = false
        }
      )
    },

    changeChartStyle() {
      this.stxx.setChartType(this.chart_style)
    },
    async loadChartLib() {
      await import('@/vendor/chartiq/css/stx-chart.css')
      const { CIQ } = await import('@/vendor/chartiq/js/chartiq.js')

      this.CIQ = CIQ
      this.is_inited = true

      this.createChart()
    },
    createQuoteFeed() {
      return {
        fetchInitialData: this.fetchData(),
        fetchPaginationData: this.fetchData(true),
      }
    },
    intervalTypeToPeriodicity(interval_type) {
      const interval_types = {
        '1M': { period: 1, timeUnit: 'minute' },
        '3M': { period: 1, timeUnit: 'minute', interval: 3 },
        '5M': { period: 1, timeUnit: 'minute', interval: 5 },
        '15M': { period: 1, timeUnit: 'minute', interval: 15 },
        '30M': { period: 1, timeUnit: 'minute', interval: 30 },
        '1H': { period: 2, timeUnit: 'minute', interval: 30 },
        '2H': { period: 4, timeUnit: 'minute', interval: 30 },
        '4H': { period: 8, timeUnit: 'minute', interval: 30 },
        '6H': { period: 12, timeUnit: 'minute', interval: 30 },
        '8H': { period: 16, timeUnit: 'minute', interval: 30 },
        '12H': { period: 20, timeUnit: 'minute', interval: 30 },
        '1D': { period: 1, timeUnit: 'day' },
        '3D': { period: 3, timeUnit: 'day' },
        '1W': { period: 1, timeUnit: 'week' },
        '1MTH': { period: 1, timeUnit: 'month' },
      }

      return { ...interval_types[interval_type], interval_type }
    },
    async loadMarketInfo() {
      const market_info = await this.$store.dispatch(
        'marketPublic/getMarket',
        this.market_seq
      )

      this.market_info = market_info
    },
    createChart() {
      const stxx = new this.CIQ.ChartEngine({
        container: this.$refs.chartContainer,
        preferences: { labels: true, currentPriceLine: true, whitespace: 0 },
      })

      // Attach an automated quote feed to the chart to handle initial load, pagination and updates at preset intervals.
      stxx.attachQuoteFeed(this.createQuoteFeed(), {
        refreshInterval: 0,
        bufferSize: 200,
      })
      stxx.chart.defaultPlotField = 'Close'
      stxx.chart.symbolDisplay = `${this.market_info.title} (${
        this.market_info.code
      })`
      stxx.setPeriodicity(this.intervalTypeToPeriodicity(this.interval_type))
      stxx.setChartType(this.chartStyle)
      stxx.layout.crosshair = true
      stxx.setChartType('candle')
      this.loading = true
      stxx.newChart(this.market_info.code, null, null, () => {
        this.loading = false
      })

      this.stxx = stxx
    },
    fetchData(use_pagination = false) {
      return (
        symbol,
        suggestedStartDate,
        suggestedEndDate,
        { interval_type, ...params },
        cb
      ) => {
        if (!use_pagination) this.last_suggested_start_date = null

        // const moreAvailable = !this.last_suggested_start_date || this.last_suggested_start_date.getTime() > (new Date(this.market_info.regdate).getTime())

        this.last_suggested_start_date = suggestedStartDate

        fetchPublicKlines({
          interval_type: this.interval_type,
          market_seq: this.market_seq,
          limit: 1000,
          start_time: use_pagination ? suggestedStartDate : null,
          end_time: use_pagination ? suggestedEndDate : null,
        })
          .then(({ data }) => {
            cb({
              quotes: this.formatChartData(data),
              moreAvailable: false,
              attribution: {
                source: 'real',
                exchange: 'REAL-TIME',
              },
            })
          })
          .catch((error) => {
            cb({ error: error.message })
          })
      }
    },
    formatChartData(feeddata) {
      const newQuotes = []
      for (const val of feeddata) {
        newQuotes.push({
          DT: new Date(val.open_time),
          Open: val.open * 1,
          High: val.high * 1,
          Low: val.low * 1,
          Close: val.close * 1,
          Volume: val.volume,
        })
      }
      return newQuotes
    },
    socketSubscribeRequest() {
      const market_seq = this.market_seq

      this.$socket.client.emit('subscribe', {
        room_name: encodeRoomName('aggtrade', { market_seq }),
      })
    },
    socketSubscribe(off = false) {
      const method = off ? 'off' : 'on'
      this.$socket.client[method]('public_market.aggtrade', this.onAggtrade)
    },
    onAggtrade(data) {
      if (data.market_seq !== this.market_seq) return

      this.stxx.updateChartData(
        {
          Close: data.price * 1,
          Volume: data.amount * 1,
          DT: new Date(),
        },
        null,
        {
          fillGaps: true,
          useAsLastSale: true,
        }
      )
    },
  },
}
</script>

<template>
  <div :id="$style.mobile">
    <div v-if="mobile" :class="$style.marketPrice">
      <dl>
        <dt>{{ $t('b2c_exchange.auxiliary_indicator') }}</dt>
        <dd
          ><button
            :class="$style.marketSubSelect"
            @click="show_study_modal = true"
            >{{ $t('select') }}</button
          ></dd
        >
      </dl>
      <dl>
        <dt>{{ $t('b2c_exchange.rod_type') }}</dt>
        <dd>
          <el-select v-model="interval_type" class="market-price-select">
            <el-option
              v-for="(val, idx) in interval_types"
              :key="idx"
              :value="val.title"
              :label="val.title"
              >{{ val.title }}</el-option
            >
          </el-select>
        </dd>
      </dl>
      <dl>
        <dt>{{ $t('b2c_exchange.chart_type') }}</dt>
        <dd>
          <el-select v-model="chart_style" class="market-price-select">
            <el-option
              v-for="[style, title] in chart_styles"
              :key="title"
              :value="style"
              >{{ title }}</el-option
            >
          </el-select>
        </dd>
      </dl>
      <el-dialog
        :visible.sync="show_study_modal"
        :title="$t('b2c_exchange.unlimited_number')"
      >
        <div>
          <el-checkbox-group v-model="s_studies" class="study-checkbox">
            <el-checkbox
              v-for="(name, title) in getStudyList()"
              :key="title"
              :label="title"
            ></el-checkbox>
          </el-checkbox-group>
          <div :class="$style.studyButtonArea">
            <button
              :class="$style.studyButton"
              @click="show_study_modal = false"
              >{{ $t('b2c_exchange.save') }}</button
            >
          </div>
        </div>
      </el-dialog>
      <!-- <div :class="$style.marketPrice">
        <dl>
          <dt>보조지표</dt>
          <dd
            ><button
              :class="$style.marketSubSelect"
              @click="show_study_modal = true"
              >선택</button
            ></dd
          >
        </dl>
        <dl>
          <dt>봉유형</dt>
          <dd>
            <el-select v-model="s_interval_type" class="market-price-select">
              <el-option
                v-for="(val, idx) in interval_types"
                :key="idx"
                :value="val.title"
                :label="val.title"
                >{{ val.title }}</el-option
              >
            </el-select>
          </dd>
        </dl>
        <dl>
          <dt>차트유형</dt>
          <dd>
            <el-select v-model="s_chart_style" class="market-price-select">
              <el-option
                v-for="[style, title] in chart_styles"
                :key="title"
                :value="style"
                >{{ title }}</el-option
              >
            </el-select>
          </dd>
        </dl>
        <el-dialog
          :visible.sync="show_study_modal"
          title="복수의 보조지표를 무제한으로 선택하실 수 있습니다."
        >
          <div>
            <el-checkbox-group
              v-if="$refs.chart"
              v-model="s_studies"
              class="study-checkbox"
            >
              <el-checkbox
                v-for="(name, title) in $refs.chart.getStudyList()"
                :key="title"
                :label="title"
              ></el-checkbox>
            </el-checkbox-group>
            <div :class="$style.studyButtonArea">
              <button
                :class="$style.studyButton"
                @click="show_study_modal = false"
                >저장</button
              >
            </div>
          </div>
        </el-dialog>
      </div> -->
    </div>
    <div :class="[$style.chart]">
      <div
        ref="chartContainer"
        v-loading="loading || !is_inited"
        style=" position: relative; width: 100%; height: 100%;"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/b2c-m-exchange.scss';
@import '@src/design/b2c/common.scss';
</style>
