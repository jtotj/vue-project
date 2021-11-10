<script>
import PageHandler from '@utils/page-handler'

export default {
  name: 'PageNavigation',
  props: {
    total_page: {
      type: Number,
      default: 1,
    },
    cur_page: {
      type: [Number, String],
      default: 1,
    },
    total_count: {
      type: Number,
      default: 0,
    },
    page_count: {
      type: Number,
      default: 10,
    },
  },

  computed: {
    page_navigation: function() {
      return new PageHandler(
        this.total_count,
        this.total_page || 1,
        this.cur_page,
        this.page_count
      )
    },
    c_cur_page() {
      return Number(this.cur_page)
    },
    page_nos: function() {
      const page_nos = []
      let page_no = null

      // eslint-disable-next-line no-cond-assign
      while ((page_no = this.page_navigation.getNextPage())) {
        page_nos.push(page_no)
      }

      return page_nos
    },
  },
}
</script>

<template>
  <div :class="[$style.pagination, $style.a1]">
    <router-link
      :to="{
        query: Object.assign({}, $route.query, {
          page: c_cur_page - 1,
        }),
      }"
      :class="$style.prevEnd"
      :disabled="c_cur_page === page_navigation.first_page"
      tag="button"
      @click="$emit('change', page_navigation.first_page - 1)"
    ></router-link>
    <template v-for="page_no in page_nos">
      <strong v-if="page_no === c_cur_page" :key="page_no">{{
        page_no
      }}</strong>
      <router-link
        v-else
        :key="page_no"
        :to="{ query: Object.assign({}, $route.query, { page: page_no }) }"
        @click="$emit('change', page_no)"
        >{{ page_no }}</router-link
      >
    </template>
    <router-link
      :to="{
        query: Object.assign({}, $route.query, {
          page: c_cur_page + 1,
        }),
      }"
      :class="$style.nextEnd"
      :disabled="c_cur_page === total_page"
      tag="button"
      @click="$emit('change', page_navigation.last_page + 1)"
    ></router-link>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/pagination.scss';
</style>
