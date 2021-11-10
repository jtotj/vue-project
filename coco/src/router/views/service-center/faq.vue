<script>
import '@assets/css/service-center/faq.css'
import serviceCenterNav from '@components/service-center-nav'
import PageNavigation from '@components/page-navigation'
import { fetchFaqTypes, fetchFaqList } from '@apis/cs'
import filter from 'lodash/filter'
import reject from 'lodash/reject'

export default {
  page: {
    title: 'Faq',
    meta: [{ name: 'description', content: 'Faq' }],
  },
  components: {
    serviceCenterNav,
    PageNavigation,
  },
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
  // watch: {
  //   $route(to, from) {
  //     this.page = this.$route.query.page || 1

  //     this.loadFaqList()
  //   },
  // },
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
        name: 'faq',
        query: { type_seq: type_seq },
      })
    },
    searchFaqList() {
      this.$router.push({
        name: 'faq',
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
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('customer_service') }}
        </h2>
      </div>
      <serviceCenterNav></serviceCenterNav>
      <div :class="[$style.rightContent]">
        <h3 :class="[$style.subTitle]">
          {{ $t('service_center.frequently_asked_questions') }}
        </h3>

        <!-- <div class="box-white popular-question">
          <h4 class="color-common">
            인기 질문
          </h4>
          <el-collapse
            v-for="question in c_popular_question"
            :key="question.seq"
          >
            <span class="icon-question">Q</span>
            <el-collapse-item :name="question.seq" :title="question.title">
              <span class="icon-answer">A</span>
              <div>
                {{ question.content }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div> -->
        <div class="faq-type-list">
          <ul class="faq-view-all">
            <li
              :class="{ 'type-active': !$route.query.type_seq }"
              @click="$router.push({ name: 'faq' })"
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
            <el-button icon="el-icon-search" @click="searchFaqList"></el-button>
          </div>
        </div>

        <div class="faq-list">
          <el-collapse v-for="faq in c_notice_remove" :key="faq.seq">
            <span class="icon-question">Q</span>
            <span v-if="!$route.query.type_seq" class="color-common">
              [{{ faq.type_title }}]
            </span>
            <el-collapse-item :name="faq.seq" :title="faq.title">
              <span class="icon-answer">A</span>
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
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
</style>
