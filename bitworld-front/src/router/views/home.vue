<script>
import appConfig from '@src/app.config'
import { mapGetters, mapState } from 'vuex'
import { fetchPrivateDeals } from '@apis/deal'
import date from 'locutus/php/datetime/date'
import fromPairs from 'lodash/fromPairs'
import PageNavigation from '@components/page-navigation'
import NoticeModal from '@components/notice-modal'
import filter from 'lodash/filter'

export default {
  page: {
    title: 'Home',
    meta: [
      {
        name: 'description',
        content: appConfig.description,
      },
    ],
  },
  components: {
    PageNavigation,
    NoticeModal,
  },
  data() {
    return {
      coin_modal: false,
      change_source_asset: {
        name: null,
        seq: null,
      },
      change_target_asset: {
        name: null,
        seq: null,
      },
      source_name: null,
      target_name: null,
      parameter: {},
      select_id: '',
      deal_list: [],
      deal_modal: false,
      param: '',
      search_coin: null,
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      s_target_asset: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('assets', ['assets']),
    ...mapState(['common']),
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.loadDealList().catch((e) => this.$toasted.error(e.message))
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadDealList()
  },
  methods: {
    fromPairs,

    async loadDealList() {
      this.loading = true
      const ret_obj = await fetchPrivateDeals({
        ...this.$route.query,
        status: 'OPEN',
        list_count: 5,
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
    date,
    selectTargetAsset(seq) {
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
    filter,
  },
}
</script>

<template>
  <div class="main">
    <section class="section trading-service">
      <div class="trade-pane">
        <div class="container">
          <div class="trade-des">
            <div class="des-box">
              <h3
                >{{ $t('main_msg.about_1_title') }} |
                {{ $t('private.direct_market') }}</h3
              >
              <div class="division"></div>
              <div>{{ $t('main_msg.about_1_msg') }}</div>
              <div>{{ $t('main_msg.about_1_2_msg') }}</div>
              <div>{{ $t('main_msg.about_1_1_msg') }}</div>
            </div>
            <div class="btn-wrap">
              <a href="https://cocobnk.com/home">
                {{ $t('dash.more') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section sell-history">
      <div class="container">
        <div class="big-tit-wrap">
          <span class="big-tit">{{ $t('private.deal_list') }}</span>
          <div class="asset-wrap">
            <div class="buy-asset-wrap">
              <ul class="buy-asset">
                <p>{{ $t('private.deal_buy_asset') }}</p>
                <div class="asset">
                  <template v-for="asset in filter(assets, { is_active: 'Y' })">
                    <li
                      v-if="asset.code !== 'KRW'"
                      :key="asset.seq"
                      :class="[
                        'asset',
                        {
                          t_active: asset.seq === $route.query.source_asset_seq,
                        },
                      ]"
                      @click="selectTargetAsset(asset.seq)"
                      >{{ asset.code }}</li
                    >
                  </template>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div v-loading="loading">
          <template v-if="deal_list.length">
            <div class="main-deal">
              <ul class="deal-list">
                <template v-for="deal in deal_list">
                  <li :key="deal.seq" :class="['deal-act']">
                    <span class="number-badge">
                      {{ deal._no }}
                    </span>
                    <div class="wrap">
                      <div class="left-info">
                        <strong class="tit">{{ deal.market_title }}</strong>
                        <ul class="short-list">
                          <li>
                            <span>
                              {{ $t('registration_date') }}
                            </span>
                            {{ date('Y-m-d H:i:s', new Date(deal.regdate)) }}
                          </li>
                          <li>{{ deal.user_id }}</li>
                        </ul>
                      </div>
                      <div class="right-info">
                        <div class="multiple">
                          <div class="money">
                            <strong class="bold">
                              {{
                                deal.source_amount
                                  | codeDecimal(deal.source_asset_code)
                              }}
                            </strong>
                            <strong>
                              <a
                                class="links"
                                size="mini"
                                @click="handleClick(deal.seq)"
                                >{{ $t('apply') }}</a
                              >
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="acco-content">
                      <ul class="detail-list">
                        <li>
                          <span>{{ $t('private.buy_price') }}</span>
                          <strong>
                            <span>
                              {{
                                deal.min_price
                                  | codeDecimal(deal.target_asset_code)
                              }}
                            </span>
                          </strong>
                        </li>
                        <li>
                          <span>{{
                            $t('private.confirmed_source_amount')
                          }}</span>
                          <strong>
                            <span>
                              {{
                                deal.confirmed_source_amount
                                  | codeDecimal(deal.source_asset_code)
                              }}
                            </span>
                          </strong>
                        </li>
                        <li>
                          <span>{{ $t('private.holding_source_amount') }}</span>
                          <strong>
                            <span>
                              {{
                                deal.holding_source_amount
                                  | codeDecimal(deal.source_asset_code)
                              }}
                            </span>
                          </strong>
                        </li>
                        <li>
                          <span>{{
                            $t('private.potential_source_amount')
                          }}</span>
                          <strong>
                            <span>
                              {{
                                deal.potential_source_amount
                                  | codeDecimal(deal.source_asset_code)
                              }}
                            </span>
                          </strong>
                        </li>
                        <li>
                          <span>{{ $t('status') }}</span>
                          <strong>
                            <span>
                              {{
                                fromPairs(
                                  common.constants.market.private_deal.status
                                )[deal.status]
                              }}
                            </span>
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </li>
                </template>
              </ul>
            </div>

            <PageNavigation
              :total_count="total_count"
              :total_page="page_navigation.total_page"
              :cur_page="page"
              :page_count="page_navigation.page_count"
            ></PageNavigation>
          </template>
          <template v-else>
            <div class="no-list-wrap">
              <img class="no-list-img" src="@assets/img/no-list.png" />
              <p>{{ $t('header.no_c2c_sell_list') }}</p>
            </div>
          </template>
        </div>
      </div>
    </section>

    <section class="section main-function">
      <div class="container">
        <div class="trade-pane">
          <div class="trade-des">
            <div class="img-wrap">
              <img src="@assets/img/function-icon1.png" />
            </div>
            <div class="des-box">
              <h3>{{ $t('main_msg.about_2_title') }}</h3>
              <div>{{ $t('main_msg.about_2_msg') }}</div>
            </div>
            <div class="btn-wrap">
              <router-link :to="{ name: 'direct-market' }">
                {{ $t('private.direct_market') }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="trade-pane">
          <div class="trade-des">
            <div class="img-wrap">
              <img src="@assets/img/function-icon2.png" />
            </div>
            <div class="des-box">
              <h3>{{ $t('main_msg.about_3_title') }}</h3>
              <div>{{ $t('main_msg.about_3_msg') }}</div>
            </div>
            <div class="btn-wrap">
              <router-link :to="{ name: 'wallet' }">
                {{ $t('header.wallet') }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="trade-pane">
          <div class="trade-des">
            <div class="img-wrap">
              <img src="@assets/img/function-icon3.png" />
            </div>
            <div class="des-box">
              <h3>{{ $t('main_msg.about_4_title') }}</h3>
              <div>{{ $t('main_msg.about_4_msg') }}</div>
            </div>
            <div class="btn-wrap">
              <router-link
                :to="{ name: 'create-ads', params: { offer_type: 'sell' } }"
                >{{ $t('private.deal_enroll') }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <NoticeModal></NoticeModal>
  </div>
</template>
