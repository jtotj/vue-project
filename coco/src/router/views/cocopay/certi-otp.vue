<script>
import PayCertiNav from '@components/pay-certi-nav'
import SecurityRank from '@components/security-rank'
import '@assets/css/mypage/otp.css'
import otplib from 'otplib'
import MaskedInput from 'vue-masked-input'
import { mapState } from 'vuex'
import { createOtp, deleteOtp } from '@apis/otp'
import { fetchOtpConfig } from '@apis/config'
export default {
  page: {
    title: 'Certiotp',
    meta: [
      {
        name: 'description',
        content: 'Certiotp',
      },
    ],
  },
  components: {
    MaskedInput,
    PayCertiNav,
    SecurityRank,
  },
  data() {
    return {
      token: '',
      secret: '',
      loading: false,
      otp_config: null,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('auth', ['otps']),

    qr_uri() {
      if (this.otps.length) {
        const chl = `otpauth://totp/${this.currentUser.email_address}${
          this.otps.length
        }?secret=${this.secret}&issuer=${window.document.domain}`

        return `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(
          chl
        )}`
      } else {
        const chl = `otpauth://totp/${this.currentUser.email_address}?secret=${
          this.secret
        }&issuer=${window.document.domain}`

        return `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(
          chl
        )}`
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.secret = otplib.authenticator.generateSecret()
      this.loadOtpConfig()
    },
    async loadOtpConfig() {
      const { config } = await fetchOtpConfig().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.otp_config = config
    },
    handleCopySecret() {
      this.$copyText(this.secret)
        .then(() => this.$toasted.success(this.$t('otp.otp_copy')))
        .catch(() => this.$toasted.error(this.$t('otp.msg_drag_copy')))
    },
    handleActivateOTP() {
      const token = this.token.replace(/[^0-9]/g, '')

      this.loading = true
      this.$dialog
        .confirm(this.$t('otp.otp_safe_keeping'), {
          type: 'hard',
          verification: this.$t('otp.yes'),
          okText: this.$t('otp.otp_register'),
          cancelText: this.$t('cancel'),
          verificationHelp: this.$t('continue_entry'),
        })
        .then(() =>
          createOtp(token, this.secret)
            .then(() => this.$store.dispatch('auth/getOtps'))
            .then(() => {
              this.loading = false
              this.token = ''
              this.init()
              this.$toasted.success(this.$t('otp.otp_register_success'))
            })
            .catch((e) => this.$toasted.error(e.message))
            .finally(() => {
              this.loading = false
            })
        )
        .catch(() => {
          this.loading = false
        })
    },
    handleDeleteOTP() {
      const token = this.token.replace(/[^0-9]/g, '')

      this.loading = true
      deleteOtp(this.otps[0].seq, token)
        .then(() => this.$store.dispatch('auth/getOtps'))
        .then(() => {
          this.init()
          this.loading = false
          this.token = ''
          this.$toasted.success(this.$t('otp.otp_delete_success'))
        })
        .catch(() => {
          this.loading = false
        })
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
            <h2 class="big-title">{{ $t('otp.otp_auth') }}</h2>
          </div>

          <div
            v-if="otp_config"
            v-loading="loading"
            class="certification-process"
          >
            <template
              v-if="otps.length && otp_config.allow_disable_otp === 'Y'"
            >
              <div class="table-box">
                <div>{{ $t('otp.authenticode') }}</div>
                <div>
                  <MaskedInput
                    v-model="token"
                    style="font-family: monospace;"
                    mask="### ###"
                    placeholder="000 000"
                    class="nickname_chg"
                    type="text"
                  />
                  <div class="btn-wrap">
                    <button
                      type="button"
                      class="btn"
                      @click.prevent="handleDeleteOTP"
                      >{{ $t('otp.otp_deactivate') }}</button
                    >
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="otps.length < otp_config.max_otp_count">
              <ul class="otp-desc-list">
                <li>
                  {{ $t('otp.msg_authenticator_installation') }}
                  <br />
                  <a
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    >{{ $t('otp.android') }}</a
                  >
                  {{ $t('otp.or') }}
                  <a
                    target="_blank"
                    href="https://itunes.apple.com/app/google-authenticator/id388497605?mt=8"
                    >{{ $t('otp.iphone_series') }}</a
                  >,
                  <a
                    target="_blank"
                    href="http://www.windowsphone.com/en-us/store/app/authenticator/e7994dbc-2336-4950-91ba-ca22d653759b"
                    >{{ $t('otp.windows_phone') }}</a
                  >
                  {{ $t('otp.and') }}
                  <a href="https://en.wikipedia.org/wiki/Google_Authenticator">
                    {{ $t('otp.msg_microsoft_other_systems') }} </a
                  >.
                </li>
                <div class="down-arrow">
                  <i class="fas fa-arrow-down"></i>
                </div>
                <li>
                  {{ $t('otp.msg_key') }}
                  <a href="#" @click.prevent="handleCopySecret">{{ secret }}</a>
                  {{ $t('otp.msg_use_loss_change') }}
                </li>
                <div class="down-arrow">
                  <i class="fas fa-arrow-down"></i>
                </div>
                <li>
                  <p v-html="$t('otp.msg_brcode_touch')"></p>
                </li>
                <div class="down-arrow">
                  <i class="fas fa-arrow-down"></i>
                </div>
                <li>
                  {{ $t('otp.msg_input_authenticode') }}
                </li>
              </ul>
              <div class="qrcode">
                <img :src="qr_uri" />
              </div>
              <div class="table-box">
                <div class="table_text">{{ $t('otp.otp_key') }}</div>
                <input
                  v-model="secret"
                  :disabled="true"
                  class="nickname_chg secret"
                />
              </div>
              <div class="table-box">
                <div class="table_text">{{ $t('otp.authenticode') }}</div>
                <div>
                  <MaskedInput
                    v-model="token"
                    style="font-family: monospace;"
                    mask="### ###"
                    placeholder="000 000"
                    class="nickname_chg"
                    type="text"
                  />
                  <div class="btn-wrap">
                    <button
                      type="button"
                      class="btn"
                      @click.prevent="handleActivateOTP"
                      >{{ $t('otp.otp_activate') }}</button
                    >
                  </div>
                </div>
                <div class="otp-explanation">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ $t('otp.enter_verification_number') }}
                </div>
              </div>
            </template>
            <template v-else>
              <div style="font-size:20px; text-align:center;">{{
                $t('otp_notice')
              }}</div>
            </template>
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
<style scroped>
.certification-process a {
  cursor: auto;
}

.otp-desc-list a {
  color: #0068c1;
  text-decoration: underline;
  cursor: pointer;
}
</style>
