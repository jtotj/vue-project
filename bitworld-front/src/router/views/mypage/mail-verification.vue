<script>
import { mapState } from 'vuex'
import { createVerification, createVerificationToken } from '@apis/mail'

export default {
  page: {
    title: 'Mypage::MailVerification',
    meta: [{ name: 'description', content: 'Mypage::MailVerification' }],
  },
  data() {
    return {
      token: null,
      auth_code: '',
      loading: false,
      token_info: null,
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
  <div class="main">
    <!-- 대 타이틀 -->
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ $t('my_page.email_auth') }}</span>
      </div>
    </div>
    <div v-loading="loading" class="verify-wrap container">
      <div class="verify">
        <div class="identity">
          <div class="identity-bot">
            <div class="offer-details payment-section">
              <div class="offer-extra-fields">
                <div class="form-group email-form">
                  <label>{{ $t('my_page.email_address') }}</label>
                  <div class="email-address">
                    <div class="input-wrap">
                      {{ currentUser.email_address }}
                    </div>
                    <div class="tocken-btn-wrap">
                      <ElButton
                        v-if="token"
                        class="email-auth"
                        @click.prevent="handleCreate"
                        >{{ $t('kyc.auth') }}</ElButton
                      >
                      <ElButton
                        v-else
                        class="email-auth"
                        @click.prevent="handleCreateToken"
                        >{{ $t('kyc.auth_code_send') }}</ElButton
                      >
                    </div>
                  </div>
                </div>
                <div v-if="token" class="form-group authentication-code">
                  <div class="required-img">*</div>
                  <label>{{ $t('kyc.auth_code') }}</label>
                  <div>
                    <div class="remi-colorized-field">
                      <el-input v-model="auth_code">
                        <template slot="prepend">
                          <i
                            class="el-icon-time"
                            style="margin-right: 5px;"
                          ></i>
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

                    <span class="explanation">{{
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
  </div>
</template>
