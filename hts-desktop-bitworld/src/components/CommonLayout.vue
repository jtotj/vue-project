<template>
  <div
    :class="[
      'wrapper',
      {
        exchange:
          is_in_traderoom ||
          is_in_login ||
          is_in_join ||
          is_in_invest ||
          is_in_fund ||
          is_in_notice ||
          is_in_cs ||
          is_in_policy ||
          is_in_mypage,
        simple:
          is_in_invest ||
          is_in_fund ||
          is_in_notice ||
          is_in_cs ||
          is_in_policy ||
          is_in_mypage,
      },
      `m-page-${$route.name}`,
    ]"
    v-if="is_inited"
  >
    <header v-if="is_in_traderoom" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>
        {{ 
          fromPairs(constants.asset.assets)[$route.params.asset] }}({{
          fromPairs(constants.asset.asset_codes)[$route.params.asset]
        }})
      </h1>
      <nav style="display:none;">
        <button
          type="button"
          class="btn_nav"
          data-set="back"
          @click="$router.go(-1)"
        >
          <i class="xi xi-arrow-left"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
      <div :class="['summary', c_selected_asset_info.updown]">
        <h2>{{ php.number_format(c_selected_asset_info.premium) }}</h2>
        <p>
          {{ $t('net_change') }}
          <b>
            {{ c_selected_asset_info.today_vs > 0 ? '+' : ''
            }}{{ c_selected_asset_info.percentage }}%
          </b>
          <em>
            {{ c_selected_asset_info.today_vs > 0 ? '+' : ''
            }}{{ php.number_format(c_selected_asset_info.today_vs) }}
          </em>
        </p>
        <div class="graph" v-if="0">graph</div>
      </div>
    </header>
    <header v-else-if="is_in_login" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>{{ $t('login') }}</h1>
      <nav style="display:none;">
        <button
          type="button"
          class="btn_nav"
          data-set="back"
          @click="$router.push({ name: 'index' })"
        >
          <i class="xi xi-home"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
    </header>
    <header v-else-if="is_in_join" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>{{ $t('membership') }}</h1>
      <nav style="display:none;">
        <button
          type="button"
          class="btn_nav"
          data-set="back"
          @click="$router.push({ name: 'index' })"
        >
          <i class="xi xi-home"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
    </header>

    <header v-else-if="is_in_invest" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>{{ $t('investment_information') }}</h1>
      <nav style="display:none">
        <button
          type="button"
          class="btn_nav"
          data-set="back"
          @click="$router.push({ name: 'index' })"
        >
          <i class="xi xi-home"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
    </header>
    <header v-else-if="is_in_policy" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>{{ $t('clause_fee_policy') }}</h1>
      <nav style="display:none;">
        <button
          type="button"
          class="btn_nav"
          data-set="back"
          @click="$router.push({ name: 'index' })"
        >
          <i class="xi xi-home"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
    </header>
    <header v-else-if="is_in_mypage" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>{{ $t('account_management') }}</h1>
      <nav style="display:none;">
        <button
          type="button"
          class="btn_nav"
          data-set="back"
          @click="$router.push({ name: 'index' })"
        >
          <i class="xi xi-home"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
    </header>
    <header v-else-if="is_in_fund" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>{{ $t('io') }}</h1>
      <nav style="display:none;">
        <button
          type="button"
          v-if="!$route.params.account_srl"
          class="btn_nav"
          data-set="back"
          @click="$router.push({ name: 'index' })"
        >
          <i class="xi xi-home"></i>
        </button>
        <button
          type="button"
          v-else
          class="btn_nav"
          data-set="back"
          @click="$router.go(-1)"
        >
          <i class="xi xi-arrow-left"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
    </header>
    <header v-else-if="is_in_notice" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>{{ $t('notice') }}</h1>
      <nav style="display:none;">
        <button
          type="button"
          v-if="!$route.params.document_srl"
          class="btn_nav"
          data-set="back"
          @click="$router.push({ name: 'index' })"
        >
          <i class="xi xi-home"></i>
        </button>
        <button
          type="button"
          v-else
          class="btn_nav"
          data-set="back"
          @click="$router.go(-1)"
        >
          <i class="xi xi-arrow-left"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
    </header>
    <header v-else-if="is_in_cs" id="header-tag">
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <h1>{{ $t('footer.customer_service_center') }}</h1>
      <nav style="display:none;">
        <button
          type="button"
          v-if="!$route.params.document_srl"
          class="btn_nav"
          data-set="back"
          @click="$router.push({ name: 'index' })"
        >
          <i class="xi xi-home"></i>
        </button>
        <button
          type="button"
          v-else
          class="btn_nav"
          data-set="back"
          @click="$router.go(-1)"
        >
          <i class="xi xi-arrow-left"></i>
        </button>
        <button
          type="button"
          class="btn_nav"
          data-set="menu"
          @click="show = true"
        >
          <i class="xi xi-bars"></i>
        </button>
      </nav>
    </header>
    <header v-else id="header-tag">
      <!-- <NoticeTicker></NoticeTicker> -->
      <div style='position:relative;'>
        <Nav></Nav>
        <button
            type="button"
            class="btn_nav"
            data-set="menu"
            @click="show = true"
            style="position: absolute;
          right: 7px;
          top: 13px;
          z-index: 30;
          color: black;
          color: black;
          height:35px;
          font-size: 33px;
          line-height:1;
          "
          >
            <i class="xi xi-bars" style="padding:2px 0 8px;"></i>
          </button>
      </div>
      <div class="mobileMainHeader" style="display:none;">
        <h1>
          <img src="~assets/img/cocofx-logo-margin.png" />
        </h1>
        <nav>
          
        </nav>
      </div>
    </header>
    <router-view></router-view>

    <transition
      name="aside"
      v-on:afterEnter="is_aside_opened = true"
      v-on:afterLeave="is_aside_opened = false"
    >
      <aside class="right" v-if="show">
        <a
          class="close xi xi-close btn_menu_close"
          @click.prevent="show = false"
        ></a>
        <div class="top">
          <h1 v-if="logged_info.member_srl">
            {{
              logged_info.member_srl
                ? $t('layout.call_user_name', [logged_info.nick_name])
                : $t('msg_login_required')
            }}
          </h1>
          <router-link
            v-if="!logged_info.member_srl"
            class="btn btn-login"
            :to="{ name: 'login' }"
            >{{ $t('login') }}/{{ $t('membership') }}</router-link
          >
          <a v-else class="btn" @click.prevent="logout">{{ $t('logout') }}</a>
          <router-link
            v-if="0 && !logged_info.member_srl"
            class="btn"
            :to="{ name: 'join' }"
            >{{ $t('membership') }}</router-link
          >
        </div>

        <!--<div class="my-grade-box">
                    <a class="my-grade-1" @click.prevent v-html="$t('security_level_1')"></a>
                    <a class="my-grade-2" @click.prevent v-html="$t('commission_grade')"></a>
        </div>-->
        <div class="my-valua-box">
          <div class="row" v-if="is_logged && estate_info">
            <div>
              {{ $t('total_transaction') }}
              <b>{{ php.number_format(estate_info.holding_balance) }}</b>
            </div>
            <div>
              {{ $t('total_evaluated') }}
              <b>{{ php.number_format(estate_info.evaluated_estate) }}</b>
            </div>
            <div>
              {{ $t('valuation_profit_loss') }}
              <b>{{ php.number_format(estate_info.evaluated_gain_loss) }}</b>
            </div>
            <div>
              {{ $t('earnings_rate') }}
              <b>
                {{ php.number_format(estate_info.evaluated_precentage, 2) }}%
              </b>
            </div>
          </div>
          <div class="row" v-else>
            <div>
              {{ $t('total_transaction') }}
              <b>-</b>
            </div>
            <div>
              {{ $t('total_evaluated') }}
              <b>-</b>
            </div>
            <div>
              {{ $t('valuation_profit_loss') }}
              <b>-</b>
            </div>
            <div>
              {{ $t('earnings_rate') }}
              <b>-</b>
            </div>
          </div>
        </div>

        <top-notice class="mobile"></top-notice>
        <LocaleSelect></LocaleSelect>
        <div class="my-box">
          <div>
            <h1>
              <a @click="handleModal">{{ $t('header.trade_method') }}</a>
            </h1>
          </div>
        </div>
        <div class="my-box">
          <div @click="my_page = !my_page">
            <h1>{{ $t('mypage.my_cocofx') }}</h1>
            <div :class="['check-img', { on: my_page }]">
              <img src="~assets/img/check.png" alt />
            </div>
          </div>
          <div v-if="my_page">
            <div class="my-trade-box">
              <router-link :to="{ name: 'mypage' }" class="my-trade">
                <i class="xi xi-user-circle" aria-hidden="true"></i>
                {{ $t('account_management') }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="my-box">
          <div @click="my_trade = !my_trade">
            <h1>{{ $t('mypage.my_trade') }}</h1>
            <div :class="['check-img', { on: my_trade }]">
              <img src="~assets/img/check.png" alt />
            </div>
          </div>
          <div v-if="my_trade" class="my-trade-box">
            <div>
              <router-link :to="{ name: 'index' }" class="my-trade">
                <i class="xi xi-home" aria-hidden="true"></i>
                {{ $t('header.traderoom') }}
              </router-link>
            </div>
            <div>
              <router-link :to="{ name: 'invest' }" class="my-trade">
                <i class="xi xi-paper" aria-hidden="true"></i>
                {{ $t('trade_history') }}
              </router-link>
            </div>
            <div>
              <router-link :to="{ name: 'fund' }" class="my-trade">
                <i class="xi xi-exchange" aria-hidden="true"></i>
                {{ $t('io') }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="my-box">
          <div @click="cs = !cs">
            <h1>{{ $t('mypage.cs') }}</h1>
            <div :class="['check-img', { on: cs }]">
              <img src="~assets/img/check.png" alt />
            </div>
          </div>
          <div v-if="cs">
            <div class="my-trade-box">
              <div>
                <img class="cs-img" src="~assets/img/notice.png" alt />
                <router-link :to="{ name: 'notice' }" class="my-trade">
                  {{ $t('notice') }}
                </router-link>
              </div>
              <div>
                <img class="cs-img" src="~assets/img/question.png" alt />
                <router-link :to="{ name: 'cs' }" class="my-trade">{{
                  $t('mypage.one_to_one_assistance')
                }}</router-link>
              </div>
              <div>
                <img class="cs-img" src="~assets/img/qna.png" alt />
                <router-link :to="{ name: 'faq' }" class="my-trade">
                  {{ $t('csnav.faq') }}
                </router-link>
              </div>
              <div>
                <router-link :to="{ name: 'contact', params: { cmd_enter_title_account: $t('cmd_enter_title_account') }}" class="my-trade">
                  <i class="xi xi-paper" aria-hidden="true"></i>
                  {{ $t('account_application') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="my-box">
          <div>
            <a href="https://cocofx.com/about_platform">
              <h1>
                {{ $t('header.manual') }}
              </h1>
            </a>
          </div>
        </div>

        <div class="my-etc-box">
          <router-link :to="{ name: 'terms' }" class="my-etc">
            {{ $t('mypage.see_terms') }}
          </router-link>
          <router-link :to="{ name: 'privacy' }" class="my-etc">{{
            $t('mypage.personal_data_processing_policy')
          }}</router-link>
          <router-link :to="{ name: 'fee' }" class="my-etc">
            {{ $t('mypage.fee_information') }}
          </router-link>
        </div>

        <!-- <div class="myinfo">
                   <nav>
                         <ul>
                            <li><router-link :to="{ name: 'index' }">  <i class="xi xi-home" aria-hidden="true">      </i>{{ $t('header.traderoom') }}   </router-link></li>
                            <li><router-link :to="{ name: 'mypage' }"> <i class="xi xi-user-circle" aria-hidden="true"></i>{{ $t('account_management') }}</router-link></li>
                            <li><router-link :to="{ name: 'invest' }"> <i class="xi xi-paper" aria-hidden="true">      </i>{{ $t('trade_history') }}     </router-link></li>
                            <li><router-link :to="{ name: 'fund' }">   <i class="xi xi-exchange" aria-hidden="true">   </i>{{ $t('io') }}                </router-link></li>
                        </ul>
                    </nav>
                    <dl class="row" v-if="is_logged && estate_info">
                        <dd>{{ $t('total_transaction') }}<b>{{ php.number_format(estate_info.holding_balance) }}</b></dd>
                        <dd>{{ $t('total_evaluated') }}<b>{{ php.number_format(estate_info.evaluated_estate) }}</b></dd>
                        <dd>{{ $t('valuation_profit_loss') }}<b>{{ php.number_format(estate_info.evaluated_gain_loss) }}</b></dd>
                        <dd>{{ $t('earnings_rate') }}<b>{{ php.number_format(estate_info.evaluated_precentage, 2) }}%</b></dd>
                    </dl>
                   <dl class="row" v-else>
                        <dd>{{ $t('total_transaction') }}<b>-</b></dd>
                        <dd>{{ $t('total_evaluated') }}<b>-</b></dd>
                        <dd>{{ $t('valuation_profit_loss') }}<b>-</b></dd>
                        <dd>{{ $t('earnings_rate') }}<b>-</b></dd>
                    </dl>
                    <dl class="cell">
                        <dd><a @click.prevent v-html="$t('security_level_1')"></a></dd>
                        <dd><a @click.prevent v-html="$t('commission_grade')"></a></dd>
                    </dl> 
        </div>-->
        <!--  <div class="menu">
                    <nav>
                        <ul>
                            <li><router-link :to="{ name: 'notice' }">{{ $t('notice') }}</router-link></li>
                            <li><router-link :to="{ name: 'cs' }">{{ $t('footer.customer_service_center') }}</router-link></li> <li><router-link :to="{ name: 'policy' }">{{ $t('clause_fee_policy') }}</router-link></li>
                        </ul>
                    </nav>
        </div>-->
      </aside>
    </transition>

    <div v-if="show_footer" class="footerMoblie">
      <Footer style="margin-top:20px;"></Footer>
    </div>
    <!-- footer mobile -->

    <div v-if="notice && show_notice" class="notice_fixed">
      <router-link
        :to="{
          name: 'noticeView',
          params: { document_srl: notice.document_srl },
        }"
      >
        <em>{{ $t('notification') }}</em>
        {{ notice.title }}
      </router-link>
      <a
        @click.prevent="show_notice = false"
        class="xi xi-close close"
        :title="$t('close')"
      ></a>
    </div>

    <footer v-if="0">
      <nav>
        <router-link v-if="!logged_info.member_srl" :to="{ name: 'login' }">
          {{ $t('login') }}
        </router-link>
        <a v-else @click.prevent="logout">{{ $t('logout') }}</a>
        <router-link :to="{ name: 'notice' }">{{ $t('notice') }}</router-link>
      </nav>
      <div class="cs_center">
        <a href>{{ $t('footer.customer_service_center_email') }}</a>
      </div>
      <div class="contact">
        <b>CocoFX Co., Ltd.</b>
        <br />
      </div>
      <div class="copy">© COPYRIGHT BITMARGIN. ALL RIGHTS RESERVED.</div>
    </footer>
    <div
      class="public_mask obj_public_mask"
      :style="{ display: is_aside_opened ? 'block' : 'none' }"
      @click="show = false"
    ></div>
    <div class="public_loading obj_public_loading">
      <i class="loader fa fa-spinner" aria-hidden="true"></i>
    </div>
  </div>
</template>
<style lang="scss">
@import '~assets/css/m.style_global.scss';
@import '~assets/css/m.style_common.scss';
</style>
<style>
@import '~assets/css/simple-line-icons/simple-line-icons.css';
@import '~assets/css/font-awesome/css/font-awesome.css';
@import '~assets/css/xeicon/xeicon.css';
@import '~assets/css/fonts/NanumSquare/nanumsquare.css';

.aside-enter-active {
  animation: bounce-in 0.3s;
}

.aside-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    right: -280px;
  }

  100% {
    right: 0;
  }
}
</style>
<script>
import 'assets/css/footer_renewal_m.css';

import { mapState, mapGetters } from 'vuex';
import php from 'phpjs';
import TopNotice from './TopNotice.vue';
import _ from 'lodash';
import LocaleSelect from './LocaleSelect.vue';
import NoticeTicker from '@/components/notice-ticker'
import Nav from '@/components/nav-new'
import Footer from '@/components/Footer'
export default {
  name: 'commonLayout',
  components: {
    TopNotice,
    LocaleSelect,
    NoticeTicker,
    Nav,
    Footer
  },
  data() {
    return {
      es: null,
      show: false,
      is_aside_opened: false,
      is_inited: true,
      last_emit_data: {},
      notice: null,
      show_notice: true,
      futures: [],
      future_balances: [],
      my_page: false,
      my_trade: false,
      cs: false,
    };
  },
  computed: {
    ...mapState({
      asset_settings: (state) => state.asset.settings,
      assets_statistics: (state) => state.asset.assets_statistics,
      premiums: (state) => state.asset.premiums,
      constants: (state) => state.common.constants,
      logged_info: (state) => state.auth.logged_info,
      trade_list: ({ trade }) => trade.unclosed_trades,
    }),
    ...mapGetters(['is_logged', 'accounts']),
    is_in_traderoom() {
      return ~this.$route.path.split('/').indexOf('traderoom');
    },
    is_in_login() {
      return ~this.$route.path.split('/').indexOf('login');
    },
    is_in_join() {
      return ~this.$route.path.split('/').indexOf('join');
    },
    is_in_invest() {
      return ~this.$route.path.split('/').indexOf('invest');
    },
    is_in_fund() {
      return ~this.$route.path.split('/').indexOf('fund');
    },
    is_in_notice() {
      return ~this.$route.path.split('/').indexOf('notice');
    },
    is_in_cs() {
      return ~this.$route.path.split('/').indexOf('cs');
    },
    is_in_policy() {
      return ~this.$route.path.split('/').indexOf('policy');
    },
    is_in_mypage() {
      return ~this.$route.path.split('/').indexOf('mypage');
    },
    show_footer() {
      if (this.is_in_fund && this.$route.params.account_srl) return false;

      return !this.is_in_traderoom && !this.is_in_invest;
    },
    c_selected_asset_info() {
      if (!this.$route.params.asset) return {};

      var asset = this.$route.params.asset;
      var statistics = this.assets_statistics[asset];
      var premium = this.premiums[asset];

      var info = {
        yesterday_vs: premium - statistics.yesterday_first,
        today_vs: premium - statistics.today_first,
        percentage:
          ((premium / statistics.today_first) * 100 - 100).toFixed(2) * 1,
        premium,
      };

      info.percentage = info.percentage === Infinity ? 0 : info.percentage;
      info.updown = info.today_vs < 0 ? 'down' : 'up';

      return info;
    },
    php() {
      return php;
    },
    estate_info() {
      var vm = this;

      var data = {
        margin: _.chain(vm.c_accounts)
          .filter({
            account_type: 'REAL',
          })
          .map('margin')
          .sum()
          .value(),
        trade_margin: _.chain(vm.c_accounts)
          .filter({
            account_type: 'REAL',
          })
          .map('trade_margin')
          .sum()
          .value(),
        holding_balance: _.chain(vm.c_accounts)
          .filter({
            account_type: 'REAL',
          })
          .map('holding_balance')
          .sum()
          .value(),
        evaluated_gain_loss: _.chain(vm.c_accounts)
          .filter({
            account_type: 'REAL',
          })
          .map('evaluated_gain_loss')
          .sum()
          .value(),
      };

      data.evaluated_estate = data.margin + data.evaluated_gain_loss;
      data.tradable_margin = Math.max(data.margin - data.holding_balance, 0);
      data.evaluated_precentage =
        ((data.trade_margin + data.evaluated_gain_loss) / data.trade_margin) *
          100 -
        100;

      return data;
    },
    c_accounts() {
      var accounts = [];
      var vm = this;

      _.each(vm.accounts, (val, key) => {
        var account = _.extend({}, val);
        var account_trades = _.filter(vm.c_trade_list, {
          account_srl: account.account_srl,
        });

        var trade_margin = _.chain(account_trades)
          .map('trade_margin')
          .sum()
          .value(); // 주문 시 사용된 증거금의 합계 (수수료 제외)

        account.evaluated_gain_loss = _.chain(account_trades)
          .filter({
            status: 'LINKED',
          })
          .map('evaluated_gain_loss')
          .sum()
          .value(); // 주문의 손익금 합계
        account.evaluated_estate =
          account.margin + account.evaluated_gain_loss + trade_margin; // 평가 자산
        account.evaluated_precentage =
          ((trade_margin + account.evaluated_gain_loss) / trade_margin) * 100 -
          100; // 손익률
        account.trade_margin = trade_margin;

        accounts.push(account);
      });

      return accounts;
    },
    c_trade_list() {
      var trade_list = [];
      var vm = this;
      var target_datas = [].concat(vm.future_balances, vm.trade_list);

      _.each(target_datas, (val, key) => {
        var trade = {};
        var asset_setting = vm.asset_settings[val.asset];
        var current_tick = vm.premiumToTick(
          asset_setting,
          vm.premiums[val.asset]
        );
        var tick_unit_count_diff = 0;
        var trade_type =
          val.balance_srl || val.future_srl ? 'FUTURES' : 'MARGIN';

        switch (trade_type) {
          case 'MARGIN':
            trade = _.extend({}, val);
            tick_unit_count_diff = vm.diffTickUnitCount(
              asset_setting.tick_unit,
              current_tick,
              trade.tick
            );
            var trade_margin = trade.trade_margin;

            if (trade.position == 'PUT') tick_unit_count_diff *= -1;
            if (trade.status == 'PENDING') tick_unit_count_diff = 0;

            trade.trade_margin = trade_margin;
            break;

          case 'FUTURES':
            _.extend(trade, {
              trade_srl: val.trade_srl || val.balance_srl,
              asset: val.asset,
              future_srl: val.future_srl,
              trade_margin:
                val.trade_margin ||
                (val.unit_price * Math.abs(val.amount)) / val.leverage,
              tick: val.tick || val.average_tick,
              amount: Math.abs(val.amount),
              position: val.position || (val.amount < 0 ? 'PUT' : 'CALL'),
              evaluated_gain_loss: 0,
              evaluated_estate: 0,
              evaluated_precentage: 0,
              total_fee: val.unit_fee * Math.abs(val.amount),
              status: val.balance_srl ? 'LINKED' : 'PENDING',
            });

            tick_unit_count_diff = vm.diffTickUnitCount(
              asset_setting.tick_unit,
              current_tick,
              trade.tick
            );

            if (val.trade_srl && val.status != 'PENDING') return;

            if (trade.position == 'PUT') tick_unit_count_diff *= -1;
            if (trade.status == 'PENDING') tick_unit_count_diff = 0;

            break;
        }

        trade.evaluated_gain_loss =
          asset_setting.tick_unit_profit[trade_type] *
          tick_unit_count_diff *
          trade.amount; // 평가 손익
        trade.holding_gain_loss = trade.evaluated_gain_loss - trade.total_fee;
        trade.evaluated_estate = trade.trade_margin + trade.evaluated_gain_loss; // 평가 금액
        trade.evaluated_precentage =
          (trade.evaluated_estate / trade.trade_margin) * 100 - 100; // 손익률

        trade_list.push(trade);
      });

      return trade_list;
    },
  },
  created() {
    const [rootElement] = document.getElementsByTagName('html');
    rootElement.classList.add('mobile');
    // var vm = this;
    // vm.init();
  },
  methods: {
    logout() {
      return this.$store.dispatch('LogOut');
    },

    premiumToTick(asset_setting, premium) {
      return (
        ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit
      );
    },

    // 호가단위 갯수의 차를 구함
    diffTickUnitCount(tick_unit, tick1, tick2) {
      return tick1 / tick_unit - tick2 / tick_unit;
    },
    handleModal() {
      this.$modal.show('trade');
    },
    alert() {
      window.alert(
        this.common.locale === 'ko-KR'
          ? '현재 국가에서 지원하지 않는 서비스 입니다.'
          : 'Comming Soon'
      );
    },
    serviceAlert() {
      const message =
        this.common.locale === 'ko-KR'
          ? '서비스 준비중입니다.'
          : 'Comming Soon';
      window.alert(message);
    },
  },
  beforeDestroy() {
    if (this.es) this.es.close();
  },
  beforeRouteUpdate(to, from, next) {
    this.show = false;

    next();
  },
};
</script>
