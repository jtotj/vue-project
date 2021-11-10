<script>
import KioskRePagination from '@components/kiosk-renewal/kiosk-re-pagination.vue'
import { fetchPrivateDeals } from '@apis/deal'
import { mapState } from 'vuex'
import 'swiper/css/swiper.min.css'
import Swiper from 'swiper'
import Decimal from 'decimal.js'
import { AssetCodeDecimal } from '@utils/asset-decimal'
import fromPairs from 'lodash/fromPairs'

export default {
  components: {
    KioskRePagination,
  },
  props: {
    select_asset: {
      type: Object,
      default: null,
    },
    source_asset: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      selected_offer_type: 'buy',
      deal_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      open_search_seller: false,
      search_seller: '',

      search_keyword: null,

      // selectbox
      options: [
        {
          value: 'regdate_desc',
          label: this.$t('kiosk_re.latest_order'),
        },
        {
          value: 'min_price_asc',
          label: this.$t('kiosk_re.low_price'),
        },
        {
          value: 'min_price_desc',
          label: this.$t('kiosk_re.high_price'),
        },
      ],
      value: 'regdate_desc',

      sort_order: null,
      order_type: null,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    // c_target_amount() {  // create-ads.vue
    //   if (!this.app_params.app_amount) return null

    //   return assetDecimal(this.c_target_asset_seq.seq, this.deal.min_price)
    //     .mul(this.app_params.app_amount)
    //     .toString()
    // },
  },
  watch: {
    select_asset: {
      deep: true,
      handler(newData) {
        this.loading = true
        this.loadDealList().then(() => (this.loading = false))
      },
    },
  },
  created() {
    this.loading = true
  },
  mounted() {
    this.loadDealList().then(() => (this.loading = false))
    this.swiper_wrpper = new Swiper('.paging-swiper', {
      width: 50,
      // slidesOffsetBefore: 81,
      // slidesOffsetAfter: 81,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  },
  methods: {
    async loadDealList() {
      switch (this.value) {
        case 'regdate_desc':
          this.sort_order = null
          this.order_type = null
          break
        case 'min_price_desc':
          this.sort_order = 'min_price'
          this.order_type = 'desc'
          break
        case 'min_price_asc':
          this.sort_order = 'min_price'
          this.order_type = 'asc'
          break
      }
      const ret_obj = await fetchPrivateDeals({
        page: this.page,
        status: 'OPEN',
        list_count: 10,
        source_asset_seq: this.select_asset.source_asset,
        target_asset_seq: this.select_asset.target_asset,
        search_target: 'user_id',
        search_keyword: this.search_seller,
        sort_order: this.sort_order,
        order_type: this.order_type,
      }).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.deal_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleDealLink(deal) {
      if (deal.status === 'OPEN') {
        this.$router.push({
          name: 'kiosk-re-deal-detail',
          query: { deal_seq: deal.seq, no: deal._no },
        })
      } else {
        alert('disabled')
      }
    },
    handlePageChange(data) {
      this.page = data
      this.loadDealList()
    },
    resetSearch() {
      this.search_keyword = null
      this.search_seller = null
      this.loadDealList()
    },
    search() {
      this.search_keyword = this.search_seller
      this.loadDealList()
    },
    Decimal,
    AssetCodeDecimal,
    fromPairs,
  },
}
</script>

<template>
  <div v-loading="loading" class="kiosk-re-deal-list">
    <!-- top -->
    <div class="deal-list-top">
      <h4 class="deal-list-title">{{
        `${source_asset.title}(${source_asset.code}) 구매`
      }}</h4>
      <div class="deal-sort-box">
        <button
          :class="{ active: open_search_seller === true }"
          @click="open_search_seller = !open_search_seller"
          >{{ $t('kiosk_re.seller') }}
          <img
            src="@assets/kiosk-re-img/icon_search.svg"
            alt=""
            style="margin-left:15px;"
          />
        </button>
        <el-select
          v-model="value"
          placeholder="Select"
          popper-class="sort-dropdown"
          @change="loadDealList"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </div>
    </div>
    <!-- search seller -->
    <template v-if="open_search_seller">
      <div class="search-seller-wrap">
        <div class="input-wrap">
          <input
            v-model="search_seller"
            class="search-input"
            type="text"
            :placeholder="$t('kiosk_re.search_seller')"
          />
          <button class="search-btn" @click="search"
            ><svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.7017 21.2283C7.93405 21.2283 5.16636 20.1303 3.13672 18.1173C1.10708 16.1042 0 13.3592 0 10.6142C0 7.68612 1.10708 5.12408 3.13672 3.11105C5.16636 1.09802 7.93405 0 10.7017 0C13.6539 0 16.2371 1.09802 18.2668 3.11105C22.5106 7.32011 22.5106 14.0912 18.2668 18.1173C16.2371 20.3133 13.4694 21.2283 10.7017 21.2283ZM10.7017 4.75808C9.04113 4.75808 7.56502 5.30708 6.45795 6.4051C5.35087 7.50311 4.79733 8.96714 4.79733 10.6142C4.79733 12.2612 5.35087 13.7252 6.45795 14.8232C8.85661 17.2023 12.5469 17.2023 14.9455 14.8232C17.3442 12.4442 17.3442 8.78414 14.9455 6.5881C13.6539 5.30708 12.1778 4.75808 10.7017 4.75808Z"
                fill="#0068c1"
              />
              <path
                d="M25.6476 27.9998C25.0941 27.9998 24.356 27.8168 23.987 27.2678L15.1304 18.4836C14.2078 17.5686 14.2078 16.1046 15.1304 15.1896C16.053 14.2745 17.5291 14.2745 18.4516 15.1896L27.3082 23.9737C28.2308 24.8887 28.2308 26.3527 27.3082 27.2678C26.9392 27.6338 26.3857 27.9998 25.6476 27.9998Z"
                fill="#0068c1"
              />
            </svg>
          </button>
        </div>
        <div class="category-wrap">
          <div v-if="search_keyword" class="category">
            <span>{{ search_keyword }}</span>
            <a @click="resetSearch"
              ><svg
                width="20"
                height="20"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M.554 1.348L.915.915A3.126 3.126 0 0 1 4.902.554l.433.361L25 20.581 44.665.915a3.125 3.125 0 1 1 4.42 4.42L29.419 25l19.666 19.665a3.126 3.126 0 0 1 .361 3.987l-.361.433a3.126 3.126 0 0 1-3.987.361l-.433-.361L25 29.419 5.335 49.085a3.125 3.125 0 0 1-4.42-4.42L20.581 25 .915 5.335a3.126 3.126 0 0 1-.361-3.987L.915.915l-.361.433z"
                  fill="#fff"
                /></svg
            ></a>
          </div>
          <button v-if="0" class="reset-btn"
            ><img src="@assets/kiosk-re-img/icon_refresh.svg" alt=""
          /></button>
        </div>
        <template v-if="!deal_list">
          <div class="no-item-wrap">
            <img src="@assets/kiosk-re-img/icon_warning.svg" alt="" />
            <p class="no-item-title">{{ $t('kiosk_re.no_regist') }}</p>
            <p class="no-item-contents">{{ $t('kiosk_re.other_seller') }}</p>
          </div>
        </template>
        <!-- list -->
        <!-- // -->
      </div>
    </template>

    <!-- list -->

    <template v-if="!deal_list">
      <div class="no-item-wrap">
        <img src="@assets/kiosk-re-img/icon_warning.svg" alt="" />
        <p class="no-item-title">{{ $t('kiosk_re.no_regist') }}</p>
        <p class="no-item-contents"></p>
      </div>
    </template>
    <template v-else>
      <div class="deal-list-wrap">
        <div
          class="deal-list-scroll"
          :class="{ 'search-on': open_search_seller }"
        >
          <ul class="deal-list">
            <li
              v-for="deal in deal_list"
              :key="deal.seq"
              class="deal-item"
              :class="{
                disabled: deal
                  ? Decimal(deal.potential_source_amount).equals(0)
                  : false,
              }"
            >
              <a
                href="javascript:;"
                @click="
                  !Decimal(deal.potential_source_amount).equals(0)
                    ? handleDealLink(deal)
                    : ''
                "
              >
                <div class="deal-info deal-num">
                  <div>No. {{ deal._no }}</div>
                  <div>
                    <span class="info code">{{ deal.source_asset_code }}</span>
                    <span class="info deal-status">{{
                      fromPairs(constants.market.private_deal.status)[
                        deal.status
                      ]
                    }}</span>
                  </div>
                </div>
                <div class="deal-info buy-amount">
                  <div>{{ $t('kiosk_re.pur_quan') }}</div>
                  <div class="big-bold">{{
                    `${deal.potential_source_amount} ${deal.source_asset_code}`
                  }}</div>
                </div>
                <div class="deal-info pay-amount">
                  <div>{{ $t('kiosk_re.buy_quan') }}</div>
                  <div>{{
                    AssetCodeDecimal(
                      deal.target_asset_code,
                      deal.use_follow_direct_market === 'Y'
                        ? new Decimal(deal.direct_market_basic_rate).mul(
                            deal.spread_ratio
                          )
                        : deal.min_price
                    )
                      .mul(deal.potential_source_amount)
                      .toString()
                  }}</div>
                </div>
                <div class="deal-info pay-amount seller">
                  <div>{{ $t('kiosk_re.seller') }}</div>
                  <div>{{ deal.user_name }}</div>
                </div>
              </a>
            </li>
          </ul>
          <!-- pagination -->
          <KioskRePagination
            :total_count="total_count"
            :total_page="page_navigation.total_page"
            :cur_page="page"
            :page_count="page_navigation.page_count"
            @change="handlePageChange"
          >
          </KioskRePagination>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* deal-top */
.deal-list-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  margin-top: 40px;
}

.deal-list-title {
  font-size: 32px;
  font-weight: 700;
  color: #363636;
}

.deal-sort-box {
  display: flex;
}

.deal-sort-box button {
  display: flex;
  align-items: center;
  padding: 15px 32px;
  margin-right: 20px;
  font-size: 28px;
  font-weight: 500;
  border: solid 3px #dedede;
  border-radius: 40px;
}

.deal-sort-box button.active {
  color: #fff;
  background-color: #0068c1;
  border-color: #0068c1;
}

.deal-sort-box button.active img {
  filter: invert(1);
}

.deal-sort-box .el-select {
  padding: 15px 32px;
  border: solid 3px #dedede;
  border-radius: 40px;
}

.deal-sort-box .el-select.active {
  color: #fff;
  background-color: #0068c1;
  border-color: #0068c1;
}

/* no-item */
.no-item-wrap {
  margin-top: 290px;
  text-align: center;
}
.no-item-title {
  margin-top: 40px;
  font-size: 42px;
  font-weight: 700;
  line-height: normal;
  color: #bfbfbf;
}
.no-item-contents {
  font-size: 24px;
  line-height: 1.5;
  color: #757575;
}

/* deal-list */
.deal-list-wrap {
  margin-top: 40px;
}

.deal-item {
  padding: 30px;
  margin-bottom: 20px;
  background-color: #fff;
  border: solid 3px #dedede;
  border-radius: 20px;
}

.deal-item.disabled {
  background-color: #d7d7d7;
  border-color: #d7d7d7;
}

.deal-item.disabled .deal-num .deal-status {
  background-color: #4a4a4a;
}

.deal-item a {
  display: block;
  width: 100%;
  height: 100%;
}

.deal-item .deal-info {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}
.deal-item .deal-info.deal-num {
  margin-top: 0;
  margin-bottom: 18px;
}
.deal-item .deal-info .big-bold {
  font-size: 32px;
  font-weight: 700;
  color: #000;
}

.deal-item .deal-num .info {
  padding: 6px 24px;
  font-size: 22px;
  font-weight: 500;
  color: #fff;
  border-radius: 20px;
}

.deal-item .deal-num .code {
  margin-right: 7px;
  background-color: #f7931a;
}

.deal-item .deal-num .deal-status {
  background-color: #0068c1;
}

.deal-list-scroll {
  position: relative;
  max-height: 1200px;
  overflow-y: scroll;
}

.deal-list-scroll.search-on {
  max-height: 1070px;
}

/* search seller */
.search-seller-wrap {
  margin-top: 40px;
}
.category-wrap {
  position: relative;
  display: flex;
  padding-right: 60px;
  margin-top: 30px;
}

.search-seller-wrap .input-wrap {
  position: relative;
  height: 100px;
  border-radius: 10px;
}

.search-seller-wrap .input-wrap .search-input {
  height: 100%;
  padding-left: 78px;
  font-size: 32px;
  font-weight: 500;
  color: #939393;
  border-radius: 10px;
}

.search-seller-wrap .input-wrap .search-input:focus {
  outline: none;
}

.search-seller-wrap .input-wrap .search-btn {
  position: absolute;
  top: 36px;
  left: 30px;
}

.category-wrap .reset-btn {
  position: absolute;
  top: 0;
  right: 0;
}

.category-wrap .category {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 17px 60px 17px 20px;
  margin-left: 20px;
  font-size: 22px;
  font-weight: 500;
  line-height: normal;
  color: #fff;
  background-color: #0068c1;
  border: solid 3px #0068c1;
  border-radius: 10px;
}
.category-wrap .category:first-child {
  margin-left: 0;
}
.category-wrap .category a {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
}
</style>
