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
      const ret_obj = await fetchCertificationList({
        ...this.$route.query,
        list_count: 5,
      }).catch((e) => this.$toasted.error(e.message))
      this.kyc_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleClick(seq) {
      if (this.$route.path.indexOf('bank') !== -1) {
        this.$router.push({
          name: 'bank-kyc-detail',
          query: {
            seq: seq,
          },
        })
      } else if (this.$route.path.indexOf('b2c') !== -1) {
        this.$router.push({
          name: 'b2c-kyc-detail',
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
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ $t('kyc.kyc_cert_list') }}</span>
      </div>
    </div>
    <div class="trades-wrap">
      <div class="container">
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
                      fromPairs(constants.kyc.certification.status)[kyc.status]
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
                        class="links"
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
      </div>
    </div>
  </div>
</template>
