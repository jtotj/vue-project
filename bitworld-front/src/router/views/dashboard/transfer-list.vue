<script>
import { fetchDirectTransfers } from '@apis/market'
import { mapState } from 'vuex'
import date from 'locutus/php/datetime/date'
import filter from 'lodash/filter'
import PageNavigation from '@components/page-navigation'
import fromPairs from 'lodash/fromPairs'

export default {
  page: {
    title: 'TransferList',
    meta: [{ name: 'description', content: 'TransferList' }],
  },
  components: { PageNavigation },
  data() {
    return {
      transfer_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      loading: false,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('auth', ['currentUser']),
    c_my_transfer_list() {
      return filter(this.transfer_list, {
        user_id: this.currentUser.user_id,
      })
    },
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.loadTransfers()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadTransfers()
  },
  methods: {
    async loadTransfers() {
      this.loading = true
      const ret_obj = await fetchDirectTransfers({
        ...this.$route.query,
        list_count: 10,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.transfer_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    date,
    fromPairs,
    goTransferDetail(p) {
      if (this.$route.path.indexOf('bank') !== -1) {
        this.$router.push({
          name: 'bank-transfer-detail',
          query: { seq: p },
        })
      } else {
        this.$router.push({
          name: 'transfer-detail',
          query: { seq: p },
        })
      }
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="foreground-container">
      <div class="contents">
        <div class="big-tit-wrap">
          <div class="container">
            <span class="big-tit">{{ $t('header.transfer_list') }}</span>
          </div>
        </div>
        <div class="trades-wrap">
          <div class="container">
            <div v-loading="loading" class="main-deal">
              <ul v-if="transfer_list.length" class="deal-list">
                <template v-for="transfer in transfer_list">
                  <li :key="transfer.seq" :class="['deal-act']">
                    <span class="number-badge">
                      {{ transfer._no }}
                    </span>
                    <div class="wrap">
                      <div class="left-info">
                        <strong class="tit"
                          >{{ transfer.source_asset_title }}/{{
                            transfer.target_asset_title
                          }}</strong
                        >
                        <ul class="short-list">
                          <li>
                            <span>{{ $t('registration_date') }}</span>
                            {{
                              date('Y-m-d H:i:s', new Date(transfer.regdate))
                            }}
                          </li>
                        </ul>
                      </div>
                      <div class="right-info">
                        <div class="multiple">
                          <strong
                            class="transfer-type"
                            :class="[
                              {
                                buy:
                                  fromPairs(
                                    constants.market.direct_transfer
                                      .transfer_type
                                  )[transfer.transfer_type] === '구매',
                              },
                              {
                                sell:
                                  fromPairs(
                                    constants.market.direct_transfer
                                      .transfer_type
                                  )[transfer.transfer_type] === '판매',
                              },
                            ]"
                          >
                            {{
                              fromPairs(
                                constants.market.direct_transfer.transfer_type
                              )[transfer.transfer_type]
                            }}</strong
                          >
                          <div class="act-wrap">
                            <a
                              class="links lookup-links"
                              @click="goTransferDetail(transfer.seq)"
                              >{{ $t('detail') }}</a
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="acco-content">
                      <ul class="detail-list">
                        <li>
                          <span>{{
                            $t('private.transfer_source_amount')
                          }}</span>
                          <strong
                            ><span>{{
                              transfer.source_amount
                                | codeDecimal(transfer.source_asset_code)
                            }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{
                            $t('private.transfer_target_amount')
                          }}</span>
                          <strong
                            ><span>{{
                              transfer.target_amount
                                | codeDecimal(transfer.target_asset_code)
                            }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ $t('private.transfer_basic_rate') }}</span>
                          <strong
                            ><span>{{
                              transfer.basic_rate
                                | codeDecimal(transfer.target_asset_code)
                            }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ $t('private.transfer_spread_rate') }}</span>
                          <strong
                            ><span>{{ transfer.spread_rate }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{
                            $t('private.transfer_exchange_rate')
                          }}</span>
                          <strong
                            ><span>{{
                              transfer.exchange_rate
                                | codeDecimal(transfer.target_asset_code)
                            }}</span></strong
                          >
                        </li>
                      </ul>
                    </div>
                  </li>
                </template>
                <PageNavigation
                  :total_count="total_count"
                  :total_page="page_navigation.total_page"
                  :cur_page="page"
                  :page_count="page_navigation.page_count"
                ></PageNavigation>
              </ul>
              <template v-else>
                <div class="no-list-wrap">
                  <img class="no-list-img" src="@assets/img/no-list.png" />
                  <p>{{ $t('header.no_transfer_list') }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
