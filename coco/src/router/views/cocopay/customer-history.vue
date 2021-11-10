<script>
import PayCsNav from '@components/pay-cs-nav'
import PageNavigation from '@components/page-navigation'
import { fetchTicketList, createTicketToken } from '@apis/cs'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import { mapGetters, mapState } from 'vuex'
import filter from 'lodash/filter'

export default {
  name: 'Cshistory',
  page: {
    title: 'Cshistory',
    meta: [
      {
        name: 'description',
        content: 'Cshistory',
      },
    ],
  },
  components: { PayCsNav, PageNavigation },
  data() {
    return {
      total_count: 0,
      total_page: 0,
      page: 1,
      page_navigation: {},
      ticket_list: [],
      type_seq: 0,
      ticket_seq: this.$route.query.ticket_seq || null,
      ticket_token: this.$route.query.ticket_token || null,
      ticket_id: '',
      password: '',
      input_target_inquiry: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapState(['common']),

    c_target_inquiry() {
      return filter(
        this.ticket_list,
        (ticket_info) =>
          !this.input_target_inquiry ||
          ticket_info.title
            .toLowerCase()
            .includes(this.input_target_inquiry.toLowerCase()) ||
          ticket_info.title.includes(this.input_target_inquiry)
      )
    },
  },
  mounted() {
    this.page = this.$route.query.page || 1

    if (this.loggedIn) {
      Promise.all([this.loadTicketList()]).catch((e) =>
        this.$toasted.error(e.message)
      )
    }
  },
  methods: {
    async loadTicketList() {
      this.loading = true
      const ret_obj = await fetchTicketList({
        ...this.$route.query,
        list_count: 5,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.ticket_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    async handleCreateTicketToken() {
      createTicketToken({
        ticket_id: this.ticket_id,
        password: this.password,
      })
        .then(({ token }) => {
          this.$router.push({
            name: 'Csdetail',
            query: {
              ticket_token: token,
            },
          })
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    date,
    fromPairs,
    handleSubmit() {
      this.$router.push({
        name: 'Cshistory',
        query: {
          search_target: 'title_content',
          search_keyword: this.input_target_inquiry,
        },
      })
    },
  },
}
</script>

<template>
  <div>
    <div class="pay-container cs-center">
      <h4 class="tit">{{ $t('service_center.service_center') }}</h4>
      <div class="con-wrap">
        <PayCsNav></PayCsNav>
        <div class="right-wrap">
          <div :class="[$style.rightContent]" class="rt-con">
            <!-- 로그인시 -->
            <template v-if="loggedIn">
              <div :class="[$style.searchWrap]">
                <form>
                  <el-input
                    v-model="input_target_inquiry"
                    :class="[$style.enterSearchTerm]"
                    :placeholder="$t('bank_service_center.enter_search_word')"
                  />
                </form>
              </div>
              <div v-loading="loading">
                <div
                  v-if="!ticket_list.length && c_target_inquiry.length === 0"
                  :class="[$style.noInquiryWrap]"
                >
                  <div :class="[$style.noInquiry]">
                    <div :class="[$style.imgWrap]">
                      <img src="@assets/img/fail-icon.png" alt="실패 아이콘" />
                    </div>
                    <p>{{ $t('service_center.msg_no_inquiry_history') }}</p>
                  </div>
                </div>
                <div :class="[$style.tableWrap]">
                  <table>
                    <colgroup> </colgroup>
                    <thead>
                      <tr>
                        <td>{{ $t('bank_service_center.title') }}</td>
                        <td>{{ $t('bank_service_center.date') }}</td>
                        <td>{{ $t('bank_service_center.state') }}</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="ticket in c_target_inquiry" :key="ticket.seq">
                        <td :class="[$style.inquiryTitle]" class="title">
                          <router-link
                            :to="{
                              name: 'Csdetail',
                              query: { ticket_seq: ticket.seq },
                            }"
                          >
                            <span :class="[$style.typeTitle]" class="cate"
                              >[{{ ticket.type_title }}]</span
                            >
                            {{ ticket.title }}
                            <span
                              v-if="ticket.parent_seq !== 0"
                              :class="[$style.redColor]"
                              >({{ $t('service_center.re_contact') }})</span
                            >
                          </router-link>
                        </td>
                        <td :class="[$style.nowrap]">
                          {{ date('Y-m-d H:i:s', new Date(ticket.regdate)) }}
                        </td>
                        <td :class="[$style.nowrap]">
                          <span
                            :class="[
                              {
                                [$style.waitingReply]:
                                  ticket.status === 'PENDING',
                                [$style.endInquiry]: ticket.status === 'CLOSED',
                                [$style.completedAnswer]:
                                  ticket.status === 'REPLY',
                              },
                            ]"
                          >
                            {{
                              fromPairs(common.constants.cs.ticket.status)[
                                ticket.status
                              ]
                            }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <PageNavigation
                    class="page-navigation"
                    :total_count="total_count"
                    :total_page="page_navigation.total_page"
                    :cur_page="page"
                    :page_count="page_navigation.page_count"
                  ></PageNavigation>
                </div>
              </div>
            </template>
            <!-- 비로그인시 -->
            <!-- <template v-else>
              <div v-if="!ticket_list.length">
                <div :class="[$style.noticeWrap]">
                  <div :class="[$style.imgWrap]">
                    <img src="@assets/img/ticket-login.png" />
                  </div>
                  <h3>
                    {{
                      $t(
                        'service_center.msg_require_login_additional_authentication'
                      )
                    }}
                  </h3>
                </div>
                <div :class="[$style.loginWrap]">
                  <div :class="[$style.membersLogin]">
                    <h4>{{ $t('service_center.when_you_member') }}</h4>
                    <div :class="[$style.loginContent]">
                      {{
                        $t(
                          'service_center.msg_inquiry_history_can_view_after_login'
                        )
                      }}
                    </div>
                    <div class="btn-wrap">
                      <router-link class="btn" :to="{ name: 'login-me' }">{{
                        $t('login')
                      }}</router-link>
                    </div>
                  </div>
                  <div :class="[$style.nonMembersLogin]">
                    <h4>{{ $t('service_center.non_member') }}</h4>
                    <div :class="[$style.loginContent]">
                      <div class="row">
                        <label for="ticket_id">
                          {{ $t('service_center.contact_id') }}
                        </label>
                        <input
                          id="ticket_id"
                          v-model="ticket_id"
                          :class="[$style.ticketId]"
                          type="text"
                          :placeholder="
                            $t('service_center.msg_enter_inquiry_id')
                          "
                        />
                      </div>
                      <div>
                        <label for="password">{{ $t('password') }}</label>
                        <input
                          id="password"
                          v-model="password"
                          :class="[$style.password]"
                          type="text"
                          :placeholder="
                            $t(
                              'service_center.msg_enter_password_when_registering_your_inquiry'
                            )
                          "
                        />
                      </div>
                    </div>
                    <div class="btn-wrap">
                      <a class="btn" @click="handleCreateTicketToken">
                        {{ $t('service_center.lookup_inquiry') }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </template> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
@import '@src/design/contact-history.scss';
</style>
