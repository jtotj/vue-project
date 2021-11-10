<script>
import '@assets/css/service-center/notice.css'
import serviceCenterNav from '@components/service-center-nav'
import { fetchFaqTypes, fetchFaqList } from '@apis/cs'
import find from 'lodash/find'
import PageNavigation from '@components/modal-page-navigation.vue'

export default {
  page: {
    title: 'ContactNotice',
    meta: [{ name: 'description', content: 'ContactNotice' }],
  },
  components: {
    serviceCenterNav,
    PageNavigation,
  },
  data() {
    return {
      loading: false,
      faq_type_list: [],
      faq_list: [],
      active_names: this.$route.query.seq || 1,
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
    }
  },
  computed: {
    c_faq_notice() {
      if (!this.faq_type_list.length) return null
      return find(this.faq_type_list, { name: 'NOTICE' })
    },
  },
  mounted() {
    Promise.all([this.loadFaqTypeList()])
      .then(() => this.loadFaqList())
      .catch((e) => this.$toasted.error(e.message))
  },
  methods: {
    async loadFaqTypeList() {
      const ret_obj = await fetchFaqTypes().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.faq_type_list = ret_obj.data
    },
    async loadFaqList() {
      this.loading = true

      const ret_obj = await fetchFaqList({
        ...this.$route.query,
        list_count: 5,
        page: this.page,
        type_seq: this.c_faq_notice.seq,
      }).catch((e) => this.$toasted.error(e.message))
      this.faq_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
      this.loading = false
    },
    goFaqList(type_seq) {
      this.$router.push({
        name: 'faq',
        query: { type_seq: type_seq },
      })
    },
    handlePageChange(data) {
      this.page = data
      this.loadFaqList()
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
      <div v-loading="loading" :class="[$style.rightContent]">
        <h3 :class="[$style.subTitle]">
          {{ $t('header.notice') }}
        </h3>

        <el-collapse v-model="active_names" accordion>
          <el-collapse-item
            v-for="faq in faq_list"
            :key="faq.seq"
            :title="`${faq.title}`"
            class="notice"
            :name="faq.seq"
          >
            <p v-html="faq.content"></p>
          </el-collapse-item>
        </el-collapse>

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
@import '@src/design/service-center.scss';
</style>
