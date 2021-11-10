<script>
import { fetchVerificationList } from '@apis/mail'
import PageNavigation from '@components/page-navigation'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'MailVerificationList',
    meta: [{ name: 'description', content: 'MailVerificationList' }],
  },
  components: { PageNavigation },
  data() {
    return {
      mail_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      loading: false,
    }
  },
  mounted() {
    this.loadMailList()
  },
  methods: {
    date,
    async loadMailList() {
      this.loading = true
      const ret_mail_obj = await fetchVerificationList({
        ...this.$route.query,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.mail_list = ret_mail_obj.data
      this.total_count = ret_mail_obj.total_count
      this.total_page = ret_mail_obj.total_page
      this.page_navigation = ret_mail_obj.page_navigation
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="contents">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('my_page.mail_cert_list') }}</h2>
      </div>
      <div class="trades-wrap">
        <div v-loading="loading" class="container">
          <template v-if="mail_list.length">
            <div class="main-deal">
              <ul class="deal-list">
                <template v-for="mail in mail_list">
                  <li :key="mail.seq" :class="['deal-act']">
                    <span class="number-badge">
                      {{ mail._no }}
                    </span>
                    <div class="wrap">
                      <div class="left-info">
                        <strong class="tit">
                          {{
                            mail.is_valid === 'Y'
                              ? $t('my_page.auth_complete')
                              : $t('my_page.not_auth')
                          }}
                        </strong>
                        <ul class="short-list">
                          <li>
                            <span>
                              {{ $t('registration_date') }}
                            </span>
                            {{ date('Y-m-d H:i:s', new Date(mail.regdate)) }}
                          </li>
                        </ul>
                      </div>
                      <div class="right-info">
                        <p>{{ mail.email_address }}</p>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
            <PageNavigation
              :total_count="total_count"
              :total_page="page_navigation.total_page"
              :cur_page="page"
              :page_count="page_navigation.page_count"
            ></PageNavigation>
          </template>
          <template v-else>
            <div :class="[$style.noListWrap]">
              <img :class="[$style.noListImg]" src="@assets/img/no-list.png" />
              <p>{{ $t('my_page.no_mail_list') }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
</style>
