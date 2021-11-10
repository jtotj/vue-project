<script>
import { mapGetters, mapState } from 'vuex'
import '@assets/css/b2c/common.css'
import LocaleSelect from '@components/LocaleSelect'
import NavNew from '@components/nav-new'

export default {
  components: {
    LocaleSelect,
    NavNew,
  },
  data() {
    return {
      dash_menu: false,
      drawer: false,
      direction: 'rtl',
      dialogTableVisible: false,
      styleObject: {
        marginLeft: '16px',
      },
      value: '',
      scrollPosition: null,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapGetters('auth', ['loggedIn']),
  },
  beforeMount() {
    window.addEventListener('scroll', this.updateScroll)
  },
  mounted() {
    this.updateScroll()
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
  },
}
</script>

<template>
  <div class="b2cHeader">
    <header
      :id="[$style.nav]"
      :class="[[$style.pc], { [$style.changeColor]: scrollPosition > 50 }]"
    >
      <div :class="[$style.header_notice]">
        <NavNew></NavNew>
      </div>
      <div :class="[$style.container]">
        <div :class="[$style.logo]" style="display:none;">
          <router-link :to="{ name: 'b2c-main' }">
            <img
              :class="[$style.logoWhite]"
              src="@assets/img/b2c/logo_b2c.png"
              alt="logo"
            />
            <img
              :class="[$style.logoBlue]"
              src="@assets/img/b2c/logo_b2c_white.png"
              alt="logo"
            />
          </router-link>
        </div>
        <ul :class="[$style.nav]" style="margin-left:0;">
          <el-menu
            :router="true"
            mode="horizontal"
            :default-active="$route.name"
          >
            <el-menu-item
              index="exchange"
              :class="[$style.navEf]"
              :route="{ name: 'exchange' }"
              ><a :class="[$style.menuItem]">
                {{ $t('header.exchange_store') }}
              </a></el-menu-item
            >
            <el-menu-item
              index="balance"
              :class="[$style.navHide]"
              :route="{ name: 'balance' }"
              ><a :class="[$style.menuItem]">{{
                $t('market_balance_transfer')
              }}</a></el-menu-item
            >
            <el-menu-item
              index="public-balance-transfer-list"
              :class="[$style.navHide]"
              :route="{ name: 'public-balance-transfer-list' }"
              ><a :class="[$style.menuItem]">{{
                $t('header.Balance_transfer_history')
              }}</a></el-menu-item
            >
            <el-menu-item
              index="public-trade-list"
              :class="[$style.navHide]"
              :route="{ name: 'public-trade-list' }"
              ><a :class="[$style.menuItem]">{{
                $t('shop.shop_history')
              }}</a></el-menu-item
            >
            <el-menu-item
              v-if="loggedIn"
              index="b2c-myprofile"
              :class="[$style.navHide]"
              :route="{ name: 'b2c-myprofile' }"
              ><a :class="[$style.menuItem]">{{
                $t('header.my_info')
              }}</a></el-menu-item
            >
            <el-menu-item>
              <a
                href="https://cocofx.com/about_platform"
                :class="[$style.menuItem]"
                target="_blank"
                >{{ $t('header.manual') }}
              </a>
            </el-menu-item>
          </el-menu>
        </ul>
        <ul :class="[$style.loginBox]" style="display:none;">
          <li>
            <LocaleSelect class="el-select" />
          </li>
          <li v-if="!loggedIn">
            <router-link
              :to="{ name: 'register' }"
              :class="[$style.loginButton, $style.signUp]"
            >
              {{ $t('register') }}
            </router-link>
          </li>
          <li v-if="!loggedIn">
            <router-link
              :to="{ name: 'login-me', query: { redirectFrom: 'b2c' } }"
              :class="[$style.loginButton, $style.login]"
            >
              {{ $t('login') }}
            </router-link>
          </li>
          <li v-if="loggedIn">
            <router-link
              :to="{ name: 'logout' }"
              :class="[$style.loginButton, $style.signUp]"
            >
              {{ $t('logout') }}
            </router-link>
          </li>
        </ul>
      </div>
    </header>
    <!-- //header-pc -->

    <header
      id="nav"
      :class="[
        {
          [$style.changeColor]: scrollPosition > 50,
        },
        [$style.mobile, $style.navi],
      ]"
    >
      <div :class="[$style.header_notice]">
        <NavNew></NavNew>
        <el-button
          class="b2c-hambuger"
          style="position:absolute;top:2px;right:-10px;color:black"
          @click="drawer = true"
        >
          <i class="fas fa-bars" style="font-size:2em"></i>
        </el-button>
      </div>
      <div :class="[$style.logo]" style="display:none">
        <router-link :to="{ name: 'b2c-main' }">
          <img
            :class="[$style.logoWhite]"
            src="@assets/img/b2c/exchange_logo_m.png"
            alt="logo"
          />
          <!-- <img
            :class="[$style.logoBlue]"
            src="@assets/img/b2c/logo_b2c_white.png"
            alt="logo"
          /> -->
        </router-link>
      </div>
      <div :class="[$style.menuButton, $style.floatR]" style="display:none">
        <el-button class="b2c-hambuger" @click="drawer = true">
          <img src="@assets/img/b2c/header_m_hambuger.png" alt="menu" />
        </el-button>
      </div>
    </header>

    <!-- //mobile header -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :append-to-body="true"
      :destroy-on-close="true"
      class="b2cSizeNav"
    >
      <span>
        <div class="pleaseLogin">
          <!-- 로그인 전-->
          <p v-if="!loggedIn" class="beforeLogin">{{
            $t('available_after_login')
          }}</p>
          <!-- 로그인 후-->
          <p v-if="loggedIn" class="afterLogin">
            <span>{{ currentUser.user_name }}</span> {{ $t('welcome') }}
          </p>
        </div>
        <ul :class="[$style.loginBox, $style.clear]" class="loginArea">
          <li v-if="!loggedIn" class="signUp">
            <router-link
              :to="{ name: 'register' }"
              :class="[$style.loginButton, $style.signUp]"
            >
              {{ $t('register') }}
            </router-link>
          </li>
          <li v-if="!loggedIn" class="login">
            <router-link
              :to="{ name: 'login-me', query: { redirectFrom: 'b2c' } }"
              :class="[$style.loginButton, $style.login]"
            >
              {{ $t('login') }}
            </router-link>
          </li>
          <li v-if="loggedIn" class="logout">
            <router-link
              :to="{ name: 'logout' }"
              :class="[$style.loginButton, $style.signUp]"
            >
              {{ $t('logout') }}
            </router-link>
          </li>
        </ul>
        <el-row :class="$style.tac" class="sideMenuArea">
          <el-col :span="4" class="sideMenuContents">
            <el-menu :router="true">
              <el-menu-item
                index="exchange-order"
                :route="{ name: 'exchange-order' }"
              >
                <a> {{ $t('header.exchange_store') }} </a>
              </el-menu-item>
              <el-menu-item index="balance" :route="{ name: 'balance' }">
                <a> {{ $t('market_balance_transfer') }} </a>
              </el-menu-item>
              <el-menu-item
                index="public-balance-transfer-list"
                :route="{ name: 'public-balance-transfer-list' }"
              >
                <a> {{ $t('header.Balance_transfer_history') }} </a>
              </el-menu-item>
              <el-menu-item
                index="public-trade-list"
                :route="{ name: 'public-trade-list' }"
              >
                <a> {{ $t('shop.shop_history') }} </a>
              </el-menu-item>
              <el-menu-item
                v-if="loggedIn"
                index="b2c-myprofile"
                :route="{ name: 'b2c-myprofile' }"
              >
                <a> {{ $t('header.my_info') }} </a>
              </el-menu-item>
              <el-menu-item index="" :route="{ name: '' }">
                <a href="https://cocofx.com/about_platform" target="_blank">
                  {{ $t('header.manual') }}
                </a>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </span>
    </el-drawer>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/common.scss';

.header_notice {
  display: flex;
}

@media (max-width: 768px) {
  .b2c-header_mobile_2zKqU {
    height: 135px !important;
  }
  .header_notice {
    display: block;
  }
}
</style>
