<script>
import { fetchXptxToken, createXptxToken } from '@apis/pg'
import { mapState } from 'vuex'
import Qrcode from 'qrcode.vue'
import filter from 'lodash/filter'

export default {
  page: {
    title: 'Pgxptx',
    meta: [{ name: 'description', content: 'Pgxptx' }],
  },
  components: {
    Qrcode,
  },
  data() {
    return {
      token_info: null,
      loading: false,
      account_seq: '',
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    c_is_active_accounts() {
      const accounts = filter(this.accounts, (account) => {
        return account.status === 'OPEN' && account.instrument_type === 'LEGACY'
      })
      if (this.$route.query.asset_code)
        return filter(accounts, { asset_code: this.$route.query.asset_code })

      return accounts
    },
  },
  methods: {
    createToken() {
      this.loading = true
      createXptxToken({
        account_seq: this.account_seq,
      })
        .then(({ seq }) => {
          this.loadTokenInfo(seq)
        })
        .catch((e) => this.$toasted.error(e.message))
        .finally((this.loading = false))
    },
    async loadTokenInfo(seq) {
      const { token_info } = await fetchXptxToken(seq)
      this.token_info = token_info
    },
    resetToken() {
      this.token_info = null
      this.account_seq = ''
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ '간편 결제' }}</span>
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
              <Qrcode
                :class="[$style.authCode]"
                :size="250"
                :value="token_info.auth_code"
              ></Qrcode>
            </el-col>
          </el-row>
        </div>
        <div :class="[$style.wrapGroup]">
          <div :class="[$style.timerWrap]">
            <el-button type="primary" @click="resetToken">다시 선택</el-button>
          </div>
        </div>
      </div>
      <div v-else :class="[$style.wrapper]">
        <div :class="[$style.wrapGroup]">
          <el-row>
            <el-col>
              <label>{{ '계좌 선택' }}</label>
            </el-col>
            <el-col>
              <el-select v-model="account_seq">
                <el-option
                  v-for="account in c_is_active_accounts"
                  :key="account.seq"
                  :value="account.seq"
                  :label="account.title || account.account_number"
                >
                  {{ account.title }} {{ account.account_number }} :
                  {{ account.asset_title }}
                  {{ account.balance | codeDecimal(account.asset_code) }}
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div :class="[$style.wrapGroup]">
          <div :class="[$style.timerWrap]">
            <el-button type="primary" @click="createToken"
              >인증코드 발급</el-button
            >
          </div>
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
    label {
      margin-bottom: 10px;
      font-size: 20px;
      color: #222;
    }
    .authCode {
      font-size: 30px;
    }
    .timerWrap {
      font-size: 20px;
    }
  }
}
</style>
