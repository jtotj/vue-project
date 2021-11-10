<script>
import '@assets/css/footer.css'
import { mapState } from 'vuex'

export default {
  // page: {
  //   title: 'footer-area',
  //   meta: [{ name: 'description', content: 'Home' }],
  // },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      dialogTableVisible: false,
      value: '',
      scrollPosition: null,
      is_show: false,
    }
  },
  computed: {
    ...mapState('common', ['locale']),
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
  },
  methods: {
    dropdownMenu() {
      this.is_show = !this.is_show
    },
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    handleToTop() {
      window.scrollTo(0, 0)
    },
  },
}
</script>

<template>
  <footer id="footer">
    <div class="footer-use-wrap">
      <div class="container">
        <h3 class="footer-use-title">
          {{ $t('footer.footer_msg') }}
        </h3>
        <p class="footer-use-text">
          {{ $t('footer.footer_sub_msg') }}
        </p>
      </div>
    </div>

    <!-- 하단 메뉴 pc -->
    <div class="footer-pc-wrap pc">
      <div class="container">
        <button
          :class="[
            {
              'dropdown-menu': is_show === true,
            },
          ]"
          class="btn-footer-open"
          @click="dropdownMenu"
          ><img src="@assets/img/icon-arrow-right.svg" alt="" />
        </button>
        <nav class="footer-menu">
          <transition name="slide">
            <ul
              :class="[
                {
                  'dropdown-menu': is_show === true,
                  'locale-position-none':
                    locale === 'ko-KR' ||
                    locale === 'zh-TW' ||
                    locale === 'zh-CN',
                  'locale-break-none':
                    locale === 'en-US' ||
                    locale === 'es-ES' ||
                    locale === 'ja-JP' ||
                    locale === 'fr-FR' ||
                    locale === 'pt-PT' ||
                    locale === 'vi-VN',
                  'footer-menu-list-height-middle':
                    locale === 'ja-JP' || locale === 'vi-VN',
                  'footer-menu-list-height-large':
                    locale === 'de-DE' ||
                    locale === 'en-US' ||
                    locale === 'es-ES' ||
                    locale === 'fr-FR' ||
                    locale === 'pt-PT',
                },
              ]"
              class="footer-menu-list"
            >
              <!-- 회사소개 -->
              <li class="footer-menu-item">
                <a href="https://cocofx.com/about" target="_blank">
                  {{ $t('pay_head_foot.about') }}
                </a>
                <ul v-if="is_show" class="footer-sub-menu-list">
                  <li class="footer-sub-menu-item">
                    <span class="footer-sub-menu-title">
                      <strong>{{ $t('pay_head_foot.about') }}</strong>
                    </span>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/about" target="_blank">
                      {{ $t('pay_head_foot.about') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/education" target="_blank">
                      {{ $t('footer.education') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a
                      href=""
                      onclick="window.alert('서비스 준비중입니다. 보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다. 빠른 시일내에 준비하여 찾아뵙겠습니다.');"
                    >
                      {{ $t('footer.online_Academy') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a
                      href=""
                      onclick="window.alert('서비스 준비중입니다. 보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다. 빠른 시일내에 준비하여 찾아뵙겠습니다.');"
                    >
                      {{ $t('footer.offline_Academy') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <span class="footer-sub-menu-title">
                      <strong>{{ $t('pay_head_foot.secure') }}</strong>
                    </span>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/security" target="_blank">
                      {{ $t('pay_head_foot.secure') }}
                    </a>
                  </li>
                </ul>
              </li>
              <!-- 코코뱅크 -->
              <li class="footer-menu-item">
                <router-link :to="{ name: 'home' }">
                  {{ $t('pay_home.cocobank_title') }}
                </router-link>
                <ul v-if="is_show" class="footer-sub-menu-list">
                  <li class="footer-sub-menu-item">
                    <span class="footer-sub-menu-title">
                      <strong>{{ $t('wallet') }}</strong>
                    </span>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'wallet' }">
                      {{ $t('wallet_page.have_asset') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'money' }">
                      {{ $t('pay_head_foot.fund') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'dashboard' }">
                      {{ $t('pay_head_foot.account_management') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <span class="footer-sub-menu-title">
                      <strong>{{ $t('breakdown') }}</strong>
                    </span>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'private-deal' }">
                      {{ $t('header.c2c_list') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link
                      :to="{
                        name: 'transfer-list',
                      }"
                    >
                      {{ $t('header.transfer_list') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link
                      :to="{
                        name: 'deposit',
                      }"
                    >
                      {{ $t('header.withdrawal_list') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'merchant-transaction-list' }">
                      {{ $t('shop.shop_history') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <span class="footer-sub-menu-title">
                      <strong>{{ $t('shop.shop_list') }}</strong>
                    </span>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'shop' }">
                      {{ $t('shop.shop_list') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'merchant-create' }">
                      {{ $t('merchant.update') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <span class="footer-sub-menu-title">
                      <strong>{{ $t('pay_head_foot.secure') }}</strong>
                    </span>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'kyc', params: { type_seq: 1 } }">
                      {{ $t('kyc.kyc_enroll') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'kyc-list' }">
                      {{ $t('kyc.kyc_cert_list') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'mail-verification' }">
                      {{ $t('my_page.email_auth') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'otp' }">
                      {{ $t('my_page.otp_auth') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link :to="{ name: 'security' }">
                      {{ $t('security.show_security') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link
                      :to="{
                        name:
                          $route.path.indexOf('bank') !== -1
                            ? 'kyc-withdraw-address'
                            : 'kyc-withdraw-address',
                      }"
                    >
                      {{ $t('my_page.auth_withdraw_address') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link
                      :to="{
                        name:
                          $route.path.indexOf('bank') !== -1
                            ? 'kyc-withdraw-address-list'
                            : 'kyc-withdraw-address-list',
                      }"
                    >
                      {{ $t('kyc.withdraw_list') }}
                    </router-link>
                  </li>
                </ul>
              </li>
              <!-- 코코마켓 -->
              <li class="footer-menu-item">
                <a href="https://market.cocofx.com/" target="_blank">
                  {{ $t('footer.coco_market') }}
                </a>
                <ul v-if="is_show" class="footer-sub-menu-list">
                  <li class="footer-sub-menu-item">
                    <span class="footer-sub-menu-title">
                      <strong>
                        {{ $t('footer.shopping_basket') }}
                      </strong>
                    </span>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://market.cocofx.com/" target="_blank">
                      {{ $t('footer.best_product') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a
                      href="https://market.cocofx.com/mypage/order_catalog"
                      target="_blank"
                    >
                      {{ $t('footer.order') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <span class="footer-sub-menu-title">
                      <strong>
                        {{ $t('footer.my_page_title') }}
                      </strong>
                    </span>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/security" target="_blank">
                      {{ $t('footer.member_info_management') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/security" target="_blank">
                      {{ $t('footer.order_management') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/security" target="_blank">
                      {{ $t('footer.my_question') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/security" target="_blank">
                      {{ $t('footer.one_enquiry') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a
                      href="https://market.cocofx.com/service/cs"
                      target="_blank"
                    >
                      {{ $t('footer.community') }}
                    </a>
                  </li>
                </ul>
              </li>
              <!-- 뉴스 -->
              <li class="footer-menu-item">
                <a class="title" href="https://cocofx.com/news" target="_blank">
                  {{ $t('footer.news') }}
                </a>
              </li>
              <!-- 이벤트 -->
              <li class="footer-menu-item">
                <a href="https://cocofx.com/event" target="_blank">
                  {{ $t('footer.event') }}
                </a>
                <ul v-if="is_show" class="footer-sub-menu-list">
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/lotterylotto" target="_blank">
                      {{ $t('footer.lotto') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/rockgame" target="_blank">
                      {{ $t('footer.rock_event') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/quizgame" target="_blank">
                      {{ $t('footer.quiz_game') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a
                      href="https://cocofx.com/eventgameladder"
                      target="_blank"
                    >
                      {{ $t('footer.ladder_game') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/tetris" target="_blank">
                      {{ $t('footer.tetris') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a
                      href="https://cocofx.com/index.php?mid=lotterylotto&act=dispLottoEntryList"
                      target="_blank"
                    >
                      {{ $t('footer.split_lotto') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/lottery" target="_blank">
                      {{ $t('footer.day_Lottery') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/attendance" target="_blank">
                      {{ $t('footer.attendance') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/adclick" target="_blank">
                      {{ $t('footer.scoop_out') }}
                    </a>
                  </li>
                </ul>
              </li>
              <!-- 플랫폼 임대 -->
              <li class="footer-menu-item">
                <a href="https://cocofx.com/board_inquiry" target="_blank">
                  {{ $t('footer.platform_rental_title') }}
                </a>
                <ul v-if="is_show" class="footer-sub-menu-list">
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/board_inquiry" target="_blank">
                      {{ $t('pay_head_foot.qa') }}
                    </a> </li
                  ><li class="footer-sub-menu-item">
                    <a href="https://c2c.cocofx.com/" target="_blank">
                      {{ $t('footer.c2c') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://c2c.cocofx.com/b2c/main" target="_blank">
                      {{ $t('footer.b2c') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a
                      href="https://margin.cocofx.com/index?trade=MARGIN"
                      target="_blank"
                    >
                      {{ $t('footer.margin_exchange') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a
                      href="https://margin.cocofx.com/index?trade=FUTURES"
                      target="_blank"
                    >
                      {{ $t('footer.gift_exchange') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://binary.cocofx.com/" target="_blank">
                      {{ $t('footer.Binary') }}
                    </a>
                  </li>
                </ul>
              </li>
              <!-- 이용약관 -->
              <li class="footer-menu-item">
                <router-link
                  :to="{ name: 'policy', params: { type: 'service' } }"
                >
                  {{ $t('pay_head_foot.usage') }}
                </router-link>
              </li>
              <!-- 개인정보취급방침 -->
              <li class="footer-menu-item">
                <router-link
                  :to="{ name: 'policy', params: { type: 'privacy' } }"
                >
                  {{ $t('pay_head_foot.privacy_state') }}
                </router-link>
              </li>
              <!-- 고객센터 -->
              <li class="footer-menu-item">
                <a href="https://cocofx.com/notice" target="_blank">
                  {{ $t('service_center.service_center') }}
                </a>
                <ul v-if="is_show" class="footer-sub-menu-list">
                  <li class="footer-sub-menu-item">
                    <router-link
                      :to="{
                        name: 'contact-notice',
                        params: { type: 'service-center/contact-notice' },
                      }"
                    >
                      {{ $t('header.notice') }}
                    </router-link>
                  </li>
                  <li class="footer-sub-menu-item">
                    <a href="https://cocofx.com/server_notice" target="_blank">
                      {{ $t('header.server_notice') }}
                    </a>
                  </li>
                  <li class="footer-sub-menu-item">
                    <router-link
                      :to="{
                        name: 'one-inquiry',
                        params: { type: 'service-center/one-inquiry' },
                      }"
                    >
                      {{ $t('pay_head_foot.qa') }}
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </transition>
        </nav>
      </div>
    </div>

    <!-- 하단 메뉴 mobile -->
    <div class="footer-mobile-wrap mobile">
      <div class="sitemap-wrap">
        <el-menu default-active="8" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <a href="https://cocofx.com/about" target="_blank">
                {{ $t('pay_head_foot.about') }}
              </a>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <strong>
                  {{ $t('pay_head_foot.about') }}
                </strong>
              </el-menu-item>
              <el-menu-item index="1-2">
                <a href="https://cocofx.com/about" target="_blank">
                  {{ $t('pay_head_foot.about') }}
                </a>
              </el-menu-item>
              <el-menu-item index="1-3">
                <a href="https://cocofx.com/education" target="_blank">
                  {{ $t('footer.education') }}
                </a>
              </el-menu-item>
              <el-menu-item index="1-4">
                <a
                  href=""
                  onclick="window.alert('서비스 준비중입니다. 보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다. 빠른 시일내에 준비하여 찾아뵙겠습니다.');"
                >
                  {{ $t('footer.online_Academy') }}
                </a>
              </el-menu-item>
              <el-menu-item index="1-5">
                <a
                  href=""
                  onclick="window.alert('서비스 준비중입니다. 보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다. 빠른 시일내에 준비하여 찾아뵙겠습니다.');"
                >
                  {{ $t('footer.offline_Academy') }}
                </a>
              </el-menu-item>
              <el-menu-item index="1-6">
                <strong>
                  {{ $t('pay_head_foot.secure') }}
                </strong>
              </el-menu-item>
              <el-menu-item index="1-7">
                <a href="https://cocofx.com/security" target="_blank">
                  {{ $t('pay_head_foot.secure') }}
                </a>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <router-link :to="{ name: 'home' }">
                {{ $t('pay_home.cocobank_title') }}
              </router-link>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <strong>{{ $t('wallet') }}</strong>
              </el-menu-item>
              <el-menu-item index="2-2">
                <router-link :to="{ name: 'wallet' }">
                  {{ $t('wallet_page.have_asset') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-3">
                <router-link :to="{ name: 'money' }">
                  {{ $t('pay_head_foot.fund') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-4">
                <router-link :to="{ name: 'dashboard' }">
                  {{ $t('pay_head_foot.account_management') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-5">
                <strong>{{ $t('breakdown') }}</strong>
              </el-menu-item>
              <el-menu-item index="2-6">
                <router-link :to="{ name: 'private-deal' }">
                  {{ $t('header.c2c_list') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-7">
                <router-link
                  :to="{
                    name: 'transfer-list',
                  }"
                  >{{ $t('header.transfer_list') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-8">
                <router-link
                  :to="{
                    name: 'deposit',
                  }"
                >
                  {{ $t('header.withdrawal_list') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-9">
                <router-link :to="{ name: 'merchant-transaction-list' }">
                  {{ $t('shop.shop_history') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-10" class="menuItem"
                ><strong>{{ $t('shop.shop_list') }}</strong></el-menu-item
              >
              <el-menu-item index="2-11">
                <router-link :to="{ name: 'shop' }">
                  {{ $t('shop.shop_list') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-12">
                <router-link :to="{ name: 'merchant-create' }">
                  {{ $t('merchant.update') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-13" class="menuItem"
                ><strong>{{ $t('pay_head_foot.secure') }}</strong></el-menu-item
              >
              <el-menu-item index="2-14">
                <router-link :to="{ name: 'kyc', params: { type_seq: 1 } }">
                  {{ $t('kyc.kyc_enroll') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-15">
                <router-link :to="{ name: 'kyc-list' }">
                  {{ $t('kyc.kyc_cert_list') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-16">
                <router-link :to="{ name: 'mail-verification' }">
                  {{ $t('my_page.email_auth') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-17">
                <router-link :to="{ name: 'otp' }">
                  {{ $t('my_page.otp_auth') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-18">
                <router-link :to="{ name: 'security' }">
                  {{ $t('security.show_security') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-19">
                <router-link
                  :to="{
                    name:
                      $route.path.indexOf('bank') !== -1
                        ? 'kyc-withdraw-address'
                        : 'kyc-withdraw-address',
                  }"
                >
                  {{ $t('my_page.auth_withdraw_address') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2-20">
                <router-link
                  :to="{
                    name:
                      $route.path.indexOf('bank') !== -1
                        ? 'kyc-withdraw-address-list'
                        : 'kyc-withdraw-address-list',
                  }"
                >
                  {{ $t('kyc.withdraw_list') }}
                </router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <a href="https://market.cocofx.com/" target="_blank">
                {{ $t('footer.coco_market') }}
              </a>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <strong>
                  {{ $t('footer.shopping_basket') }}
                </strong>
              </el-menu-item>
              <el-menu-item index="3-2">
                <a href="https://market.cocofx.com/" target="_blank">
                  {{ $t('footer.best_product') }}
                </a>
              </el-menu-item>
              <el-menu-item index="3-3">
                <a
                  href="https://market.cocofx.com/mypage/order_catalog"
                  target="_blank"
                >
                  {{ $t('footer.order') }}
                </a>
              </el-menu-item>
              <el-menu-item index="3-4">
                <strong>
                  {{ $t('footer.my_page_title') }}
                </strong>
              </el-menu-item>
              <el-menu-item index="3-5">
                <a href="https://cocofx.com/security" target="_blank">
                  {{ $t('footer.member_info_management') }}
                </a>
              </el-menu-item>
              <el-menu-item index="3-6">
                <a href="https://cocofx.com/security" target="_blank">
                  {{ $t('footer.order_management') }}
                </a>
              </el-menu-item>
              <el-menu-item index="3-7">
                <a href="https://cocofx.com/security" target="_blank">
                  {{ $t('footer.my_question') }}
                </a>
              </el-menu-item>
              <el-menu-item index="3-8">
                <a href="https://cocofx.com/security" target="_blank">
                  {{ $t('footer.one_enquiry') }}
                </a>
              </el-menu-item>
              <el-menu-item index="3-9">
                <a href="https://market.cocofx.com/service/cs" target="_blank">
                  {{ $t('footer.community') }}
                </a>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- <el-submenu index="4">
            <template slot="title">
              <a href="https://cocofx.com/icoex#/index" target="_blank">
                {{ $t('footer.ieo_market') }}
              </a>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" >
                <a href="https://cocofx.com/icoex#/index" target="_blank">
                  {{ $t('footer.ieo_market') }}
                </a>
              </el-menu-item>
              <el-menu-item index="4-2" >
                <a href="https://cocofx.com/ico_news" target="_blank">
                  {{ $t('footer.public') }}
                </a>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
          <el-submenu index="5" class="el-submenu-opacity">
            <template slot="title">
              <a class="title" href="https://cocofx.com/news" target="_blank">
                {{ $t('footer.news') }}
              </a>
            </template>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <a href="https://cocofx.com/event" target="_blank">
                {{ $t('footer.event') }}
              </a>
            </template>
            <el-menu-item-group>
              <el-menu-item index="6-1" class="menuItem"
                ><a href="https://cocofx.com/lotterylotto" target="_blank">{{
                  $t('footer.lotto')
                }}</a></el-menu-item
              >
              <el-menu-item index="6-2" class="menuItem"
                ><a href="https://cocofx.com/rockgame" target="_blank">{{
                  $t('footer.rock_event')
                }}</a></el-menu-item
              >
              <el-menu-item index="6-3" class="menuItem"
                ><a href="https://cocofx.com/quizgame" target="_blank">{{
                  $t('footer.quiz_game')
                }}</a></el-menu-item
              >
              <el-menu-item index="6-4" class="menuItem"
                ><a href="https://cocofx.com/eventgameladder" target="_blank">{{
                  $t('footer.ladder_game')
                }}</a></el-menu-item
              >
              <el-menu-item index="6-5" class="menuItem"
                ><a href="https://cocofx.com/tetris" target="_blank">{{
                  $t('footer.tetris')
                }}</a></el-menu-item
              >
              <el-menu-item index="6-6" class="menuItem"
                ><a
                  href="https://cocofx.com/index.php?mid=lotterylotto&act=dispLottoEntryList"
                  target="_blank"
                  >{{ $t('footer.split_lotto') }}</a
                ></el-menu-item
              >
              <el-menu-item index="6-7" class="menuItem"
                ><a href="https://cocofx.com/lottery" target="_blank">{{
                  $t('footer.day_Lottery')
                }}</a></el-menu-item
              >
              <el-menu-item index="6-8" class="menuItem"
                ><a href="https://cocofx.com/attendance" target="_blank">{{
                  $t('footer.attendance')
                }}</a></el-menu-item
              >
              <el-menu-item index="6-9" class="menuItem"
                ><a href="https://cocofx.com/adclick" target="_blank">{{
                  $t('footer.scoop_out')
                }}</a></el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <a href="https://cocofx.com/board_inquiry" target="_blank">
                {{ $t('footer.platform_rental_title') }}
              </a>
            </template>
            <el-menu-item-group>
              <el-menu-item index="7-1">
                <a href="https://cocofx.com/board_inquiry" target="_blank">
                  {{ $t('pay_head_foot.qa') }}
                </a>
              </el-menu-item>
              <el-menu-item index="7-2">
                <a href="https://c2c.cocofx.com/" target="_blank">
                  {{ $t('footer.c2c') }}
                </a>
              </el-menu-item>
              <el-menu-item index="7-3">
                <a href="https://c2c.cocofx.com/b2c/main" target="_blank">
                  {{ $t('footer.b2c') }}
                </a>
              </el-menu-item>
              <el-menu-item index="7-4">
                <a
                  href="https://margin.cocofx.com/index?trade=MARGIN"
                  target="_blank"
                >
                  {{ $t('footer.margin_exchange') }}
                </a>
              </el-menu-item>
              <el-menu-item index="7-5">
                <a
                  href="https://margin.cocofx.com/index?trade=FUTURES"
                  target="_blank"
                >
                  {{ $t('footer.gift_exchange') }}
                </a>
              </el-menu-item>
              <el-menu-item index="7-6">
                <a href="https://binary.cocofx.com/" target="_blank">
                  {{ $t('footer.Binary') }}
                </a>
              </el-menu-item>
              <!-- <el-menu-item index="7-7" >
                <a href="https://cocofx.com/" target="_blank">
                  {{ $t('footer.powerball') }}
                </a>
              </el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="8" class="el-submenu-opacity">
            <template slot="title">
              <router-link
                :to="{ name: 'policy', params: { type: 'service' } }"
              >
                {{ $t('pay_head_foot.usage') }}
              </router-link>
            </template>
          </el-submenu>
          <el-submenu index="9" class="el-submenu-opacity">
            <template slot="title">
              <router-link
                :to="{ name: 'policy', params: { type: 'privacy' } }"
              >
                {{ $t('pay_head_foot.privacy_state') }}
              </router-link>
            </template>
          </el-submenu>
          <el-submenu index="10">
            <template slot="title">
              <a href="https://cocofx.com/notice" target="_blank">
                {{ $t('service_center.service_center') }}
              </a>
            </template>
            <el-menu-item-group>
              <el-menu-item index="10-1">
                <router-link
                  :to="{
                    name: 'contact-notice',
                    params: { type: 'service-center/contact-notice' },
                  }"
                >
                  {{ $t('header.notice') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="10-2">
                <a href="https://cocofx.com/server_notice" target="_blank">
                  {{ $t('header.server_notice') }}
                </a>
              </el-menu-item>
              <el-menu-item index="10-3">
                <router-link
                  :to="{
                    name: 'one-inquiry',
                    params: { type: 'service-center/one-inquiry' },
                  }"
                >
                  {{ $t('pay_head_foot.qa') }}
                </router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="footer-logo">
              <img
                src="@src/assets/img/cocobank-f-logo-w.png"
                alt="푸터 로고"
              />
            </div>
          </div>
          <div class="col">
            <div class="text-area">
              <p>FH Financial House Trust Kommanditbolag Org.nm: 969778-0162</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <div class="container">
        <p>COCOBANK All rights reserved</p>
      </div>
    </div>
  </footer>
  <!-- //footer -->
</template>

<style lang="scss" module>
@import '@design';
</style>
