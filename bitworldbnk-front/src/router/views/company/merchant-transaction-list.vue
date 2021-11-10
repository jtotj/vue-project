<script>
import { fetchMerchantTransactionList, fetchTransactionList } from '@apis/pg'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import PageNavigation from '@components/page-navigation'

export default {
  page: {
    title: 'MerchantTransactionList',
    meta: [{ name: 'description', content: 'MerchantTransactionList' }],
  },
  components: { PageNavigation },
  data() {
    return {
      transaction_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      loading: false,

      /* 검색 */
      merchant_title: [
        ['title', this.$t('dash.trade_name')],
        ['transaction_id', this.$t('dash.trade_id')],
      ],
      search_payer_name: this.$t('dash.pay_person'),
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    // c_search_merchant() {
    //   let search_merchant = this.transaction_list
    //   if (this.data_search.shop_title_search) {
    //     search_merchant = filter(search_merchant, (list) =>
    //       list.title
    //         .toLowerCase()
    //         .includes(this.data_search.shop_title_search.toLowerCase())
    //     )
    //   }
    //   if (this.data_search.shop_id_search) {
    //     search_merchant = filter(search_merchant, (list) =>
    //       list.transaction_id
    //         .toLowerCase()
    //         .includes(this.data_search.shop_id_search.toLowerCase())
    //     )
    //   }
    //   if (this.data_search.pg_state_value) {
    //     search_merchant = filter(
    //       search_merchant,
    //       (list) => list.status === this.data_search.pg_state_value
    //     )
    //   }
    //   if (this.data_search.pg_transaction_type) {
    //     search_merchant = filter(
    //       search_merchant,
    //       (list) =>
    //         list.transaction_type === this.data_search.pg_transaction_type
    //     )
    //   }
    //   if (
    //     this.data_search.trade_amount_min ||
    //     this.data_search.trade_amount_max
    //   ) {
    //     search_merchant = filter(
    //       search_merchant,
    //       (list) =>
    //         Number(list.amount) >= Number(this.data_search.trade_amount_min) &&
    //         Number(list.amount) <= Number(this.data_search.trade_amount_max)
    //     )
    //   }

    //   return search_merchant
    // },
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      if (this.$route.params.merchant_seq) {
        this.loadMerchantTransactionList()
      } else {
        this.loadTransactionList()
      }
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    if (this.$route.params.merchant_seq) {
      this.loadMerchantTransactionList()
    } else {
      this.loadTransactionList()
    }
  },
  methods: {
    date,
    fromPairs,
    async loadMerchantTransactionList() {
      this.loading = true
      const ret_obj = await fetchMerchantTransactionList(
        /* pg.js params값 제대로 안넘어감 메서드 확인하고 메서드에 맞게 수정해야함. */
        this.$route.params.merchant_seq,
        {
          ...this.$route.query,
        }
      )
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.transaction_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    async loadTransactionList() {
      this.loading = true
      const ret_obj = await fetchTransactionList({
        ...this.$route.query,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.transaction_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    goTransactionDetail(row) {
      if (this.$route.params.merchant_seq) {
        this.$router.push({
          name: 'transaction-detail',
          query: { transaction_seq: row.seq, merchant_seq: row.merchant_seq },
        })
      } else {
        this.$router.push({
          name: 'transaction-detail',
          query: { transaction_seq: row.seq },
        })
      }
    },
    mobileGoTransaction(seq, merchant_seq) {
      if (this.$route.params.merchant_seq) {
        this.$router.push({
          name: 'transaction-detail',
          query: { transaction_seq: seq, merchant_seq: merchant_seq },
        })
      } else {
        this.$router.push({
          name: 'transaction-detail',
          query: { transaction_seq: seq },
        })
      }
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('shop.shop_history') }}</h2>
      </div>
      <section id="travel">
        <div v-loading="loading" class="box-wrap">
          <div :class="[$style.transactionWrap]">
            <!-- 거래내역 pc -->
            <div class="pc-tabel hide-desktop">
              <el-table
                :data="transaction_list"
                class="hide-mobile transaction-table"
                @row-click="goTransactionDetail"
              >
                <el-table-column :label="$t('shop.shop_cre_date')">
                  <template slot-scope="scope">{{
                    date('Y-m-d H:i:s', new Date(scope.row.regdate))
                  }}</template>
                </el-table-column>
                <el-table-column
                  :label="$t('dash.trade_name')"
                  prop="title"
                ></el-table-column>
                <el-table-column
                  :label="$t('dash.trade_id')"
                  prop="transaction_id"
                ></el-table-column>
                <el-table-column
                  :label="$t('dash.pay_person')"
                  prop="payer_name"
                ></el-table-column>
                <el-table-column :label="$t('dash.trade_amount')" prop="amount">
                  <template slot-scope="scope">
                    {{ scope.row.amount | codeDecimal(scope.row.asset_code) }}
                    {{ scope.row.asset_code }}
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('dash.transaction_type')"
                  prop="transaction_type"
                >
                  <template slot-scope="scope">
                    {{
                      fromPairs(constants.pg.transaction.transaction_type)[
                        scope.row.transaction_type
                      ]
                    }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('status')">
                  <template slot-scope="scope">
                    {{
                      fromPairs(constants.pg.transaction.status)[
                        scope.row.status
                      ]
                    }}
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 거래내역 mobile -->
            <div class="mobile-table hide-desktop">
              <div
                v-for="data in transaction_list"
                :key="data.seq"
                :class="[$style.listWrap]"
              >
                <div :class="[$style.listBody]">
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">
                      {{ $t('dash.trade_name') }}
                    </span>
                    <span :class="[$style.bodyContent]">
                      {{ data.title }}
                    </span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('shop.shop_cre_date')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{
                      date('Y-m-d H:i:s', new Date(data.regdate))
                    }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('dash.trade_id')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{
                      data.transaction_id
                    }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('dash.pay_person')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{
                      data.payer_name
                    }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('dash.trade_amount')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{ data.amount }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('dash.transaction_type')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{
                      fromPairs(constants.pg.transaction.transaction_type)[
                        data.transaction_type
                      ]
                    }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{ $t('status') }}</span>
                    <span :class="[$style.bodyContent]">{{
                      fromPairs(constants.pg.transaction.status)[data.status]
                    }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{ $t('detail') }}</span>
                    <span :class="[$style.bodyContent]"
                      ><button
                        class="transaction-detail-btn"
                        @click="
                          mobileGoTransaction(data.seq, data.merchant_seq)
                        "
                        >{{ $t('dash.detail_show') }}</button
                      ></span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PageNavigation
          :total_count="total_count"
          :total_page="page_navigation.total_page"
          :cur_page="page"
          :page_count="page_navigation.page_count"
        ></PageNavigation>
      </section>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/merchant-transaction-list.scss';
</style>

<style scoped>
.mobile-table.hide-desktop {
  display: none;
}

@media (max-width: 768px) {
  .mobile-table.hide-desktop {
    display: block;
  }
  .pc-tabel.hide-desktop {
    display: none;
  }
}
</style>
