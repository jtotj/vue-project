<script>
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import { fetchCertificationList, cancelCertification } from '@apis/kyc'
import PageNavigation from '@components/page-navigation'
export default {
  page: {
    title: 'KycCertificationList',
    meta: [{ name: 'description', content: 'KycCertificationList' }],
  },
  components: { PageNavigation },
  data() {
    return {
      kyc_list: [],
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
      this.loadKycList()
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1
    this.loadKycList()
  },
  methods: {
    fromPairs,
    date,
    async loadKycList() {
      this.loading = true
      const ret_obj = await fetchCertificationList({
        ...this.$route.query,
        list_count: 5,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.kyc_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleClick(seq) {
      if (this.$route.path.indexOf('bank') !== -1) {
        this.$router.push({
          name: 'kyc-detail',
          query: {
            seq: seq,
          },
        })
      } else {
        this.$router.push({
          name: 'kyc-detail',
          query: {
            seq: seq,
          },
        })
      }
    },

    handleCancel(p) {
      cancelCertification(p)
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.cancel'))
          this.loadKycList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('kyc.kyc_cert_list') }}</h2>
      </div>
      <div class="trades-wrap">
        <div v-loading="loading">
          <template v-if="kyc_list.length">
            <div class="main-deal">
              <ul class="deal-list">
                <template v-for="kyc in kyc_list">
                  <li :key="kyc.seq" :class="['deal-act']">
                    <span class="number-badge">
                      {{ kyc._no }}
                    </span>
                    <div class="wrap">
                      <div class="left-info">
                        <strong class="tit">{{
                          fromPairs(constants.kyc.certification.status)[
                            kyc.status
                          ]
                        }}</strong>
                        <ul class="short-list">
                          <li>
                            <span>
                              {{ $t('registration_date') }}
                            </span>
                            {{ date('Y-m-d H:i:s', new Date(kyc.regdate)) }}
                          </li>
                        </ul>
                      </div>
                      <div class="right-info">
                        <span>{{ kyc.type_title }}</span>
                        <div class="act-wrap">
                          <a class="links" @click="handleClick(kyc.seq)">{{
                            $t('detail')
                          }}</a>
                          <a
                            v-if="kyc.status === 'PENDING'"
                            class="links cancel"
                            @click="handleCancel(kyc.seq)"
                            >{{ $t('cancel') }}</a
                          >
                        </div>
                      </div>
                    </div>
                    <div class="acco-content">
                      <ul class="detail-list">
                        <li>
                          <span>{{ $t('my_page.expdate') }}</span>
                          <strong
                            ><span>{{
                              kyc.expdate !== null
                                ? date('Y-m-d H:i:s', new Date(kyc.expdate))
                                : 'No data'
                            }}</span></strong
                          >
                        </li>
                        <li>
                          <span>{{ $t('private.closed_date') }}</span>
                          <strong
                            ><span>{{
                              kyc.closed_date !== null
                                ? date('Y-m-d H:i:s', new Date(kyc.closed_date))
                                : 'No data'
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
              <p>{{ $t('kyc.no_kyc_list') }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/kyc.scss';
</style>
