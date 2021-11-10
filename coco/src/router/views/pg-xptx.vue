<script>
import axios from 'axios'
import { fetchXptxToken } from '@apis/pg'
import { getToken, hasToken } from '@utils/auth'
import { getLocale } from '@utils/locale'
import { mapState } from 'vuex'
import Qrcode from 'qrcode.vue'
import filter from 'lodash/filter'
import find from 'lodash/find'
import AssetSelector from '@components/asset-selector'
import fromPairs from 'lodash/fromPairs'
import Decimal from 'decimal.js'
import moment from 'moment-timezone'

export default {
  page: {
    title: 'Pgxptx',
    meta: [{ name: 'description', content: 'Pgxptx' }],
  },
  components: {
    Qrcode,
    AssetSelector,
  },
  data() {
    return {
      token_info: null,
      loading: false,
      account_seq: '',
      search_target_asset: Number(this.$route.query.asset_seq) || null,
      input_search_account: '',
      show_token_mobal: false,
      timer: 0,
      countdown_interval: null,
      server_now_time: null,
      now_time: null,
      time_diff: null,
      restart: false,
      timerZero: false,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_is_active_accounts() {
      if (!this.c_ccf_info) {
        return
      }
      const accounts = filter(this.accounts, (account) => {
        return account.status === 'OPEN' && account.instrument_type === 'LEGACY'
      }).filter(
        (account) =>
          account.asset_code === this.c_ccf_info.code &&
          (!this.input_search_account ||
            account.title
              .toLowerCase()
              .includes(this.input_search_account.toLowerCase()) ||
            account.account_number.includes(this.input_search_account))
      )
      return accounts
    },
    c_asset_code() {
      return find(this.assets, { seq: this.search_target_asset })
    },
    c_ccf_info() {
      return find(this.assets, { code: 'CCF' })
    },
  },
  watch: {
    timer() {
      if (this.timer < 10) {
        this.timerZero = true
      }
      if (this.timer <= 0) {
        clearInterval(this.countdown_interval)
        this.restart = true
      }
    },
  },
  methods: {
    // createToken2(account_seq) {
    //   this.loading = true
    //   this.show_token_mobal = true
    //   this.account_seq = account_seq
    //   createXptxToken({
    //     account_seq: this.account_seq,
    //   })
    //     .then(({ seq }) => {
    //       this.loadTokenInfo(seq)
    //     })
    //     .catch((e) => this.$toasted.error(e.message))
    //     .finally((this.loading = false))
    // },
    async createToken(account_seq) {
      this.restart = false
      this.loading = true
      this.show_token_mobal = true
      this.account_seq = account_seq
      this.timerZero = false
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
        const result = await service.post('/pg/xptx/token', {
          account_seq: this.account_seq,
        })
        const now = result.headers.date
        this.server_now_time = moment(now)
        this.now_time = moment()
        this.time_diff = this.now_time.diff(this.server_now_time, 'seconds')
        setTimeout(() => {
          this.loadTokenInfo(result.data.variables.seq)
            .then(() => {
              this.expTimer()
              this.loading = false
            })
            .catch((e) => this.$toasted.error(e.message))
        }, 1000)
      } catch (error) {
        this.$toasted.error(error.message)
      }
    },
    async loadTokenInfo(seq) {
      const { token_info } = await fetchXptxToken(seq)
      this.token_info = token_info
    },
    resetToken() {
      this.show_token_mobal = false
      this.token_info = null
      this.account_seq = ''
      clearInterval(this.countdown_interval)
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
    onCopy(data) {
      this.$copyText(data).then(
        this.$toasted.success(this.$t('toasted_msg.copy'))
      )
    },
    fromPairs,
    Decimal,
  },
}
</script>

<template>
  <div :class="[$style.pgXptxWrap, 'foreground-container']">
    <!-- -->
    <div class="big-tit-wrap">
      <div class="container">
        <div class="big-title-wrap">
          <h2 class="big-title">{{ '간편 결제' }}</h2>
        </div>
        <!-- 자산 목록 -->
        <div v-if="0" class="asset-list">
          <h3>
            {{ $t('wallet_page.asset_list') }}
          </h3>
          <AssetSelector v-model="search_target_asset" />
        </div>
        <!-- 계좌 목록 -->
        <div class="account-list">
          <h3>계좌목록</h3>
          <!-- 계좌 목록 검색창 -->
          <div :class="[$style.account_search]">
            <el-input
              v-model="input_search_account"
              prefix-icon="el-icon-search"
              :placeholder="
                `${$t('wallet_page.account_title')} / ${$t(
                  'wallet_page.withdraw_bank_address'
                )}`
              "
              :class="[$style.input_account_search]"
            />
          </div>
          <!-- 계좌 목록 리스트 -->
          <template>
            <PerfectScrollbar :class="[$style.perfectScrollbar]">
              <ul v-if="c_is_active_accounts">
                <li
                  v-for="account in c_is_active_accounts"
                  :key="account.seq"
                  :class="[$style.selectAccountList]"
                >
                  <div>
                    <strong>{{ account.title || $t('no_alias') }}</strong>
                    <span
                      >({{
                        fromPairs(constants.account.instrument_type)[
                          account.instrument_type
                        ]
                      }})({{ account.asset_code }})</span
                    >
                    <p :class="[$style.accountNumberWrap]">
                      <span :class="[$style.accountText]">
                        {{ $t('wallet_page.withdraw_bank_address') }}
                      </span>
                      <span :class="[$style.account_number]">
                        {{ account.account_number }}
                      </span>
                      <button
                        class="oncopy marginL-10"
                        @click.prevent.stop="onCopy(account.account_number)"
                        >{{ $t('copy') }}</button
                      >
                    </p>
                  </div>
                  <div>
                    <strong :class="[$style.amount]">
                      {{
                        Decimal(account.balance).minus(account.holding_balance)
                          | codeDecimal(account.asset_code)
                      }}
                    </strong>
                    <div :class="[$style.wrapGroup]">
                      <div :class="[$style.timerWrap]">
                        <el-button
                          type="primary"
                          @click="createToken(account.seq)"
                          >인증코드 발급</el-button
                        >
                      </div>
                    </div>
                  </div>
                </li>
                <div
                  v-if="c_is_active_accounts.length === 0"
                  :class="[$style.dealList]"
                >
                  <div class="no-list">
                    <div class="img-wrap">
                      <img
                        src="@assets/img/no-list.png"
                        alt="목록 없음 아이콘"
                      />
                    </div>
                    <p>
                      {{ $t('wallet_page.no_account_list') }}
                    </p>
                  </div>
                </div>
              </ul>
              <template v-else>
                <div class="no-list">
                  <div class="img-wrap img-size">
                    <img
                      src="@assets/img/please-select-icon.png"
                      alt="손가락 아이콘"
                    />
                  </div>
                  <p>
                    {{ $t('private.please_select_asset') }}
                  </p>
                </div>
              </template>
            </PerfectScrollbar>
          </template>
        </div>
      </div>
    </div>
    <!-- 인증코드 모달 -->
    <el-dialog
      :class="[$style.withdrawModal]"
      :visible.sync="show_token_mobal"
      :append-to-body="true"
      top="12vh"
      @close="resetToken"
    >
      <div v-loading="loading" :class="$style.loadingWrap">
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
            <div :class="[$style.wrapGroup]">
              <div :class="[$style.timerWrap, $style.mt15]">
                00 : <span v-if="timerZero">0</span>{{ timer }}
              </div>
            </div>
          </div>
          <div v-if="restart" :class="[$style.wrapGroup]">
            <div :class="[$style.timerWrap]">
              <el-button type="primary" @click="createToken(account_seq)"
                >다시 발급 받기</el-button
              >
            </div>
          </div>
        </div>
        <!-- <div v-else :class="[$style.wrapper]">
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
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.loadingWrap {
  min-height: 346px;
}

.pgXptxWrap {
  .account_search {
    margin-bottom: 20px;
  }

  .perfectScrollbar {
    height: 600px;
  }

  .selectAccountList {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    margin-bottom: 10px;
    border: 1px solid #e5e5e5;

    .accountNumberWrap {
      .accountText {
        padding-right: 5px;
        color: #b9b9b9;
      }
    }

    .amount {
      float: right;
      padding-bottom: 20px;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 0;
    }
  }
}

.wrapper {
  padding: 5px 20px;
  margin: 0 auto;
  text-align: center;
  background: #fff;
  .wrapGroup {
    margin-bottom: 10px;
    label {
      margin-bottom: 15px;
      font-size: 20px;
      color: #222;
    }
    .authCode {
      font-size: 30px;
    }
    .timerWrap {
      font-size: 20px;
    }
    .mt15 {
      margin-top: 15px;
    }
  }
}

@media (max-width: 780px) {
  .pgXptxWrap {
    .selectAccountList {
      flex-direction: column;

      div:last-child {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;
      }
      .accountNumberWrap {
        button {
          float: right;
          margin: 5px 0;
        }
      }
      .amount {
        padding-bottom: 0;
      }
    }
  }
}
</style>
<style scoped>
.container .account-list {
  float: none;
  width: 100%;
}
</style>
