<script>
import '@assets/css/kiosk/kiosk-certified.css'
import date from 'locutus/php/datetime/date'
import PageNavigation from '@components/kiosk/kiosk-page-navigation'
import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'
import { fetchCertificationList, cancelCertification } from '@apis/kyc'

export default {
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
        page: this.page,
        list_count: 4,
      }).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.kyc_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },

    handleCancel(p) {
      cancelCertification(p)
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.cancel'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.loadKycList()
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
    },
    handlePageChange(data) {
      this.page = data
      this.loadKycList()
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCertified" class="kiosk-certified">
    <div :class="$style.container">
      <div :class="$style.kioskKycList" class="kiosk-kyc-list">
        <div>
          <template v-if="kyc_list.length">
            <dl v-for="kyc in kyc_list" :key="kyc.seq" class="kiosk-select-box">
              <dt :class="$style.kycListDate">{{
                date('Y-m-d H:i:s', new Date(kyc.regdate))
              }}</dt>
              <dt :class="$style.kycState"
                ><strong>{{ kyc.type_title }}</strong></dt
              >
              <dd>
                {{ fromPairs(constants.kyc.certification.status)[kyc.status] }}
                <el-button
                  v-if="kyc.status === 'PENDING'"
                  @click="handleCancel(kyc.seq)"
                  >{{ $t('cancel') }}</el-button
                >
              </dd>
              <dt>{{ $t('business.expiry_date') }}</dt>
              <dd>{{
                kyc.expdate !== null
                  ? date('Y-m-d H:i:s', new Date(kyc.expdate))
                  : 'No data'
              }}</dd>
              <dt>{{ $t('private.closed_date') }}</dt>
              <dd>{{
                kyc.closed_date !== null
                  ? date('Y-m-d H:i:s', new Date(kyc.closed_date))
                  : 'No data'
              }}</dd>
            </dl>
            <PageNavigation
              :total_count="total_count"
              :total_page="page_navigation.total_page"
              :cur_page="page"
              :page_count="page_navigation.page_count"
              @change="handlePageChange"
            ></PageNavigation>
          </template>
          <template v-else>
            <div :class="$style.noListWrap">
              {{ $t('kyc.no_kyc_list') }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
