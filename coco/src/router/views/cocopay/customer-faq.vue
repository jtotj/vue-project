<script>
import '@assets/css/service-center/faq.css'
import PayCsNav from '@components/pay-cs-nav'
import PageNavigation from '@components/page-navigation'
import { fetchFaqTypes, fetchFaqList } from '@apis/cs'
import filter from 'lodash/filter'
import reject from 'lodash/reject'

export default {
  name: 'Csfaq',
  page: {
    title: 'Csfaq',
    meta: [
      {
        name: 'description',
        content: 'Csfaq',
      },
    ],
  },
  components: { PayCsNav, PageNavigation },
  data() {
    return {
      faq_type_list: [],
      faq_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      popular_question: [],
      faq_content: false,
      open_faq_index: null,
      faq_search: '',
    }
  },
  computed: {
    c_notice_type_remove() {
      return reject(this.faq_type_list, (list) => list.name === 'NOTICE')
    },
    c_notice_remove() {
      return reject(this.faq_list, (list) => list.type_name === 'NOTICE')
    },
    c_popular_question() {
      return filter(this.faq_list, {
        type_name: 'POPULAR_QUESTION',
      })
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1

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
      }).catch((e) => this.$toasted.error(e.message))
      this.faq_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    goFaqList(type_seq) {
      this.$router.push({
        name: 'Csfaq',
        query: { type_seq: type_seq },
      })
    },
    searchFaqList() {
      this.$router.push({
        name: 'Csfaq',
        query: Object.assign({}, this.$route.query, {
          search_target: 'title_content',
          search_keyword: this.faq_search,
        }),
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
          <div class="faq-type-list">
            <ul class="faq-view-all">
              <li
                class="view-all"
                :class="{ 'type-active': !$route.query.type_seq }"
                @click="$router.push({ name: 'Csfaq' })"
                >{{ $t('service_center.view_all') }}</li
              >
            </ul>
            <ul>
              <li>
                <a
                  v-for="faq_type in c_notice_type_remove"
                  :key="faq_type.seq"
                  :label="faq_type.title"
                  :name="faq_type.title"
                  :class="{
                    'type-active': faq_type.seq === $route.query.type_seq,
                  }"
                  @click="goFaqList(faq_type.seq)"
                  ><i class="el-icon-caret-right" />{{ faq_type.title }}</a
                >
              </li>
            </ul>
          </div>
          <div class="faq-search">
            <div class="faq-search-box">
              <el-input
                v-model="faq_search"
                :placeholder="$t('service_center.pls_search_fap')"
              />
            </div>
            <div class="faq-search-btn">
              <el-button @click="searchFaqList"></el-button>
            </div>
          </div>
          <div class="faq-list">
            <el-collapse v-for="faq in c_notice_remove" :key="faq.seq">
              <!-- <span class="icon-question">Q</span> -->
              <img
                class="icon-question"
                src="@assets/img/pay-img/faq_q.png"
                alt=""
              />
              <span v-if="!$route.query.type_seq" class="color-common">
                [{{ faq.type_title }}]
              </span>
              <el-collapse-item :name="faq.seq" :title="faq.title">
                <!-- <span class="icon-answer">A</span> -->
                <img
                  class="icon-answer"
                  src="@assets/img/pay-img/faq_a.png"
                  alt=""
                />
                <div v-html="faq.content"> </div>
              </el-collapse-item>
            </el-collapse>
            <PageNavigation
              class="page-navigation"
              :total_count="total_count"
              :total_page="page_navigation.total_page"
              :cur_page="page"
              :page_count="page_navigation.page_count"
            ></PageNavigation>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
</style>
