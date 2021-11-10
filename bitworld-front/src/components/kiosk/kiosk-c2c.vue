<script>
import '@assets/css/kiosk/kiosk-exchange-history.css'
import { fetchPrivateDeals } from '@apis/deal'
import { fetchPrivateMarkets } from '@apis/market'

import { mapState } from 'vuex'
import date from 'locutus/php/datetime/date'
import filter from 'lodash/filter'
import PageNavigation from '@components/kiosk/kiosk-page-navigation'
import C2cEnrollment from '@components/kiosk/kiosk-c2c-enrollment'
import fromPairs from 'lodash/fromPairs'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import clone from 'lodash/clone'
import forEach from 'lodash/forEach'
import remove from 'lodash/remove'

import find from 'lodash/find'

export default {
  components: { PageNavigation, C2cEnrollment },

  data() {
    return {
      private_markets: [],
      deal_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      search_params: {},

      s_deal_seq: null,

      drawer_kiosk_history: false,
      enroll_vislble: false,
      direction: 'btt',
      assets_search: '',
    }
  },
  computed: {
    ...mapState('assets', ['assets']),

    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_active_market() {
      return filter(this.private_markets, { is_active: 'Y' })
    },
    c_filter_menu_assets() {
      const list = clone(this.c_market_source)
      remove(list, (asset_info) => {
        return this.$route.query.source_asset_seq === asset_info.seq
      })
      forEach(this.assets, (asset_info) => {
        if (this.$route.query.source_asset_seq === asset_info.seq) {
          list.unshift(asset_info)
        }
      })
      return list
    },
    c_filter_assets_list() {
      return filter(
        this.c_market_source,
        (asset_info) =>
          !this.assets_search ||
          asset_info.code
            .toLowerCase()
            .includes(this.assets_search.toLowerCase()) ||
          asset_info.title.includes(this.assets_search)
      )
    },
    c_market_source() {
      return filter(
        uniq(
          map(this.c_active_market, ({ source_asset_seq }) =>
            find(this.assets, { seq: source_asset_seq })
          )
        ),
        (list) => {
          return list.is_active === 'Y'
        }
      )
    },
  },
  mounted() {
    Promise.all([this.loadDealList(), this.loadPrivateMarket()]).catch((e) =>
      this.$toasted.error(e.message, {
        theme: 'toasted-primary',
        containerClass: 'kiosk-toasted',
      })
    )
  },
  methods: {
    setBodyClass() {
      var body = document.body
      body.classList.toggle('detailActive')
    },
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-img/coin-' + code + '.svg')
      } catch (e) {
        return default_img
      }
    },
    async loadDealList() {
      const ret_obj = await fetchPrivateDeals({
        page: this.page,
        ...this.search_params,
        status: 'OPEN',
        list_count: 4,
      })
      this.deal_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    async loadPrivateMarket() {
      const market_obj = await fetchPrivateMarkets({})
      this.private_markets = market_obj.data
    },
    handlePageChange(data) {
      this.page = data
      this.loadDealList()
    },
    selectAsset(seq) {
      this.search_params.source_asset_seq = seq
      this.drawer_kiosk_history = false
      this.loadDealList()
    },

    date,
    fromPairs,
    getPrivateApplicationForm(seq) {
      this.s_deal_seq = seq
      this.enroll_vislble = true
    },
    handleClose() {
      this.enroll_vislble = false
      this.loadDealList()
    },
  },
}
</script>

<template>
  <div :class="$style.kioskExchangeHistory" class="kiosk-exchange-history">
    <div :class="$style.container">
      <!-- 히스토리 검색바 -->
      <template>
        <div :class="$style.historySearch" class="history-search">
          <el-button @click=";(drawer_kiosk_history = true), setBodyClass()">
            <img
              src="@assets/kiosk-img/icon-search-dark.svg"
              alt="history search"
            />
          </el-button>
          <div class="">
            <div class="private-application-btn">
              <el-button @click="getPrivateApplicationForm(null)">
                {{ $t('sell') }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 히스토리 리스트 -->
        <div :class="$style.historyList">
          <template v-if="deal_list.length">
            <dl
              v-for="deal in deal_list"
              :key="deal.seq"
              :class="$style.historyBuy"
            >
              <dt :class="$style.historyDate">{{
                date('Y-m-d H:i:s', new Date(deal.regdate))
              }}</dt>
              <dd :class="$style.detailHistory" class="detail-history">
                <el-button @click="getPrivateApplicationForm(deal.seq)">{{
                  $t('buy')
                }}</el-button>
              </dd>
              <dt :class="$style.exchangeTit">
                <span>{{
                  fromPairs(constants.market.private_deal.status)[deal.status]
                }}</span>
              </dt>
              <dd :class="$style.exchangeInfo">
                <span>{{ deal.market_title }}</span>
              </dd>
              <dt>{{ $t('kiosk.purchase_price') }}</dt>
              <dd
                >1 {{ deal.source_asset_code }} =
                {{ Math.floor(deal.min_price) }}
                {{ deal.target_asset_code }}</dd
              >
              <dt>{{ $t('kiosk.available_quantity') }}</dt>
              <dd>{{ deal.potential_source_amount }}</dd>
            </dl>
            <PageNavigation
              :total_count="total_count"
              :total_page="page_navigation.total_page"
              :cur_page="page"
              :page_count="page_navigation.page_count"
              @change="handlePageChange"
            ></PageNavigation>
          </template>
          <template v-else>
            <div :class="$style.noListWrap">
              {{ $t('kiosk.purchase_history') }}
            </div>
          </template>
        </div>
      </template>

      <!-- 환전 상세 내역 버튼 클릭시 페이지 -->
    </div>

    <!-- 상세 검색 페이지 -->
    <el-drawer
      class="history-detail"
      :class="$style.historyDetail"
      :title="$t('kiosk.advanced_search')"
      :visible.sync="enroll_vislble"
      :direction="direction"
      :modal="false"
    >
      <div class="container">
        <div class="kiosk-select-box">
          <div :class="$style.assetsSearch" class="assets-search">
            <el-input
              v-model="assets_search"
              :placeholder="$t('kiosk.search_assets_txt')"
              prefix-icon="el-icon-search"
            >
            </el-input>
            <PerfectScrollbar
              :class="[$style.perfectScrollbar]"
              :options="{
                handlers: [
                  'click-rail',
                  'drag-thumb',
                  'keyboard',
                  'wheel',
                  'touch',
                ],
              }"
            >
              <div :class="$style.searchList">
                <div
                  v-for="asset in c_filter_assets_list"
                  :key="asset.seq"
                  @click="selectAsset(asset.seq)"
                >
                  <div :class="[$style.assetsTit]">
                    <img :src="getAssetSrc(asset.code)" />
                    <div>
                      <strong>{{ asset.code }}</strong>
                      <span>{{ asset.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      class="history-detail"
      :class="$style.historyDetail"
      :title="
        !s_deal_seq
          ? $t('kiosk.sales_registration')
          : $t('kiosk.purchase_registration')
      "
      :visible.sync="enroll_vislble"
      :direction="direction"
      :modal="false"
    >
      <C2cEnrollment
        v-if="enroll_vislble"
        :deal_seq="s_deal_seq"
        @close_drawer="handleClose"
      ></C2cEnrollment>
    </el-drawer>

    <!-- 조회 옵션 페이지 -->
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-exchange-history.scss';
</style>
