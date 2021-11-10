<script>
import { mapGetters, mapState } from 'vuex'
import '@assets/css/kiosk/kiosk-bank.css'
import KioskWithdrawal from '@components/kiosk/kiosk-withdrawal'
import KioskTransfer from '@components/kiosk/kiosk-transfer'
import KioskRemittance from '@components/kiosk/kiosk-remittance'
import KioskDirect from '@components/kiosk/kiosk-direct'
import KioskBalanceLog from '@components/kiosk/kiosk-balance-log'
import KioskExchangeHistory from '@components/kiosk/kiosk-exchange-history'
import KioskCertified from '@components/kiosk/kiosk-certified-main'
import KioskLogin from '@components/kiosk/kiosk-login'
import KioskGuide from '@components/kiosk/kiosk-guide'

export default {
  components: {
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
      select_component: null,
      drawer_visible: false,
      drawer_title: null,
      logout_modal_visible: false,

      direction: 'btt',
      drawer_kiosk_use_remittance: false,
      drawer_kiosk_use_search: false,
      drawer_kiosk_use_withdrawal: false,
      drawer_kiosk_use_transfer: false,
      drawer_kiosk_use_direct: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('common', ['locale']),
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
          // this.drawer_title = '예금 조회'
          this.drawer_title = this.$t('kiosk.deposit_inquiry')
          break
        case 'KioskWithdrawal':
          this.drawer_title = this.$t('kiosk.deposit_withdrawal')
          break
        case 'KioskRemittance':
          // this.drawer_title = '코코뱅크 계좌이체'
          this.drawer_title = this.$t('kiosk.cocobank_account_transfer')
          break
        case 'KioskTransfer':
          // this.drawer_title = '타지갑 이체'
          this.drawer_title = this.$t('kiosk.transfer_to_another_wallet')
          break
        case 'KioskExchangeHistory':
          // this.drawer_title = '환전내역'
          this.drawer_title = this.$t('kiosk.exchange_list')
          break
        case 'KioskCertified':
          // this.drawer_title = '인증관리'
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
  <div :class="$style.kioskBankAlone" class="kiosk-bank-alone">
    <section :class="$style.adBanner">
      <div :class="$style.transparentBg"></div>
      <iframe
        frameborder="0"
        allowfullscreen="1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube video player"
        width="100%"
        height="100%"
        :class="$style.ytplayer"
        src="https://www.youtube.com/embed/QoUB7EIOI2k?loop=1&amp;autoplay=1&amp;controls=0&amp;disablekb=1&amp;modestbranding=1&amp;playlist=QoUB7EIOI2k&amp;video_id=QoUB7EIOI2k&amp;fs=0&amp;iv_load_policy=3&amp;playsinline=0&amp;rel=0&amp;mute=1&amp;enablejsapi=1&amp;origin=http%3A%2F%2Fsnfex.com&amp;widgetid=1"
      ></iframe>
    </section>
    <!-- //영상 배너 -->

    <div class="use-swiper">
      <div :class="$style.bankUse" class="swiper-container">
        <!-- 사용방법 swiper -->
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <el-button @click="drawer_kiosk_use_direct = true">
              <h4 v-if="locale === 'ko-KR'">다이렉트 환전<br />사용방법</h4>
              <h4 v-else>{{ $t('kiosk.direct_ex_manual') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide">
            <el-button @click="drawer_kiosk_use_remittance = true">
              <h4 v-if="locale === 'ko-KR'">예금송금<br />사용방법</h4>
              <h4 v-else>{{ $t('kiosk.deposit_transfer_manual') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide">
            <el-button @click="drawer_kiosk_use_search = true">
              <h4 v-if="locale === 'ko-KR'">예금조회<br />사용방법</h4>
              <h4 v-else>{{ $t('kiosk.deposit_inquiry_txt_manual') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide">
            <el-button @click="drawer_kiosk_use_withdrawal = true">
              <h4 v-if="locale === 'ko-KR'">예금출금<br />사용방법</h4>
              <h4 v-else>{{ $t('kiosk.deposit_withdrawal_manual') }}</h4>
            </el-button>
          </div>
          <div class="swiper-slide">
            <el-button @click="drawer_kiosk_use_transfer = true">
              <h4 v-if="locale === 'ko-KR'">지갑이체<br />사용방법</h4>
              <h4 v-else>{{ $t('kiosk.wallet_transfer_manual') }}</h4>
            </el-button>
          </div>
        </div>
      </div>
    </div>

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

    <div class="drawer-wrapper">
      <!-- 사용방법 버튼 드로워 -->
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

      <!-- 로그아웃 버튼 드로워 -->
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
@import '@src/design/kiosk/kiosk-bank-alone.scss';
</style>

<style scoped>
.swiper-container-android .swiper-slide,
.swiper-wrapper {
  transform: translate3d(63px, 0, 0) !important;
}
</style>
