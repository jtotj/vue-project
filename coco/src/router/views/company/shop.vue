<script>
import { fetchMerchantList } from '@apis/pg'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import PageNavigation from '@components/page-navigation'
export default {
  page: {
    title: 'Bank::BankShop',
    meta: [{ name: 'description', content: 'Bank::BankShop' }],
  },
  components: { PageNavigation },
  data() {
    return {
      merchant_list: [],
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
  },
  watch: {
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.loadMerchantList()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadMerchantList()
  },
  methods: {
    date,
    fromPairs,
    async loadMerchantList() {
      this.loading = true
      const ret_obj = await fetchMerchantList({
        ...this.$route.query,
        list_count: 10,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.merchant_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('shop.shop_list') }}</h2>
        <div class="btn-wrap">
          <router-link
            :to="{ name: 'merchant-create' }"
            class="create-merchant-link"
          >
            <i class="fas fa-plus-circle"></i>
            {{ $t('shop.shop_create') }}
          </router-link>
        </div>
      </div>
      <div :class="[$style.shop]">
        <div v-loading="loading" :class="[$style.tableWrap]">
          <div class="pc">
            <table :class="[$style.table]">
              <thead>
                <tr>
                  <th>{{ $t('shop.shop_cre_date') }}</th>
                  <th>{{ $t('shop.shop_title') }}</th>
                  <th>{{ $t('shop.shop_id') }}</th>
                  <th>{{ $t('shop.shop_state') }}</th>
                  <th>{{ $t('shop.shop_work') }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="merchant_list.length">
                  <tr
                    v-for="merchant in merchant_list"
                    :key="merchant.seq"
                    :class="[$style.merchantList]"
                  >
                    <td class="date">
                      <div class="recurrance-icon-placeholder"></div>
                      {{ date('Y-m-d H:i:s', new Date(merchant.regdate)) }}
                    </td>
                    <td class="invoice-id">
                      <span>{{ merchant.merchant_name }}</span>
                    </td>
                    <td class="recipient">
                      <span>{{ merchant.merchant_id }}</span>
                    </td>
                    <td class="status">
                      {{
                        fromPairs(constants.pg.merchant.status)[merchant.status]
                      }}
                    </td>
                    <td class="actions">
                      <div class="btn-group">
                        <router-link
                          :to="{
                            name: 'merchant-detail',
                            params: { merchant_seq: merchant.seq },
                          }"
                          :class="[$style.btnSmall]"
                          >{{ $t('shop.shop_detail') }}</router-link
                        >
                        <router-link
                          :to="{
                            name: 'merchant-update',
                            params: {
                              merchant_seq: merchant.seq,
                              merchant_name: merchant.merchant_name,
                            },
                          }"
                          :class="[$style.btnSmall]"
                          >{{ $t('shop.shop_retouch') }}</router-link
                        >
                        <router-link
                          :to="{
                            name: 'merchant-account-list',
                            params: { merchant_seq: merchant.seq },
                          }"
                          :class="[$style.btnSmall]"
                          >{{ $t('shop.shop_settlement') }}</router-link
                        >
                        <router-link
                          :to="{
                            name: 'merchant-transaction-list',
                            params: { merchant_seq: merchant.seq },
                          }"
                          :class="[$style.btnSmall]"
                          >{{ $t('shop.shop_history') }}</router-link
                        >
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="5">
                      {{ $t('shop.no_shop_list') }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="mobile">
            <div :class="[$style.table]">
              <ul v-if="merchant_list.length">
                <li
                  v-for="data in merchant_list"
                  :key="data.seq"
                  :class="[$style.merchantList]"
                >
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('shop.shop_title')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{
                      data.merchant_name
                    }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('shop.shop_cre_date')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{
                      date('Y-m-d H:i:s', new Date(data.regdate))
                    }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('shop.shop_id')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{
                      data.merchant_id
                    }}</span>
                  </div>
                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('shop.shop_state')
                    }}</span>
                    <span :class="[$style.bodyContent]">{{
                      fromPairs(constants.pg.merchant.status)[data.status]
                    }}</span>
                  </div>

                  <div :class="[$style.mainBody]">
                    <span :class="[$style.bodyTitle]">{{
                      $t('shop.shop_work')
                    }}</span>
                    <div :class="[$style.bodyContent]">
                      <div :class="[$style.btnWrap]">
                        <router-link
                          :to="{
                            name: 'merchant-detail',
                            params: { merchant_seq: data.seq },
                          }"
                          >{{ $t('shop.shop_detail') }}</router-link
                        >
                        <router-link
                          :to="{
                            name: 'merchant-update',
                            params: { merchant_seq: data.seq },
                          }"
                          >{{ $t('shop.shop_retouch') }}</router-link
                        >
                        <router-link
                          :to="{
                            name: 'merchant-account-list',
                            params: { merchant_seq: data.seq },
                          }"
                          >{{ $t('shop.shop_settlement') }}</router-link
                        >
                        <router-link
                          :to="{
                            name: 'merchant-transaction-list',
                            params: { merchant_seq: data.seq },
                          }"
                          >{{ $t('shop.shop_history') }}</router-link
                        >
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-else class="no-list">
                <div class="img-wrap">
                  <img src="@assets/img/no-list.png" />
                </div>
                <p>{{ $t('shop.no_shop_list') }}</p>
              </div>
            </div>
          </div>
        </div>
        <PageNavigation
          :total_count="total_count"
          :total_page="page_navigation.total_page"
          :cur_page="page"
          :page_count="page_navigation.page_count"
        ></PageNavigation>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/shop.scss';
</style>

<style scoped>
.big-title-wrap {
  overflow: hidden;
}
.big-title-wrap .big-title {
  float: left;
}
.big-title-wrap .btn-wrap {
  float: right;
}
.big-title-wrap .btn-wrap svg {
  padding-right: 2px;
}
</style>
