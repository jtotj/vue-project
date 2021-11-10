<script>
import '@assets/css/kiosk/kiosk-bank-use.css'
import KioskTermsOfAccount from '@components/kiosk/kiosk-terms-of-account'
import KioskWithdrawal from '@components/kiosk/kiosk-withdrawal'
import KioskTransfer from '@components/kiosk/kiosk-transfer'
import KioskRemittance from '@components/kiosk/kiosk-remittance'
import KioskDirect from '@components/kiosk/kiosk-direct'
import KioskBalanceLog from '@components/kiosk/kiosk-balance-log'
import KioskExchangeHistory from '@components/kiosk/kiosk-exchange-history'
import KioskCertified from '@components/kiosk/kiosk-certified-main'
import KioskAlert from '@components/kiosk/kiosk-alert'
import KioskLogin from '@components/kiosk/kiosk-login'
import KioskC2c from '@components/kiosk/kiosk-c2c'

import '@assets/css/kiosk/kiosk-bank.css'
import { mapGetters } from 'vuex'

export default {
  components: {
    KioskTermsOfAccount,
    KioskWithdrawal,
    KioskTransfer,
    KioskRemittance,
    KioskDirect,
    KioskBalanceLog,
    KioskExchangeHistory,
    KioskCertified,
    KioskAlert,
    KioskLogin,
    KioskC2c,
  },
  page: {
    title: 'KiosBankUse',
    meta: [{ name: 'description', content: 'KiosBankUse' }],
  },
  data() {
    return {
      select_component: null,
      drawer_title: null,
      drawer_visible: false,
      logout_modal_visible: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  methods: {
    handleClick(component_name) {
      this.select_component = component_name
      this.drawer_visible = true
      switch (component_name) {
        case 'KioskDirect':
          this.drawer_title = this.$t('private.direct_market')
          break
        case 'KioskBalanceLog':
          this.drawer_title = this.$t('kiosk.deposit_inquiry')
          break
        case 'KioskWithdrawal':
          this.drawer_title = this.$t('kiosk.deposit_withdrawal')
          break
        case 'KioskRemittance':
          this.drawer_title = this.$t('kiosk.cocobank_account_transfer')
          break
        case 'KioskTransfer':
          this.drawer_title = this.$t('kiosk.transfer_to_another_wallet')
          break
        case 'KioskExchangeHistory':
          this.drawer_title = this.$t('kiosk.exchange_list')
          break
        case 'KioskCertified':
          this.drawer_title = this.$t('kiosk.certified_drawer_title')
          break
        case 'KioskTermsOfAccount':
          this.drawer_title = this.$t('kiosk.account_application')
          break
        case 'KioskC2c':
          this.drawer_title = this.$t('kiosk.c2c_transaction')
          break
      }
    },
    handleClose() {
      this.drawer_visible = false
    },
    handleLogout() {
      this.$store.dispatch('auth/logOut')

      this.drawer_visible = false
    },
  },
}
</script>

<template>
  <div :class="$style.kioskBankUse" class="kiosk-bank-use">
    <div :class="$style.container">
      <h2 :class="$style.bankUseTitle">{{ $t('kiosk.bank_use') }}</h2>

      <!-- 다이렉트거래 -->
      <div :class="$style.depositCheck">
        <el-button class="use-main-btn" @click="handleClick('KioskDirect')">
          <img src="@assets/kiosk-img/exchange-bg.svg" alt="다이렉트거래" />
          <h3 :class="$style.btnTitle">{{ $t('kiosk.direct_transaction') }}</h3>
          <p :class="$style.summary">{{
            $t('kiosk.direct_transaction_txt')
          }}</p>
        </el-button>
      </div>

      <!-- 예금출금 -->
      <div :class="$style.withdrawal">
        <el-button class="use-main-btn" @click="handleClick('KioskWithdrawal')">
          <img src="@assets/kiosk-img/withdrawal-bg.svg" alt="예금출금" />
          <h3 :class="$style.btnTitle">{{ $t('kiosk.deposit_withdrawal') }}</h3>
          <p
            :class="$style.summary"
            v-html="$t('kiosk.deposit_withdrawal_txt')"
          ></p>
        </el-button>
      </div>

      <!-- 계좌신청 -->
      <div :class="$style.accountApplication">
        <el-button
          class="use-main-btn"
          @click="handleClick('KioskTermsOfAccount')"
        >
          <img
            src="@assets/kiosk-img/account-application-bg.svg"
            alt="계좌신청"
          />
          <h3 :class="$style.btnTitle">{{
            $t('kiosk.account_application')
          }}</h3>
          <p :class="$style.summary">{{
            $t('kiosk.account_application_txt')
          }}</p>
        </el-button>
      </div>

      <!-- 예금조회 -->
      <div :class="$style.deposit">
        <el-button class="use-main-btn" @click="handleClick('KioskBalanceLog')">
          <img src="@assets/kiosk-img/deposit-bg.svg" alt="예금조회" />
          <h3 :class="$style.btnTitle">{{ $t('kiosk.deposit_inquiry') }}</h3>
          <p :class="$style.summary">{{ $t('kiosk.deposit_inquiry_txt') }}</p>
        </el-button>
      </div>

      <!-- C2C 거래 -->
      <div :class="$style.tradeCtoc">
        <el-button class="use-main-btn" @click="handleClick('KioskC2c')">
          <img src="@assets/kiosk-img/c2c-bg.svg" alt="C2C거래" />
          <h3 :class="$style.btnTitle">{{ $t('kiosk.c2c_transaction') }}</h3>
          <p
            :class="$style.summary"
            v-html="$t('kiosk.c2c_transaction_txt')"
          ></p>
        </el-button>
      </div>

      <!-- 예금송금 -->
      <div :class="$style.remittance">
        <el-button class="use-main-btn" @click="handleClick('KioskRemittance')">
          <img src="@assets/kiosk-img/remittance-bg.svg" alt="예금송금" />
          <h3 :class="$style.btnTitle">{{ $t('kiosk.deposit_transfer') }}</h3>
          <p :class="$style.summary">{{ $t('kiosk.deposit_transfer_txt') }}</p>
        </el-button>
      </div>

      <!-- 지갑이체 -->
      <div :class="$style.walletTransfer">
        <el-button class="use-main-btn" @click="handleClick('KioskTransfer')">
          <img src="@assets/kiosk-img/transfer-bg.svg" alt="지갑이체" />
          <h3 :class="$style.btnTitle">{{ $t('kiosk.wallet_transfer') }}</h3>
          <p :class="$style.summary">{{ $t('kiosk.wallet_transfer_txt') }}</p>
        </el-button>
      </div>

      <!-- 환전내역 -->
      <div :class="$style.exchangeHistory">
        <el-button
          class="use-main-btn"
          @click="handleClick('KioskExchangeHistory')"
        >
          <img src="@assets/kiosk-img/breakdown-bg.svg" alt="환전내역" />
          <h3 :class="$style.btnTitle">{{ $t('kiosk.exchange_list') }}</h3>
          <p :class="$style.summary"></p>
        </el-button>
      </div>

      <!-- 인증관리 -->
      <div :class="$style.certified">
        <el-button class="use-main-btn" @click="handleClick('KioskCertified')">
          <img src="@assets/kiosk-img/certified-bg.svg" alt="인증관리" />
          <h3 :class="$style.btnTitle">{{ $t('kiosk.certified') }}</h3>
          <p :class="$style.summary"></p>
        </el-button>
      </div>
    </div>
    <div class="drawer-wrapper">
      <el-drawer
        :title="loggedIn ? drawer_title : ''"
        :visible.sync="drawer_visible"
        direction="btt"
        :append-to-body="true"
      >
        <component
          :is="loggedIn ? select_component : 'KioskLogin'"
          v-if="drawer_visible"
          @close_drawer="handleClose"
          @component_change="handleClick"
          @logout_event="logout_modal_visible = true"
        ></component>
      </el-drawer>
    </div>
    <el-dialog
      :append-to-body="true"
      class=" kiosk-certified logout-modal"
      :visible.sync="logout_modal_visible"
    >
      <template v-if="loggedIn">
        <span>로그아웃 하시겠습니까</span>
        <div slot="footer" class="dialog-footer">
          <el-button class="cancel-btn" @click="logout_modal_visible = false"
            >취소</el-button
          >
          <el-button type="primary" class="" @click="handleLogout"
            >확인</el-button
          >
        </div>
      </template>
      <template v-else>
        <span>로그아웃이 완료되었습니다.</span>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            class="logout-success-btn"
            @click="logout_modal_visible = false"
            >확인</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-common.scss';
@import '@src/design/kiosk/kiosk-bank-use.scss';
</style>
