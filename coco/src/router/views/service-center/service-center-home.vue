<script>
import serviceCenterNav from '@components/service-center-nav'
import { fetchFaqList } from '@apis/cs'
import filter from 'lodash/filter'

export default {
  page: {
    title: 'ServiceCenterHome',
    meta: [{ name: 'description', content: 'ServiceCenterHome' }],
  },
  components: {
    serviceCenterNav,
  },
  data() {
    return {
      faq_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},

      faq_content: false,
      open_faq_index: null,
    }
  },
  computed: {
    c_faq_contents() {
      return filter(this.faq_list, (list) => list.type_name === 'NOTICE')
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1

    Promise.all([])
      .then(() => this.loadFaqList())
      .catch((e) => this.$toasted.error(e.message))
  },
  methods: {
    async loadFaqList() {
      const ret_obj = await fetchFaqList({
        ...this.$route.query,
        list_count: 5,
      }).catch((e) => this.$toasted.error(e.message))
      this.faq_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    goFaqList(type_seq) {
      this.$router.push({
        name: 'faq',
        query: { type_seq: type_seq },
      })
    },
    openFaqContent(faq_seq) {
      if (this.open_faq_index === faq_seq) {
        this.open_faq_index = null
      } else {
        this.open_faq_index = faq_seq
      }
    },
  },
}
</script>
<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('customer_service') }}
        </h2>
      </div>
      <serviceCenterNav></serviceCenterNav>
      <div :class="[$style.rightContent]">
        <div class="box-white marginB-10">
          <h3>
            {{ $t('service_hours') }}
          </h3>
          <p> 10:00 - 19:00 {{ $t('all_day_long') }} </p>
        </div>
        <div class="box-white marginB-10">
          <h3>
            {{ $t('online_service_hours') }}
          </h3>
          <p>
            {{ $t('unusable_hours') }}
          </p>
        </div>
        <div class="box-white">
          <h3>
            {{ $t('offline_hours') }}
          </h3>
          <p>10:00 - 19:00 {{ $t('offline_bank_hours') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
</style>
