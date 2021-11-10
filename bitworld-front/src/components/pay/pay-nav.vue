<script>
import LocaleSelect from '@components/LocaleSelect'
import { fetchMerchantList } from '@apis/pg'
import { fetchPrivateMarkets } from '@apis/market'
import { fetchCertificationTypes } from '@apis/kyc'
import { mapState, mapGetters } from 'vuex'
import nth from 'lodash/nth'
import filter from 'lodash/filter'

export default {
  components: {
    LocaleSelect,
  },
  data() {
    return {
      activeIndex: '1',
      drawer: false,
      direction: 'rtl',

      merchant_list: [],
      market_list: [],
      kyc_type_list: [],

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
        this.$store.dispatch('auth/logOut')
        this.$router.push({ name: 'pay-home' })
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
      this.$toasted.info(this.$t('help.prepare'))
    },
  },
}
</script>

<template>
  <div class="bank-header">
    <nav id="header-nav">
      <!-- 네비게이션 PC -->
      <div class="nav-wrapper pc">
        <div class="nav-container">
          <div class="header-logo-wrap">
            <h1 class="header-logo">
              <router-link :to="{ name: 'pay-home' }">
                <img src="@assets/img/cocobank-logo-w.png" />
              </router-link>
            </h1>
          </div>
          <div class="nav-list-secondary">
            <LocaleSelect></LocaleSelect>
            <el-menu
              :default-active="$route.name"
              class="el-menu-demo"
              mode="horizontal"
              @select="menuSelect"
            >
              <el-menu-item index="pay-help-house">
                <a href="#">{{ $t('pay_head_foot.help') }}</a>
              </el-menu-item>
              <el-menu-item v-if="loggedIn" index="logout">{{
                $t('pay_head_foot.out')
              }}</el-menu-item>
              <el-menu-item v-else index="login-me">{{
                $t('pay_head_foot.in')
              }}</el-menu-item>
            </el-menu>
          </div>
        </div>
      </div>
      <nav class="header-main-nav">
        <ul
          :class="[
            {
              long_text: longtext_locales.indexOf(common.locale) !== -1,
            },
            $style.clearfix,
            'ul-reset',
          ]"
        >
          <li class="droppable">
            <router-link
              :to="{
                name: 'bank-wallet',
              }"
              >{{ $t('header.look_up') }}</router-link
            >
            <div class="mega-menu">
              <div class="container cf">
                <ul class="ul-reset">
                  <h3>{{ $t('wallet') }}</h3>
                  <li class="droppable">
                    <router-link :to="{ name: 'bank-wallet' }">{{
                      $t('wallet_page.have_asset')
                    }}</router-link>
                  </li>
                  <li class="droppable">
                    <router-link :to="{ name: 'money' }">{{
                      $t('pay_nav.view_your_account')
                    }}</router-link>
                  </li>
                  <li class="droppable">
                    <router-link :to="{ name: 'dashboard' }">{{
                      $t('pay_nav.account_summary_views')
                    }}</router-link>
                  </li>
                </ul>
                <ul class="ul-reset">
                  <h3>{{ $t('header.history') }}</h3>
                  <router-link
                    :to="{
                      name: 'bank-transfer-list',
                    }"
                    >{{ $t('header.transfer_list') }}</router-link
                  >
                  <router-link
                    :to="{
                      name: 'bank-deposit',
                    }"
                    >{{ $t('header.withdrawal_list') }}</router-link
                  >
                  <router-link :to="{ name: 'bank-transaction-list' }">{{
                    $t('header.payment_history')
                  }}</router-link>
                </ul>
                <div class="img-wrap">
                  <img src="@assets/img/wallet.jpg" />
                </div>
              </div>
            </div>
          </li>
          <li class="droppable">
            <router-link
              :to="{
                name: 'bank-account-transfer',
              }"
              >{{ $t('header.transfer') }}</router-link
            >
            <div class="mega-menu">
              <div class="container cf">
                <ul class="ul-reset">
                  <h3>{{ $t('header.transfer') }}</h3>
                  <li class="droppable">
                    <router-link :to="{ name: 'bank-account-transfer' }">{{
                      $t('header.account_transfer')
                    }}</router-link>
                  </li>
                  <li class="droppable">
                    <router-link :to="{ name: 'bank-account-transfer-list' }">{{
                      $t('header.transfer_history')
                    }}</router-link>
                  </li>
                  <li>
                    <a @click="alertPrepare">{{
                      $t('header.register_used_account')
                    }}</a>
                  </li>
                </ul>
                <div class="img-wrap">
                  <img src="@assets/img/wallet.jpg" />
                </div>
              </div>
            </div>
          </li>
          <li class="droppable">
            <router-link :to="{ name: 'bank-direct-market' }">{{
              $t('header.exchange')
            }}</router-link>
            <div class="mega-menu">
              <div class="container cf">
                <ul class="ul-reset">
                  <h3>{{ $t('header.exchange') }}</h3>
                  <li>
                    <router-link :to="{ name: 'bank-direct-market' }">{{
                      $t('header.do_exchange')
                    }}</router-link>
                    <router-link :to="{ name: 'bank-transfer-list' }">{{
                      $t('header.exchange_list')
                    }}</router-link>
                  </li>
                </ul>
                <div class="img-wrap">
                  <img src="@assets/img/wallet.jpg" />
                </div>
              </div>
            </div>
          </li>
          <li v-if="c_kyc_type_list_first" class="droppable">
            <router-link
              :to="{
                name: 'bank-kyc',
                params: { type_seq: c_kyc_type_list_first.seq },
              }"
              >{{ $t('header.account_management') }}</router-link
            >
            <div class="mega-menu">
              <div class="container cf">
                <ul class="ul-reset">
                  <h3>{{ $t('header.security_certification') }}</h3>
                  <li
                    v-for="kyc in kyc_type_list"
                    :key="kyc.seq"
                    class="kyc-type-list"
                  >
                    <router-link
                      :to="{ name: 'bank-kyc', params: { type_seq: kyc.seq } }"
                      class="list-item"
                      >{{ kyc.title }}</router-link
                    >
                  </li>
                  <li>
                    <router-link :to="{ name: 'bank-mail-verification' }">{{
                      $t('my_page.email_auth')
                    }}</router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'bank-otp' }">{{
                      $t('my_page.otp_auth')
                    }}</router-link>
                  </li>
                </ul>
                <ul class="ul-reset">
                  <h3>{{ $t('header.history') }}</h3>
                  <li>
                    <router-link :to="{ name: 'bank-security' }">{{
                      $t('my_page.show_security')
                    }}</router-link>
                  </li>
                  <li class="kyc-type-list">
                    <router-link
                      :to="{ name: 'bank-kyc-list' }"
                      class="list-item"
                      >{{ $t('kyc.kyc_cert_list') }}</router-link
                    >
                  </li>
                  <li>
                    <router-link :to="{ name: 'mail-verification-list' }">{{
                      $t('header.email')
                    }}</router-link>
                  </li>
                  <li>
                    <router-link v-if="0" :to="{ name: 'bank-kyc-list' }">{{
                      $t('header.email_list')
                    }}</router-link>
                    <router-link v-if="0" :to="{ name: 'bank-kyc-list' }">{{
                      $t('header.otp_list')
                    }}</router-link>
                  </li>
                </ul>
                <div class="img-wrap">
                  <img src="@assets/img/wallet.jpg" />
                </div>
              </div>
            </div>
          </li>
          <li class="droppable">
            <router-link :to="{ name: 'shop' }">{{
              $t('header.company')
            }}</router-link>
            <div class="mega-menu">
              <div class="container cf">
                <ul class="ul-reset">
                  <h3>{{ $t('header.exact_calculation') }}</h3>
                  <li>
                    <router-link :to="{ name: 'shop' }">{{
                      $t('shop.shop_list')
                    }}</router-link>
                  </li>
                  <li>
                    <router-link
                      :to="{
                        name: 'merchant-account-all-list',
                      }"
                    >
                      {{ $t('header.calculation_account_list') }}
                    </router-link>
                  </li>
                  <li v-if="0">
                    <router-link
                      v-for="merchant in merchant_list"
                      :key="merchant.seq"
                      :to="{
                        name: 'merchant-account-list',
                        params: { merchant_seq: merchant.seq },
                      }"
                      >{{ merchant.merchant_name }}
                      {{ $t('header.calculation_account_list') }}</router-link
                    >
                  </li>
                  <li v-if="0">
                    <router-link
                      v-for="merchant in merchant_list"
                      :key="merchant.seq"
                      :to="{
                        name: 'merchant-transaction-list',
                        params: { merchant_seq: merchant.seq },
                      }"
                      >{{ merchant.merchant_name }}
                      {{ $t('header.payment_history') }}</router-link
                    >
                  </li>
                </ul>
                <ul class="ul-reset">
                  <h3>{{ $t('header.history') }}</h3>
                  <li>
                    <a href="https://market.cocofx.com/" target="_blank">{{
                      $t('header.coco_open_market')
                    }}</a>
                  </li>
                </ul>
                <div class="img-wrap">
                  <img src="@assets/img/wallet.jpg" />
                </div>
              </div>
            </div>
          </li>
          <li class="droppable">
            <router-link :to="{ name: 'bank-myprofile' }">{{
              $t('header.profile')
            }}</router-link>
            <div class="mega-menu">
              <div class="container cf">
                <ul class="ul-reset">
                  <h3>{{ $t('header.information') }}</h3>
                  <li>
                    <router-link :to="{ name: 'bank-myprofile' }">{{
                      $t('header.my_profile')
                    }}</router-link>
                    <router-link
                      :to="{
                        name: 'bank-myprofile',
                        query: { update_seq: 'email' },
                      }"
                      >{{ $t('header.email_modify') }}</router-link
                    >
                    <router-link
                      :to="{
                        name: 'bank-myprofile',
                        query: { update_seq: 'password' },
                      }"
                      >{{ $t('header.password_modify') }}</router-link
                    >
                  </li>
                </ul>
                <div class="img-wrap">
                  <img src="@assets/img/wallet.jpg" />
                </div>
              </div>
            </div>
          </li>
          <li class="droppable">
            <a href="https://cocofx.com/notice" target="_blank">{{
              $t('header.service_center')
            }}</a>
            <div class="mega-menu">
              <div class="container cf">
                <ul class="ul-reset">
                  <h3>{{ $t('header.inquiry') }}</h3>
                  <li v-if="1">
                    <router-link :to="{ name: 'pay-one-inquiry' }">{{
                      $t('header.one_on_one_inquiry')
                    }}</router-link>
                    <router-link :to="{ name: 'pay-contact-history' }">{{
                      $t('header.inquiry_history')
                    }}</router-link>
                    <router-link :to="{ name: 'pay-faq' }">{{
                      $t('header.frequently_asked_questions')
                    }}</router-link>
                  </li>
                </ul>
                <ul class="ul-reset">
                  <h3>{{ $t('header.announcement') }}</h3>
                  <li>
                    <a
                      href="https://cocofx.com/server_notice"
                      target="_blank"
                      >{{ $t('header.server') }}</a
                    >
                    <a href="https://cocofx.com/notice" target="_blank">{{
                      $t('header.notice')
                    }}</a>
                  </li>
                </ul>
                <div class="img-wrap">
                  <img src="@assets/img/wallet.jpg" />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <!-- 네비게이션 MOBILE -->
      <div class="mobile">
        <div class="header-logo-wrap">
          <h1 class="header-logo-mobile">
            <router-link :to="{ name: 'pay-home' }">
              <img src="@assets/img/cocobank-logo-w.png" />
            </router-link>
          </h1>
        </div>
        <el-button @click="drawer = true">
          <img src="@views/pay/img/hamberger-btn.png" alt="menu button" />
        </el-button>
        <el-drawer
          :visible.sync="drawer"
          :direction="direction"
          class="mobile-drawer bank-mobile-drawer"
          size="70%"
        >
          <div class="hamberger-top">
            <div class="locale-wrap">
              <LocaleSelect></LocaleSelect>
            </div>
            <el-menu
              :default-active="$route.name"
              class="connection-information"
              @select="menuSelect"
            >
              <el-menu-item v-if="!loggedIn" index="login-me">
                <button class="login-btn">{{ $t('login') }}</button>
              </el-menu-item>
              <el-menu-item v-else index="logout">
                <button class="logout-btn" index="logout">{{
                  $t('logout')
                }}</button>
              </el-menu-item>
            </el-menu>
          </div>
          <PerfectScrollbar class="payDrawerperfectScrollbar">
            <div class="tac">
              <el-menu
                :default-active="$route.name"
                class="el-menu-vertical-demo"
                :router="true"
                @select="menuSelect"
              >
                <el-submenu index="2">
                  <template slot="title">
                    <span>{{ $t('header.look_up') }}</span>
                  </template>
                  <el-menu-item-group :title="$t('wallet')">
                    <el-menu-item
                      index="wallet"
                      :route="{ name: 'bank-wallet' }"
                      >{{ $t('wallet_page.have_asset') }}</el-menu-item
                    >
                    <el-menu-item index="money" :route="{ name: 'money' }">{{
                      $t('pay_nav.view_your_account')
                    }}</el-menu-item>
                    <el-menu-item
                      index="dashboard"
                      :route="{ name: 'dashboard' }"
                      >{{ $t('pay_nav.account_summary_views') }}</el-menu-item
                    >
                  </el-menu-item-group>
                  <el-menu-item-group :title="$t('history')">
                    <el-menu-item
                      index="transfer-list"
                      :route="{ name: 'bank-transfer-list' }"
                      >{{ $t('header.transfer_list') }}</el-menu-item
                    >
                    <el-menu-item
                      index="Deposit"
                      :route="{ name: 'bank-deposit' }"
                      >{{ $t('header.withdrawal_list') }}</el-menu-item
                    >
                    <el-menu-item
                      index="transaction-list"
                      :route="{ name: 'bank-transaction-list' }"
                      >{{ $t('header.payment_history') }}</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <span>{{ $t('header.transfer') }}</span>
                  </template>
                  <el-menu-item-group :title="$t('header.transfer')">
                    <el-menu-item
                      index="account-transfer"
                      :route="{ name: 'bank-account-transfer' }"
                      >{{ $t('header.account_transfer') }}</el-menu-item
                    >
                    <el-menu-item
                      index="account-transfer-list"
                      :route="{ name: 'bank-account-transfer-list' }"
                      >{{ $t('header.transfer_history') }}</el-menu-item
                    >
                    <li class="el-menu-item" @click="alertPrepare">
                      {{ $t('header.register_used_account') }}
                    </li>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <span>{{ $t('header.exchange') }}</span>
                  </template>
                  <el-menu-item-group :title="$t('exchange')">
                    <el-menu-item
                      index="direct-market"
                      :route="{ name: 'bank-direct-market' }"
                      >{{ $t('header.do_exchange') }}</el-menu-item
                    >
                    <el-menu-item
                      index="transfer-list"
                      :route="{ name: 'bank-transfer-list' }"
                      >{{ $t('header.exchange_list') }}</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                  <template slot="title">
                    <span>{{ $t('header.account_management') }}</span>
                  </template>
                  <el-menu-item-group :title="$t('security_certification')">
                    <el-menu-item
                      v-for="kyc in kyc_type_list"
                      :key="kyc.seq"
                      :index="kyc.name"
                      :route="{
                        name: 'bank-kyc',
                        params: { type_seq: kyc.seq },
                      }"
                      >{{ kyc.title }}</el-menu-item
                    >
                    <el-menu-item
                      index="bank-mail-verification"
                      :route="{ name: 'bank-mail-verification' }"
                      >{{ $t('my_page.email_auth') }}</el-menu-item
                    >
                    <el-menu-item index="otp" :route="{ name: 'bank-otp' }">{{
                      $t('my_page.otp_auth')
                    }}</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group :title="$t('history')">
                    <el-menu-item
                      index="security"
                      :route="{ name: 'bank-security' }"
                      >{{ $t('my_page.show_security') }}</el-menu-item
                    >
                    <el-menu-item
                      index="kyc-list"
                      :route="{ name: 'bank-kyc-list' }"
                      >{{ $t('kyc.kyc_cert_list') }}</el-menu-item
                    >
                    <el-menu-item
                      index="mail-verification-list"
                      :route="{ name: 'mail-verification-list' }"
                      >{{ $t('header.email') }}</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="6">
                  <template slot="title">
                    <span>{{ $t('header.company') }}</span>
                  </template>
                  <el-menu-item-group :title="$t('exact_calculation')">
                    <el-menu-item index="shop" :route="{ name: 'shop' }">{{
                      $t('shop.shop_list')
                    }}</el-menu-item>
                    <li class="el-menu-item" @click="alertPrepare">
                      {{ $t('header.calculation_account_list') }}
                    </li>
                  </el-menu-item-group>
                  <el-menu-item-group :title="$t('history')">
                    <a
                      class="el-menu-item"
                      href="https://market.cocofx.com/"
                      target="_blank"
                    >
                      {{ $t('header.coco_open_market') }}
                    </a>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="7">
                  <template slot="title">
                    <span>{{ $t('header.profile') }}</span>
                  </template>
                  <el-menu-item-group :title="$t('information')">
                    <el-menu-item
                      index="myprofile"
                      :route="{ name: 'bank-myprofile' }"
                      >{{ $t('header.my_info') }}</el-menu-item
                    >
                    <el-menu-item
                      index="myprofile"
                      :route="{
                        name: 'bank-myprofile',
                        query: { update_seq: 'email' },
                      }"
                      >{{ $t('header.email_modify') }}</el-menu-item
                    >
                    <el-menu-item
                      index="myprofile"
                      :route="{
                        name: 'bank-myprofile',
                        query: { update_seq: 'password' },
                      }"
                      >{{ $t('header.password_modify') }}</el-menu-item
                    >
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="8">
                  <template slot="title">
                    <span>{{ $t('header.service_center') }}</span>
                  </template>
                  <el-menu-item-group :title="$t('inquiry')">
                    <el-menu-item
                      index="pay-one-inquiry"
                      :route="{ name: 'pay-one-inquiry' }"
                      >{{ $t('header.one_on_one_inquiry') }}</el-menu-item
                    >
                    <el-menu-item
                      index="pay-contact-history"
                      :route="{ name: 'pay-contact-history' }"
                      >{{ $t('header.inquiry_history') }}</el-menu-item
                    >
                    <el-menu-item
                      index="pay-faq"
                      :route="{ name: 'pay-faq' }"
                      >{{
                        $t('header.frequently_asked_questions')
                      }}</el-menu-item
                    >
                  </el-menu-item-group>
                  <el-menu-item-group :title="$t('announcement')">
                    <a
                      class="el-menu-item"
                      href="https://cocofx.com/server_notice"
                      target="_blank"
                    >
                      {{ $t('header.server') }}
                    </a>
                    <a
                      class="el-menu-item"
                      href="https://cocofx.com/notice"
                      target="_blank"
                    >
                      {{ $t('header.notice') }}
                    </a>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item
                  index="pay-help-house"
                  :route="{ name: 'pay-help-house' }"
                >
                  <template slot="title">
                    <span>{{ $t('pay_head_foot.help') }}</span>
                  </template>
                </el-menu-item>
              </el-menu>
            </div>
          </PerfectScrollbar>
        </el-drawer>
      </div>
    </nav>
  </div>
</template>
<style lang="scss" module>
@import '@design';
</style>
<style>
#header-nav .lang .title-img {
  height: 50px;
  background-position-y: 16px;
}
</style>
