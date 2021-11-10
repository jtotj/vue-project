<script>
import { fetchPublicTradeList } from '@apis/market'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import PageNavigation from '@components/page-navigation'
import Decimal from 'decimal.js'

export default {
  page: {
    title: 'PublicTradeList',
    meta: [{ name: 'description', content: 'PublicTradeList' }],
  },
  components: { PageNavigation },
  data() {
    return {
      trade_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.loadTradeList()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadTradeList()
  },
  methods: {
    fromPairs,
    Decimal,
    date,
    async loadTradeList() {
      const ret_obj = await fetchPublicTradeList({
        ...this.$route.query,
      })

      this.trade_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
  },
}
</script>

<template>
  <section class="main">
    <h2 class="page-name">{{ $t('shop.shop_history') }}</h2>
    <div :class="[$style.orderDate]">
      <table :class="[$style.orderTable]">
        <colgroup>
          <col width="12%" />
          <col width="11%" />
          <col width="11%" />
          <col width="11%" />
          <col width="11%" />
        </colgroup>
        <thead>
          <tr>
            <th>{{ $t('b2c_exchange.market_name') }}</th>
            <th>{{ $t('b2c_exchange.execution_time') }}</th>
            <th>{{ $t('b2c_exchange.execution_price') }}</th>
            <th>{{ $t('b2c_exchange.execution_quantity') }}</th>
            <th>{{ $t('b2c_exchange.execution_amount') }}</th>
          </tr>
        </thead>
      </table>
      <div :class="[$style.tableScrollY]">
        <PerfectScrollbar :class="[$style.perfectScrollbar]">
          <table :class="[$style.orderTable]">
            <colgroup>
              <col width="12%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
            </colgroup>
            <tbody>
              <template v-for="trade in trade_list">
                <tr :key="`${trade.seq}-1`">
                  <td>{{ trade.market_title }}</td>
                  <td>{{ date('Y.m.d H:i:s', new Date(trade.regdate)) }}</td>
                  <td>{{ trade.price }}</td>
                  <td>{{ trade.amount }}</td>
                  <td>{{
                    new Decimal(trade.price).mul(trade.amount).toString()
                  }}</td>
                </tr>
              </template>
              <template v-if="!trade_list.length">
                <tr>
                  <td colspan="5">{{ $t('shop.no_shop_history') }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </PerfectScrollbar>
      </div>
      <PageNavigation
        :total_count="total_count"
        :total_page="page_navigation.total_page"
        :cur_page="page"
        :page_count="page_navigation.page_count"
      ></PageNavigation>
    </div>
  </section>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/balance-transfer-list.scss';
</style>
