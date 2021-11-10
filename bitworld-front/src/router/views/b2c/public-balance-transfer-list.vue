<script>
import { fetchPublicBalanceTransferList } from '@apis/market'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import PageNavigation from '@components/page-navigation'

export default {
  page: {
    title: 'PublicBalanceTransferList',
    meta: [{ name: 'description', content: 'PublicBalanceTransferList' }],
  },
  components: { PageNavigation },

  data() {
    return {
      transfer_list: [],
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
      this.loadBalanceTransferList()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadBalanceTransferList()
  },
  methods: {
    fromPairs,
    date,
    async loadBalanceTransferList() {
      const ret_obj = await fetchPublicBalanceTransferList({
        ...this.$route.query,
      })

      this.transfer_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
  },
}
</script>

<template>
  <section class="main">
    <h2 class="page-name">{{ $t('header.Balance_transfer_history') }}</h2>
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
            <th>{{ $t('b2c_exchange.account_number') }}</th>
            <th>{{ $t('b2c_exchange.moving_quantity') }}</th>
            <th>{{ $t('b2c_exchange.registration_date') }}</th>
            <th>{{ $t('b2c_exchange.division') }}</th>
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
              <template v-for="transfer in transfer_list">
                <tr :key="`${transfer.seq}-1`">
                  <td>{{ transfer.market_title }}</td>
                  <td>{{ transfer.account_number }}</td>
                  <td>{{ transfer.amount }}</td>
                  <td>{{ date('Y.m.d H:i:s', new Date(transfer.regdate)) }}</td>
                  <td>{{
                    fromPairs(
                      constants.market.public_balance_transfer.transfer_type
                    )[transfer.transfer_type]
                  }}</td>
                </tr>
              </template>
              <template v-if="!transfer_list.length">
                <tr>
                  <td colspan="5">
                    {{ $t('header.no_balance_transfer_history') }}
                  </td>
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
