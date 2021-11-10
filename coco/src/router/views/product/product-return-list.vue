<script>
import { fetchFinanceReturnList } from '@apis/finance'
import PageNavigation from '@components/page-navigation'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'ProductReturnList',
    meta: [{ name: 'description', content: 'ProductReturnList' }],
  },
  components: { PageNavigation },
  data() {
    return {
      list: [],
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
      this.loadList()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadList()
  },
  methods: {
    fromPairs,
    date,
    async loadList() {
      this.loading = true
      const obj = await fetchFinanceReturnList({
        ...this.$route.query,
        list_count: 5,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.list = obj.data
      this.total_count = obj.total_count
      this.total_page = obj.total_page
      this.page_navigation = obj.page_navigation
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ '자금반환 내역' }}</h2>
      </div>
      <div class="trades-wrap">
        <div v-loading="loading">
          <template v-if="list.length">
            <div class="main-deal">
              <ul class="deal-list">
                <template v-for="data in list">
                  <li :key="data.seq" :class="['deal-act']">
                    <span class="number-badge">
                      {{ data._no }}
                    </span>
                    <div class="wrap">
                      <div class="left-info">
                        <strong class="tit">{{ data.instrument_title }}</strong>
                        <ul class="short-list">
                          <li>
                            <span>
                              {{ $t('registration_date') }}
                            </span>
                            {{ date('Y-m-d H:i:s', new Date(data.regdate)) }}
                          </li>
                        </ul>
                      </div>
                      <div class="right-info">
                        <span>{{
                          fromPairs(constants.finance.return.return_type)[
                            data.return_type
                          ]
                        }}</span>
                        <div class="act-wrap">
                          <a
                            v-if="0"
                            class="links"
                            @click="handleClick(data.seq)"
                            >{{ $t('detail') }}</a
                          >
                        </div>
                      </div>
                    </div>
                    <div class="acco-content">
                      <ul class="detail-list">
                        <li>
                          <span>{{ '원금액' }}</span>
                          <strong
                            ><span>{{ data.amount }}</span></strong
                          >
                        </li>
                        <li v-if="data.instrument_type !== 'DIVEARN'">
                          <span>{{ '이자' }}</span>
                          <strong
                            ><span>{{ data.interest_amount }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ '총금액' }}</span>
                          <strong
                            ><span>{{ data.net_amount }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ '반환자' }}</span>
                          <strong
                            ><span>{{
                              fromPairs(constants.finance.return.returner_type)[
                                data.returner_type
                              ]
                            }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ '자금 계좌번호' }}</span>
                          <strong
                            ><span>{{ data.fund_account_number }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ '반환 계좌번호' }}</span>
                          <strong
                            ><span>{{
                              data.return_account_number
                            }}</span></strong
                          >
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
            <div class="no-list">
              <div class="img-wrap">
                <img src="@assets/img/no-list.png" />
              </div>
              <p>{{ '상품반환 내역이 없습니다' }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
