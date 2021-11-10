<script>
import ServiceCenterNav from '@components/service-center-nav'
import FormFieldFile from '@components/form-field-file'
import { fetchCsTicketTypeForm } from '@apis/form'
import { createTicket, fetchTicketTypes } from '@apis/cs'
import map from 'lodash/map'
import find from 'lodash/find'
import { mapGetters } from 'vuex'

export default {
  page: {
    title: 'OneInquiry',
    meta: [{ name: 'description', content: 'OneInquiry' }],
  },
  components: { ServiceCenterNav, FormFieldFile },
  data() {
    return {
      step: 'writing',
      ticket_form: [],
      ticket_type_list: [],
      ticket_type_seq: 0,
      ticket_id: '',
      ticket_seq: 0,
      token: '',
      title: '',
      content: '',
      email_address: '',
      password: '',

      parent_seq: this.$route.query.seq || null,
      type_seq: this.$route.query.type_seq || null,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),

    c_ticket_type_info() {
      return find(this.ticket_type_list, {
        seq: this.ticket_type_seq,
      })
    },
    c_ticket_parent_info() {
      return find(this.ticket_type_list, {
        parent_seq: this.parent_seq,
      })
    },
  },

  mounted() {
    Promise.all([this.loadTicketTypeList()])
      .then(() => {
        if (this.$route.query.type_seq) {
          this.ticket_type_seq = Number(this.$route.query.type_seq)
          this.loadTicketForm()
        }
      })
      .catch((e) => this.$toasted.error(e.message))
  },
  methods: {
    // goBack() {
    //   window.history.length > 1
    //     ? this.$router.go(-1)
    //     : this.$router.push({ name: 'bank-home' })
    // },

    ticketSelectChange() {
      this.loadTicketForm().catch((e) => this.$toasted.error(e.message))
    },

    async loadTicketTypeList() {
      const ret_obj = await fetchTicketTypes().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.ticket_type_list = ret_obj.data
    },
    async loadTicketForm() {
      const { forms } = await fetchCsTicketTypeForm({
        target_type: 'CS_TICKET',
        type_seq: this.ticket_type_seq,
      }).catch((e) => this.$toasted.error(e.message))
      this.ticket_form = map(forms, (form) => ({
        ...form,
        field_values: map(form.fields, (field) => ({
          field_seq: field.seq,
          value: '',
          option_seq: null,
          options: [],
        })),
      }))
    },
    handleSubmit() {
      createTicket({
        type_seq: this.ticket_type_seq,
        parent_seq: this.parent_seq,
        title: this.title,
        content: this.content,
        email_address: this.email_address,
        password: this.password,
        field_values: map(
          [].concat(...map(this.ticket_form, (form) => form.field_values)),
          (field_value) => ({
            ...field_value,
            options: map(field_value.options, (option_seq) => ({
              option_seq,
            })),
          })
        ),
      })
        .then((e) => {
          this.$toasted.success(this.$t('toasted_msg.register'))
          this.ticket_id = e.ticket_id
          this.ticket_seq = e.seq
          this.token = e.token
          this.step = 'completed'
        })
        .catch((e) => {
          this.$toasted.error(e.message)
        })
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
      <ServiceCenterNav></ServiceCenterNav>
      <div :class="[$style.rightContent]">
        <h3 :class="[$style.subTitle]">
          {{ $t('header.one_on_one_inquiry') }}
        </h3>
        <!-- 1:1문의 작성하기 -->
        <template v-if="step === 'writing'">
          <div :class="[$style.writing]">
            <form :class="[$style.form]" @submit.prevent="handleSubmit">
              <div :class="[$style.formGroup]">
                <!-- 문의 유형 -->
                <p :class="[$style.mainColor]">
                  {{ $t('service_center.pls_select_inquiry_type') }}
                </p>
                <el-select
                  v-model="ticket_type_seq"
                  :disabled="$route.query.type_seq"
                  :class="[$style.selectTicketType]"
                  @change="ticketSelectChange"
                >
                  <el-option
                    disabled
                    :value="0"
                    :label="$t('service_center.pls_select_inquiry_type')"
                    :class="[$style.firstOption]"
                  >
                    {{ $t('service_center.pls_select_inquiry_type') }}
                  </el-option>
                  <el-option
                    v-for="ticket_type in ticket_type_list"
                    :key="ticket_type.seq"
                    :value="ticket_type.seq"
                    :label="ticket_type.title"
                  >
                    {{ ticket_type.title }}
                  </el-option>
                </el-select>
              </div>
              <template v-if="c_ticket_type_info">
                <template
                  v-if="!loggedIn && c_ticket_type_info.allow_guest === 'N'"
                >
                  <div class="box">{{
                    $t('service_center.pls_login_to_use_inquiry')
                  }}</div>
                </template>
                <template v-else>
                  <div :class="[$style.inquiryBox]">
                    <div :class="[$style.formGroup]">
                      <input
                        v-model="title"
                        type="text"
                        :placeholder="$t('service_center.msg_enter_title')"
                      />
                    </div>
                    <div
                      v-if="c_ticket_type_info.use_content === 'Y'"
                      :class="[$style.formGroup]"
                    >
                      <textarea
                        v-model="content"
                        :placeholder="
                          $t('service_center.msg_enter_your_content')
                        "
                      ></textarea>
                    </div>
                    <div
                      v-for="form in ticket_form"
                      :key="form.seq"
                      :class="[$style.paymentSection]"
                    >
                      <p v-html="form.description"></p>
                      <div :class="[$style.fieldWrap]">
                        <div
                          v-for="(field, idx) in form.fields"
                          :key="field.seq"
                          :class="[$style.formGroup]"
                        >
                          <div class="ds-flex">
                            <div
                              v-if="field.is_required === 'Y'"
                              class="required-img"
                              >*</div
                            >
                            <label>{{ field.title }}</label>
                          </div>

                          <div class="remi-colorized-field">
                            <template v-if="field.field_type === 'INPUT'">
                              <el-input
                                v-model="form.field_values[idx].value"
                                :placeholder="field.placeholder"
                              ></el-input>
                            </template>
                            <template v-if="field.field_type === 'TEXTAREA'">
                              <textarea
                                v-model="form.field_values[idx].value"
                                :placeholder="field.placeholder"
                              ></textarea>
                            </template>
                            <template v-if="field.field_type === 'RADIO'">
                              <div
                                v-for="option in field.options"
                                :key="option.seq"
                              >
                                <el-radio
                                  v-model="form.field_values[idx].option_seq"
                                  :label="option.seq"
                                  >{{ option.title }}</el-radio
                                >
                              </div>
                            </template>
                            <template v-if="field.field_type === 'SELECT'">
                              <el-select
                                v-model="form.field_values[idx].option_seq"
                                :clearable="field.is_required !== 'Y'"
                                :placeholder="
                                  field.placeholder.length
                                    ? field.placeholder
                                    : $t('no_select')
                                "
                              >
                                <el-option
                                  v-for="option in field.options"
                                  :key="option.seq"
                                  :label="option.title"
                                  :value="option.seq"
                                ></el-option>
                              </el-select>
                            </template>
                            <template v-if="field.field_type === 'CHECKBOX'">
                              <ElCheckboxGroup
                                v-model="form.field_values[idx].options"
                              >
                                <ElCheckbox
                                  v-for="option in field.options"
                                  :key="option.seq"
                                  :label="option.seq"
                                  >{{ option.title }}</ElCheckbox
                                >
                              </ElCheckboxGroup>
                            </template>
                            <template v-if="field.field_type === 'FILE'">
                              <FormFieldFile
                                v-model="form.field_values[idx].value"
                                :field_seq="field.seq"
                              ></FormFieldFile>
                            </template>
                            <template v-if="field.field_type === 'MULTISELECT'">
                              <el-select
                                v-model="form.field_values[idx].options"
                                multiple
                              >
                                <el-option
                                  v-for="option in field.options"
                                  :key="option.seq"
                                  :label="option.title"
                                  :value="option.seq"
                                ></el-option>
                              </el-select>
                            </template>
                          </div>
                          <span :class="[$style.explanation]">
                            {{ field.description }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <template v-if="!loggedIn">
                      <div :class="[$style.nonMemberLogin]">
                        <p>{{ $t('service_center.non_member_login') }}</p>
                        <div :class="[$style.formGroup]">
                          <input
                            v-model="email_address"
                            type="email"
                            :placeholder="$t('input.email_address')"
                          />
                        </div>
                        <div :class="[$style.formGroup]">
                          <input
                            v-model="password"
                            type="password"
                            :placeholder="
                              $t('service_center.msg_enter_your_password')
                            "
                          />
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
                <div class="btn-wrap">
                  <button class="btn">
                    {{ $t('service_center.send') }}
                  </button>
                </div>
              </template>
            </form>
            <!-- form -->
          </div>
        </template>
        <!-- 1:1문의 보내기 완료 -->
        <template v-if="step === 'completed'">
          <div :class="[$style.completed]">
            <div :class="[$style.textWrap]">
              <div :class="[$style.imgWrap]">
                <img src="@assets/img/success-icon.png" />
              </div>
              <p
                :class="[$style.completedText]"
                v-html="$t('service_center.normal_inquiries_received')"
              ></p>
              <div :class="[$style.ticketIdWrap]">
                <p>{{ $t('service_center.contact_id') }}</p>
                <div :class="[$style.ticketId]">{{ ticket_id }}</div>
              </div>
            </div>
            <div class="btn-wrap">
              <router-link
                v-if="loggedIn"
                :class="[$style.goContactHistory]"
                :to="{ name: 'contact-history' }"
                >{{ $t('service_center.inquiry_history') }}</router-link
              >
              <router-link
                v-else
                :to="{
                  name: 'contact-detail',
                  query: {
                    ticket_seq,
                    ticket_token: token,
                  },
                }"
                class="btn"
                >{{ $t('service_center.view_inquiry') }}</router-link
              >
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
@import '@src/design/one-inquiry.scss';
</style>
