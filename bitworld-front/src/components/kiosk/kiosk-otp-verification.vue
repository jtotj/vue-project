<script>
import '@assets/css/kiosk/kiosk-certified.css'
import otplib from 'otplib'
import { mapState } from 'vuex'
import { createOtp, deleteOtp } from '@apis/otp'
import { fetchOtpConfig } from '@apis/config'

export default {
  data() {
    return {
      step: null,
      token: '',
      secret: '',
      loading: false,
      otp_config: null,

      input_length: 6,
    }
  },
  watch: {
    token() {
      if (this.token.length === 6) {
        this.handleActivateOTP()
      }
    },
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
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.otp_config = config
    },
    handleCopySecret() {
      this.$copyText(this.secret)
        .then(() =>
          this.$toasted.success(this.$t('otp.otp_copy'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        .catch(() =>
          this.$toasted.error(this.$t('otp.msg_drag_copy'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
    },
    handleActivateOTP() {
      const token = this.token.replace(/[^0-9]/g, '')

      this.loading = true

      createOtp(token, this.secret)
        .then(() => this.$store.dispatch('auth/getOtps'))
        .then(() => {
          this.loading = false
          this.token = ''
          this.init()
          this.$toasted.success(this.$t('otp.otp_register_success'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.$emit('drawer_close')
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        .finally(() => {
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
          this.$toasted.success(this.$t('otp.otp_delete_success'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    addNumber(e) {
      this.token = this.token + e.target.innerText
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCertified" class="kiosk-certified">
    <div :class="$style.container">
      <div :class="$style.kioskCertifiedOtp">
        <!-- 1단계 설치 안내 -->
        <div v-if="step === null" :class="$style.certifiedOtpDepth1">
          <div>
            <h2>{{ $t('kiosk.step_one') }}</h2>
            <p>{{ $t('kiosk.step_one_txt') }}</p>
            <div :class="$style.authIcon">
              <img
                src="@assets/kiosk-img/icon-authenticator.svg"
                alt="Google Authenticaror"
              />
            </div>
          </div>
          <el-button @click="step = 'notice'">{{ $t('next') }}</el-button>
        </div>

        <!-- 2단계 인증코드 안내 -->
        <div v-else-if="step === 'notice'" :class="$style.certifiedOtpDepth2">
          <div>
            <h2>{{ $t('kiosk.step_two') }}</h2>
            <p>{{ $t('kiosk.step_two_txt') }}</p>
            <el-input
              v-model="secret"
              class="certified-code"
              :disabled="true"
              placeholder="1Q8W3C456DEFG7H9"
            >
            </el-input>
          </div>
          <el-button @click="step = 'scan'">{{ $t('next') }}</el-button>
        </div>

        <!-- 3단계 인증코드 안내 -->
        <div v-else-if="step === 'scan'" :class="$style.certifiedOtpDepth3">
          <div>
            <h2>{{ $t('kiosk.step_three') }}</h2>
            <p>{{ $t('kiosk.step_three_txt') }}</p>
            <div :class="$style.qrCodeWrapper">
              <img :src="qr_uri" alt="qr-code" :class="$style.qrCode" />
            </div>
          </div>
          <el-button @click="step = 'input'">{{ $t('next') }}</el-button>
        </div>

        <!-- 4단계 인증코드 안내 -->
        <div v-if="step === 'input'" :class="$style.certifiedOtpDepth4">
          <div>
            <h2>{{ $t('kiosk.step_four') }}</h2>
            <p v-html="$t('kiosk.step_four_txt')"></p>
            <div :class="$style.loginCode">
              <template v-for="(count, idx) in input_length">
                <div
                  :key="idx"
                  :class="[
                    $style.codeCircle,
                    { [$style.active]: token.length >= idx + 1 },
                  ]"
                ></div>
              </template>
            </div>
            <div :class="$style.kioskLoginNum">
              <ul>
                <li @click="addNumber">1</li>
                <li @click="addNumber">2</li>
                <li @click="addNumber">3</li>
                <li @click="addNumber">4</li>
                <li @click="addNumber">5</li>
                <li @click="addNumber">6</li>
                <li @click="addNumber">7</li>
                <li @click="addNumber">8</li>
                <li @click="addNumber">9</li>
                <li :class="$style.reenter" @click="token = ''">{{
                  $t('re_enter')
                }}</li>
                <li @click="addNumber">0</li>
                <li :class="$style.clear" @click="token = token.slice(0, -1)">
                  <img
                    src="@assets/kiosk-img/login-backspace.svg"
                    alt="backspace"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
