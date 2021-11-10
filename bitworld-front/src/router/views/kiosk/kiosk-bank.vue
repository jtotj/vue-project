<script>
// import KioskCoinList from '@components/kiosk/kiosk-coin-list'
import { mapGetters, mapState } from 'vuex'
import KioskWithdrawal from '@components/kiosk/kiosk-withdrawal'
import KioskTransfer from '@components/kiosk/kiosk-transfer'
import KioskRemittance from '@components/kiosk/kiosk-remittance'
import KioskDirect from '@components/kiosk/kiosk-direct'
import KioskBalanceLog from '@components/kiosk/kiosk-balance-log'
import KioskExchangeHistory from '@components/kiosk/kiosk-exchange-history'
import KioskCertified from '@components/kiosk/kiosk-certified-main'
import KioskGuide from '@components/kiosk/kiosk-guide'
import KioskLogin from '@components/kiosk/kiosk-login'
import '@assets/css/kiosk/kiosk-bank.css'
import 'swiper/css/swiper.min.css'
import Swiper from 'swiper'

export default {
  components: {
    // KioskCoinList,
    KioskWithdrawal,
    KioskTransfer,
    KioskRemittance,
    KioskDirect,
    KioskBalanceLog,
    KioskExchangeHistory,
    KioskCertified,
    KioskGuide,
    KioskLogin,
  },
  data() {
    return {
      drawer_kiosk_use_remittance: false,
      drawer_kiosk_use_search: false,
      drawer_kiosk_use_withdrawal: false,
      drawer_kiosk_use_transfer: false,
      drawer_kiosk_use_direct: false,
      direction: 'btt',
      select_component: null,
      drawer_title: null,
      drawer_visible: false,

      logout_modal_visible: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('common', ['locale']),
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
    <div
      :class="[
        $style.container,
        {
          [$style.wordBreak]:
            locale === 'en-US' ||
            locale === 'es-ES' ||
            locale === 'fr-FR' ||
            locale === 'ja-JP' ||
            locale === 'pt-PT' ||
            locale === 'vi-VN' ||
            locale === 'fr-FE',
          [$style.wordBreakGermany]: locale === 'de-DE',
        },
      ]"
      class="container"
    >
      <h2>{{ $t('kiosk.bank_use') }}</h2>
      <div
        :class="[
          $style.exchange,
          {
            [$style.wordBreak]:
              locale === 'de-DE' ||
              locale === 'en-US' ||
              locale === 'fr-FR' ||
              locale === 'es-ES' ||
              locale === 'ja-JP' ||
              locale === 'pt-PT' ||
              locale === 'vi-VN' ||
              locale === 'fr-FE',
          },
        ]"
      >
        <el-button @click="handleClick('KioskDirect')">
          <div>
            <h3>{{ $t('footer.direct_ex') }}</h3>
            <p>{{ $t('kiosk.bank_direct_ex') }}</p>
          </div>
          <img src="@assets/kiosk-img/exchange-bg.svg" alt="exchange" />
        </el-button>
      </div>
      <!-- //exchange -->

      <div :class="$style.deposit">
        <el-button @click="handleClick('KioskBalanceLog')">
          <img src="@assets/kiosk-img/deposit-bg.svg" alt="deposit" />
          <h3>{{ $t('kiosk.deposit_inquiry') }}</h3>
          <p :class="$style.txtBox">{{ $t('kiosk.deposit_inquiry_txt') }}</p>
        </el-button>
      </div>
      <!-- //deposit -->

      <div :class="$style.withdrawal">
        <el-button @click="handleClick('KioskWithdrawal')">
          <img src="@assets/kiosk-img/withdrawal-bg.svg" alt="withdrawal" />
          <h3>{{ $t('kiosk.deposit_withdrawal') }}</h3>
          <p
            :class="$style.txtBox"
            v-html="$t('kiosk.deposit_withdrawal_txt')"
          ></p>
        </el-button>
      </div>
      <!-- //withdrawal -->

      <div :class="$style.remittance">
        <el-button @click="handleClick('KioskRemittance')">
          <img src="@assets/kiosk-img/remittance-bg.svg" alt="remittance" />
          <h3>{{ $t('kiosk.deposit_transfer') }}</h3>
          <p
            :class="$style.txtBox"
            v-html="$t('kiosk.deposit_transfer_txt')"
          ></p>
        </el-button>
      </div>
      <!-- //remittance -->

      <div :class="$style.transfer">
        <el-button @click="handleClick('KioskTransfer')">
          <img src="@assets/kiosk-img/transfer-bg.svg" alt="transfer" />
          <h3>{{ $t('kiosk.wallet_transfer') }}</h3>
          <p
            :class="$style.txtBox"
            v-html="$t('kiosk.wallet_transfer_txt')"
          ></p>
        </el-button>
      </div>
      <!-- //transfer -->

      <div :class="$style.breakdown">
        <el-button @click="handleClick('KioskExchangeHistory')">
          <img src="@assets/kiosk-img/breakdown-bg.svg" alt="breakdown" />
          <h3>{{ $t('kiosk.exchange_list') }}</h3>
          <p :class="$style.txtBox"></p>
        </el-button>
      </div>
      <!-- //breakdown -->

      <div :class="$style.certified">
        <el-button @click="handleClick('KioskCertified')">
          <img src="@assets/kiosk-img/certified-bg.svg" alt="certified" />
          <h3>{{ $t('kiosk.certified') }}</h3>
          <p :class="$style.txtBox"></p>
        </el-button>
      </div>
      <!-- //certified -->
    </div>

    <div class="use-swiper">
      <!-- swiper html -->
      <div
        :class="[
          $style.bankUse,
          {
            [$style.wordBreak]:
              locale === 'de-DE' ||
              locale === 'en-US' ||
              locale === 'es-ES' ||
              locale === 'ja-JP' ||
              locale === 'pt-PT' ||
              locale === 'fr-FR',
          },
        ]"
        class="swiper-container"
      >
        <h2>{{ $t('kiosk.use') }}</h2>
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <el-button @click="drawer_kiosk_use_direct = true">
              <img src="@assets/kiosk-img/exchange-bg.svg" alt="direct" />
              <h4>{{ $t('footer.direct_ex') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide banner1">
            <el-button @click="drawer_kiosk_use_remittance = true">
              <img src="@assets/kiosk-img/remittance-bg.svg" alt="remittance" />
              <h4>{{ $t('kiosk.deposit_transfer') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide banner2">
            <el-button @click="drawer_kiosk_use_search = true">
              <img src="@assets/kiosk-img/deposit-bg.svg" alt="deposit" />
              <h4>{{ $t('kiosk.deposit_inquiry') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide banner3">
            <el-button @click="drawer_kiosk_use_withdrawal = true">
              <img src="@assets/kiosk-img/withdrawal-bg.svg" alt="withdrawal" />
              <h4>{{ $t('kiosk.deposit_withdrawal') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide banner4">
            <el-button @click="drawer_kiosk_use_transfer = true">
              <img src="@assets/kiosk-img/transfer-bg.svg" alt="withdrawal" />
              <h4>{{ $t('kiosk.wallet_transfer') }}</h4>
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
          @logout_event="logout_modal_visible = true"
        ></component>
      </el-drawer>
    </div>
    <!-- //메인 버튼 드로워 -->

    <!-- 사용방법 버튼 드로워 -->
    <div class="drawer-wrapper">
      <el-drawer
        :title="$t('kiosk.direct_ex_manual')"
        :visible.sync="drawer_kiosk_use_direct"
        :direction="direction"
      >
        <!-- 서비스 준비중 알림 -->
        <KioskGuide
          :value="
            `https://drive.google.com/file/d/1DMKbSYr162Ks811fgQHBB2DOFxmScPnZ/view?usp=sharing`
          "
        ></KioskGuide>
      </el-drawer>
      <el-drawer
        :title="$t('kiosk.deposit_transfer_manual')"
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
        :title="$t('kiosk.deposit_inquiry_txt_manual')"
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
        :title="$t('kiosk.deposit_withdrawal_manual')"
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
        :title="$t('kiosk.wallet_transfer_manual')"
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
            <el-button
              class="cancel-btn"
              @click="logout_modal_visible = false"
              >{{ $t('cancel') }}</el-button
            >
            <el-button type="primary" class="" @click="handleLogout">{{
              $t('kiosk.confirm')
            }}</el-button>
          </div>
        </template>
        <template v-else>
          <span>로그아웃이 완료되었습니다.</span>
          <div slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              class="logout-success-btn"
              @click="logout_modal_visible = false"
              >{{ $t('kiosk.confirm') }}</el-button
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
