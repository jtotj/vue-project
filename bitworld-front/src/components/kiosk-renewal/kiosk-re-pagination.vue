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
  <div class="pagination a1">
    <div class="paging-wrap">
      <template v-for="page_no in page_nos">
        <strong v-if="page_no === cur_page" :key="page_no">{{
          page_no
        }}</strong>
        <a v-else :key="page_no" @click="$emit('change', page_no)">{{
          page_no
        }}</a>
      </template>
    </div>
    <div class="btns-wrap">
      <button
        class="prevEnd"
        :disabled="page_navigation.first_page === 1"
        @click="$emit('change', page_navigation.first_page - 1)"
      >
        <img src="@assets/kiosk-re-img/lang_left_btn.svg" alt="" />
      </button>
      <button
        class="nextEnd"
        :disabled="page_navigation.last_page === total_page"
        @click="$emit('change', page_navigation.last_page + 1)"
      >
        <img src="@assets/kiosk-re-img/lang_right_btn.svg" alt=""
      /></button>
    </div>
  </div>
</template>

<style scoped>
/* Pagination Reset */
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  padding: 20px 0;
  margin: 0 auto;
  clear: both;
}

.pagination * {
  padding: 0;
  margin: 0;
}

.pagination img {
  border: 0;
}

.pagination a,
.pagination button,
.pagination strong {
  display: block;
  float: left;
  min-width: 50px;
  padding: 0 5px;
  margin: 0;
  font-family: inter Bold;
  font-size: 42px;
  font-weight: 500;
  line-height: normal;
  color: #737373;
  text-align: center;
  letter-spacing: 0 !important;
  cursor: pointer;
}

.pagination strong {
  font-size: 42px;
  font-weight: bold;
  line-height: normal;
  color: #0068c1 !important;
}

.pagination button.prev,
.pagination button.prevEnd,
.pagination button.next,
.pagination button.nextEnd {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 50px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-family: inter Light, Arial;
  line-height: 30px;
  color: white;
  color: #fff;
  letter-spacing: 0 !important;
  cursor: pointer;
  background: #0068c1;
  border-radius: 10px;
}

.pagination button.prev:hover,
.pagination button.prevEnd:hover,
.pagination button.next:hover,
.pagination button.nextEnd:hover {
  background: #0081f1 !important;
}

.pagination.a1 {
  display: flex;
  align-items: center;
}

.pagination .paging-wrap {
  position: relative;
  z-index: 99;
}

.pagination .paging-wrap strong,
.pagination .paging-wrap a {
  line-height: 50px;
}

.pagination .btns-wrap {
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
