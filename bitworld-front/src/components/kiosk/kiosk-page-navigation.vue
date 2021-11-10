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
  <div :class="[$style.pageNavigation, $style.a1]">
    <div
      :class="$style.pageBackBtn"
      :disabled="page_navigation.first_page === 1"
      @click="$emit('change', page_navigation.first_page - 1)"
    >
      <img src="@assets/kiosk-img/back-icon-white.svg" alt="" />
    </div>
    <ul :class="$style.page">
      <template v-for="page_no in page_nos">
        <li v-if="page_no === cur_page" :key="page_no" :class="$style.active"
          ><span>{{ page_no }}</span></li
        >
        <li v-else :key="page_no" @click="$emit('change', page_no)">
          <span>{{ page_no }}</span></li
        >
      </template>
    </ul>

    <div
      :class="$style.pageNextBtn"
      :disabled="page_navigation.last_page === total_page"
      @click="$emit('change', page_navigation.last_page + 1)"
    >
      <img src="@assets/kiosk-img/next-icon-white.svg" alt=""
    /></div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/default.scss';
@import '@src/design/font.scss';
@import '@src/design/kiosk/kiosk-pagination.scss';
</style>
