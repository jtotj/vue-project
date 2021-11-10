<script>
import '@assets/css/c2c.css'
import PageNavigation from '@components/page-navigation'
import { mapState } from 'vuex'
import { fetchPrivateDeals } from '@apis/deal'
import date from 'locutus/php/datetime/date'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import remove from 'lodash/remove'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import find from 'lodash/find'
import clone from 'lodash/clone'
import { fetchPrivateMarkets } from '@apis/market'

export default {
  components: { PageNavigation },
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: 'Home' }],
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      dialogTableVisible: false,
      value: '',
      scrollPosition: null,
      deal_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      open_deal_index: null,
      input_target_asset: '',

      private_market_list: [],
    }
  },
  computed: {
    ...mapState(['common']),
    ...mapState('assets', ['assets']),
    c_active_market() {
      return filter(this.private_market_list, { is_active: 'Y' })
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
          !this.input_target_asset ||
          asset_info.code
            .toLowerCase()
            .includes(this.input_target_asset.toLowerCase()) ||
          asset_info.title.includes(this.input_target_asset)
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
    c_deal_list() {
      if (!this.deal_list.length) return []

      return filter(this.deal_list, (deal) => {
        return (
          deal.source_asset_code !== 'CCE' && deal.target_asset_code !== 'CCE'
        )
      })
    },
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.loadDealList().catch((e) => this.$toasted.error(e.message))
      this.c_filter_assets_list()
      this.c_filter_menu_assets()
    },
  },
  updated() {
    this.scrollMoveAssets()
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
    this.page = this.$route.query.page || 1
    this.loadDealList()
    this.loadPrivateMarket()
  },
  methods: {
    date,
    fromPairs,
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    handleToTop() {
      window.scrollTo(0, 0)
    },
    async loadDealList() {
      this.loading = true
      const ret_obj = await fetchPrivateDeals({
        ...this.$route.query,
        status: 'OPEN',
        list_count: 10,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.deal_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    async loadPrivateMarket() {
      const market_obj = await fetchPrivateMarkets({
        ...this.$route.query,
      }).catch((e) => this.$toasted.error(e.message))
      this.private_market_list = market_obj.data
    },
    handleClick(p) {
      this.param = p
      this.$router.push({
        name: 'create-ads',
        params: {
          offer_type: 'buy',
          deal_seq: this.param,
        },
      })
    },
    selectAssetclick(seq) {
      if (this.$route.query.source_asset_seq === seq) {
        this.$router.push({
          name: 'home',
        })
      } else {
        this.$router.push({
          name: 'home',
          query: { source_asset_seq: seq },
        })
      }
    },
    searchAssetclick(seq) {
      this.$router.push({
        name: 'home',
        query: { source_asset_seq: seq },
      })
    },
    filter,
    scrollMoveAssets() {
      if (this.$route.query.source_asset_seq > 0) {
        const menu = document.querySelector('.sectionSales')
        const menuOffsetTop = menu.offsetTop

        window.scrollTo({ top: menuOffsetTop, behavior: 'smooth' })
      }
    },
  },
}
</script>

<template>
  <div :class="[$style.main]" class="newHome">
    <section :class="[$style.section, $style.banner]" style="display:none;">
      <div :class="[$style.container]">
        <div :class="[$style.textBox]">
          <h1>{{ $t('main_msg.about_1_title') }}</h1>
          <h1 class="lastH1">{{ $t('private.direct_market') }}</h1>
          <div>
            <p>{{ $t('main_msg.about_1_msg') }}</p>
            <p>{{ $t('main_msg.about_1_2_msg') }}</p>
            <p>{{ $t('main_msg.about_1_1_msg') }}</p>
          </div>
        </div>
      </div>
    </section>
    <!-- //banner -->
    <section :class="[$style.section, $style.sales]" class="sectionSales">
      <div :class="[$style.container]">
        <h1>{{ $t('private.deal_list') }}</h1>
        <div :class="$style.propertyBox">
          <h3>{{ $t('private.deal_buy_asset') }}</h3>
          <div :class="[$style.overflowParents]">
            <div :class="[$style.salesSelect]">
              <PerfectScrollbar
                :class="[$style.perfectScrollbar]"
                :options="{ suppressScrollX: false, suppressScrollY: true }"
              >
                <a
                  v-for="asset in c_filter_menu_assets"
                  :key="asset.seq"
                  class="assetMenu"
                >
                  <em
                    :class="[
                      [$style.assetTitle],
                      {
                        [$style.active]:
                          asset.seq === $route.query.source_asset_seq,
                      },
                    ]"
                    @click="selectAssetclick(asset.seq)"
                    >{{ asset.code }}</em
                  >
                </a>
              </PerfectScrollbar>
            </div>
          </div>
          <div :class="[$style.more]">
            <a class="el-dropdown-link" @click="dialogTableVisible = true">
              {{ $t('dash.more')
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </a>
          </div>
        </div>
        <div
          v-if="deal_list.length"
          :class="[$style.pc, $style.requestBox, $style.clear]"
        >
          <ul :class="[$style.requestBoxTitle, $style.clear]">
            <li :class="[$style.hide]"></li>
            <li>{{ $t('Coin_name') }}</li>
            <li :class="[$style.hide]"></li>
            <li :class="[$style.hide]"></li>
            <li>{{ $t('private.buy_price') }}</li>
            <li>{{ $t('private.potential_source_amount') }}</li>
            <li>{{ $t('status') }}</li>
            <li :class="[$style.hide]"></li>
          </ul>
          <ul
            v-for="deal in c_deal_list"
            :key="deal.seq"
            :class="[$style.requestBoxContent, $style.clear]"
          >
            <li>
              {{ deal._no }}
            </li>
            <li>
              <figure :class="`${deal.source_asset_code}`"></figure>
              <span>{{ deal.market_title }}</span>
            </li>
            <li>{{ date('Y-m-d H:i:s', new Date(deal.regdate)) }}</li>
            <li>
              {{ deal.user_id }}
            </li>
            <li>
              1 {{ deal.source_asset_code }} = <br />{{ deal.min_price }}
              {{ deal.target_asset_code }}
            </li>
            <li>
              {{ deal.potential_source_amount }}
            </li>
            <li>
              {{
                fromPairs(common.constants.market.private_deal.status)[
                  deal.status
                ]
              }}
            </li>
            <li>
              <button @click="handleClick(deal.seq)">
                <a class="links" size="mini">
                  {{ $t('apply') }}
                </a>
              </button>
            </li>
          </ul>
        </div>
        <div v-else class="no-list-wrap" :class="[$style.noListWrap]">
          <img class="no-list-img" src="@assets/img/no-list.png" />
          <p>{{ $t('header.no_c2c_sell_list') }}</p>
        </div>

        <!-- mobile -->
        <div
          v-if="deal_list.length"
          :class="[$style.mobile, $style.requestBox, $style.clear]"
        >
          <ul
            v-for="deal in deal_list"
            :key="deal.seq"
            :class="[$style.requestBoxContent, $style.clear]"
          >
            <li>
              <figure :class="`${deal.source_asset_code}`"></figure>
              <span>{{ deal.market_title }}</span>
            </li>
            <li>
              {{ date('Y-m-d H:i:s', new Date(deal.regdate)) }}
            </li>
            <li>
              {{ deal.user_id }}
            </li>
            <li>
              {{ $t('private.buy_price') }}
            </li>
            <li>
              1 {{ deal.source_asset_code }} =
              {{ Math.floor(deal.min_price) }}
              {{ deal.target_asset_code }}
            </li>
            <li>
              {{ $t('private.potential_source_amount') }}
            </li>
            <li>
              {{ deal.potential_source_amount }}
            </li>
            <li>
              {{ $t('status') }}
            </li>
            <li>
              {{
                fromPairs(common.constants.market.private_deal.status)[
                  deal.status
                ]
              }}
            </li>
            <li>
              <button @click="handleClick(deal.seq)">
                <a class="links" size="mini">
                  {{ $t('apply') }}
                </a>
              </button>
            </li>
          </ul>
        </div>
        <!-- //mobile -->
        <PageNavigation
          :total_count="total_count"
          :total_page="page_navigation.total_page"
          :cur_page="page"
          :page_count="page_navigation.page_count"
        ></PageNavigation>
      </div>
    </section>
    <!-- //sales -->

    <section :class="[$style.section, $style.skills]" style="display:none;">
      <div :class="[$style.container]">
        <h1>{{ $t('main_function') }}</h1>
        <div :class="[$style.skillContents, $style.clear]">
          <div :class="[$style.leftBox]">
            <img src="@src/assets/img/b_coin.png" alt="coin image" />
          </div>
          <div :class="[$style.rightBox, $style.textBox]">
            <h3>{{ $t('main_msg.about_2_title') }}</h3>
            <p>{{ $t('main_msg.c2c_main_msg1_1') }}</p>
            <p>
              {{ $t('main_msg.c2c_main_msg1_2') }}
            </p>
            <p>{{ $t('main_msg.c2c_main_msg1_3') }}</p>
            <a href="https://cocobnk.com/home">
              {{ $t('private.direct_market') }}
            </a>
          </div>
        </div>
        <div :class="[$style.skillContents, $style.clear]">
          <div :class="[$style.leftBox, $style.secondBoxL, $style.rightImage]">
            <img src="@src/assets/img/phone.png" alt="cellphone" />
          </div>
          <div :class="[$style.rightBox, $style.secondBoxR, $style.textBox]">
            <h3>{{ $t('main_msg.about_3_title') }}</h3>
            <p>{{ $t('main_msg.c2c_main_msg2_1') }}</p>
            <p>{{ $t('main_msg.c2c_main_msg2_2') }}</p>
            <router-link :to="{ name: 'wallet' }">
              {{ $t('header.wallet') }}
            </router-link>
          </div>
        </div>
        <div :class="[$style.skillContents, $style.clear]">
          <div :class="[$style.leftBox]">
            <img src="@src/assets/img/notebook.png" alt="notebook" />
          </div>
          <div :class="[$style.rightBox, $style.textBox]">
            <h3>{{ $t('main_msg.about_4_title') }}</h3>
            <p>{{ $t('main_msg.c2c_main_msg3_1') }}</p>
            <p>{{ $t('main_msg.c2c_main_msg3_2') }}</p>
            <router-link
              :to="{ name: 'create-ads', params: { offer_type: 'sell' } }"
              >{{ $t('sale_registration') }}</router-link
            >
          </div>
        </div>
      </div>
    </section>
    <!-- //skills -->

    <!-- scroll Top 버튼 -->
    <div :class="[$style.upButton]" @click="handleToTop">
      <img src="@src/assets/img/up_button.png" alt="up button" />
    </div>

    <!-- 더보기 -->

    <el-dialog
      :class="[$style.morePopUp]"
      :title="$t('private.deal_buy_asset')"
      :visible.sync="dialogTableVisible"
      class="dialogWrapper"
    >
      <form :class="[$style.inputBox]">
        <input
          v-model="input_target_asset"
          type="text"
          :placeholder="$t('b2c_exchange.coin_name_and_symbol_search')"
        />
        <img src="@src/assets/img/search.png" alt="search" />
      </form>
      <PerfectScrollbar>
        <div :class="[$style.tableOverflow]">
          <div
            v-for="asset in c_filter_assets_list"
            :key="asset.seq"
            :class="[$style.assetLink]"
          >
            <button @click="searchAssetclick(asset.seq)"
              ><em>{{ asset.title }}</em
              ><span>{{ asset.code }}</span></button
            >
          </div>
        </div>
      </PerfectScrollbar>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/common.scss';
@import '@src/design/c2c.scss';
</style>
