<script>
import axios from 'axios'
import { getToken, hasToken } from '@utils/auth'
import { getLocale } from '@utils/locale'
import { fetchXploginToken } from '@apis/member'
import moment from 'moment-timezone'
import Qrcode from 'qrcode.vue'

export default {
  page: {
    title: 'XpLogin',
    meta: [{ name: 'description', content: 'XpLogin' }],
  },
  components: {
    Qrcode,
  },
  data() {
    return {
      token_info: null,
      timer: 0,
      loading: false,
      countdown_interval: null,
      server_now_time: null,
      now_time: null,
      time_diff: null,
      message: null,
    }
  },
  watch: {
    timer() {
      if (this.timer <= 0) {
        clearInterval(this.countdown_interval)
        this.createToken()
      }
    },
  },
  mounted() {
    Promise.all([this.createToken()]).catch((e) =>
      this.$toasted.error(e.message)
    )
  },
  methods: {
    async createToken() {
      this.loading = true
      const service = axios.create({
        baseURL: '/api/v1',
        timeout: 10000,
      })
      service.interceptors.request.use(
        (config) => {
          const token = getToken()
          config.headers['Accept-Language'] = getLocale()

          if (hasToken()) {
            config.headers.Authorization = `Bearer ${token}`
          }

          return config
        },
        (error) => Promise.reject(error)
      )
      try {
        const result = await service.post('/member/xplogin/token')
        const now = result.headers.date
        this.server_now_time = moment(now)
        this.now_time = moment()
        this.time_diff = this.now_time.diff(this.server_now_time, 'seconds')
        await this.loadTokenInfo(result.data.variables.seq)
        await this.expTimer()
      } catch (error) {
        this.$toasted.error(error.message)
      } finally {
        this.loading = false
      }
    },
    async loadTokenInfo(seq) {
      const { token_info } = await fetchXploginToken(seq)
      this.token_info = token_info
      const obj = {
        type: 'xplogin',
        auth_code: token_info.auth_code,
        regdate: token_info.regdate,
      }
      this.message = window.btoa(JSON.stringify(obj))
    },
    expTimer() {
      const expdate = moment(this.token_info.expdate).tz('Asia/Seoul')
      this.countdown_interval = setInterval(() => {
        const now = moment()
          .tz('Asia/Seoul')
          .subtract(this.time_diff, 'seconds')
        this.timer = expdate.diff(now, 'seconds').valueOf()
      }, 200)
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ '간편 로그인' }}</span>
      </div>
    </div>
    <div v-loading="loading" class="container">
      <div v-if="token_info" :class="[$style.wrapper]">
        <div :class="[$style.wrapGroup]">
          <el-row>
            <el-col>
              <label>{{ '인증코드' }}</label>
            </el-col>
            <el-col>
              <span :class="[$style.authCode]">{{ token_info.auth_code }}</span>
              <Qrcode
                :value="message"
                :size="200"
                :class="[$style.authQrCode]"
                background="transparent"
              ></Qrcode>
            </el-col>
          </el-row>
        </div>
        <div :class="[$style.wrapGroup]">
          <div :class="[$style.timerWrap]"> 00 : {{ timer }} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.wrapper {
  padding: 20px;
  margin: 0 auto;
  text-align: center;
  background: #fff;
  .wrapGroup {
    margin-bottom: 10px;
    .authCode {
      font-size: 30px;
    }
    .authQrCode {
      margin-top: 30px;
    }
    .timerWrap {
      font-size: 20px;
    }
  }
}
</style>
