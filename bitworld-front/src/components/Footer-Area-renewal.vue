<script>
import '@assets/css/b2c/common.css'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: 'Home' }],
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      dialogTableVisible: false,
      value: '',
      scrollPosition: null,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
  },
  methods: {
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
  <footer>
    <div :class="[$style.pc]">
      <section :class="[$style.coinUseArea]">
        <div :class="[$style.container]">
          <strong>{{ $t('footer.footer_msg') }}</strong>
          <p>{{ $t('footer.footer_sub_msg') }}</p>
          <div :class="[$style.tipArea]">
            <div :class="[$style.tip]">
              <span :class="[$style.noSpace]"
                >{{ $t('footer.footer_sub_msg2') }}!</span
              >
            </div>
            <span>{{ $t('footer.footer_sub_msg3') }}</span>
          </div>
        </div>
      </section>
      <el-collapse accordion>
        <div :class="[$style.container]">
          <el-collapse-item>
            <template slot="title">
              <ul :class="[$style.footerMenu, $style.c2cFooterMenu]">
                <li>
                  <a href="https://cocofx.com/about">
                    {{ $t('pay_head_foot.about') }}
                  </a>
                </li>
                <li>
                  <a href="https://cocobnk.com">
                    {{ $t('pay_home.cocobank_title') }}
                  </a>
                </li>
                <li>
                  <a href="https://cocoin.market/" target="_blank">
                    {{ $t('footer.coco_market') }}
                  </a>
                </li>
                <li
                  ><a
                    :class="[$style.title]"
                    href="https://aboutcoin.io"
                    target="_blank"
                  >
                    {{ $t('footer.news') }}
                  </a>
                </li>
                <li>
                  <a href="https://cocofx.com/event">
                    {{ $t('footer.event') }}
                  </a>
                </li>
                <li>
                  <a href="https://cocofx.com/notice">
                    {{ $t('service_center.service_center') }}
                  </a>
                </li>
                <li>
                  <a href="https://cocofx.com/board_inquiry">
                    {{ $t('footer.platform_rental_title') }}
                  </a>
                </li>
                <li> </li>
              </ul>
            </template>
            <ul>
              <li>
                <ul>
                  <li :class="[$style.hideBlock]"></li>
                  <li
                    ><strong>{{ $t('pay_head_foot.about') }}</strong></li
                  >
                  <li>
                    <a href="https://cocofx.com/about">
                      {{ $t('pay_head_foot.about') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/education">
                      {{ $t('footer.education') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href=""
                      onclick="window.alert('서비스 준비중입니다. 보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다. 빠른 시일내에 준비하여 찾아뵙겠습니다.');"
                    >
                      {{ $t('footer.online_Academy') }}
                    </a>
                  </li>
                  <li
                    ><a
                      href=""
                      onclick="window.alert('서비스 준비중입니다. 보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다. 빠른 시일내에 준비하여 찾아뵙겠습니다.');"
                    >
                      {{ $t('footer.offline_Academy') }}
                    </a>
                  </li>
                  <li>
                    <strong>
                      {{ $t('pay_head_foot.secure') }}
                    </strong>
                  </li>
                  <li>
                    <a href="https://cocofx.com/security">
                      {{ $t('pay_head_foot.secure') }}
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <ul>
                  <li
                    ><strong>{{ $t('wallet') }}</strong></li
                  >
                  <li>
                    <a href="https://cocobnk.com/wallet">
                      {{ $t('wallet_page.have_asset') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocobnk.com/lookup/money">
                      {{ $t('pay_head_foot.fund') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocobnk.com/dashboard/dashboard">
                      {{ $t('pay_head_foot.account_management') }}
                    </a>
                  </li>
                  <li>
                    <strong>{{ $t('breakdown') }}</strong>
                  </li>
                  <li>
                    <a href="https://cocobnk.com/dashboard/private/deal">
                      {{ $t('header.c2c_list') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocobnk.com/lookup/transfer-list">
                      {{ $t('header.transfer_list') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocobnk.com/deposit">
                      {{ $t('header.withdrawal_list') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocobnk.com/company/merchant-transaction-list"
                    >
                      {{ $t('shop.shop_history') }}
                    </a>
                  </li>
                  <li
                    ><strong>{{ $t('shop.shop_list') }}</strong></li
                  >
                  <li>
                    <a href="https://cocobnk.com/company/shop">
                      {{ $t('shop.shop_list') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocobnk.com/company/merchant-create">
                      {{ $t('merchant.update') }}
                    </a>
                  </li>
                  <li
                    ><strong>{{ $t('pay_head_foot.secure') }}</strong></li
                  >
                  <li>
                    <a
                      href="https://cocobnk.com/certification-management/kyc/1"
                    >
                      {{ $t('kyc.kyc_enroll') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocobnk.com/certification-management/kyc-list"
                    >
                      {{ $t('kyc.kyc_cert_list') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocobnk.com/certification-management/mail-verification"
                    >
                      {{ $t('my_page.email_auth') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocobnk.com/certification-management/otp">
                      {{ $t('my_page.otp_auth') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocobnk.com/certification-management/security"
                    >
                      {{ $t('security.show_security') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocobnk.com/certification-management/kyc-withdraw-address"
                    >
                      {{ $t('my_page.auth_withdraw_address') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocobnk.com/certification-management/kyc-withdraw-address-list"
                    >
                      {{ $t('kyc.withdraw_list') }}
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>
                    <strong>{{ $t('footer.shopping_basket') }}</strong>
                  </li>
                  <li>
                    <a href="https://cocoin.market/goods/best" target="_blank">
                      {{ $t('footer.best_product') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocoin.market/mypage/order_catalog"
                      target="_blank"
                    >
                      {{ $t('footer.order') }}
                    </a>
                  </li>
                  <li>
                    <strong>{{ $t('footer.my_page_title') }}</strong>
                  </li>
                  <li>
                    <a
                      href="https://cocoin.market/mypage/index"
                      target="_blank"
                    >
                      {{ $t('footer.member_info_management') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocoin.market/mypage/index"
                      target="_blank"
                    >
                      {{ $t('footer.order_management') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocoin.market/mypage/index"
                      target="_blank"
                    >
                      {{ $t('footer.my_question') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocoin.market/mypage/index"
                      target="_blank"
                    >
                      {{ $t('footer.one_enquiry') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocoin.market/service/cs" target="_blank">
                      {{ $t('footer.community') }}
                    </a>
                  </li>
                </ul>
              </li>
              <li> </li>
              <li>
                <ul>
                  <li>
                    <a href="https://cocofx.com/lotterylotto">
                      {{ $t('footer.lotto') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/rockgame">
                      {{ $t('footer.rock_event') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/quizgame">
                      {{ $t('footer.quiz_game') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/eventgameladder">
                      {{ $t('footer.ladder_game') }}
                    </a>
                  </li>
                  <li
                    ><a href="https://cocofx.com/tetris">
                      {{ $t('footer.tetris') }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://cocofx.com/index.php?mid=lotterylotto&act=dispLottoEntryList"
                    >
                      {{ $t('footer.split_lotto') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/lottery">
                      {{ $t('footer.day_Lottery') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/attendance">
                      {{ $t('footer.attendance') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/adclick">
                      {{ $t('footer.scoop_out') }}
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>
                    <a href="https://cocofx.com/notice">
                      {{ $t('header.notice') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/server_notice">
                      {{ $t('header.server_notice') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/contact">
                      {{ $t('pay_head_foot.qa') }}
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>
                    <a href="https://cocofx.com/board_inquiry">
                      {{ $t('pay_head_foot.qa') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://c2c.cocofx.com/home">
                      {{ $t('footer.forum') }}
                    </a>
                  </li>
                  <li>
                    <router-link :to="{ name: 'home' }">
                      {{ $t('footer.c2c') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'b2c-main' }">{{
                      $t('footer.b2c')
                    }}</router-link>
                  </li>
                  <li>
                    <a href="https://margin.cocofx.com/index?trade=MARGIN">
                      {{ $t('footer.margin_exchange') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://margin.cocofx.com/index?trade=FUTURES">
                      {{ $t('footer.futures_exchange') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://binary.cocofx.com/">
                      {{ $t('footer.Binary') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://cocofx.com/">
                      {{ $t('footer.powerball') }}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
    <!-- //pc -->
    <div :class="[$style.mobile]" class="footerMoblie">
      <section :class="[$style.coinUseArea]">
        <div :class="[$style.container]">
          <strong>{{ $t('footer.footer_msg') }}</strong>
          <p>{{ $t('footer.footer_sub_msg') }}</p>
          <div :class="[$style.tipArea]">
            <div :class="[$style.tip]">
              <span :class="[$style.noSpace]"
                >{{ $t('footer.footer_sub_msg2') }}!</span
              >
            </div>
            <span>{{ $t('footer.footer_sub_msg3') }}</span>
          </div>
        </div>
      </section>
      <el-row class="tac">
        <el-col :span="8">
          <el-menu default-active="8" class="el-menu-vertical-demo">
            <el-submenu index="1">
              <template slot="title">
                <a href="https://cocofx.com/about">
                  {{ $t('pay_head_foot.about') }}
                </a>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" class="menuItem">
                  <strong>
                    {{ $t('pay_head_foot.about') }}
                  </strong>
                </el-menu-item>
                <el-menu-item index="1-2" class="menuItem">
                  <a href="https://cocofx.com/about">
                    {{ $t('pay_head_foot.about') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="1-3" class="menuItem">
                  <a href="https://cocofx.com/education">
                    {{ $t('footer.education') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="1-4" class="menuItem">
                  <a
                    href=""
                    onclick="window.alert('서비스 준비중입니다. 보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다. 빠른 시일내에 준비하여 찾아뵙겠습니다.');"
                  >
                    {{ $t('footer.online_Academy') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="1-5" class="menuItem">
                  <a
                    href=""
                    onclick="window.alert('서비스 준비중입니다. 보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다. 빠른 시일내에 준비하여 찾아뵙겠습니다.');"
                  >
                    {{ $t('footer.offline_Academy') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="1-6" class="menuItem">
                  <strong>
                    {{ $t('pay_head_foot.secure') }}
                  </strong>
                </el-menu-item>
                <el-menu-item index="1-7" class="menuItem">
                  <a href="https://cocofx.com/security">
                    {{ $t('pay_head_foot.secure') }}
                  </a>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <a href="https://cocobnk.com/home">
                  {{ $t('pay_home.cocobank_title') }}
                </a>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1" class="menuItem">
                  <strong>{{ $t('wallet') }}</strong>
                </el-menu-item>
                <el-menu-item index="2-2" class="menuItem">
                  <a href="https://cocobnk.com/lookup/money">
                    {{ $t('wallet_page.have_asset') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-3" class="menuItem">
                  <a href="https://cocobnk.com/lookup/money">
                    {{ $t('pay_head_foot.fund') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-4" class="menuItem">
                  <a href="https://cocobnk.com/dashboard/dashboard">
                    {{ $t('pay_head_foot.account_management') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-5" class="menuItem">
                  <strong>{{ $t('breakdown') }}</strong>
                </el-menu-item>
                <el-menu-item index="2-6" class="menuItem">
                  <a href="https://cocobnk.com/dashboard/private/deal">
                    {{ $t('header.c2c_list') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-7" class="menuItem">
                  <a href="https://cocobnk.com/lookup/transfer-list">
                    {{ $t('header.transfer_list') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-8" class="menuItem">
                  <a href="https://cocobnk.com/deposit">
                    {{ $t('header.withdrawal_list') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-9" class="menuItem">
                  <a
                    href="https://cocobnk.com/company/merchant-transaction-list"
                  >
                    {{ $t('shop.shop_history') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-10" class="menuItem"
                  ><strong>{{ $t('shop.shop_list') }}</strong></el-menu-item
                >
                <el-menu-item index="2-11" class="menuItem">
                  <a href="https://cocobnk.com/company/shop">
                    {{ $t('shop.shop_list') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-12" class="menuItem">
                  <a href="https://cocobnk.com/company/merchant-create">
                    {{ $t('merchant.update') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-13" class="menuItem"
                  ><strong>{{
                    $t('pay_head_foot.secure')
                  }}</strong></el-menu-item
                >
                <el-menu-item index="2-14" class="menuItem">
                  <a href="https://cocobnk.com/certification-management/kyc/1">
                    {{ $t('kyc.kyc_enroll') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-15" class="menuItem">
                  <a
                    href="https://cocobnk.com/certification-management/kyc-list"
                  >
                    {{ $t('kyc.kyc_cert_list') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-16" class="menuItem">
                  <a
                    href="https://cocobnk.com/certification-management/mail-verification"
                  >
                    {{ $t('my_page.email_auth') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-17" class="menuItem">
                  <a href="https://cocobnk.com/certification-management/otp">
                    {{ $t('my_page.otp_auth') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-18" class="menuItem">
                  <a
                    href="https://cocobnk.com/certification-management/security"
                  >
                    {{ $t('security.show_security') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-19" class="menuItem">
                  <a
                    href="https://cocobnk.com/certification-management/kyc-withdraw-address"
                  >
                    {{ $t('my_page.auth_withdraw_address') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="2-20" class="menuItem">
                  <a
                    href="hhttps://cocobnk.com/certification-management/kyc-withdraw-address-list"
                  >
                    {{ $t('kyc.withdraw_list') }}
                  </a>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <a href="https://cocoin.market/" target="_blank">
                  {{ $t('footer.coco_market') }}
                </a>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1" class="menuItem">
                  <strong>
                    {{ $t('footer.shopping_basket') }}
                  </strong>
                </el-menu-item>
                <el-menu-item index="3-2" class="menuItem">
                  <a href="https://cocoin.market/goods/best" target="_blank">
                    {{ $t('footer.best_product') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="3-3" class="menuItem">
                  <a
                    href="https://cocoin.market/mypage/order_catalog"
                    target="_blank"
                  >
                    {{ $t('footer.order') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="3-4" class="menuItem">
                  <strong>
                    {{ $t('footer.my_page_title') }}
                  </strong>
                </el-menu-item>
                <el-menu-item index="3-5" class="menuItem">
                  <a href="https://cocoin.market/mypage/index" target="_blank">
                    {{ $t('footer.member_info_management') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="3-6" class="menuItem">
                  <a href="https://cocoin.market/mypage/index" target="_blank">
                    {{ $t('footer.order_management') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="3-7" class="menuItem">
                  <a href="https://cocoin.market/mypage/index" target="_blank">
                    {{ $t('footer.my_question') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="3-8" class="menuItem">
                  <a href="https://cocoin.market/mypage/index" target="_blank">
                    {{ $t('footer.one_enquiry') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="3-9" class="menuItem">
                  <a href="https://cocoin.market/service/cs" target="_blank">
                    {{ $t('footer.community') }}
                  </a>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="5" class="menuItem nonepadding">
              <a class="title" href="https://aboutcoin.io" target="_blank">
                {{ $t('footer.news') }}
              </a>
            </el-menu-item>
            <el-submenu index="6">
              <template slot="title">
                <a href="https://cocofx.com/event">
                  {{ $t('footer.event') }}
                </a>
              </template>
              <el-menu-item-group>
                <el-menu-item index="6-1" class="menuItem"
                  ><a href="https://cocofx.com/lotterylotto">{{
                    $t('footer.lotto')
                  }}</a></el-menu-item
                >
                <el-menu-item index="6-2" class="menuItem"
                  ><a href="https://cocofx.com/rockgame">{{
                    $t('footer.rock_event')
                  }}</a></el-menu-item
                >
                <el-menu-item index="6-3" class="menuItem"
                  ><a href="https://cocofx.com/quizgame">{{
                    $t('footer.quiz_game')
                  }}</a></el-menu-item
                >
                <el-menu-item index="6-4" class="menuItem"
                  ><a href="https://cocofx.com/eventgameladder">{{
                    $t('footer.ladder_game')
                  }}</a></el-menu-item
                >
                <el-menu-item index="6-5" class="menuItem"
                  ><a href="https://cocofx.com/tetris">{{
                    $t('footer.tetris')
                  }}</a></el-menu-item
                >
                <el-menu-item index="6-6" class="menuItem"
                  ><a
                    href="https://cocofx.com/index.php?mid=lotterylotto&act=dispLottoEntryList"
                    >{{ $t('footer.split_lotto') }}</a
                  ></el-menu-item
                >
                <el-menu-item index="6-7" class="menuItem"
                  ><a href="https://cocofx.com/lottery">{{
                    $t('footer.day_Lottery')
                  }}</a></el-menu-item
                >
                <el-menu-item index="6-8" class="menuItem"
                  ><a href="https://cocofx.com/attendance">{{
                    $t('footer.attendance')
                  }}</a></el-menu-item
                >
                <el-menu-item index="6-9" class="menuItem"
                  ><a href="https://cocofx.com/adclick">{{
                    $t('footer.scoop_out')
                  }}</a></el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="7">
              <template slot="title">
                <a href="https://cocofx.com/notice">
                  {{ $t('service_center.service_center') }}
                </a>
              </template>
              <el-menu-item-group>
                <el-menu-item index="7-1" class="menuItem">
                  <a href="https://cocofx.com/notice">
                    {{ $t('header.notice') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="7-2" class="menuItem">
                  <a href="https://cocofx.com/server_notice">
                    {{ $t('header.server_notice') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="7-3" class="menuItem">
                  <a href="https://cocofx.com/contact">
                    {{ $t('pay_head_foot.qa') }}
                  </a>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="8">
              <template slot="title">
                <a href="https://cocofx.com/board_inquiry">
                  {{ $t('footer.platform_rental_title') }}
                </a>
              </template>
              <el-menu-item-group>
                <el-menu-item index="8-1" class="menuItem">
                  <a href="https://cocofx.com/board_inquiry">
                    {{ $t('pay_head_foot.qa') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="8-2" class="menuItem">
                  <a href="https://c2c.cocofx.com/home">
                    {{ $t('footer.forum') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="8-3" class="menuItem">
                  <router-link :to="{ name: 'home' }">
                    {{ $t('footer.c2c') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item index="8-4" class="menuItem">
                  <router-link :to="{ name: 'b2c-main' }">
                    {{ $t('footer.b2c') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item index="8-5" class="menuItem">
                  <a href="https://margin.cocofx.com/index?trade=MARGIN">
                    {{ $t('footer.margin_exchange') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="8-6" class="menuItem">
                  <a href="https://margin.cocofx.com/index?trade=FUTURES">
                    {{ $t('footer.futures_exchange') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="8-7" class="menuItem">
                  <a href="https://binary.cocofx.com/">
                    {{ $t('footer.Binary') }}
                  </a>
                </el-menu-item>
                <el-menu-item index="8-8" class="menuItem">
                  <a href="https://cocofx.com/">
                    {{ $t('footer.powerball') }}
                  </a>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <!-- //mobile -->
    <div :class="[$style.container]">
      <div :class="[$style.textBox]">
        <p>
          {{ $t('footer.law') }}
        </p>
        <p>
          {{ $t('footer.law1') }}
        </p>
        <p>
          {{ $t('footer.law2') }}
        </p>
        <p>
          {{ $t('footer.law3') }}
        </p>
        <p>
          {{ $t('footer.law4') }}
        </p>
        <p>
          {{ $t('footer.law5') }}
        </p>
        <p>
          {{ $t('footer.law6') }}
        </p>
        <p>
          {{ $t('footer.law7') }}
        </p>
        <p>
          {{ $t('footer.law8') }}
        </p>
        <br />
        <p>
          <span :class="[$style.danger]">
            {{ $t('footer.law_warn') }}
          </span>
          {{ $t('footer.law_1') }}
        </p>
        <p>
          {{ $t('footer.law_2') }}
        </p>
        <div :class="[$style.footerLogo]">
          <img src="@src/assets/img/footer_logo.png" alt="footer_logo" />
        </div>
      </div>
    </div>
    <div :class="[$style.copy]">
      <div :class="[$style.container]">
        <p>ⓒ COCOBANK All rights reserved</p>
      </div>
    </div>
  </footer>
  <!-- //footer -->
</template>

<style lang="scss" module>
@import '@src/design/b2c/common.scss';
</style>
