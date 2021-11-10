<script>
import { fetchDocumentList } from '@apis/xe/board'
import htmlspecialchars_decode from 'locutus/php/strings/htmlspecialchars_decode'
import LocaleSelect from '@components/LocaleSelect'
import NoticeTicker from '@components/notice-ticker'
import PayModal from '@components/pay-store-popup'
import { fetchMerchantList } from '@apis/pg'
import { fetchPrivateMarkets } from '@apis/market'
import { fetchCertificationTypes } from '@apis/kyc'
import { mapState, mapGetters } from 'vuex'
import nth from 'lodash/nth'
import filter from 'lodash/filter'

export default {
  components: {
    LocaleSelect,
    NoticeTicker,
    PayModal,
  },
  data() {
    return {
      mid: 'news',
      list_count: 8,
      news: [],
      hamberger_menu: false,
      dialog_visible: false,
      direction: 'rtl',
      merchant_list: [],
      market_list: [],
      kyc_type_list: [],
      customer_list: [
        { state: 'INDIVIDUAL', title: this.$t('individual') },
        { state: 'COMPANY', title: this.$t('company') },
      ],

      longtext_locales: ['fr-FR', 'es-ES', 'en-US', 'de-DE'],
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapState(['common']),

    c_active_market() {
      return filter(this.market_list, { is_active: 'Y' })
    },
    c_kyc_type_list_first() {
      return nth(this.kyc_type_list, 0)
    },
  },
  mounted() {
    Promise.all([this.loadDocumentList()])
      .catch((e) => this.$toasted.error(e.message))
      .finally(() => {
        this.loading = false
      })

    if (this.loggedIn) {
      Promise.all(
        [this.loadMerchantList(), this.loadMarketList()],
        this.loadKycTypeList()
      ).catch((e) => this.$toasted.error(e.message))
    } else {
      this.loadMarketList()
    }
  },
  methods: {
    menuSelect(index) {
      if (index === 'logout') {
        this.$router.push({ name: 'home' })
        this.$store.dispatch('auth/logOut')
      } else if (index === 'mypage') {
        this.$router.push({ name: 'myprofile' })
      } else if (index !== 'login-me') {
        this.$router.push({
          name: index,
        })
      } else {
        this.$router.push({
          name: index,
          query: { redirectFrom: 'bank' },
        })
      }
    },
    async loadDocumentList() {
      const { document_list } = await fetchDocumentList({ mid: this.mid })

      this.news = document_list.slice(0, this.list_count).map((val) => ({
        title: htmlspecialchars_decode(val.title),
        link: `https://cocofx.com/${this.mid}/${val.document_srl}`,
      }))
    },
    async loadMerchantList() {
      const { data } = await fetchMerchantList().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.merchant_list = data
    },
    async loadMarketList() {
      const { data } = await fetchPrivateMarkets().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.market_list = data
    },
    async loadKycTypeList() {
      const ret_obj = await fetchCertificationTypes({
        type_seq: this.$route.params.type_seq * 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.kyc_type_list = ret_obj.data
    },
    goOpenMaket() {
      window.location.href = 'https://market.cocofx.com/'
    },
    goNotice() {
      window.location.href = 'https://cocofx.com/notice'
    },
    goServerNotice() {
      window.location.href = 'https://cocofx.com/server_notice'
    },
    alertPrepare() {
      return this.$alert(this.$t('service_prepare'))
    },
    customerClickMobile(state) {
      switch (state) {
        case 'INDIVIDUAL':
          this.$store.dispatch('common/setCustomerExchange', 'INDIVIDUAL')
          break
        case 'COMPANY':
          this.$store.dispatch('common/setCustomerExchange', 'COMPANY')
      }
    },
    dlvisible(data) {
      this.dialog_visible = false
    },
    loginToast() {
      if (this.loggedIn === false) {
        this.$toasted.error(this.$t('confirmation_login'))
        this.dialog_visible = false
      }
    },
  },
}
</script>

<template>
  <nav id="nav">
    <!-- 상점 목록 모달 -->
    <el-dialog
      :append-to-body="true"
      :custom-class="'store-modal-el'"
      :visible.sync="dialog_visible"
    >
      <PayModal @visible="dlvisible"></PayModal>
    </el-dialog>
    <NoticeTicker></NoticeTicker>
    <div class="container">
      <div class="logo-wrap">
        <h1 class="logo">
          <router-link :to="{ name: 'home' }">
            <img src="@assets/img/cocobank-logo.svg" />
          </router-link>
        </h1>
      </div>
      <div class="corporation-text pc">
        <p
          :class="[
            {
              active: common.customer_exchange === 'INDIVIDUAL',
            },
          ]"
          @click="customerClickMobile('INDIVIDUAL')"
        >
          {{ $t('individual') }}
        </p>
        <p
          :class="[
            {
              active: common.customer_exchange === 'COMPANY',
            },
          ]"
          @click="customerClickMobile('COMPANY'), loginToast()"
        >
          <span
            class="cor-btn-span"
            :class="{
              'active-menu': $route.path.indexOf('company') !== -1,
            }"
            @click="dialog_visible = true"
          >
            {{ $t('company') }}
          </span>
        </p>
      </div>
      <div class="nav-secondary pc">
        <LocaleSelect class="nav-list-lang"></LocaleSelect>
        <el-menu
          :default-active="$route.name"
          class="login-menu"
          mode="horizontal"
          @select="menuSelect"
        >
          <template v-if="loggedIn">
            <el-menu-item index="mypage">
              <router-link
                :to="{
                  name: 'myprofile',
                }"
                :class="{
                  'active-menu': $route.path.indexOf('mypage') !== -1,
                }"
              >
                {{ $t('footer.my_page_title') }}
              </router-link>
            </el-menu-item>
            <el-menu-item index="logout">
              <a href="#">
                {{ $t('pay_head_foot.out') }}
              </a>
            </el-menu-item>
          </template>
          <template v-else>
            <el-menu-item>
              <router-link
                :to="{
                  name: 'register',
                }"
              >
                {{ $t('register') }}
              </router-link>
            </el-menu-item>
            <el-menu-item>
              <router-link
                :to="{
                  name: 'login-me',
                }"
              >
                {{ $t('pay_head_foot.in') }}
              </router-link>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <!-- 개인 -->
      <div class="individual">
        <nav class="pc">
          <div class="menu">
            <ul
              :class="[
                {
                  [$style.longText]:
                    longtext_locales.indexOf(common.locale) !== -1,
                },
              ]"
            >
              <li class="droppable">
                <router-link
                  :to="{
                    name: 'direct-exchange',
                  }"
                  :class="{
                    'active-menu': $route.path.indexOf('exchange') !== -1,
                  }"
                >
                  {{ $t('exchange_price') }}
                  <!-- 환전/시세 -->
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul>
                      <li class="droppable">
                        <router-link :to="{ name: 'direct-exchange' }">
                          {{ $t('header.exchange') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <a @click="alertPrepare">
                          {{ $t('market_price_check') }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="droppable">
                <router-link
                  :to="{ name: 'money' }"
                  :class="{
                    'active-menu': $route.path.indexOf('lookup/') !== -1,
                  }"
                >
                  {{ $t('look_up') }}
                  <!-- 조회 -->
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul>
                      <li class="droppable">
                        <!-- 전 계좌 조회 -->
                        <router-link :to="{ name: 'money' }">
                          {{ $t('full_account_inquiry') }}
                        </router-link>
                      </li>
                      <!-- 환전내역조회 -->
                      <li class="droppable">
                        <router-link :to="{ name: 'transfer-list' }">
                          {{ $t('exchange_details_check') }}
                        </router-link>
                      </li>
                      <!-- 자금 예치 계좌 조회 -->
                      <li class="droppable">
                        <router-link :to="{ name: 'account-balance' }">
                          {{ $t('deposit_account_inquiry') }}
                        </router-link>
                      </li>
                      <!-- 이체 내역 조회 -->
                      <li>
                        <router-link :to="{ name: 'account-transfer-list' }">{{
                          $t('account_transfer.transfer_list_detail')
                        }}</router-link>
                      </li>
                      <!-- 입금 내역 조회 -->
                      <li>
                        <router-link :to="{ name: 'deposit' }">{{
                          $t('wallet_page.deposit_list_look')
                        }}</router-link>
                      </li>
                      <!-- 출금 내역 조회 -->
                      <li>
                        <router-link :to="{ name: 'withdraw' }">{{
                          $t('wallet_page.withdraw_list_look')
                        }}</router-link>
                      </li>
                      <!-- <li class="droppable">
                        <a href="#" @click="alertPrepare">{{
                          $t('dormant_account_check')
                        }}</a>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'wallet-reference' }">
                          {{ $t('account_and_other_case_status') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'remittance-transfer' }">
                          {{ $t('error_remittance') }}
                        </router-link>
                      </li> -->
                    </ul>
                  </div>
                </div>
              </li>
              <li class="droppable">
                <router-link
                  :to="{ name: 'account-transfer' }"
                  :class="{
                    'active-menu': $route.path.indexOf('transfer/') !== -1,
                  }"
                >
                  {{ $t('transfer')
                  }}<!-- 이체 -->
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul>
                      <li>
                        <router-link :to="{ name: 'account-transfer' }">{{
                          $t('transfer')
                        }}</router-link>
                      </li>
                      <li>
                        <router-link :to="{ name: 'account-transfer-list' }">{{
                          $t('account_transfer.transfer_list_detail')
                        }}</router-link>
                      </li>
                      <li>
                        <router-link
                          :to="{
                            name: 'account-transfer-list',
                            query: { active_tab: 'outer' },
                          }"
                          >{{
                            $t('other_wallets_transfer_search')
                          }}</router-link
                        >
                      </li>
                      <!-- <li class="droppable">
                        <router-link :to="{ name: 'favorite-address' }">{{
                          $t('frequently_used_accounts')
                        }}</router-link>
                      </li> -->
                    </ul>
                  </div>
                </div>
              </li>
              <li class="droppable">
                <router-link
                  :to="{ name: 'create-address' }"
                  :class="{
                    'active-menu': $route.path.indexOf('new-account') !== -1,
                  }"
                >
                  {{ $t('new_account') }}
                  <!-- 계좌신규 -->
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul>
                      <li class="droppable">
                        <router-link :to="{ name: 'create-address' }">{{
                          $t('new_demand_account')
                        }}</router-link>
                      </li>
                      <!-- <li class="droppable">
                        <router-link :to="{ name: 'svings-account' }">{{
                          $t('new_installment_savings_account')
                        }}</router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'term-deposit' }">{{
                          $t('new_deposit_account')
                        }}</router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'svings-term-list' }">{{
                          $t('check_account_progress_account')
                        }}</router-link>
                      </li> -->
                    </ul>
                  </div>
                </div>
              </li>
              <li class="droppable">
                <router-link
                  :to="{ name: 'product-search' }"
                  :class="{
                    'active-menu': $route.path.indexOf('product') !== -1,
                  }"
                >
                  {{ $t('header.Product_Subscription') }}
                  <!-- 계좌신규 -->
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul>
                      <li class="droppable">
                        <router-link :to="{ name: 'product-search' }">
                          {{ $t('header.Product_Subscription') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link
                          :to="{ name: 'product-subscription-list' }"
                        >
                          {{ '상품계좌 조회' }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'product-return-list' }">
                          {{ '자금반환 내역조회' }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'product-dividend-list' }">
                          {{ '배당수령 내역조회' }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <!-- <li class="droppable">
                <router-link :to="{ name: 'withdraw' }">
                  {{ $t('withdrawal') }}
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul >
                      <li class="droppable">
                        <a href="#" @click="alertPrepare">{{
                          $t('Smart_window_withdrawal')
                        }}</a>
                      </li>
                      <li class="droppable">
                        <a href="#" @click="alertPrepare"
                          >{{ $t('smart_ATM_withdrawal') }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </li> -->
              <li class="droppable">
                <router-link
                  :to="{ name: 'service-center-home' }"
                  :class="{
                    'active-menu': $route.path.indexOf('service-center') !== -1,
                  }"
                >
                  {{ $t('customer_service') }}
                  <!-- 고객센터 -->
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul>
                      <li class="droppable">
                        <router-link :to="{ name: 'contact-notice' }">{{
                          $t('notice')
                        }}</router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'one-inquiry' }">{{
                          $t('one_one_inquiry')
                        }}</router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'contact-history' }">{{
                          $t('inquiry_details')
                        }}</router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'faq' }">{{
                          $t('frequently_asked_questions')
                        }}</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="droppable">
                <router-link
                  :to="{ name: 'auth-management', params: { type_seq: 1 } }"
                  :class="{
                    'active-menu':
                      $route.path.indexOf('certification-management') !== -1,
                  }"
                >
                  {{ $t('header.certification_management') }}
                  <!-- 인증/관리 -->
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul>
                      <li class="droppable">
                        <router-link :to="{ name: 'auth-management' }">
                          {{ $t('secure_management') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link
                          :to="{ name: 'kyc', params: { type_seq: 1 } }"
                        >
                          {{ $t('kyc.kyc_enroll') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'mail-verification' }">
                          {{ $t('my_page.email_auth') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'otp' }">
                          {{ $t('my_page.otp_auth') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'security' }">
                          {{ $t('my_page.security') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'kyc-withdraw-address' }">
                          {{ $t('my_page.auth_withdraw_address') }}
                        </router-link>
                      </li>
                      <li class="droppable">
                        <router-link :to="{ name: 'clap-detail' }">
                          CLAP
                        </router-link>
                      </li>
                      <!-- <li class="droppable">
                        <a href="#" @click="alertPrepare">{{
                          $t('fund_limit_management')
                        }}</a>
                      </li>
                      <li class="droppable">
                        <a href="#" @click="alertPrepare">{{
                          $t('issue_details_check')
                        }}</a>
                      </li> -->
                    </ul>
                  </div>
                </div>
              </li>
              <li
                v-if="common.customer_exchange === 'COMPANY'"
                class="droppable"
              >
                <router-link
                  :to="{ name: 'merchant-transaction-list' }"
                  :class="{
                    'active-menu': $route.path.indexOf('company') !== -1,
                  }"
                >
                  {{ $t('company') }}
                  <!-- 기업 -->
                </router-link>
                <div class="mega-menu">
                  <div class="container cf">
                    <ul>
                      <!-- 거래내역 -->
                      <li class="droppable">
                        <router-link
                          :to="{ name: 'merchant-transaction-list' }"
                        >
                          {{ $t('shop.shop_history') }}
                        </router-link>
                      </li>
                      <!-- 상점 목록 -->
                      <li class="droppable">
                        <router-link :to="{ name: 'shop' }">{{
                          $t('shop.shop_list')
                        }}</router-link>
                      </li>
                      <!-- 상점 등록 -->
                      <li class="droppable">
                        <router-link :to="{ name: 'merchant-create' }">{{
                          $t('merchant.create')
                        }}</router-link>
                      </li>
                      <!-- 정산 계좌 등록 -->
                      <li class="droppable">
                        <router-link
                          :to="{ name: 'merchant-account-all-list' }"
                          >{{
                            $t('header.calculation_account_list')
                          }}</router-link
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <!-- 모바일 햄버거 메뉴 -->
      <div class="hamberger-btn-wrap mobile">
        <div class="hamberger-btn" @click="hamberger_menu = true">
          <img src="@assets/img/hamberger-btn.svg" alt="햄버거 버튼" />
        </div>

        <el-drawer
          :visible.sync="hamberger_menu"
          :append-to-body="true"
          :direction="direction"
          size="70%"
          class="hamberger-drawer"
        >
          <LocaleSelect></LocaleSelect>

          <el-menu
            :default-active="$route.name"
            mode="horizontal"
            class="login-menu"
            @select="menuSelect"
          >
            <template v-if="loggedIn">
              <li>
                <router-link
                  :to="{
                    name: 'myprofile',
                  }"
                  :class="{
                    'active-menu': $route.path.indexOf('mypage') !== -1,
                  }"
                >
                  {{ $t('footer.my_page_title') }}
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'logout' }">
                  {{ $t('pay_head_foot.out') }}
                </router-link>
              </li>
            </template>
            <template v-else>
              <li>
                <router-link :to="{ name: 'register' }">
                  {{ $t('register') }}
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'login-me' }">
                  {{ $t('pay_head_foot.in') }}
                </router-link>
              </li>
            </template>
          </el-menu>

          <div :class="$style.customerBtnWrap">
            <a
              v-for="list in customer_list"
              :key="list.index"
              :class="[
                $style.customerBtn,
                {
                  [$style.active]: common.customer_exchange === list.state,
                },
              ]"
              @click="customerClickMobile(list.state)"
            >
              {{ list.title }}
            </a>
          </div>
          <div class="menu">
            <PerfectScrollbar>
              <el-menu default-active="2" class="el-menu-vertical-demo">
                <!-- 기업 -->
                <el-submenu
                  v-if="common.customer_exchange === 'COMPANY'"
                  index="0"
                >
                  <template slot="title">
                    <span
                      :class="{
                        'active-menu': $route.path.indexOf('company') !== -1,
                      }"
                    >
                      {{ $t('company') }}
                    </span>
                  </template>
                  <el-menu-item index="0-1">
                    <router-link :to="{ name: 'merchant-transaction-list' }">
                      {{ $t('shop.shop_history') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="0-2">
                    <router-link :to="{ name: 'shop' }">{{
                      $t('shop.shop_list')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="0-3">
                    <router-link :to="{ name: 'merchant-create' }">{{
                      $t('merchant.create')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="0-4">
                    <router-link :to="{ name: 'merchant-account-all-list' }">
                      {{ $t('header.calculation_account_list') }}
                    </router-link>
                  </el-menu-item>
                </el-submenu>
                <!-- 간편결제 -->
                <el-submenu index="8" class="no-icon">
                  <template slot="title">
                    <router-link :to="{ name: 'pg-xptx' }">
                      <span
                        :class="{
                          'active-menu': $route.path.indexOf('pg-xptx') !== -1,
                        }"
                      >
                        {{ $t('header.easy_payment') }}
                      </span>
                    </router-link>
                  </template>
                  <!-- <el-menu-item index="8-1">
                    <router-link :to="{ name: 'pg-xptx' }">
                      {{ $t('header.easy_payment') }}
                    </router-link>
                  </el-menu-item> -->
                </el-submenu>
                <!-- 간편 로그인 -->
                <el-submenu index="9" class="no-icon">
                  <template slot="title">
                    <router-link :to="{ name: 'xplogin' }">
                      <span
                        :class="{
                          'active-menu': $route.path.indexOf('xplogin') !== -1,
                        }"
                      >
                        {{ $t('header.easy_login') }}
                      </span>
                    </router-link>
                  </template>
                </el-submenu>
                <!-- 환전/시세 -->
                <el-submenu index="1">
                  <template slot="title">
                    <span
                      :class="{
                        'active-menu': $route.path.indexOf('exchange') !== -1,
                      }"
                    >
                      {{ $t('exchange_price') }}
                    </span>
                  </template>
                  <el-menu-item index="1-1">
                    <router-link :to="{ name: 'direct-exchange' }">{{
                      $t('header.exchange')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="1-2">
                    <a href="#" @click="alertPrepare">{{
                      $t('market_price_check')
                    }}</a>
                  </el-menu-item>
                </el-submenu>
                <!-- 조회 -->
                <el-submenu index="2">
                  <template slot="title">
                    <span
                      :class="{
                        'active-menu': $route.path.indexOf('lookup/') !== -1,
                      }"
                    >
                      {{ $t('look_up') }}
                    </span>
                  </template>
                  <el-menu-item index="2-1">
                    <router-link :to="{ name: 'money' }">
                      {{ $t('full_account_inquiry') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="2-2">
                    <router-link :to="{ name: 'transfer-list' }">
                      {{ $t('exchange_details_check') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="2-3">
                    <router-link :to="{ name: 'account-balance' }">{{
                      $t('deposit_account_inquiry')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="2-4">
                    <router-link :to="{ name: 'account-transfer-list' }">{{
                      $t('account_transfer.transfer_list_detail')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="2-5">
                    <router-link :to="{ name: 'deposit' }">{{
                      $t('wallet_page.deposit_list_look')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="2-6">
                    <router-link :to="{ name: 'withdraw' }">{{
                      $t('wallet_page.withdraw_list_look')
                    }}</router-link>
                  </el-menu-item>
                  <!-- <el-menu-item index="2-5">
                          <a href="#" @click="alertPrepare">{{
                            $t('dormant_account_check')
                          }}</a>
                        </el-menu-item>
                        <el-menu-item index="2-6">
                          <router-link :to="{ name: 'wallet-reference' }">{{
                            $t('account_and_other_case_status')
                          }}</router-link>
                        </el-menu-item>
                        <el-menu-item index="2-7">
                          <router-link :to="{ name: 'remittance-transfer' }">{{
                            $t('error_remittance')
                          }}</router-link>
                        </el-menu-item> -->
                </el-submenu>
                <!-- 이체 -->
                <el-submenu index="3">
                  <template slot="title">
                    <span
                      :class="{
                        'active-menu': $route.path.indexOf('transfer/') !== -1,
                      }"
                    >
                      {{ $t('transfer') }}
                    </span>
                  </template>
                  <el-menu-item index="3-1">
                    <router-link :to="{ name: 'account-transfer' }">{{
                      $t('transfer')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="3-2">
                    <router-link :to="{ name: 'account-transfer-list' }">{{
                      $t('transfer_result_check')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="3-3">
                    <router-link
                      :to="{
                        name: 'account-transfer-list',
                        query: { active_tab: 'outer' },
                      }"
                      >{{ $t('other_wallets_transfer_search') }}</router-link
                    >
                  </el-menu-item>
                  <!-- <el-menu-item index="3-4">
                          <router-link :to="{ name: 'favorite-address' }">{{
                            $t('frequently_used_accounts')
                          }}</router-link>
                        </el-menu-item> -->
                </el-submenu>
                <!-- 계좌신규 -->
                <el-submenu index="4">
                  <template slot="title">
                    <span
                      :class="{
                        'active-menu':
                          $route.path.indexOf('new-account') !== -1,
                      }"
                    >
                      {{ $t('new_account') }}
                    </span>
                  </template>
                  <el-menu-item index="4-1">
                    <router-link :to="{ name: 'create-address' }">{{
                      $t('new_demand_account')
                    }}</router-link>
                  </el-menu-item>
                  <!-- <el-menu-item index="4-2">
                          <router-link :to="{ name: 'svings-account' }">{{
                            $t('new_installment_savings_account')
                          }}</router-link>
                        </el-menu-item>
                        <el-menu-item index="4-3">
                          <router-link :to="{ name: 'term-deposit' }">{{
                            $t('new_deposit_account')
                          }}</router-link>
                        </el-menu-item>
                        <el-menu-item index="4-4">
                          <router-link :to="{ name: 'svings-term-list' }">{{
                            $t('check_account_progress_account')
                          }}</router-link>
                        </el-menu-item> -->
                </el-submenu>
                <!-- 출금 -->
                <!-- <el-submenu index="5">
                        <template slot="title">
                          <span>
                            <router-link :to="{ name: 'withdraw' }">
                              {{ $t('withdrawal') }}
                            </router-link>
                          </span>
                        </template>
                        <el-menu-item index="5-1">
                          <a href="#" @click="alertPrepare">{{
                            $t('Smart_window_withdrawal')
                          }}</a>
                        </el-menu-item>
                        <el-menu-item index="5-2">
                          <a href="#" @click="alertPrepare"
                            >{{ $t('smart_ATM_withdrawal') }}
                          </a>
                        </el-menu-item>
                      </el-submenu> -->
                <!-- 고객센터 -->
                <el-submenu index="7">
                  <template slot="title">
                    <span
                      :class="{
                        'active-menu':
                          $route.path.indexOf('product/search') !== -1,
                      }"
                    >
                      {{ $t('header.Product_Subscription') }}
                    </span>
                  </template>
                  <el-menu-item index="7-1">
                    <router-link :to="{ name: 'product-search' }">{{
                      $t('header.Product_Subscription')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="7-2">
                    <router-link :to="{ name: 'product-subscription-list' }">
                      {{ '상품계좌 조회' }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="7-3">
                    <router-link :to="{ name: 'product-return-list' }">
                      {{ '자금반환 내역조회' }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="7-4">
                    <router-link :to="{ name: 'product-dividend-list' }">
                      {{ '배당수령 내역조회' }}
                    </router-link>
                  </el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                  <template slot="title">
                    <span
                      :class="{
                        'active-menu':
                          $route.path.indexOf('service-center') !== -1,
                      }"
                    >
                      {{ $t('customer_service') }}
                    </span>
                  </template>
                  <el-menu-item index="5-1">
                    <router-link :to="{ name: 'contact-notice' }">{{
                      $t('notice')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="5-2">
                    <router-link :to="{ name: 'one-inquiry' }">{{
                      $t('one_one_inquiry')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="5-3">
                    <router-link :to="{ name: 'contact-history' }">{{
                      $t('inquiry_details')
                    }}</router-link>
                  </el-menu-item>
                  <el-menu-item index="5-4">
                    <router-link :to="{ name: 'faq' }">{{
                      $t('frequently_asked_questions')
                    }}</router-link>
                  </el-menu-item>
                  <!-- <el-menu-item index="5-5">
                      <a
                        href="https://cocofx.com/server_notice"
                        target="_blank"
                        >{{ $t('server_notice') }}</a
                      >
                    </el-menu-item> -->
                </el-submenu>
                <!-- 관리 -->
                <el-submenu index="6">
                  <template slot="title">
                    <span
                      :class="{
                        'active-menu':
                          $route.path.indexOf('certification-management') !==
                          -1,
                      }"
                    >
                      {{ $t('header.certification_management') }}
                    </span>
                  </template>
                  <el-menu-item index="6-1">
                    <router-link :to="{ name: 'auth-management' }">
                      {{ $t('secure_management') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="6-2">
                    <router-link :to="{ name: 'kyc', params: { type_seq: 1 } }">
                      {{ $t('kyc.kyc_enroll') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="6-3">
                    <router-link :to="{ name: 'mail-verification' }">
                      {{ $t('my_page.email_auth') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="6-4">
                    <router-link :to="{ name: 'otp' }">
                      {{ $t('my_page.otp_auth') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="6-5">
                    <router-link :to="{ name: 'security' }">
                      {{ $t('my_page.security') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="6-6">
                    <router-link :to="{ name: 'kyc-withdraw-address' }">
                      {{ $t('my_page.auth_withdraw_address') }}
                    </router-link>
                  </el-menu-item>
                  <el-menu-item index="6-7">
                    <router-link :to="{ name: 'clap-detail' }">
                      CLAP
                    </router-link>
                  </el-menu-item>
                  <!-- <el-menu-item index="6-2">
                      <a href="#" @click="alertPrepare">{{
                        $t('fund_limit_management')
                      }}</a>
                    </el-menu-item>
                    <el-menu-item index="6-3">
                      <a href="#" @click="alertPrepare">{{
                        $t('issue_details_check')
                      }}</a>
                    </el-menu-item> -->
                </el-submenu>
              </el-menu>
            </PerfectScrollbar>
          </div>
        </el-drawer>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" module>
@media (max-width: 768px) {
  .customerBtnWrap .customerBtn {
    display: inline-block;
    width: 50%;
    padding: 15px;
    text-align: center;
    background-color: #f4f4f4;
  }

  .customerBtnWrap .customerBtn.active {
    font-weight: bold;
    color: #0068c1;
  }

  .corporationText {
    display: inline-block;
    margin-left: 16px;
    line-height: 60px;
  }
}
</style>

<style>
.cor-btn-span {
  cursor: pointer;
}

.nav-secondary ul {
  border-bottom: none !important;
}
.nav-secondary ul li {
  padding-left: 20px !important;
}

.nav-secondary ul li a:hover {
  text-decoration: underline;
}

.nav-secondary .lang-wrap .lang-dropbox {
  position: fixed;
  width: 140px;
}

.individual {
  display: inline-block;
  width: 100%;
}

@media (max-width: 768px) {
  .el-drawer {
    width: 70%;
  }

  .hamberger-btn-wrap .menu {
    width: 100%;
  }

  .hamberger-btn-wrap .el-submenu .el-menu {
    background-color: #f4f4f4;
  }

  .hamberger-drawer .el-submenu__title {
    height: initial !important;
    border-bottom: 1px solid #e5e5e5;
  }

  .hamberger-drawer .el-submenu .el-menu {
    padding: 0 20px;
    background-color: #f4f4f4 !important;
  }

  .hamberger-drawer .login-menu {
    display: inline-block;
    width: 100%;
    padding: 20px;
    overflow: hidden;
    border-bottom: none !important;
  }

  .hamberger-drawer .login-menu li {
    box-sizing: border-box;
    float: left;
    width: 48%;
    padding: 10px;
    color: #222;
    text-align: center;
    border: 1px solid #e5e5e5;
  }

  .hamberger-drawer .login-menu li:last-child {
    margin-left: 4%;
  }

  .hamberger-drawer .el-drawer__close-btn {
    padding: 20px !important;
  }

  .hamberger-drawer .el-menu.el-menu--horizontal li.logged-first a {
    color: #0068c1 !important;
    background: #fff !important;
  }

  .hamberger-drawer .el-menu.el-menu--horizontal li.logged-second a {
    margin-left: 14px;
    color: #fff !important;
    background: #0068c1;
  }
  .hamberger-drawer .lang-wrap {
    display: block;
    float: initial;
    padding: 0 20px;
  }

  .hamberger-drawer .el-drawer__header {
    float: right;
    padding: 0;
    margin: 0;
  }

  .hamberger-drawer .menu {
    float: none;
  }

  .hamberger-drawer .menu .ps {
    height: calc(100vh - 63px - 25px - 87px - 55px);
  }

  .individual {
    display: none;
  }
}
</style>
