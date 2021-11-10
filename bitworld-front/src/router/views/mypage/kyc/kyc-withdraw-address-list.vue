<script>
import { fetchWithdrawAddressList } from '@apis/kyc'
import { mapState } from 'vuex'
import PageNavigation from '@components/page-navigation'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'KycWithdrawAddressList',
    meta: [{ name: 'description', content: 'KycWithdrawAddressList' }],
  },
  components: { PageNavigation },

  data() {
    return {
      withdraw_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      open_mobile_tab: null,
      page_navigation: {},
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
      this.loadWithdrawAddress()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadWithdrawAddress()
  },
  methods: {
    fromPairs,
    date,
    async loadWithdrawAddress() {
      const obj = await fetchWithdrawAddressList({
        ...this.$route.query,
        list_count: 10,
      }).catch((e) => this.$toasted.error(e.message))
      this.withdraw_list = obj.data
      this.total_count = obj.total_count
      this.total_page = obj.total_page
      this.page_navigation = obj.page_navigation
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ $t('kyc.withdraw_list') }}</span>
      </div>
    </div>
    <div class="trades-wrap">
      <div class="container">
        <div class="main-deal">
          <div class="deal-list">
            <template v-for="(kyc, index) in withdraw_list">
              <li
                :key="kyc.seq"
                :class="['deal-act', { on: open_mobile_tab === index }]"
              >
                <span class="number-badge">
                  {{ kyc._no }}
                </span>
                <div class="wrap">
                  <div class="left-info">
                    <strong class="tit">{{ kyc.asset_title }}</strong>
                    <ul class="short-list">
                      <li>
                        <span>{{ $t('registration_date') }}</span>
                        {{ date('Y-m-d H:i:s', new Date(kyc.regdate)) }}
                      </li>
                    </ul>
                  </div>
                  <div class="right-info">
                    <div class="multiple">
                      <span>
                        {{
                          fromPairs(
                            constants.kyc.asset_withdraw_address_certification
                              .status
                          )[kyc.status]
                        }}
                        {{
                          kyc.is_valid !== null ? $t('allow') : $t('disallow')
                        }}
                      </span>
                      <div class="act-wrap">
                        <template v-if="$route.path.indexOf('b2c') === -1">
                          <router-link
                            :to="{
                              name:
                                $route.path.indexOf('bank') !== -1
                                  ? 'bank-kyc-withdraw-detail'
                                  : 'kyc-withdraw-detail',
                              params: { seq: kyc.seq },
                            }"
                            class="links"
                            >{{ $t('look_up') }}</router-link
                          >
                        </template>
                        <template v-else>
                          <router-link
                            :to="{
                              name: 'b2c-kyc-withdraw-detail',
                              params: { seq: kyc.seq },
                            }"
                            class="links"
                            >{{ $t('look_up') }}</router-link
                          >
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="acco-content">
                  <ul class="detail-list">
                    <li>
                      <span>{{ $t('kyc.holder_name') }}</span>
                      <strong
                        ><span>{{ kyc.holder_name }}</span></strong
                      >
                    </li>
                    <li>
                      <span>{{ $t('kyc.bank_name') }}</span>
                      <strong
                        ><span>{{
                          fromPairs(
                            constants.kyc.asset_withdraw_address_certification
                              .bank_codes
                          )[kyc.bank_code]
                        }}</span></strong
                      >
                    </li>
                    <li>
                      <span>{{ $t('wallet_page.withdraw_account_info') }}</span>
                      <strong
                        ><span>{{ kyc.withdraw_address }}</span></strong
                      >
                    </li>
                    <li v-if="kyc.expadate">
                      <span>{{ $t('my_page.expdate') }}</span>
                      <strong
                        ><span>{{
                          date('Y-m-d H:i:s', new Date(kyc.expdate))
                        }}</span></strong
                      >
                    </li>
                    <li>
                      <span>{{ $t('private.closed_date') }}</span>
                      <strong
                        ><span>{{
                          date('Y-m-d H:i:s', new Date(kyc.closed_date))
                        }}</span></strong
                      >
                    </li>
                  </ul>
                </div>
              </li>
            </template>
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
