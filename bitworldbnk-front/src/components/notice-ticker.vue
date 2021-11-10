<script>
export default {
  data() {
    return {
      mids: ['news', 'pnotice'],
      list_count: 10,
      result: {
        news: [],
        notice: [],
      },
      // 새 글의 수명을 1/1000초로 표현함
      // new_ttl_milisec: 2 * 24 * 3600 * 1000,
    }
  },
  mounted() {
    Promise.all([this.loadDocumentNewsList(), this.loadDocumentNoticeList()])
      .catch((e) => this.$toasted.error(e.message))
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async loadDocumentNewsList() {
      /* const { document_list } = await fetchDocumentList({
        mid: 'news',
      })

      this.result['news'] = document_list
        .slice(0, this.list_count)
        .map((val) => ({
          title: htmlspecialchars_decode(val.title),
          link: `https://aboutcoin.io/${this.mids['news']}/${val.document_srl}`,
          regdate: htmlspecialchars_decode(val.regdate),
        })) */
    },
    async loadDocumentNoticeList() {
      /* const { document_list } = await fetchCocofxDocumentList({
        mid: 'pnotice',
      })

      this.result['notice'] = document_list
        .slice(0, this.list_count)
        .map((val) => ({
          title: htmlspecialchars_decode(val.title),
          link: `https://cocofx.com/${this.mids['pnotice']}/${
            val.document_srl
          }`,
          regdate: htmlspecialchars_decode(val.regdate),
        })) */
    },
    // isNew(document) {
    //   return (
    //     Date.now() - new Date(document.regdate).getTime() <=
    //     this.new_ttl_milisec
    //   )
    // },
  },
}
</script>

<template>
  <!-- 공지사항 및 뉴스 -->
  <div class="notice-news-wrap">
    <!-- 공지사항 -->
    <div class="header-notice-wrap">
      <el-carousel height="40px" direction="vertical" arrow="never">
        <el-carousel-item
          v-for="notice in result['notice']"
          :key="notice.title"
          class="header-notice-item"
        >
          <a :href="notice.link" target="_blank">
            <img src="@assets/img/icon/icon-bell-notice.svg" alt="공지" />
            {{ notice.title }}
          </a>
        </el-carousel-item>
        <el-carousel-item
          v-if="!this.result['notice'].length"
          class="header-notice-item"
        >
          <img
            src="@assets/img/icon/icon-bell-notice.svg"
            alt="공지"
          />공지사항이 없습니다.
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 뉴스 -->
    <div class="header-news-wrap">
      <ul class="header-news-list">
        <li
          v-for="news in result['news']"
          :key="news.title"
          class="header-news-item"
        >
          <a :href="news.link" target="_blank">
            <span class="fc-skyblue">NEWS</span>
            {{ news.title }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
/* Notic-news */
.notice-news-wrap {
  width: 100%;
  height: 40px;
  overflow: hidden;
}

.header-notice-wrap {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 320px;
  height: 40px;
  padding: 0 20px;
  overflow: hidden;
  background-color: #f6f6f6;
}

.header-notice-list {
  width: 100%;
}

.header-notice-item {
  width: 100%;
  font-weight: 700;
  line-height: 40px;
}
.header-notice-item > a {
  font-size: 14px;
}

.header-notice-item img {
  position: relative;
  top: 1px;
  width: auto;
  margin-right: 5px;
}

.header-news-wrap {
  background-color: #333;
}

.header-news-list {
  left: 0;
  display: inline-block;
  height: 40px;
  white-space: nowrap;
  -webkit-animation-name: ticker;
  animation-name: ticker;
  -webkit-animation-duration: 70s;
  animation-duration: 70s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;

  /* animation: newsAni 30s linear infinite; */
}

.header-news-list:hover {
  animation-play-state: paused;
}

.header-news-item {
  display: inline-block;
  padding: 0 100px;
  line-height: 40px;
}

.header-news-item > a {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -1.2px;
}

.header-news-item .fc-skyblue {
  padding-right: 5px;
  font-size: 14px;
  color: #2b9ce1;
  letter-spacing: -1px;
}

@-webkit-keyframes ticker {
  0% {
    visibility: visible;
    -webkit-transform: translateX(100vw);
    transform: translateX(100vw);
  }
  100% {
    -webkit-transform: translateX(-100vw);
    transform: translateX(-100vw);
  }
}

@keyframes ticker {
  0% {
    visibility: visible;
    -webkit-transform: translateX(100vw);
    transform: translateX(100vw);
  }
  100% {
    -webkit-transform: translateX(-100vw);
    transform: translateX(-100vw);
  }
}

@media screen and (max-width: 768px) {
  .notice-news-wrap {
    height: 80px;
  }
  .header-notice-wrap {
    position: static;
    width: 100%;
    padding: 0;
    margin: 0 auto;
    text-align: center;
  }
  .header-news-list {
    -webkit-animation-duration: 50s;
    animation-duration: 50s;
  }
}
</style>
