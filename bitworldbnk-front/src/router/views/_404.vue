<script>
export default {
  page: {
    title: '404',
    meta: [{ name: 'description', content: '404' }],
  },
  props: {
    resource: {
      type: String,
      default: '',
    },
  },
}
</script>

<template>
  <div :class="[$style.notFoundContent]">
    <div :class="[$style.titleWrap]">
      <div :class="[$style.error]">
        <div :class="[$style.circle]"></div>
        <p>ERROR</p>
        <div :class="[$style.circle]"></div>
      </div>
      <div :class="[$style.title]">
        <img src="@assets/img/404.png" alt />
      </div>
      <div :class="[$style.txt]">
        <template v-if="resource">{{ resource }}</template>
        PAGE NOT FOUND
      </div>
      <div :class="[$style.btnWrap]">
        <router-link to="/">
          <div :class="[$style.imgWrap]">
            <img src="@assets/img/arrow-left.png" />
          </div>
          {{ $t('private.go_home') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.notFoundContent {
  box-sizing: border-box;
  width: 800px;
  padding: 100px 0;
  margin: 100px auto;
  background-color: #f9f9f9;
  border: 1px solid #e5e5e5;

  .titleWrap {
    width: 300px;
    padding: 20px;
    margin: 0 auto;
    text-align: center;

    .error {
      .circle {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #0068c1;
        border-radius: 10px;
      }
      p {
        display: inline-block;
        padding: 0 10px;
        font-size: 14px;
        line-height: 22px;
        color: #0068c1;
        letter-spacing: 0;
      }
    }
    .titleWrap {
      .title {
        padding: 20px 0;
        border-bottom: 1px solid #cddae0;
      }
      .txt {
        padding: 20px 0;
        letter-spacing: 0;
      }
    }
    .btnWrap {
      padding-top: 40px;

      .imgWrap {
        float: left;
        width: 6px;
        margin-right: 5px;
      }

      a {
        display: inline-block;
        padding: 15px 30px;
        color: white;
        background-color: #0068c1;

        &:hover {
          background-color: #007ae6;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .content {
    width: 100%;
  }
}
</style>
