<script>
import '@assets/css/kiosk/kiosk-exchange-history.css'
import { fetchDirectTransfers } from '@apis/market'
import { mapState } from 'vuex'
import date from 'locutus/php/datetime/date'
import filter from 'lodash/filter'
import PageNavigation from '@components/kiosk/kiosk-page-navigation'
import fromPairs from 'lodash/fromPairs'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import find from 'lodash/find'

export default {
  components: { PageNavigation },

  data() {
    return {
      transfer_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},

      s_asset_seq: 0,
      favorite_assets: [],

      drawer_kiosk_history: false,
      direction: 'btt',
      assets_search: '',
      drawer_kiosk_option: false,

      search_params: {
        order_type: 'desc',
        transfer_type: null,
      },

      regdate_more: null,
      regdate_less: null,
      search_date_option: 'month',
      search_date_title: this.$t('one_month'),

      s_transfer_seq: null,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),

    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    s_transfer_info() {
      if (!this.s_transfer_seq) return null

      return find(this.transfer_list, { seq: this.s_transfer_seq })
    },
    c_filter_asset() {
      return filter(
        this.assets,
        (asset_info) =>
          !this.assets_search ||
          asset_info.code
            .toLowerCase()
            .includes(this.assets_search.toLowerCase()) ||
          asset_info.title.includes(this.assets_search)
      )
    },
    c_favorite_assets() {
      const assets = uniq(
        map(this.favorite_assets, (value) => find(this.assets, { seq: value }))
      ).filter(
        (asset) =>
          !this.assets_search ||
          asset.code.toLowerCase().includes(this.assets_search.toLowerCase()) ||
          asset.title.includes(this.assets_search)
      )
      return assets
    },
    search_type_title() {
      switch (this.search_params.transfer_type) {
        case 'BID':
          return this.$t('buy')

        case 'ASK':
          return this.$t('sell')

        default:
          return this.$t('all')
      }
    },
  },
  mounted() {
    if (localStorage.favorite_assets) {
      this.favorite_assets = JSON.parse(localStorage.getItem('favorite_assets'))
    }
    const start = new Date()
    const end = new Date()
    start.setHours(0, 0, 0, 0)
    this.search_params.regdate_start = start.getTime()
    this.search_params.regdate_end = end.getTime()
    this.loadTransfers()
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
    async loadTransfers() {
      const ret_obj = await fetchDirectTransfers({
        ...this.search_params,
        page: this.page,
        source_asset_seq: this.s_asset_seq ? this.s_asset_seq : null,
        list_count: 4,
      })

      this.transfer_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handlePageChange(data) {
      this.page = data
      this.loadTransfers()
    },
    selectAsset(seq) {
      this.s_asset_seq = seq
      this.drawer_kiosk_history = false
      this.loadTransfers()
    },
    toggleAssetFavorites(seq) {
      const index = this.favorite_assets.indexOf(seq)
      if (index !== -1) {
        this.favorite_assets.splice(index, 1)
        localStorage.setItem(
          'favorite_assets',
          JSON.stringify(this.favorite_assets)
        )
        return
      }
      this.favorite_assets.push(seq)
      localStorage.setItem(
        'favorite_assets',
        JSON.stringify(this.favorite_assets)
      )
    },
    date,
    fromPairs,
    pickerOptions() {
      const start = new Date()
      const end = new Date()
      switch (this.search_date_option) {
        case 'day':
          start.setHours(0)
          start.setMinutes(0)
          start.setSeconds(0)
          this.regdate_more = start.getTime()
          this.regdate_less = end
          this.search_date_title = this.$t('one_day')
          break
        case 'month':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.regdate_more = start.getTime()
          this.regdate_less = end
          this.search_date_title = this.$t('one_month')
          break
        case 'three_month':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          this.regdate_more = start.getTime()
          this.regdate_less = end
          this.search_date_title = this.$t('three_months')
          break
        case 'six_month':
          start.setMonth(start.getMonth() - 6)
          this.regdate_more = start.getTime()
          this.regdate_less = end
          this.search_date_title = this.$t('six_months')
          break
        case 'year':
          start.setFullYear(start.getFullYear() - 1)
          this.regdate_more = start.getTime()
          this.regdate_less = end
          this.search_date_title = this.$t('one_year')
          break
        default:
          this.search_date_title = ''
          break
      }
      this.pickerDateChange()
    },
    pickerDateChange() {
      this.search_params.regdate_start = this.regdate_more
      const regdate_end = this.regdate_less
      regdate_end.setHours(23)
      regdate_end.setMinutes(59)
      regdate_end.setSeconds(59)

      this.search_params.regdate_end = regdate_end.getTime()
    },
    getTransferSearchOption() {
      this.loadTransfers()
      this.drawer_kiosk_option = false
    },
    getTransferInfoDetail(seq) {
      this.s_transfer_seq = seq
    },
  },
}
</script>

<template>
  <div :class="$style.kioskExchangeHistory" class="kiosk-exchange-history">
    <div :class="$style.container">
      <!-- 히스토리 검색바 -->
      <template v-if="!s_transfer_seq">
        <div :class="$style.historySearch" class="history-search">
          <el-button @click=";(drawer_kiosk_history = true), setBodyClass()">
            <img
              src="@assets/kiosk-img/icon-search-dark.svg"
              alt="history search"
            />
          </el-button>
          <div class="">
            <div>
              <span>{{ search_date_title }} </span>
              <span> {{ search_type_title }} </span>
              <span>
                {{
                  search_params.order_type === 'desc' ? $t('new') : $t('past')
                }}</span
              >
            </div>
            <div class="history-option">
              <el-button @click="drawer_kiosk_option = true">
                <img
                  src="@assets/kiosk-img/icon-settings.svg"
                  alt="조회 옵션"
                />
              </el-button>
            </div>
          </div>
        </div>

        <!-- 히스토리 리스트 -->
        <div :class="$style.historyList">
          <template v-if="transfer_list.length">
            <dl
              v-for="transfer in transfer_list"
              :key="transfer.seq"
              :class="$style.historyBuy"
            >
              <dt :class="$style.historyDate">{{
                date('Y-m-d H:i:s', new Date(transfer.regdate))
              }}</dt>
              <dd :class="$style.detailHistory" class="detail-history">
                <el-button @click="getTransferInfoDetail(transfer.seq)">{{
                  $t('kiosk.detail')
                }}</el-button>
              </dd>
              <dt :class="$style.exchangeTit">
                <img
                  v-if="transfer.transfer_type === 'BID'"
                  src="@assets/kiosk-img/icon-history-buy.svg"
                  alt="buy"
                />
                <img
                  v-else
                  src="@assets/kiosk-img/icon-history-sell.svg"
                  alt=""
                />

                <span>{{
                  fromPairs(constants.market.direct_transfer.transfer_type)[
                    transfer.transfer_type
                  ]
                }}</span>
              </dt>
              <dd :class="$style.exchangeInfo">
                <span
                  >{{ transfer.source_asset_title }}/{{
                    transfer.target_asset_title
                  }}</span
                >
              </dd>
              <dt>{{ $t('account_number') }}</dt>
              <dd>{{ transfer.target_account_number }}</dd>
              <dt>{{ $t('private.direct_source_amount') }}</dt>
              <dd>{{ transfer.source_amount }}</dd>
              <dt>{{ $t('private.direct_target_amount') }}</dt>
              <dd>{{ transfer.target_amount }}</dd>
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
              {{ $t('header.no_transfer_list') }}
            </div>
          </template>
        </div>
      </template>

      <!-- 환전 상세 내역 버튼 클릭시 페이지 -->
      <div v-else :class="$style.accountCheck" class="account-check">
        <template v-if="s_transfer_info">
          <h2>{{ $t('private.transfer_list_detail') }}</h2>
          <dl class="kiosk-select-box">
            <dt>{{ $t('private.transfer_detail_type') }}</dt>
            <dd>{{
              fromPairs(constants.market.direct_transfer.transfer_type)[
                s_transfer_info.transfer_type
              ]
            }}</dd>
            <dt>{{ $t('privatetransfer_regdate') }}</dt>
            <dd>{{
              date('Y-m-d H:i:s', new Date(s_transfer_info.regdate))
            }}</dd>
            <dt>{{ $t('kiosk.base_asset_account_information') }}</dt>
            <dd>{{ s_transfer_info.source_account_number }}</dd>
          </dl>
          <dl class="kiosk-select-box">
            <dt>{{ $t('private.transfer_source_asset') }}</dt>
            <dd>{{ s_transfer_info.source_asset_title }}</dd>
            <dt>{{ $t('private.transfer_target_asset') }}</dt>
            <dd>{{ s_transfer_info.target_asset_title }}</dd>
          </dl>
          <dl class="kiosk-select-box">
            <dt>{{ $t('private.transfer_source_amount') }}</dt>
            <dd>{{ s_transfer_info.source_amount }}</dd>
            <dt>{{ $t('private.transfer_target_amount') }}</dt>
            <dd>{{ s_transfer_info.target_amount }}</dd>
          </dl>
          <dl class="kiosk-select-box">
            <dt>{{ $t('private.transfer_basic_rate') }}</dt>
            <dd>{{ s_transfer_info.basic_rate }}</dd>
            <dt>{{ $t('private.transfer_spread_rate') }}</dt>
            <dd>{{ s_transfer_info.spread_rate }}</dd>
          </dl>
        </template>
      </div>
      <div v-if="s_transfer_info" class="transfer">
        <el-button @click="s_transfer_seq = null">{{ $t('back') }}</el-button>
      </div>
    </div>

    <!-- 상세 검색 페이지 -->
    <el-drawer
      class="history-detail"
      :class="$style.historyDetail"
      :title="$t('kiosk.advanced_search')"
      :visible.sync="drawer_kiosk_history"
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
            <el-tabs type="card">
              <el-tab-pane :label="$t('kiosk.assets')">
                <PerfectScrollbar :class="[$style.perfectScrollbar]">
                  <div :class="$style.searchList">
                    <div
                      v-for="asset in c_filter_asset"
                      :key="asset.seq"
                      @click="selectAsset(asset.seq)"
                    >
                      <div
                        :class="$style.assetFavorit"
                        @click.prevent.stop="toggleAssetFavorites(asset.seq)"
                      >
                        <img
                          v-if="favorite_assets.indexOf(asset.seq) === -1"
                          src="@assets/kiosk-img/icon-star.svg"
                          alt="star"
                          class="star"
                        />
                        <img
                          v-else
                          src="@assets/kiosk-img/icon-star-yellow.svg"
                          alt="star"
                          class="star_yellow"
                        />
                      </div>
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
              </el-tab-pane>
              <el-tab-pane :label="$t('kiosk.favorite')">
                <PerfectScrollbar :class="[$style.perfectScrollbar]">
                  <div :class="$style.searchList">
                    <div
                      v-for="favorite in c_favorite_assets"
                      :key="favorite.seq"
                      @click="selectAsset(favorite.seq)"
                    >
                      <div
                        :class="$style.assetFavorit"
                        @click.prevent.stop="toggleAssetFavorites(favorite.seq)"
                      >
                        <img
                          v-if="favorite_assets.indexOf(favorite.seq) === -1"
                          src="@assets/kiosk-img/icon-star.svg"
                          alt="star"
                          class="star"
                        />
                        <img
                          v-else
                          src="@assets/kiosk-img/icon-star-yellow.svg"
                          alt="star"
                          class="star_yellow"
                        />
                      </div>
                      <div :class="[$style.assetsTit]">
                        <img
                          src="@assets/kiosk-img/coin-BTC.svg"
                          alt="bitcoin"
                        />
                        <div>
                          <strong>{{ favorite.code }}</strong>
                          <span>{{ favorite.title }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PerfectScrollbar>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 조회 옵션 페이지 -->
    <el-drawer
      class="search-option"
      :class="$style.searchOption"
      :title="$t('kiosk.inquiry_option')"
      :visible.sync="drawer_kiosk_option"
      :direction="direction"
    >
      <div :class="$style.container">
        <div>
          <h3>{{ $t('kiosk.inquiry_period') }}</h3>
          <div class="search-date">
            <el-radio-group
              v-model="search_date_option"
              @change="pickerOptions"
            >
              <el-radio-button label="day">{{ $t('day') }}</el-radio-button>
              <el-radio-button label="month">{{
                $t('one_month')
              }}</el-radio-button>
              <el-radio-button label="three_month">{{
                $t('three_months')
              }}</el-radio-button>
              <el-radio-button label="six_month">{{
                $t('six_months')
              }}</el-radio-button>
              <el-radio-button label="year">{{
                $t('one_year')
              }}</el-radio-button>
            </el-radio-group>
          </div>

          <div class="search-calendar">
            <el-date-picker
              v-model="regdate_more"
              type="date"
              :placeholder="$t('kiosk.select_date')"
              @change="pickerDateChange"
            >
            </el-date-picker>
            <span class="calendar-to"></span>
            <el-date-picker
              v-model="regdate_less"
              type="date"
              :placeholder="$t('kiosk.select_date')"
              @change="pickerDateChange"
            >
            </el-date-picker>
          </div>

          <h3>{{ $t('kiosk.classification_of_transactions') }}</h3>
          <div class="search-division">
            <el-radio-group v-model="search_params.transfer_type">
              <el-radio-button :label="null">{{ $t('all') }}</el-radio-button>
              <el-radio-button label="BID">{{ $t('buy') }}</el-radio-button>
              <el-radio-button label="ASK">{{ $t('sell') }}</el-radio-button>
            </el-radio-group>
          </div>
          <h3>{{ $t('kiosk.sort_order') }}</h3>
          <div class="search-sort">
            <el-radio-group v-model="search_params.order_type">
              <el-radio-button label="desc">{{ $t('new') }}</el-radio-button>
              <el-radio-button label="asc">{{ $t('past') }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="transfer">
          <el-button @click="getTransferSearchOption">{{
            $t('verify')
          }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-exchange-history.scss';
</style>
