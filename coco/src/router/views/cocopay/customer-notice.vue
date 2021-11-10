<script>
import PayCsNav from '@components/pay-cs-nav'
import { fetchFaqTypes, fetchFaqList } from '@apis/cs'
import find from 'lodash/find'

export default {
  name: 'Csnotice',
  page: {
    title: 'Csnotice',
    meta: [
      {
        name: 'description',
        content: 'Csnotice',
      },
    ],
  },
  components: { PayCsNav },
  data() {
    return {
      faq_type_list: [],
      faq_list: [],
    }
  },
  computed: {
    c_faq_notice() {
      if (!this.faq_type_list.length) return null
      return find(this.faq_type_list, { name: 'NOTICE' })
    },
  },
  mounted() {
    // this.page = this.$route.query.page || 1

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
      const ret_obj = await fetchFaqList({
        ...this.$route.query,
        list_count: 5,
        type_seq: this.c_faq_notice.seq,
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
  },
}
</script>

<template>
  <div>
    <div class="pay-container cs-center">
      <h4 class="tit">{{ $t('service_center.service_center') }}</h4>
      <div class="con-wrap">
        <PayCsNav></PayCsNav>
        <div class="right-wrap">
          <el-collapse accordion>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
</style>
