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
    <button
      :class="$style.prevEnd"
      :disabled="cur_page === 1"
      @click="$emit('change', cur_page - 1)"
    ></button>
    <template v-for="page_no in page_nos">
      <strong v-if="page_no === cur_page" :key="page_no">{{ page_no }}</strong>
      <a v-else :key="page_no" @click="$emit('change', page_no)">{{
        page_no
      }}</a>
    </template>
    <button
      :class="$style.nextEnd"
      :disabled="cur_page === total_page"
      @click="$emit('change', cur_page + 1)"
    ></button>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/pagination.scss';
</style>
