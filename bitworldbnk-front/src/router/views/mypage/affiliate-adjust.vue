<script>
import { mapState } from 'vuex'
import { fetchAffiliateAdjust } from '@apis/affiliate'
import date from 'locutus/php/datetime/date'
import PageNavigation from '@components/modal-page-navigation'
import AffiliateNav from '@components/affiliate-nav'
import filter from 'lodash/filter'
import AffiliateSelector from '@components/affiliate-selector'
export default {
  page: {
    title: 'AffiliateLog',
    meta: [{ name: 'description', content: 'AffiliateLog' }],
  },
  components: {
    PageNavigation,
    AffiliateNav,
    AffiliateSelector,
  },
  data() {
    return {
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      affiliate_adjust: [],
      loading: false,
      search_target_asset: 0,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('assets', ['assets']),

    c_is_active_asset() {
      return filter(this.assets, { is_active: 'Y' })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    date,
    init() {
      this.loading = true
      Promise.all([this.loadAffiliateAdjust()])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    async loadAffiliateAdjust() {
      const ret_obj = await fetchAffiliateAdjust({
        ...this.$route.query,
        list_count: 10,
        page: this.page,
      }).catch((e) => this.$toasted.error(e.message))
      this.affiliate_adjust = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handlePageChange(data) {
      this.page = data
      this.loadAffiliateAdjust()
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('affiliate.affiliate_adjust_list') }}
        </h2>
      </div>
      <div :class="[$style.affiliageAdjust]">
        <AffiliateNav></AffiliateNav>
        <div class="account-search">
          <!-- 자산별 검색 추가 -->
          <p :class="[$style.title]">
            {{ $t('affiliate.search_by_asset') }}
          </p>
          <AffiliateSelector v-model="search_target_asset"></AffiliateSelector>
        </div>
        <div v-loading="loading" :class="[$style.tableWrap]">
          <table>
            <thead>
              <tr>
                <th>
                  {{ $t('affiliate.asset_name') }}
                </th>
                <th>
                  {{ $t('affiliate.asset_code') }}
                </th>
                <th>
                  {{ $t('affiliate.calculate_amount') }}
                </th>
                <th>
                  {{ $t('affiliate.account_number') }}
                </th>
                <th>
                  {{ $t('affiliate.registration_date') }}
                </th>
              </tr>
            </thead>
            <tbody v-for="affiliate in affiliate_adjust" :key="affiliate.seq">
              <div :class="[$style.row]">
                <tr>
                  <td>
                    {{ affiliate.asset_title }}
                  </td>
                  <td>
                    {{ affiliate.asset_code }}
                  </td>
                  <td class="nowrap text-right">
                    {{ affiliate.amount | trimDecimalZero | numberFormat }}
                  </td>
                  <td class="nowrap">
                    {{ affiliate.account_number }}
                  </td>
                  <td class="nowrap">
                    {{ date('Y-m-d H:i:s', new Date(affiliate.regdate)) }}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
          <div v-if="!affiliate_adjust.length" class="no-list">
            <div class="img-wrap">
              <img src="@assets/img/no-list.png" />
            </div>
            <p>
              {{ $t('affiliate.no_affiliate_adjust') }}
            </p>
          </div>
        </div>
        <PageNavigation
          class="page-navigation"
          :total_count="total_count"
          :total_page="page_navigation.total_page"
          :cur_page="page"
          :page_count="page_navigation.page_count"
          @change="handlePageChange"
        ></PageNavigation>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/affiliate.scss';
@import '@src/design/favorite.scss';
@import '@src/design/affiliate-selector.scss';
</style>
