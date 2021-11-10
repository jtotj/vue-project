<script>
import '@assets/css/kiosk/kiosk-withdrawal.css'
import { mapState } from 'vuex'
import KioskAssetAccountSearch from '@components/kiosk/kiosk-asset-account-search'
import find from 'lodash/find'
import Decimal from 'decimal.js'
import { createAccountTransfer, fetchAccount } from '@apis/account'
import assetDecimal from '@utils/asset-decimal'

export default {
  components: { KioskAssetAccountSearch },
  data() {
    return {
      search_visible: true,
      step: null,
      params: {
        amount: '',
        from_seq: 0,
      },
      find_account: null,
      error_message: null,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),

    ...mapState('account', ['accounts']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_s_from_account_info() {
      if (this.params.from_seq === 0) return null
      return find(this.accounts, { seq: this.params.from_seq })
    },
    c_available_transfer_balance() {
      return assetDecimal(
        this.c_s_from_account_info.asset_seq,
        this.c_s_from_account_info.balance
      )
        .minus(this.c_s_from_account_info.holding_balance)
        .toString()
    },
    account_title() {
      let info_title = null
      if (this.c_s_from_account_info) {
        info_title = this.c_s_from_account_info.title
          ? `${this.c_s_from_account_info.title}(${
              this.c_s_from_account_info.account_number
            })`
          : `${this.$t('kiosk.no_account_alias')}(${
              this.c_s_from_account_info.account_number
            })`
      }

      return info_title
    },
    c_s_asset_info() {
      if (this.s_account_seq === 0) return null

      return find(this.assets, {
        seq: this.c_s_from_account_info.asset_seq,
      })
    },
  },
  watch: {
    'params.amount'(val) {
      if (val.search(/\.\./g) === -1) {
        val = val.replace(/[^0-9.]/g, '')
      } else {
        val = val.replace(/[^0-9]/g, '')
      }
      const parts = val.toString().split('.')
      let result = ''
      if (parts[1]) {
        result =
          parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          (parts[1] ? '.' + parts[1] : '')
      } else {
        result = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      this.params.amount = result
    },
  },
  methods: {
    Decimal,
    async findAccountInfo() {
      await fetchAccount({
        account_seq_or_number: this.params.to_account,
        for_transfer: 1,
      })
        .then((result) => {
          if (result.account_info) {
            this.find_account = result.account_info
          } else {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account'),
              {
                theme: 'toasted-primary',
                containerClass: 'kiosk-toasted',
              }
            )
          }
        })
        .catch((e) => {
          if (e.httpStatusCode === 403) {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account'),
              {
                theme: 'toasted-primary',
                containerClass: 'kiosk-toasted',
              }
            )
          } else {
            this.$toasted.error(e.message, {
              theme: 'toasted-primary',
              containerClass: 'kiosk-toasted',
            })
          }
          this.find_account = null
        })
    },
    handleAccountTransfer() {
      this.loading = true
      createAccountTransfer({
        from_seq: this.params.from_seq,
        to_seq: this.find_account.seq,
        amount: this.removeComma(this.params.amount),
        description: this.params.description,
      })
        .then((result) => {
          this.step = 'success'
          this.params = {}
          this.$emit('logout_event')
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => {
          this.step = 'fail'
          this.error_message = e.message
        })
        .finally(() => {
          this.loading = false
        })
    },
    totalAvailableBalance() {
      if (this.c_s_from_account_info)
        this.params.amount = this.c_available_transfer_balance
      else this.params.amount = 0
    },
    deleteWithdrawInfo() {
      this.search_visible = true
      this.params.amount = null
      this.params.description = null
      this.params.from_seq = null
      this.params.to_account = null
    },
    removeComma(value) {
      value = value.replace(/,/g, '')
      return value
    },
  },
}
</script>

<template>
  <div :class="$style.kioskWithdrawal" class="kiosk-withdrawal">
    <div :class="$style.container">
      <KioskAssetAccountSearch
        v-if="search_visible"
        v-model="params.from_seq"
        @close="search_visible = false"
      ></KioskAssetAccountSearch>
      <!-- 자산, 계좌 검색(kiosk-search 컴포넌트) 페이지 선택 후  -->
      <template v-else>
        <template v-if="step === null">
          <div :class="$style.withdrawalAccount" class="kiosk-select-box">
            <h2>{{ $t('account_transfer.from_account_select') }}</h2>
            <div :class="$style.accountTitleWrap">
              <el-input
                class="user-info"
                suffix-icon="el-icon-circle-close"
                :placeholder="account_title"
                :disabled="true"
              >
              </el-input>
              <button
                :class="$style.accountSelectArea"
                @click="deleteWithdrawInfo"
              />
            </div>
            <!-- <el-input
              class="user-info"
              :placeholder="account_title"
              :disabled="true"
            >
            </el-input> -->
            <ul>
              <li>
                <span>{{ $t('price') }}</span>
                <ul>
                  <li>{{
                    c_s_from_account_info.balance
                      | codeDecimal(c_s_from_account_info.asset_code)
                  }}</li>
                  <li>{{ c_s_from_account_info.asset_code }}</li>
                </ul>
              </li>
              <li>
                <span>{{ $t('account_transfer.available_transfer') }}</span>
                <ul>
                  <li>{{
                    Decimal(c_s_from_account_info.balance).minus(
                      c_s_from_account_info.holding_balance
                    ) | codeDecimal(c_s_from_account_info.asset_code)
                  }}</li>
                  <li>{{ c_s_from_account_info.asset_code }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div :class="$style.transferAccount2" class="kiosk-select-box">
            <h2>{{ $t('account_transfer.to_account_number') }}</h2>
            <el-input
              v-model="params.to_account"
              :placeholder="$t('kiosk.enter_transfer_account_number')"
            ></el-input>
            <el-button @click="findAccountInfo">{{
              $t('account_transfer.to_account_confirm')
            }}</el-button>
          </div>
          <!-- 이체 계좌 확인 후 계좌 회원 명 확인 란 -->
          <template v-if="find_account">
            <div :class="$style.userInfo" class="user-info kiosk-select-box">
              <h2>{{ $t('account_transfer.to_account_user_name') }}</h2>
              <el-input
                :placeholder="
                  find_account.user_name ||
                    $t('account_transfer.not_search_user_name')
                "
                :disabled="true"
              ></el-input>
            </div>
          </template>
          <div :class="$style.transferQuantity" class="kiosk-select-box num">
            <h2>{{ $t('kiosk.transfer_quantity') }}</h2>
            <el-button class="full" @click="totalAvailableBalance">{{
              $t('account_transfer.all_amount')
            }}</el-button>
            <el-input
              v-model="params.amount"
              type="text"
              :placeholder="$t('kiosk.enter_transfer_quantity')"
              clearable
            >
            </el-input>
          </div>
          <div :class="$style.memo" class="kiosk-select-box">
            <h2>{{ $t('memo') }}</h2>
            <el-input
              v-model="params.description"
              type="text"
              :placeholder="$t('enter_memo')"
            >
            </el-input>
          </div>

          <div class="kiosk-select-box transfer">
            <el-button @click="handleAccountTransfer">{{
              $t('header.transfer')
            }}</el-button>
          </div>
        </template>
      </template>
    </div>

    <!-- 출금 계좌 입력 후 이체 완료 시 로딩 페이지 -->
    <div v-if="step === 'success'" :class="$style.withdrawalSuccess">
      <img src="@assets/kiosk-img/icon-success.svg" alt="login success" />
      <p>{{ $t('account_transfer.success_transfer') }}</p>
      <div class="kiosk-select-box">
        <el-button class="home-btn" @click="$emit('close_drawer')">
          {{ $t('kiosk.go_to_first') }}
        </el-button>
      </div>
    </div>

    <!-- 출금 계좌 입력 후 이체 살패 시 로딩 페이지 -->
    <div v-if="step === 'fail'" :class="$style.withdrawalFail">
      <img src="@assets/kiosk-img/icon-fail.svg" alt="login fail" />
      <p>{{ $t('account_transfer.success_fail') }}</p>
      <p>{{ error_message }}</p>
      <div class="kiosk-select-box">
        <el-button class="prev-btn" @click="step = null">{{
          $t('before')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-withdrawal.scss';
</style>
