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
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('kyc.withdraw_list') }}</h2>
      </div>
      <div class="trades-wrap">
        <template v-if="withdraw_list.length">
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
                          <span class="registration-date-tit">{{
                            date('Y-m-d H:i:s', new Date(kyc.regdate))
                          }}</span>
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
                          <router-link
                            :to="{
                              name:
                                $route.path.indexOf('bank') !== -1
                                  ? 'kyc-withdraw-detail'
                                  : 'kyc-withdraw-detail',
                              params: { seq: kyc.seq },
                            }"
                            class="links"
                            >{{ $t('look_up') }}</router-link
                          >
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
                        <span>{{
                          $t('wallet_page.withdraw_account_info')
                        }}</span>
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
        </template>
        <template v-else>
          <div class="no-list">
            <div class="img-wrap">
              <img src="@assets/img/no-list.png" />
            </div>
            <p>{{ $t('kyc.no_kyc_withdraw_address_list') }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/kyc.scss';
</style>
