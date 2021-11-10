<script>
import PageNavigation from '@components/modal-page-navigation'
import { fetchDirectTransfers } from '@apis/market'
import { mapState } from 'vuex'
import date from 'locutus/php/datetime/date'
import fromPairs from 'lodash/fromPairs'
import find from 'lodash/find'

export default {
  components: {
    PageNavigation,
  },
  props: {
    asset_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      transfer_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      loading: false,
      transfer_type: null,
      transfer_type_name: 'ALL',
      transfer_menu: false,
      search_date_option: null,
      show_date_picker: false,
      date_search: [],
      search_params: {},
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('auth', ['currentUser']),
    ...mapState('assets', ['assets']),

    c_s_asset_info() {
      if (!this.asset_seq) return null
      return find(this.assets, { seq: this.asset_seq })
    },
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.loadTransfers()
    },
    asset_seq() {
      this.loadTransfers()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadTransfers()
  },
  methods: {
    async loadTransfers(type) {
      this.loading = true
      const ret_obj = await fetchDirectTransfers({
        ...this.$route.query,
        ...this.search_params,
        list_count: 10,
        source_asset_seq: this.asset_seq || null,
        transfer_type: type,
        page: this.page,
      }).catch((e) => this.$toasted.error(e.message))
      this.transfer_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
      this.loading = false
    },
    date,
    fromPairs,

    goTransferDetail(p) {
      this.$router.push({
        name: 'transfer-detail',
        query: { seq: p },
      })
    },
    handleClick(type) {
      this.page = 1
      switch (this.transfer_type_name) {
        case 'BID':
          return this.loadTransfers('BID')
        case 'ASK':
          return this.loadTransfers('ASK')
        default:
          return this.loadTransfers(null)
      }
    },
    handlePageChange(data) {
      this.page = data
      if (this.transfer_type_name !== 'ALL') {
        this.transfer_type = this.transfer_type_name
      } else {
        this.transfer_type = null
      }
      this.loadTransfers(this.transfer_type)
    },
    pickerOptions() {
      const start = new Date()
      const end = new Date()
      this.show_date_picker = true
      switch (this.search_date_option) {
        case 'one':
          this.date_search = [start.setHours(0, 0, 0, 0), end.getTime()]
          break
        case 'week':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'month':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'three_month':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'six_month':
          start.setMonth(start.getMonth() - 6)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'option':
          this.date_search = []
          break
        default:
          break
      }
      this.pickerDateChange()
    },
    pickerDateChange() {
      if (this.date_search && this.date_search.length) {
        this.search_params.regdate_start = this.date_search[0]
        this.search_params.regdate_end = this.date_search[1]
        this.loadTransfers()
      }
    },
    resetBtn() {
      this.$router.replace({ query: null })
    },
    transferMenu() {
      this.transfer_menu = !this.transfer_menu
      this.search_target_account = null
    },
  },
}
</script>

<template>
  <div v-loading="loading" class="exchange-list">
    <!-- 계좌 검색 -->
    <!-- <div class="search-account">
      <el-input
        v-model="input_search_account"
        prefix-icon="el-icon-search"
        :placeholder="$t('relative_asset_inquiry')"
      />
    </div> -->

    <!-- 환전 내역 기간별 조회 검색 -->
    <div :class="[$style.searchButtonWrap]">
      <button class="btn-white" @click="transferMenu">{{
        $t('detail_search')
      }}</button>
    </div>
    <transition name="slide">
      <div v-if="transfer_menu" :class="[$style.transitionSilde]">
        <el-row
          :class="[$style.balanceForm, $style.balancePickerSort]"
          type="flex"
          justify="space-between"
        >
          <el-radio-group
            v-model="search_date_option"
            :class="[$style.balanceRadioBtn]"
            class="transfer-radio-btn"
            @change="pickerOptions"
          >
            <el-radio-button label="one">{{
              $t('account_transfer.today')
            }}</el-radio-button>
            <el-radio-button label="week">{{
              $t('account_transfer.one_week')
            }}</el-radio-button>
            <el-radio-button label="month">{{
              $t('account_transfer.one_month')
            }}</el-radio-button>
            <el-radio-button label="three_month">{{
              $t('account_transfer.three_months')
            }}</el-radio-button>
            <el-radio-button label="six_month">{{
              $t('account_transfer.six_months')
            }}</el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row
          v-if="show_date_picker"
          :class="[$style.balanceForm, $style.tCenter]"
        >
          <el-date-picker
            v-model="date_search"
            type="daterange"
            align="right"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            :class="[$style.balancePickerDate]"
            @change="pickerDateChange"
          >
          </el-date-picker>
        </el-row>
      </div>
    </transition>

    <el-tabs
      v-model="transfer_type_name"
      type="card"
      :class="[
        $style.tabs,
        {
          tabHeight: transfer_menu === true,
        },
      ]"
      @tab-click="handleClick"
    >
      <el-tab-pane :label="$t('all')" name="ALL">
        <PerfectScrollbar :class="[$style.perfectScrollbar]">
          <template>
            <template v-if="transfer_list.length">
              <ul>
                <li
                  v-for="transfer in transfer_list"
                  :key="transfer.seq"
                  class="list"
                >
                  <div :class="[$style.infoWrap]">
                    <strong :class="[$style.infoTitle]">
                      {{ transfer.source_asset_title }}/{{
                        transfer.target_asset_title
                      }}</strong
                    >
                    <div :class="[$style.multiple]">
                      <span
                        class="transfer-type"
                        :class="[
                          {
                            buy:
                              fromPairs(
                                constants.market.direct_transfer.transfer_type
                              )[transfer.transfer_type] === '구매',
                          },
                          {
                            sell:
                              fromPairs(
                                constants.market.direct_transfer.transfer_type
                              )[transfer.transfer_type] === '판매',
                          },
                        ]"
                      >
                        ({{
                          fromPairs(
                            constants.market.direct_transfer.transfer_type
                          )[transfer.transfer_type]
                        }})</span
                      >
                      <div class="detail-link-wrap">
                        <a
                          class="detail-link"
                          @click="goTransferDetail(transfer.seq)"
                          >{{ $t('detail') }}
                        </a>
                        <div class="img-wrap">
                          <img src="@assets/img/arrow-right.svg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul :class="[$style.shortList]">
                    <li>
                      <span :class="[$style.text]">
                        {{ $t('registration_date') }}
                      </span>
                      <span :class="[$style.content]">
                        {{ date('Y-m-d H:i:s', new Date(transfer.regdate)) }}
                      </span>
                    </li>
                    <li>
                      <span :class="[$style.text]">
                        {{ $t('private.transfer_source_amount') }}
                      </span>
                      <span :class="[$style.content]">
                        {{
                          transfer.source_amount
                            | codeDecimal(transfer.source_asset_code)
                        }}
                      </span>
                    </li>
                    <li>
                      <span :class="[$style.text]">
                        {{ $t('private.transfer_target_amount') }}
                      </span>
                      <span :class="[$style.content]">
                        {{
                          transfer.target_amount
                            | codeDecimal(transfer.target_asset_code)
                        }}
                      </span>
                    </li>
                    <li>
                      <span :class="[$style.text]">
                        {{ $t('private.transfer_basic_rate') }}
                      </span>
                      <span :class="[$style.content]">
                        {{
                          transfer.basic_rate
                            | codeDecimal(transfer.target_asset_code)
                        }}
                      </span>
                    </li>
                    <li>
                      <span :class="[$style.text]">
                        {{ $t('private.transfer_spread_rate') }}
                      </span>
                      <span :class="[$style.content]">
                        {{ transfer.spread_rate }}
                      </span>
                    </li>
                    <li>
                      <span>{{ $t('private.transfer_exchange_rate') }}</span>
                      <span :class="[$style.content]">
                        {{
                          transfer.exchange_rate
                            | codeDecimal(transfer.target_asset_code)
                        }}
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </template>
            <template v-else>
              <div class="no-list">
                <div class="img-wrap">
                  <img src="@assets/img/no-list.png" />
                </div>
                <p>{{ $t('header.no_transfer_list') }}</p>
              </div>
            </template>
          </template>
        </PerfectScrollbar>
      </el-tab-pane>
      <el-tab-pane :label="$t('buy')" name="BID">
        <PerfectScrollbar :class="[$style.perfectScrollbar]">
          <template v-if="transfer_list.length">
            <ul>
              <li
                v-for="buy_transfer in transfer_list"
                :key="buy_transfer.seq"
                class="list"
              >
                <div :class="[$style.infoWrap]">
                  <strong :class="[$style.infoTitle]">
                    {{ buy_transfer.source_asset_title }}/{{
                      buy_transfer.target_asset_title
                    }}</strong
                  >
                  <div :class="[$style.multiple]">
                    <div class="detail-link-wrap">
                      <a
                        class="detail-link"
                        @click="goTransferDetail(buy_transfer.seq)"
                        >{{ $t('detail') }}
                      </a>
                      <div class="img-wrap">
                        <img src="@assets/img/arrow-right.svg" />
                      </div>
                    </div>
                  </div>
                </div>
                <ul :class="[$style.shortList]">
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('registration_date') }}
                    </span>
                    <span :class="[$style.content]">
                      {{ date('Y-m-d H:i:s', new Date(buy_transfer.regdate)) }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('private.transfer_source_amount') }}
                    </span>
                    <span :class="[$style.content]">
                      {{
                        buy_transfer.source_amount
                          | codeDecimal(buy_transfer.source_asset_code)
                      }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('private.transfer_target_amount') }}
                    </span>
                    <span :class="[$style.content]">
                      {{
                        buy_transfer.target_amount
                          | codeDecimal(buy_transfer.target_asset_code)
                      }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('private.transfer_basic_rate') }}
                    </span>
                    <span :class="[$style.content]">
                      {{
                        buy_transfer.basic_rate
                          | codeDecimal(buy_transfer.target_asset_code)
                      }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('private.transfer_spread_rate') }}
                    </span>
                    <span :class="[$style.content]">
                      {{ buy_transfer.spread_rate }}
                    </span>
                  </li>
                  <li>
                    <span>{{ $t('private.transfer_exchange_rate') }}</span>
                    <span :class="[$style.content]">
                      {{
                        buy_transfer.exchange_rate
                          | codeDecimal(buy_transfer.target_asset_code)
                      }}
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </template>
          <template v-else>
            <div class="no-list">
              <div class="img-wrap">
                <img src="@assets/img/no-list.png" />
              </div>
              <p>{{ $t('header.no_transfer_list') }}</p>
            </div>
          </template>
        </PerfectScrollbar>
      </el-tab-pane>
      <el-tab-pane :label="$t('sell')" name="ASK">
        <PerfectScrollbar :class="[$style.perfectScrollbar]">
          <template v-if="transfer_list.length">
            <ul>
              <li
                v-for="sell_transfer in transfer_list"
                :key="sell_transfer.seq"
                class="list"
              >
                <div :class="[$style.infoWrap]">
                  <strong :class="[$style.infoTitle]">
                    {{ sell_transfer.source_asset_title }}/{{
                      sell_transfer.target_asset_title
                    }}</strong
                  >
                  <div :class="[$style.multiple]">
                    <div class="detail-link-wrap">
                      <a
                        class="detail-link"
                        @click="goTransferDetail(sell_transfer.seq)"
                        >{{ $t('detail') }}
                      </a>
                      <div class="img-wrap">
                        <img src="@assets/img/arrow-right.svg" />
                      </div>
                    </div>
                  </div>
                </div>
                <ul :class="[$style.shortList]">
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('registration_date') }}
                    </span>
                    <span :class="[$style.content]">
                      {{ date('Y-m-d H:i:s', new Date(sell_transfer.regdate)) }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('private.transfer_source_amount') }}
                    </span>
                    <span :class="[$style.content]">
                      {{
                        sell_transfer.source_amount
                          | codeDecimal(sell_transfer.source_asset_code)
                      }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('private.transfer_target_amount') }}
                    </span>
                    <span :class="[$style.content]">
                      {{
                        sell_transfer.target_amount
                          | codeDecimal(sell_transfer.target_asset_code)
                      }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('private.transfer_basic_rate') }}
                    </span>
                    <span :class="[$style.content]">
                      {{
                        sell_transfer.basic_rate
                          | codeDecimal(sell_transfer.target_asset_code)
                      }}
                    </span>
                  </li>
                  <li>
                    <span :class="[$style.text]">
                      {{ $t('private.transfer_spread_rate') }}
                    </span>
                    <span :class="[$style.content]">
                      {{ sell_transfer.spread_rate }}
                    </span>
                  </li>
                  <li>
                    <span>{{ $t('private.transfer_exchange_rate') }}</span>
                    <span :class="[$style.content]">
                      {{
                        sell_transfer.exchange_rate
                          | codeDecimal(sell_transfer.target_asset_code)
                      }}
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </template>
          <template v-else>
            <div class="no-list">
              <div class="img-wrap">
                <img src="@assets/img/no-list.png" />
              </div>
              <p>{{ $t('header.no_transfer_list') }}</p>
            </div>
          </template>
        </PerfectScrollbar>
      </el-tab-pane>
    </el-tabs>
    <PageNavigation
      v-if="transfer_list.length !== 0"
      :class="[$style.page_navigation]"
      :total_count="total_count"
      :total_page="page_navigation.total_page"
      :cur_page="page"
      :page_count="page_navigation.page_count"
      @change="handlePageChange"
    ></PageNavigation>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/modal.scss';
@import '@src/design/exchange-list.scss';
</style>

<style scoped>
.exchange-list {
  margin-top: -40px;

  /* border: 1px solid red; */
}

.slide-enter-active {
  transition: all 0.5s ease;
}

.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.exchange-list .search-account {
  margin-bottom: 20px;
}

.exchange-list .transfer-type {
  float: left;
  padding-right: 10px;
}

.exchange-list .detail-link-wrap {
  float: right;
}

.exchange-list .detail-link-wrap .img-wrap {
  float: right;
  width: 6px;
  margin-left: 5px;
}

.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 100%;
}

@media (max-width: 768px) {
  .exchange-list {
    width: 100%;
  }
}
</style>
