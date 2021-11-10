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
      type: Number,
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
    search_asset: {
      type: Number,
      default: 0,
    },
    search_account: {
      type: Number,
      default: 0,
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
          page: page_navigation.first_page - 1,
          search_asset: search_asset,
          search_account: search_account,
        }),
      }"
      :class="$style.prevEnd"
      :disabled="page_navigation.first_page === 1"
      tag="button"
      @click="$emit('change', page_navigation.first_page - 1)"
    ></router-link>
    <template v-for="page_no in page_nos">
      <strong v-if="page_no === cur_page" :key="page_no">{{ page_no }}</strong>
      <router-link
        v-else
        :key="page_no"
        :to="{
          query: Object.assign({}, $route.query, {
            page: page_no,
            search_asset: search_asset,
            search_account: search_account,
          }),
        }"
        @click="$emit('change', page_no)"
        >{{ page_no }}</router-link
      >
    </template>
    <router-link
      :to="{
        query: Object.assign({}, $route.query, {
          page: page_navigation.last_page + 1,
          search_asset: search_asset,
          search_account: search_account,
        }),
      }"
      :class="$style.nextEnd"
      :disabled="page_navigation.last_page === total_page"
      tag="button"
      @click="$emit('change', page_navigation.last_page + 1)"
    ></router-link>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/pagination.scss';
</style>
