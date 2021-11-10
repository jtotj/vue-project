<script>
import serviceCenterNav from '@components/service-center-nav'
import { fetchTicket, closedTicket } from '@apis/cs'
import { mapGetters, mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import find from 'lodash/find'

export default {
  page: {
    title: 'ContactDetail',
    meta: [{ name: 'description', content: 'ContactDetail' }],
  },
  components: {
    serviceCenterNav,
  },
  data() {
    return {
      ticket_seq: this.$route.query.ticket_seq || null,
      ticket_token: this.$route.query.ticket_token || null,
      ticket_info: null,
      parent_info: null,
      field_values_ticket: [],
      field_values_parent: [],
      forms: [],
      forms1: [],
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapState(['common']),

    c_ticket_parent_info() {
      return find(this.ticket_info, {
        parent_seq: this.ticket_info.parent_seq,
      })
    },
  },
  mounted() {
    Promise.all([this.loadTicket()])
      .then(() => this.loadParent())
      .catch((e) => this.$toasted.error(e.message))
  },
  methods: {
    fromPairs,
    date,
    goBack() {
      this.$router.push({ name: 'contact-history' })
    },
    async loadTicket() {
      const { ticket_info, field_values, forms } = await fetchTicket(
        this.ticket_seq,
        this.$route.query.ticket_token
      ).catch((e) => this.$toasted.error(e.message))
      this.ticket_info = ticket_info
      this.field_values_ticket = field_values
      this.forms = forms
    },
    async loadParent() {
      if (!this.ticket_info || !this.ticket_info.parent_seq) return

      const { ticket_info: parent_info, field_values } = await fetchTicket(
        this.ticket_info.parent_seq
      )
      this.parent_info = parent_info
      this.field_values_parent = field_values
    },
    handleModifyTicket() {
      closedTicket(this.ticket_seq, this.$route.query.ticket_token)
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.inquiry_closed'))
          this.$router.push({ name: 'contact-history' })
        })
        .catch((e) => this.$toasted.error(e.message))
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('customer_service') }}
        </h2>
      </div>
      <serviceCenterNav></serviceCenterNav>
      <div :class="[$style.rightContent]">
        <h3 :class="[$style.subTitle]">
          {{ $t('service_center.inquiry_details') }}
        </h3>
        <!-- 비로그인시 -->
        <template v-if="!loggedIn && !$route.query.ticket_token">
          <div :class="[$style.imgWrap]">
            <img src="@assets/img/ticket-login.png" />
          </div>
          <div :class="[$style.loginWrap]">
            <div :class="[$style.membersLogin]">
              <p>{{ $t('service_center.msg_pls_login') }}</p>
              <div :class="[$style.btnWrap]">
                <router-link :to="{ name: 'contact-history' }">
                  {{ $t('service_center.go_back') }}
                </router-link>
              </div>
            </div>
          </div>
        </template>
        <!-- 로그인시 -->
        <template v-else>
          <!-- 재문의 -->
          <template v-if="parent_info">
            <div :class="[$style.reInquiry]">
              <h4>{{ $t('service_center.super_inquiry') }}</h4>
              <div v-if="parent_info" :class="[$style.formWrap]">
                <div :class="[$style.formGroup]">
                  <label>{{ $t('business.card_type') }}</label>
                  <p>{{ parent_info.type_title }}</p>
                </div>
                <div :class="[$style.formGroup]">
                  <label>{{ $t('bank_service_center.title') }}</label>
                  <p>{{ parent_info.title }}</p>
                </div>
                <div :class="[$style.formGroup]">
                  <label>{{ $t('status') }}</label>
                  <div>
                    <span
                      :class="[
                        {
                          [$style.waitingReply]:
                            parent_info.status === 'PENDING',
                          [$style.endInquiry]: parent_info.status === 'CLOSED',
                          [$style.completedAnswer]:
                            parent_info.status === 'REPLY',
                        },
                      ]"
                    >
                      {{
                        fromPairs(common.constants.cs.ticket.status)[
                          parent_info.status
                        ]
                      }}
                    </span>
                    <span
                      v-if="parent_info.status === 'PENDING'"
                      :class="[$style.closingBtn]"
                      @click="handleModifyTicket"
                      >{{ $t('closing') }}</span
                    >
                  </div>
                </div>
                <div :class="[$style.formGroup]">
                  <label>{{ $t('private.transfer_regdate') }}</label>
                  <p>
                    {{ date('Y-m-d H:i:s', new Date(parent_info.regdate)) }}
                  </p>
                </div>
                <div
                  v-if="parent_info.content !== null"
                  :class="[$style.formGroup]"
                >
                  <label>{{ $t('service_center.contents') }}</label>
                  <p>{{ parent_info.content }}</p>
                </div>
              </div>
            </div>
            <div
              v-for="form in forms"
              :key="form.seq"
              :class="[$style.inquiry]"
            >
              <div :class="[$style.formWrap]">
                <template v-for="field in field_values_parent">
                  <div
                    v-if="form.seq === field.form_seq"
                    :key="field.seq"
                    :class="[$style.formGroup]"
                  >
                    <label>{{ field.title }}</label>
                    <div>
                      <span v-if="field.value.length !== 0">{{
                        field.value
                      }}</span>
                      <template v-for="field_option in field_values_parent">
                        <span :key="field_option.seq">{{
                          field_option.source_filename
                        }}</span>
                        <span
                          v-if="field_option.source_filename === null"
                          :key="field_option.seq"
                        >
                          {{ $t('service_center.msg_source_filename_none') }}
                        </span>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div v-if="parent_info.status === 'REPLY'" :class="[$style.reply]">
              <h4>{{ $t('pay_login.secure_answer') }}</h4>
              <p v-html="parent_info.reply"></p>
            </div>
          </template>
          <!-- 문의 -->
          <template v-if="ticket_info">
            <h4>{{ $t('inquiry') }}</h4>
            <div :class="[$style.inquiry]">
              <div :class="[$style.formWrap]">
                <div :class="[$style.formGroup]">
                  <label>{{ $t('business.card_type') }}</label>
                  <p>{{ ticket_info.type_title }}</p>
                </div>
                <div :class="[$style.formGroup]">
                  <label>{{ $t('bank_service_center.title') }}</label>
                  <p>{{ ticket_info.title }}</p>
                </div>
                <div :class="[$style.formGroup]">
                  <label>{{ $t('status') }}</label>
                  <div>
                    <span
                      :class="[
                        {
                          [$style.waitingReply]:
                            ticket_info.status === 'PENDING',
                          [$style.endInquiry]: ticket_info.status === 'CLOSED',
                          [$style.completedAnswer]:
                            ticket_info.status === 'REPLY',
                        },
                      ]"
                    >
                      {{
                        fromPairs(common.constants.cs.ticket.status)[
                          ticket_info.status
                        ]
                      }}
                    </span>
                    <span
                      v-if="ticket_info.status === 'PENDING'"
                      :class="[$style.closingBtn]"
                      @click="handleModifyTicket"
                      >{{ $t('closing') }}
                    </span>
                  </div>
                </div>
                <div :class="[$style.formGroup]">
                  <label>{{ $t('private.transfer_regdate') }}</label>
                  <p>{{
                    date('Y-m-d H:i:s', new Date(ticket_info.regdate))
                  }}</p>
                </div>
                <div
                  v-if="ticket_info.content !== null"
                  :class="[$style.formGroup]"
                >
                  <label>{{ $t('service_center.contents') }}</label>
                  <p>{{ ticket_info.content }}</p>
                </div>
              </div>
            </div>
            <div
              v-for="form in forms"
              :key="form.seq"
              :class="[$style.inquiry]"
            >
              <div :class="[$style.formWrap]">
                <template v-for="field in field_values_ticket">
                  <div
                    v-if="form.seq === field.form_seq"
                    :key="field.seq"
                    :class="[$style.formGroup]"
                  >
                    <label>{{ field.title }}</label>
                    <div>
                      <span v-if="field.value.length !== 0">{{
                        field.value
                      }}</span>
                      <template v-for="field_option in field_values_ticket">
                        <span :key="field_option.seq">{{
                          field_option.source_filename
                        }}</span>
                        <span
                          v-if="field_option.source_filename === null"
                          :key="field_option.seq"
                        >
                          {{ $t('service_center.msg_source_filename_none') }}
                        </span>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div v-if="ticket_info.status === 'REPLY'" :class="[$style.reply]">
              <h4>{{ $t('pay_login.secure_answer') }}</h4>
              <p v-html="ticket_info.reply"></p>
            </div>
            <div :class="[$style.btnWrap]">
              <button v-if="loggedIn" class="btn-grey" @click="goBack">
                {{ $t('bank_service_center.list') }}
              </button>
              <router-link
                v-if="
                  (ticket_info.status === 'PENDING' ||
                    ticket_info.parent_seq === 0) &&
                    !parent_info
                "
                class="btn"
                :class="[$style.reinquiryBtn]"
                :to="{
                  name: 'one-inquiry',
                  query: {
                    seq: ticket_info.seq,
                    type_seq: ticket_info.type_seq,
                  },
                }"
                >{{ $t('service_center.re_contact') }}</router-link
              >
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/contact-detail.scss';
@import '@src/design/service-center.scss';
</style>
