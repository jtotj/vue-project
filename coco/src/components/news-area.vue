<script>
import { fetchDocumentList } from '@apis/xe/board'
import htmlspecialchars_decode from 'locutus/php/strings/htmlspecialchars_decode'

export default {
  data() {
    return {
      mid: 'news',
      list_count: 8,
      news: [],
      loading: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([this.loadDocumentList()])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    async loadDocumentList() {
      const { document_list } = await fetchDocumentList({ mid: this.mid })

      this.news = document_list.slice(0, this.list_count).map((val) => ({
        title: htmlspecialchars_decode(val.title),
        link: `https://aboutcoin.io/${this.mid}/${val.document_srl}`,
      }))
    },
  },
}
</script>

<template>
  <div class="news-area">
    <div class="main-title">
      <h2>
        {{ $t('footer.news') }}
      </h2>
      <a class="more-view" href="http://aboutcoin.io/news">
        {{ $t('dash.more') }}
        <div class="img-wrap">
          <img src="@assets/img/arrow-right-grey.svg" alt="" />
        </div>
      </a>
    </div>

    <div class="news-list">
      <content-placeholders v-if="loading">
        <content-placeholders-text :lines="18" />
      </content-placeholders>
      <ul v-else>
        <li v-for="item in news" :key="item.title">
          <a :href="item.link" target="_blank"> - {{ item.title }} </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.news-area {
  float: right;
  width: 46%;
}

.news-area .main-title {
  overflow: hidden;
}

.news-area .main-title h2 {
  float: left;
}
.news-area .more-view {
  float: right;
  padding: 12px 0;
}

.news-area .img-wrap {
  float: right;
  width: 5px;
  padding-left: 10px;
}

.news-area .news-list ul {
  min-height: 450px;
}

.news-area .news-list ul li {
  padding: 15px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #e5e5e5;
}

.news-area .news-list ul li a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .news-area {
    width: 100%;
  }
}
</style>
