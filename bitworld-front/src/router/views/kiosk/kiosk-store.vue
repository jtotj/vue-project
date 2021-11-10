<script>
import { mapGetters } from 'vuex'

import KioskWithdrawal from '@components/kiosk/kiosk-withdrawal'
import KioskTransfer from '@components/kiosk/kiosk-transfer'
import KioskRemittance from '@components/kiosk/kiosk-remittance'
import KioskBalanceLog from '@components/kiosk/kiosk-balance-log'
import KioskC2cHistory from '@components/kiosk/kiosk-c2c-history'
import KioskCertified from '@components/kiosk/kiosk-certified-main'
import KioskAlert from '@components/kiosk/kiosk-alert'
import KioskGuide from '@components/kiosk/kiosk-guide'
import KioskLogin from '@components/kiosk/kiosk-login'
import KioskC2c from '@components/kiosk/kiosk-c2c'
import '@assets/css/kiosk/kiosk-bank.css'
import 'swiper/css/swiper.min.css'
import Swiper from 'swiper'

export default {
  components: {
    KioskWithdrawal,
    KioskTransfer,
    KioskRemittance,
    KioskBalanceLog,
    KioskC2cHistory,
    KioskCertified,
    KioskAlert,
    KioskC2c,
    KioskLogin,
    KioskGuide,
  },
  data() {
    return {
      drawer_kiosk_use_c2c: false,
      drawer_kiosk_use_remittance: false,
      drawer_kiosk_use_search: false,
      drawer_kiosk_use_withdrawal: false,
      drawer_kiosk_use_transfer: false,
      direction: 'btt',
      select_component: null,
      drawer_title: null,
      drawer_visible: false,

      logout_modal_visible: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  mounted() {
    this.swiper = new Swiper('.swiper-container', {
      spaceBetween: 31.2,
      slidesPerView: 'auto',
      slidesOffsetBefore: 81,
      slidesOffsetAfter: 81,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  },
  methods: {
    alertPrepare() {
      this.$toasted.info(this.$t('help.prepare'), {
        theme: 'toasted-primary',
        containerClass: 'kiosk-toasted',
      })
    },
    handleClick(component_name) {
      this.select_component = component_name
      this.drawer_visible = true
      switch (component_name) {
        case 'KioskC2c':
          this.drawer_title = 'C2C 거래'
          break
        case 'KioskBalanceLog':
          this.drawer_title = '예금 조회'
          break
        case 'KioskWithdrawal':
          this.drawer_title = '예금 출금'
          break
        case 'KioskRemittance':
          this.drawer_title = '코코뱅크 계좌이체'
          break
        case 'KioskTransfer':
          this.drawer_title = '타지갑 이체'
          break
        case 'KioskC2cHistory':
          this.drawer_title = '거래내역'
          break
        case 'KioskCertified':
          this.drawer_title = '인증관리'
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
  <div :class="$style.kioskBank" class="kiosk-bank">
    <div :class="$style.container" class="container">
      <h2>매장사용</h2>
      <div :class="$style.exchange">
        <el-button @click="handleClick('KioskC2c')">
          <div>
            <h3>C2C 거래</h3>
            <p>고객간 암호자산 거래를 합니다.</p>
          </div>
          <img src="@assets/kiosk-img/c2c-bg.svg" alt="exchange" />
        </el-button>
      </div>
      <!-- //exchange -->

      <div :class="$style.deposit">
        <el-button @click="handleClick('KioskBalanceLog')">
          <img src="@assets/kiosk-img/deposit-bg.svg" alt="deposit" />
          <h3>예금조회</h3>
          <p :class="$style.txtBox">자사 계좌를 조회</p>
        </el-button>
      </div>
      <!-- //deposit -->

      <div :class="$style.withdrawal">
        <el-button @click="handleClick('KioskWithdrawal')">
          <img src="@assets/kiosk-img/withdrawal-bg.svg" alt="withdrawal" />
          <h3>예금출금</h3>
          <p :class="$style.txtBox">신청 후 10초~10분 소요</p>
        </el-button>
      </div>
      <!-- //withdrawal -->

      <div :class="$style.remittance">
        <el-button @click="handleClick('KioskRemittance')">
          <img src="@assets/kiosk-img/remittance-bg.svg" alt="remittance" />
          <h3>예금송금</h3>
          <p :class="$style.txtBox">자사의 계좌로 송금</p>
        </el-button>
      </div>
      <!-- //remittance -->

      <div :class="$style.transfer">
        <el-button @click="handleClick('KioskTransfer')">
          <img src="@assets/kiosk-img/transfer-bg.svg" alt="transfer" />
          <h3>지갑이체</h3>
          <p :class="$style.txtBox">타 거래소 지갑으로 이체</p>
        </el-button>
      </div>
      <!-- //transfer -->

      <div :class="$style.breakdown">
        <el-button @click="handleClick('KioskC2cHistory')">
          <img src="@assets/kiosk-img/breakdown-bg.svg" alt="breakdown" />
          <h3>거래내역</h3>
          <p :class="$style.txtBox"></p>
        </el-button>
      </div>
      <!-- //breakdown -->

      <div :class="$style.certified">
        <el-button @click="handleClick('KioskCertified')">
          <img src="@assets/kiosk-img/certified-bg.svg" alt="certified" />
          <h3>인증관리</h3>
          <p :class="$style.txtBox"></p>
        </el-button>
      </div>
      <!-- //certified -->
    </div>

    <div class="use-swiper">
      <!-- swiper html -->
      <div :class="$style.bankUse" class="swiper-container">
        <h2>사용방법</h2>
        <div class="swiper-wrapper">
          <div class="swiper-slide banner1">
            <el-button @click="drawer_kiosk_use_c2c = true">
              <img src="@assets/kiosk-img/c2c-bg.svg" alt="c2c" />
              <h4>C2C 거래</h4>
            </el-button>
          </div>
          <div class="swiper-slide ">
            <el-button @click="drawer_kiosk_use_remittance = true">
              <img src="@assets/kiosk-img/remittance-bg.svg" alt="remittance" />
              <h4>{{ $t('kiosk.deposit_transfer') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide banner2">
            <el-button @click="drawer_kiosk_use_search = true">
              <img src="@assets/kiosk-img/deposit-bg.svg" alt="deposit" />
              <h4>예금조회</h4>
            </el-button>
          </div>
          <div class="swiper-slide banner3">
            <el-button @click="drawer_kiosk_use_withdrawal = true">
              <img src="@assets/kiosk-img/withdrawal-bg.svg" alt="withdrawal" />
              <h4>예금출금</h4>
            </el-button>
          </div>
          <div class="swiper-slide banner4">
            <el-button @click="drawer_kiosk_use_transfer = true">
              <img src="@assets/kiosk-img/transfer-bg.svg" alt="withdrawal" />
              <h4>지갑이체</h4>
            </el-button>
          </div>
        </div>
        <div class="swiper-button swiper-button-next">
          <img src="@assets/kiosk-img/next-icon-white.svg" alt="next button" />
        </div>
        <div class="swiper-button swiper-button-prev">
          <img src="@assets/kiosk-img/back-icon-white.svg" alt="back button" />
        </div>
      </div>
    </div>
    <!-- //사용방법 -->

    <!-- 메인 버튼 드로워 -->
    <div class="drawer-wrapper">
      <el-drawer
        :title="loggedIn ? drawer_title : ''"
        :visible.sync="drawer_visible"
        :direction="direction"
        :append-to-body="true"
      >
        <component
          :is="loggedIn ? select_component : 'KioskLogin'"
          v-if="drawer_visible"
          @close_drawer="handleClose"
        ></component>
      </el-drawer>
    </div>
    <!-- //메인 버튼 드로워 -->

    <!-- 사용방법 버튼 드로워 -->
    <div class="drawer-wrapper">
      <el-drawer
        title="C2C 거래 사용방법"
        :visible.sync="drawer_kiosk_use_c2c"
        :direction="direction"
      >
        <!-- 서비스 준비중 알림 -->
        <KioskAlert></KioskAlert>
      </el-drawer>
      <el-drawer
        title="예금 송금 사용 방법"
        :visible.sync="drawer_kiosk_use_remittance"
        :direction="direction"
      >
        <!-- 서비스 준비중 알림 -->
        <KioskGuide
          :value="
            `https://drive.google.com/file/d/1SLtH9uMfB2lmTvuOUR_bUQrKG6330AtJ/view?usp=sharing`
          "
        ></KioskGuide>
      </el-drawer>
      <el-drawer
        title="예금 조회 사용 방법"
        :visible.sync="drawer_kiosk_use_search"
        :direction="direction"
      >
        <!-- 서비스 준비중 알림 -->
        <KioskGuide
          :value="
            `https://drive.google.com/file/d/1e56qffleH8NGcia_FyYOEaUcM3Bq9aMA/view?usp=sharing`
          "
        ></KioskGuide>
      </el-drawer>
      <el-drawer
        title="예금 출금 사용 방법"
        :visible.sync="drawer_kiosk_use_withdrawal"
        :direction="direction"
      >
        <!-- 서비스 준비중 알림 -->
        <KioskGuide
          :value="
            `https://drive.google.com/file/d/1zQU6rD6b5u20-u9t7NYWjn4vy0yrI7p8/view?usp=sharing`
          "
        ></KioskGuide>
      </el-drawer>
      <el-drawer
        title="지갑 이체 사용 방법"
        :visible.sync="drawer_kiosk_use_transfer"
        :direction="direction"
      >
        <!-- 서비스 준비중 알림 -->
        <KioskGuide
          :value="
            `https://drive.google.com/file/d/1R7LQyzNLi_bXOeKof3-KNw38wTJStSLC/view?usp=sharing`
          "
        ></KioskGuide>
      </el-drawer>
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
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-common.scss';
@import '@src/design/kiosk/kiosk-bank.scss';
</style>
