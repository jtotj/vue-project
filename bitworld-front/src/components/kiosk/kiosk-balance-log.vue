<script>
import { fetchAccountBalanceLogList } from '@apis/account'
import PageNavigation from '@components/kiosk/kiosk-page-navigation'
import '@assets/css/kiosk/kiosk-search.css'
import { mapState } from 'vuex'
import uniq from 'lodash/uniq'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'
import date from 'locutus/php/datetime/date'
import Decimal from 'decimal.js'

export default {
  components: { PageNavigation },
  filters: {
    replace(value) {
      if (!value) return ''
      return value.replace(/\[[^\]]*\]/g, '')
    },
  },
  data() {
    return {
      activeName: 'first',
      assets_search: '',
      account_search: '',
      favorite_search_account: '',
      favorite_search_asset: '',

      assets_search_visible: false,
      account_search_visible: false,

      favorite_assets: [],
      selected_asset_seq: 0,
      favorite_accounts: [],
      selected_account_seq: 0,
      s_account_info_visible: false,

      log_search_visible: false,
      search_option_visible: false,
      log_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      search_params: {
        order_type: 'desc',
      },

      regdate_more: null,
      regdate_less: null,
      search_date_option: 'month',
      search_date_title: this.$t('one_month'),
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['currentUser']),

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
          !this.favorite_search_asset ||
          asset.code
            .toLowerCase()
            .includes(this.favorite_search_asset.toLowerCase()) ||
          asset.title.includes(this.favorite_search_asset)
      )
      return assets
    },
    c_s_asset_info() {
      if (this.selected_asset_seq === 0) return null

      return find(this.assets, { seq: this.selected_asset_seq })
    },
    c_accounts() {
      if (this.selected_asset_seq === 0) return []

      return filter(
        this.accounts,
        (account) =>
          account.asset_seq === this.selected_asset_seq &&
          (!this.account_search ||
            account.title
              .toLowerCase()
              .includes(this.account_search.toLowerCase()) ||
            account.account_number.includes(this.account_search))
      )
    },
    c_favorite_accounts() {
      const accounts = uniq(
        map(this.favorite_accounts, (value) =>
          find(this.accounts, { seq: value })
        )
      ).filter(
        (favorite_account) =>
          favorite_account.asset_seq === this.selected_asset_seq &&
          (!this.favorite_search_account ||
            favorite_account.title
              .toLowerCase()
              .includes(this.favorite_search_account.toLowerCase()) ||
            favorite_account.account_number.includes(
              this.favorite_search_account
            ))
      )
      return accounts
    },
    c_favorite_accounts_currentUser() {
      return `favorite_accounts_${this.currentUser.seq}`
    },
    c_s_account_info() {
      if (this.selected_account_seq === 0) return null

      return find(this.accounts, { seq: this.selected_account_seq })
    },
  },
  watch: {
    selected_asset_seq() {
      this.selected_account_seq = 0
    },
  },
  mounted() {
    if (localStorage.favorite_assets) {
      this.favorite_assets = JSON.parse(localStorage.getItem('favorite_assets'))
    }
    if (localStorage.getItem(this.c_favorite_accounts_currentUser)) {
      this.favorite_accounts = JSON.parse(
        localStorage.getItem(this.c_favorite_accounts_currentUser)
      )
    }
    const start = new Date()
    const end = new Date()
    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)
    this.search_params.regdate_start = start.getTime()
    this.search_params.regdate_end = end.getTime()
  },
  methods: {
    Decimal,
    date,
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
    toggleAccountFavorites(seq) {
      const index = this.favorite_accounts.indexOf(seq)

      if (index !== -1) {
        this.favorite_accounts.splice(index, 1)
        localStorage.setItem(
          this.c_favorite_accounts_currentUser,
          JSON.stringify(this.favorite_accounts)
        )
        return
      }
      this.favorite_accounts.push(seq)
      localStorage.setItem(
        this.c_favorite_accounts_currentUser,
        JSON.stringify(this.favorite_accounts)
      )
    },
    selectAsset(seq) {
      this.selected_asset_seq = seq
      this.assets_search_visible = false
    },
    selectAccount(seq) {
      this.selected_account_seq = seq
      this.account_search_visible = false
    },
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-img/coin-' + code + '.svg')
      } catch (e) {
        return default_img
      }
    },
    async getAccountBalanceLogList() {
      const ret_obj = await fetchAccountBalanceLogList({
        ...this.search_params,
        list_count: 3,
        page: this.page,
        account_seq: this.selected_account_seq,
      })
      map(ret_obj.data, (val) => {
        const diff = new Decimal(val.after).minus(val.before)

        if (diff.gt(0)) val.heading = 'up'
        else if (diff.lt(0)) val.heading = 'down'
        else val.heading = 'eq'

        val.diff = diff.abs().toString()
      })
      this.log_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
      this.log_search_visible = true
    },
    handlePageChange(data) {
      this.page = data
      this.getAccountBalanceLogList()
    },
    copyAccountNumber() {
      this.$copyText(this.c_s_account_info.account_number).then(
        this.$toasted.success(this.$t('toasted_msg.copy'), {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
    },
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
          this.search_date_title = this.$t('day')
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
    getLogSearchOption() {
      this.getAccountBalanceLogList()
      this.search_option_visible = false
    },
  },
}
</script>

<template>
  <div :class="$style.kioskSearch" class="kiosk-search">
    <div :class="$style.container">
      <template v-if="!log_search_visible">
        <!-- 자산검색 -->
        <template v-if="!account_search_visible">
          <div class="kiosk-select-box">
            <h2>{{ $t('kiosk.search_assets') }}</h2>
            <el-button
              class="kiosk-select-asset"
              @click="assets_search_visible = !assets_search_visible"
            >
              <template v-if="!c_s_asset_info">
                <span>
                  {{ $t('kiosk.select_assets_txt') }}
                  <img
                    v-if="!assets_search_visible"
                    src="@assets/kiosk-img/icon-next.svg"
                    alt="next-btn"
                  />
                </span>
              </template>
              <template v-else>
                <div :class="$style.selectedAssetWrap">
                  <div :class="[$style.selectedAssetsTit]">
                    <img :src="getAssetSrc(c_s_asset_info.code)" />
                    <div>
                      <strong>{{ c_s_asset_info.code }}</strong>
                      <span>{{ c_s_asset_info.title }}</span>
                    </div>
                  </div>
                  <div
                    :class="[$style.selectedCancel]"
                    @click="selected_asset_seq = 0"
                  >
                    <img src="@assets/kiosk-img/icon-select-cancel.svg" />
                  </div>
                </div>
              </template>
            </el-button>
            <div
              v-if="assets_search_visible"
              :class="$style.assetsSearch"
              class="assets-search"
            >
              <el-tabs type="card">
                <el-tab-pane :label="$t('kiosk.assets')">
                  <el-input
                    v-model="assets_search"
                    :placeholder="$t('kiosk.search_assets_txt')"
                    prefix-icon="el-icon-search"
                  >
                  </el-input>
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
                  <el-input
                    v-model="favorite_search_asset"
                    :placeholder="$t('kiosk.search_assets_txt')"
                    prefix-icon="el-icon-search"
                  >
                  </el-input>
                  <PerfectScrollbar :class="[$style.perfectScrollbar]">
                    <div :class="$style.searchList">
                      <div
                        v-for="favorite in c_favorite_assets"
                        :key="favorite.seq"
                        @click="selectAsset(favorite.seq)"
                      >
                        <div
                          :class="$style.assetFavorit"
                          @click.prevent.stop="
                            toggleAssetFavorites(favorite.seq)
                          "
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
                            :src="getAssetSrc(favorite.code)"
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
        </template>

        <!-- 계좌검색 -->
        <template v-if="!assets_search_visible">
          <div class="kiosk-select-box">
            <h2>{{ $t('kiosk.search_account') }}</h2>
            <el-button
              class="kiosk-select-asset"
              @click="account_search_visible = !account_search_visible"
            >
              <template v-if="!c_s_account_info">
                <span>
                  {{ $t('kiosk.select_account_txt') }}
                  <img
                    v-if="!account_search_visible"
                    src="@assets/kiosk-img/icon-next.svg"
                    alt="next-btn"
                  />
                </span>
              </template>
              <template v-else>
                <div :class="$style.selectedAssetWrap">
                  <div :class="[$style.selectedAssetsTit]">
                    <img :src="getAssetSrc(c_s_asset_info.code)" />
                    <div>
                      <strong>{{
                        c_s_account_info.title || '(계좌 별칭 없음)'
                      }}</strong>
                      <span>{{ c_s_account_info.account_number }}</span>
                    </div>
                  </div>
                  <div
                    :class="[$style.selectedCancel]"
                    @click="selected_account_seq = 0"
                  >
                    <strong>{{ c_s_account_info.balance }}</strong>
                    <img src="@assets/kiosk-img/icon-select-cancel.svg" />
                  </div>
                </div>
              </template>
            </el-button>
            <div
              v-if="account_search_visible"
              :class="$style.assetsSearch"
              class="assets-search"
            >
              <el-tabs type="card">
                <el-tab-pane :label="$t('account')">
                  <el-input
                    v-model="account_search"
                    :placeholder="$t('kiosk.search_account_txt')"
                    prefix-icon="el-icon-search"
                  >
                  </el-input>
                  <PerfectScrollbar :class="[$style.perfectScrollbar]">
                    <div :class="$style.searchList">
                      <div
                        v-for="account in c_accounts"
                        :key="account.seq"
                        @click="selectAccount(account.seq)"
                      >
                        <div
                          :class="$style.assetFavorit"
                          @click.prevent.stop="
                            toggleAccountFavorites(account.seq)
                          "
                        >
                          <img
                            v-if="favorite_accounts.indexOf(account.seq) === -1"
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
                          <img :src="getAssetSrc(account.asset_code)" />
                          <div>
                            <strong :class="$style.acoountName">{{
                              account.title || $t('kiosk.no_account_alias')
                            }}</strong>
                            <span>{{ account.account_number }}</span>
                          </div>
                          <span>{{ account.balance }}</span>
                        </div>
                      </div>
                    </div>
                  </PerfectScrollbar>
                </el-tab-pane>
                <el-tab-pane :label="$t('kiosk.favorite')">
                  <el-input
                    v-model="favorite_search_account"
                    :placeholder="$t('kiosk.search_account_txt')"
                    prefix-icon="el-icon-search"
                  >
                  </el-input>
                  <PerfectScrollbar :class="[$style.perfectScrollbar]">
                    <div :class="$style.searchList">
                      <div
                        v-for="favorite_account in c_favorite_accounts"
                        :key="favorite_account.seq"
                        @click="selectAccount(favorite_account.seq)"
                      >
                        <div
                          :class="$style.assetFavorit"
                          @click.prevent.stop="
                            toggleAccountFavorites(favorite_account.seq)
                          "
                        >
                          <img
                            v-if="
                              favorite_accounts.indexOf(
                                favorite_account.seq
                              ) === -1
                            "
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
                            :src="getAssetSrc(favorite_account.asset_code)"
                          />
                          <div>
                            <strong :class="$style.acoountName">{{
                              favorite_account.title ||
                                $t('kiosk.no_account_alias')
                            }}</strong>
                            <span>{{ favorite_account.account_number }}</span>
                          </div>
                          <span>{{ favorite_account.balance }}</span>
                        </div>
                      </div>
                    </div>
                  </PerfectScrollbar>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </template>

        <!-- 검색 확인 버튼 -->
        <template v-if="!account_search_visible && !assets_search_visible">
          <div :class="$style.check" class="kiosk-select-box check">
            <el-button @click="getAccountBalanceLogList">{{
              $t('kiosk.confirm')
            }}</el-button>
          </div>
        </template>
      </template>

      <template v-else>
        <!-- 예금 조회 상세 내역 -->
        <div :class="$style.kioskSearchDetail">
          <div>
            <!-- 예금조회 타이틀 정보 -->
            <div :class="[$style.kioskSearchHeader]">
              <div
                v-if="!s_account_info_visible"
                :class="$style.detailTitle"
                class="detail-title"
              >
                <p>{{
                  c_s_account_info.title || $t('kiosk.no_account_alias')
                }}</p>
                <div>
                  <strong>{{ c_s_account_info.balance }}</strong
                  ><span>{{ c_s_account_info.asset_code }}</span>
                  <el-button @click="s_account_info_visible = true">
                    <img
                      src="@assets/kiosk-img/icon-down-dark.svg"
                      alt="상세 보기"
                    />
                  </el-button>
                </div>
              </div>

              <dl v-else :class="$style.detailContent" class="detail-content">
                <dt>{{
                  c_s_account_info.title || $t('kiosk.no_account_alias')
                }}</dt>
                <dd>
                  <el-button @click="s_account_info_visible = false">
                    <img
                      src="@assets/kiosk-img/icon-down-dark.svg"
                      alt="상세 보기"
                    />
                  </el-button>
                </dd>
                <dt :class="$style.userAccount">{{
                  c_s_account_info.account_number
                }}</dt>
                <dd class="kiosk-select-box">
                  <el-button @click="copyAccountNumber">{{
                    $t('copy')
                  }}</el-button>
                </dd>
                <dt>{{ $t('balance') }}</dt>
                <dd>
                  <strong>{{ c_s_account_info.balance }}</strong>
                  <span>{{ c_s_account_info.asset_code }}</span>
                </dd>
                <dt>{{ $t('kiosk.withdrawable_amount') }}</dt>
                <dd>
                  <strong>{{
                    Decimal(c_s_account_info.balance).minus(
                      c_s_account_info.holding_balance
                    ) | codeDecimal(c_s_account_info.asset_code)
                  }}</strong>
                  <span>{{ c_s_account_info.asset_code }}</span>
                </dd>
              </dl>
            </div>
            <!-- //예금조회 타이틀 정보 -->

            <!-- 예금조회 리스트 -->
            <div :class="$style.kioskSearchList">
              <div :class="$style.kioskSearchBar">
                <div>
                  <span>{{ search_date_title }} </span>
                  <span> {{ $t('all') }} </span>
                  <span>
                    {{
                      search_params.order_type === 'desc'
                        ? $t('new')
                        : $t('past')
                    }}</span
                  >
                </div>
                <div class="history-option">
                  <el-button @click="search_option_visible = true">
                    <img
                      src="@assets/kiosk-img/icon-settings.svg"
                      alt="조회 옵션"
                    />
                  </el-button>
                </div>
              </div>

              <div :class="$style.kioskSearchContent">
                <template v-if="log_list.length">
                  <dl v-for="log in log_list" :key="log.seq">
                    <dt>{{ date('Y-m-d H:i:s', new Date(log.regdate)) }}</dt>
                    <dd :class="$style.kioskContentTxt">{{
                      log.description_replaced | replace()
                    }}</dd>
                    <dt>{{ $t('kiosk.variable_amount') }}</dt>
                    <dd
                      :class="{
                        [$style.minus]: log.heading === 'down',
                        [$style.plus]: log.heading === 'up',
                      }"
                      >{{ { eq: '', up: '+', down: '-' }[log.heading] }}
                      {{ log.diff }}</dd
                    >
                    <dt>{{ $t('balance') }}</dt>
                    <dd
                      ><span>{{ log.after }}</span
                      >{{ c_s_account_info.asset_code }}</dd
                    >
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
                    {{ $t('kiosk.no_deposit_history') }}
                  </div>
                </template>
              </div>
            </div>
            <!-- //예금조회 리스트 -->
          </div>
          <!-- //예금 조회 상세 내역 -->
        </div>
      </template>
      <el-drawer
        class="search-option"
        :class="$style.searchOption"
        :title="$t('kiosk.inquiry_option')"
        :visible.sync="search_option_visible"
        direction="btt"
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
            <template v-if="0">
              <h3>{{ $t('kiosk.type_of_change') }}</h3>
              <div class="search-division">
                <el-button class="is-active">{{ $t('all') }}</el-button>
                <el-button>{{ $t('increase') }}</el-button>
                <el-button>{{ $t('deduction') }}</el-button>
              </div>
            </template>
            <h3>{{ $t('kiosk.sort_order') }}</h3>
            <div class="search-sort">
              <el-radio-group v-model="search_params.order_type">
                <el-radio-button label="desc">{{ $t('new') }}</el-radio-button>
                <el-radio-button label="asc">{{ $t('past') }}</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div class="transfer">
            <el-button @click="getLogSearchOption">{{
              $t('kiosk.confirm')
            }}</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-search.scss';
</style>
