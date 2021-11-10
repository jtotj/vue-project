<script>
import '@assets/css/kiosk/kiosk-login.css'
import { authMethods } from '@state/helpers'
import Qrcode from 'qrcode.vue'

export default {
  components: { Qrcode },
  data() {
    return {
      password: '',
      step: null,
      input_length: 8,
      barcode_info: null,
    }
  },
  watch: {
    password() {
      if (this.password.length === 8) {
        this.step = 'login_ing'
        this.handleLogin()
      }
    },
  },
  beforeDestroy() {
    if (window.ipcRenderer) window.ipcRenderer.removeAllListeners('barcode')
  },
  mounted() {
    if (window.ipcRenderer) {
      window.ipcRenderer.on('barcode', (event, res) => {
        try {
          const message = window.atob(res)
          this.barcode_info = JSON.parse(message)
          if (!this.loading) this.handleLogin()
        } catch (e) {
          this.$toasted.error(this.$t('kiosk.invalid_login_code'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        }
      })
    }
  },
  methods: {
    ...authMethods,
    async handleLogin() {
      this.loading = true
      try {
        await this.logIn({
          login_type: 'XPLOGIN',
          password: this.barcode_info
            ? this.barcode_info.auth_code
            : this.password,
        })

        this.step = 'logined'
        setTimeout(() => {
          this.$emit('login_complete')
        }, 2000)
      } catch (e) {
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
        this.password = ''
        this.barcode_info = null
        this.step = null
      } finally {
        this.loading = false
      }
    },
    addNumber(e) {
      this.password = this.password + e.target.innerText
    },
  },
}
</script>

<template>
  <div :class="$style.KioskLogin" class="kiosk-login re-login">
    <!-- 로그인 QR 코드 페이지 -->
    <div v-if="step === null" :class="$style.kioskLoginDepth1">
      <h4>로그인</h4>
      <h3 v-html="$t('kiosk_re.login_title')"></h3>
      <p
        ><span>{{ $t('kiosk_re.login_txt_1') }}</span></p
      >
      <Qrcode
        value="https://cocobnk.com/xplogin"
        :size="358"
        class="qrcode"
        background="transparent"
      ></Qrcode>
      <p class="bot-txt"
        ><span>{{ $t('kiosk_re.login_txt_2') }}</span></p
      >
      <el-button @click="step = 'input_code'">{{
        $t('kiosk.simple_login_txt')
      }}</el-button>
    </div>

    <!-- 로그인 간단 인증코드 입력 페이지 -->
    <div
      v-if="step === 'input_code'"
      :class="$style.kioskLoginDepth2"
      class="re-code"
    >
      <h4 v-html="$t('kiosk_re.code_txt')"></h4>
      <div class="login-code">
        <template v-for="(count, idx) in input_length">
          <div
            :key="idx"
            :class="[{ active: password.length >= idx + 1 }]"
            class="code-circle"
          ></div>
        </template>
      </div>
      <div class="code-num">
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
          <li class="reenter" @click="password = ''">{{ $t('re_enter') }}</li>
          <li @click="addNumber">0</li>
          <li :class="$style.clear" @click="password = password.slice(0, -1)">
            <img src="@assets/kiosk-re-img/icon_back.svg" alt="backspace" />
          </li>
        </ul>
      </div>
    </div>

    <!-- 로그인 간단 인증코드 입력 후 로그인 완료 전 로딩 페이지 -->
    <div v-if="step === 'login_ing'" :class="$style.kioskLoginDepth3">
      <div></div>
      <p @click="step === 'logined'">{{ $t('kiosk.be_loggin_in') }}</p>
    </div>

    <!-- 로그인 완료 페이지 -->
    <div v-if="step === 'logined'" :class="$style.kioskLoginDepth4">
      <span :class="$style.loginSuccess"></span>
      <p>{{ $t('kiosk.be_logged_in') }}</p>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-login.scss';
</style>
