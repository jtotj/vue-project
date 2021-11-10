<script>
import PayCertiNav from '@components/pay-certi-nav'
import SecurityRank from '@components/security-rank'
import { mapState } from 'vuex'
import { createVerification, createVerificationToken } from '@apis/mail'

export default {
  name: 'Certiemail',
  page: {
    title: 'Mypage::MailCertification',
    meta: [
      {
        name: 'description',
        content: 'Mypage::MailCertification',
      },
    ],
  },
  components: {
    PayCertiNav,
    SecurityRank,
  },
  data() {
    return {
      token: null,
      auth_code: '',
      token_info: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    handleCreateToken() {
      this.loading = true
      createVerificationToken()
        .then(({ token }) => {
          this.token = token
          this.$notify({
            title: this.$t('toasted_msg.title'),
            message: this.$t('toasted_msg.email_auth_send'),
            type: 'success',
          })
          this.token_info = this.$jwt.decode(this.token)
        })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    handleCreate() {
      this.loading = true
      createVerification(this.$data)
        .then(({ token }) => {
          this.$notify({
            title: this.$t('toasted_msg.title'),
            message: this.$t('toasted_msg.email_auth'),
            type: 'success',
          })
          this.$router.push({ name: 'myprofile' })
        })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    resetVerify() {
      this.token = null
      this.token_info = null
    },
  },
}
</script>

<template>
  <div>
    <div class="pay-container certi-manage cs-center">
      <h4 class="tit">{{ $t('header.certification_management') }}</h4>
      <div class="con-wrap">
        <PayCertiNav></PayCertiNav>
        <div class="right-wrap">
          <SecurityRank></SecurityRank>
          <div class="big-title-wrap">
            <h2 class="big-title">{{ $t('my_page.email_auth') }}</h2>
          </div>
          <div v-loading="loading" class="verify-wrap">
            <div :class="[$style.mailVerifyWrap]">
              <div class="form-group email-form">
                <label>{{ $t('my_page.email_address') }}</label>
                <div :class="[$style.emailInfoWrap]">
                  <el-input
                    :class="[$style.emailInfo]"
                    :value="currentUser.email_address"
                    disabled
                  >
                    {{}}
                  </el-input>
                  <div class="btn-wrap">
                    <button
                      v-if="token"
                      class="btn"
                      @click.prevent="handleCreate"
                    >
                      {{ $t('kyc.auth') }}
                    </button>
                    <button
                      v-else
                      class="btn"
                      @click.prevent="handleCreateToken"
                    >
                      {{ $t('kyc.auth_code_send') }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="token" class="form-group">
                <div :class="[$style.requiredImg]">*</div>
                <label>{{ $t('kyc.auth_code') }}</label>
                <div class="remi-colorized-field">
                  <el-input v-model="auth_code">
                    <template slot="prepend">
                      <i class="el-icon-time" style="margin-right: 5px;"></i>
                      <vue-countdown-timer
                        style="display:inline-block;"
                        :start-time="token_info.iat"
                        :end-time="token_info.exp"
                        @end_callback="resetVerify"
                      >
                        <template slot="countdown" slot-scope="scope">
                          <span>{{ scope.props.minutes }}</span
                          ><i>{{ scope.props.minutesTxt }}</i>
                          <span>{{ scope.props.seconds }}</span>
                        </template>
                      </vue-countdown-timer>
                    </template>
                  </el-input>
                </div>

                <div :class="[$style.explanationWrap]">
                  <span :class="[$style.explanation]">{{
                    $t('kyc.msg_auth_code')
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
@import '@src/design/kyc.scss';
</style>
