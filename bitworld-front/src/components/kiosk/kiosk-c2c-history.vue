<script>
import '@assets/css/kiosk/kiosk-exchange-history.css'
import '@assets/css/kiosk/kiosk-c2c.css'
import { fetchPrivateDeals, cancelPrivateDeal } from '@apis/deal'
import {
  fetchPrivateApplications,
  cancelPrivateApplication,
  payPrivateApplication,
} from '@apis/application'

import { mapState } from 'vuex'
import date from 'locutus/php/datetime/date'
import fromPairs from 'lodash/fromPairs'

import PageNavigation from '@components/kiosk/kiosk-page-navigation'

export default {
  components: { PageNavigation },

  data() {
    return {
      private_deal_list: [],
      app_list: [],
      deal_page: 1,
      deal_total_count: 0,
      deal_total_page: 0,
      deal_page_navigation: {},
      app_page: 1,
      app_total_count: 0,
      app_total_page: 0,
      app_page_navigation: {},
      tab_value: 'deal',
    }
  },
  computed: {
    ...mapState('assets', ['assets']),

    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  mounted() {
    this.init()
  },
  methods: {
    setBodyClass() {
      var body = document.body
      body.classList.toggle('detailActive')
    },
    init() {
      Promise.all([this.getPrivateDeal(), this.getPrivateApp()]).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
    },
    async getPrivateDeal() {
      const ret_obj = await fetchPrivateDeals({
        list_count: 4,
        page: this.deal_page,
        own_deals: 1,
      })

      this.private_deal_list = ret_obj.data
      this.deal_total_count = ret_obj.total_count
      this.deal_total_page = ret_obj.total_page
      this.deal_page_navigation = ret_obj.page_navigation
    },
    async getPrivateApp() {
      const ret_obj = await fetchPrivateApplications({
        page: this.app_page,
        list_count: 4,
      })

      this.app_list = ret_obj.data
      this.app_total_count = ret_obj.total_count
      this.app_total_page = ret_obj.total_page
      this.app_page_navigation = ret_obj.page_navigation
    },
    handleDealPageChange(data) {
      this.deal_page = data
      this.getPrivateDeal()
    },
    handleAppPageChange(data) {
      this.app_page = data
      this.getPrivateApp()
    },
    handleDealCancel(seq) {
      cancelPrivateDeal(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.getPrivateDeal()
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
    },
    handleAppCancel(seq) {
      cancelPrivateApplication(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.getPrivateApp()
        })
        .catch((e) => this.$toasted.error(e.message), {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
    },
    handleAppPay(seq) {
      payPrivateApplication(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.msg_holding'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.getPrivateApp()
        })
        .catch((e) => this.$toasted.error(e.message), {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
    },
    date,
    fromPairs,
  },
}
</script>

<template>
  <div :class="$style.kioskExchangeHistory" class="kiosk-exchange-history">
    <div :class="$style.container">
      <!-- 히스토리 검색바 -->
      <template>
        <!-- 히스토리 리스트 -->
        <div :class="$style.historyList" class="kiosk-c2c">
          <el-tabs v-model="tab_value" type="card">
            <el-tab-pane name="deal" :label="$t('kiosk.purchase_history')">
              <template v-if="private_deal_list.length">
                <dl
                  v-for="deal in private_deal_list"
                  :key="deal.seq"
                  :class="$style.historyBuy"
                >
                  <dt :class="$style.historyDate">{{
                    date('Y-m-d H:i:s', new Date(deal.regdate))
                  }}</dt>
                  <dd :class="$style.detailHistory" class="detail-history">
                    <el-button
                      v-if="deal.status === 'OPEN'"
                      @click="handleDealCancel(deal.seq)"
                      >{{ $t('cancel') }}</el-button
                    >
                  </dd>
                  <dt :class="$style.exchangeTit">
                    <span>{{
                      fromPairs(constants.market.private_deal.status)[
                        deal.status
                      ]
                    }}</span>
                  </dt>
                  <dd :class="$style.exchangeInfo">
                    <span>{{ deal.market_title }}</span>
                  </dd>
                  <dt>{{ $t('kiosk.sales_quantity') }}</dt>
                  <dd>{{
                    deal.source_amount | codeDecimal(deal.source_asset_code)
                  }}</dd>
                  <dt>{{ $t('kiosk.minimum_purchase_quantity') }}</dt>
                  <dd>{{
                    deal.source_min_amount | codeDecimal(deal.source_asset_code)
                  }}</dd>
                  <dt>{{ $t('kiosk.purchase_price') }}</dt>
                  <dd>{{
                    deal.min_price | codeDecimal(deal.target_asset_code)
                  }}</dd>

                  <dt>{{ $t('kiosk.available_quantity') }}</dt>
                  <dd>{{
                    deal.potential_source_amount
                      | codeDecimal(deal.source_asset_code)
                  }}</dd>
                </dl>
                <PageNavigation
                  :total_count="deal_total_count"
                  :total_page="deal_page_navigation.total_page"
                  :cur_page="deal_page"
                  :page_count="deal_page_navigation.page_count"
                  @change="handleDealPageChange"
                ></PageNavigation>
              </template>
              <template v-else>
                <div :class="$style.noListWrap">
                  {{ $t('kiosk.no_description') }}
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane name="app" :label="$t('kiosk.sales_history')">
              <template v-if="app_list.length">
                <dl
                  v-for="app in app_list"
                  :key="app.seq"
                  :class="$style.historyBuy"
                >
                  <dt :class="$style.historyDate">{{
                    date('Y-m-d H:i:s', new Date(app.regdate))
                  }}</dt>
                  <dd :class="$style.detailHistory" class="detail-history">
                    <el-button
                      v-if="app.status === 'PENDING'"
                      @click="handleAppPay(app.seq)"
                      >{{ $t('holding') }}</el-button
                    >
                    <el-button
                      v-if="app.status === 'PENDING' || app.status === 'PAYED'"
                      @click="handleAppCancel(app.seq)"
                      >{{ $t('cancel') }}</el-button
                    >
                  </dd>
                  <dt :class="$style.exchangeTit">
                    <span>{{
                      fromPairs(constants.market.private_application.status)[
                        app.status
                      ]
                    }}</span>
                  </dt>
                  <dd :class="$style.exchangeInfo">
                    <span>{{ app.market_title }}</span>
                  </dd>
                  <dt>{{ $t('kiosk.price_per_quantity') }}</dt>
                  <dd>{{ app.price | codeDecimal(app.target_asset_code) }}</dd>
                  <dt>{{ $t('kiosk.total_fee') }}</dt>
                  <dd>{{ app.fee_amount }}</dd>
                </dl>
                <PageNavigation
                  :total_count="app_total_count"
                  :total_page="app_page_navigation.total_page"
                  :cur_page="app_page"
                  :page_count="app_page_navigation.page_count"
                  @change="handleAppPageChange"
                ></PageNavigation>
              </template>
              <template v-else>
                <div :class="$style.noListWrap">
                  내역이 없습니다.
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>

      <!-- 환전 상세 내역 버튼 클릭시 페이지 -->
    </div>

    <!-- 상세 검색 페이지 -->
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-exchange-history.scss';
@import '@src/design/kiosk/kiosk-c2c.scss';
</style>
