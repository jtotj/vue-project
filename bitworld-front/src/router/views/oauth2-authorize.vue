<script>
import { fetchClient, createAuthorization } from '@apis/oauth2'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'
import LocaleSelect from '@components/LocaleSelect'

export default {
  page: {
    title: 'Oauth2Authorize',
    meta: [{ name: 'description', content: 'Oauth2Authorize' }],
  },
  components: { LocaleSelect },
  data() {
    return {
      loading: false,
      button_loading: false,
      client_info: null,
      checked: true,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('auth', ['currentUser']),
    ...mapState('common', { config: (state) => state.config }),
    request_scopes() {
      const scopes = (this.$route.query.scope || '').split(' ')
      return filter(
        this.constants.oauth2.scope,
        ([scope_name]) => scopes.indexOf(scope_name) !== -1
      )
    },
    c_display_terms() {
      return filter(this.config.terms, { display: 'Y' })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([this.loadClient()])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    async loadClient() {
      const { client_info } = await fetchClient(this.$route.query.client_id)

      this.client_info = client_info
    },
    handleSubmit() {
      this.loading = true
      createAuthorization(this.$route.query)
        .then(({ redirect_to }) => {
          window.location.href = redirect_to
        })
        .catch(async (e) => {
          await this.$alert(e.message, { title: '오류', type: 'error' })

          if (e.redirect_to) {
            window.location.href = e.redirect_to
          }
        })
    },
    fromPairs,
  },
}
</script>

<template>
  <div v-loading="loading">
    <div id="header-oauth">
      <div style="position:relative;">
        <div class="connection-wrap">
          <h1 class="connection">
            <img src="@assets/img/dashed-connection.png" alt="배너 이미지" />
          </h1>
        </div>
        <div class="client-title-wrap">
          <h2 v-if="client_info" class="client-title">{{
            $t('oauth.contact_msg', [client_info.title])
          }}</h2>
        </div>
        <div class="localeSelectWrap">
          <LocaleSelect class="localeSelect"></LocaleSelect>
        </div>
      </div>
    </div>
    <div class="login-manual">
      <p>{{ $t('procedure') }}</p>
      <p>{{ $t('snslink') }}</p>
      <div>
        <p v-html="$t('four_one')"></p>
        <p>{{ $t('four_two') }}</p>
        <p>{{ $t('eight') }}</p>
        <p>{{ $t('nine') }}</p>
      </div>
      <p>{{ $t('execution') }}</p>
      <p>{{ $t('privacy') }}</p>
      <div>
        <p>{{ $t('twentyfour_three') }}</p>
        <p v-html="$t('twentyfour_two')"></p>
      </div>
      <p>{{ $t('implemented') }}</p>
    </div>
    <div v-if="client_info" :class="$style.oauth2">
      <div class="box-wrap">
        <div class="text-box">
          <p>
            <i18n path="oauth.agree_msg">
              <span class="bold">{{ client_info.title }}</span>
              <span class="mainColor">{{ currentUser.user_id }}</span>
            </i18n>
          </p>
          <p>{{ $t('oauth.agree_info') }}</p>
        </div>
        <p class="list-title">{{ $t('oauth.agree_request') }}</p>
        <ul>
          <li v-for="[name, title] in request_scopes" :key="name">
            <el-checkbox v-model="checked" disabled>{{ title }}</el-checkbox>
          </li>
        </ul>
        <div :class="$style.btnWrap">
          <button @click.prevent="handleSubmit">{{ $t('oauth.agree') }}</button>
        </div>
      </div>
    </div>
    <footer id="footer">
      <div class="container">
        <div class="terms">
          <div class="policy">
            <a href="https://cocobnk.com/policy" target="_blank">{{
              $t('pay_main.footer_6')
            }}</a>
          </div>
        </div>
      </div>
      <div class="compa-info-text">ⓒ COCOBANK All rights reserved</div>
    </footer>
  </div>
</template>

<style lang="scss" module>
@import '@design';

body {
  background-color: #fafbfc !important;
}
.oauth2 {
  box-sizing: border-box;
  max-width: 550px;
  padding: 20px;
  margin: 0 auto;
  background-color: white;
  border: 1px solid #eee;
}

.oauth2 li {
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: #333;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 2px;
}
.oauth2 .btnWrap {
  text-align: center;
}
.oauth2 button {
  padding: 10px 30px;
  margin: 20px 0;
  font-size: 14px;
  color: white;
  background-color: #aacf49;
  border-radius: 2px;
}

@media (max-width: 767px) {
  .oauth2 {
    max-width: 90%;
  }
}
</style>

<style>
#header-oauth {
  width: 550px;
  padding: 20px 0;
  margin: 0 auto;
  text-align: center;
}
#header-oauth .connection-wrap {
  width: 100%;
}
#header-oauth .client-title-wrap {
  padding: 10px 0;
}
#header-oauth .client-title-wrap .client-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: #333;
  text-align: center;
  word-break: keep-all;
}
#header-oauth .connection-wrap .connection {
  margin: 0 auto;
}
#header-oauth .connection-wrap .connection img {
  width: 100%;
}
#header-oauth .lang .gnb-svg {
  top: 0;
}
#header-oauth .container,
#footer .container {
  width: 550px;
}
.box-wrap p {
  padding: 5px 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: #666;
}
.box-wrap .list-title {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #999;
}
.login-manual {
  box-sizing: border-box;
  max-width: 550px;
  padding: 20px;
  margin: 0 auto 20px;
  background-color: white;
  border: 1px solid #eee;
}
.login-manual p {
  margin-bottom: 24px;
}
.login-manual div {
  padding: 10px 5px;
  margin-bottom: 24px;
  border: solid 1px #eee;
}
.login-manual div p:last-child {
  margin-bottom: 0;
}
.login-manual div p:nth-child(2),
.login-manual div p:nth-child(3) {
  margin-bottom: 0;
}

/* checkbox */

.box-wrap .el-checkbox__input.is-checked .el-checkbox__inner,
.box-wrap .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #aacf49 !important;
  border-color: #aacf49 !important;
}
.box-wrap .el-checkbox__inner:hover {
  border-color: #aacf49 !important;
}
.box-wrap .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #aacf49 !important;
}
.box-wrap
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner::after {
  border-color: white;
}
#footer {
  padding: 20px 0;
  text-align: center;
}
#footer .container {
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #eee;
}
#footer .terms .policy {
  text-align: center;
}
#footer .footer-item {
  width: 170px;
  padding-bottom: 10px;
  margin: 0 auto;
}
#footer .footer-item ul {
  overflow: hidden;
}
#footer .footer-item ul li {
  float: left;
  padding: 0 10px;
  font-size: 12px;
  color: #999;
}
#footer .compa-info-text {
  padding: 20px 0;
  font-size: 12px;
  color: #ccc;
  text-align: center;
}
#footer .color-footer {
  padding: 0 5px;
  font-size: 12px;
  color: #868d9a;
}
.localeSelectWrap {
  padding: 20px 0;
  text-align: left;
}

.localeSelectWrap p {
  color: #145fae;
}

.localeSelectWrap .localeSelect {
  position: relative;
  float: none;
  padding: 10px;
  border-bottom: 1px solid black;
}

.localeSelectWrap .localeSelect .drop-box {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  margin-top: 10px;
}

@media (max-width: 767px) {
  #header-oauth {
    width: 90%;
    padding: 20px 0;
    margin: 0 auto;
  }
  #header-oauth .container,
  #footer .container {
    box-sizing: border-box;
    width: 100%;
    padding: 0;
  }
  .container {
    width: 90%;
  }
}

@media (max-width: 385px) {
  #footer .color-footer {
    display: block;
    width: 100%;
    padding: 5px 0;
    font-size: 12px;
    color: #868d9a;
  }
}
</style>
