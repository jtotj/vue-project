<script>
import { mapState, mapGetters } from 'vuex'
import '@assets/css/c2c.css'
import LocaleSelect from '@components/LocaleSelect'
import NavNew from '@components/nav-new'

export default {
  components: {
    LocaleSelect,
    NavNew,
  },
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: 'Home' }],
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      dialogTableVisible: false,
      styleObject: {
        marginLeft: '16px',
      },
      value: '',
      scrollPosition: null,
      long_local_text: ['es-ES', 'fr-FR'],
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapState(['common']),
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
  <div :class="[$style.clearfix]" class="topNav">
    <header
      id="nav"
      :class="[
        {
          [$style.changeColor]: scrollPosition > 50,
        },
        [$style.pc, $style.navi],
      ]"
    >
      <NavNew></NavNew>
      <div :class="[$style.container, $style.c2cContainer]">
        <div
          :class="[
            {
              [$style.longLocalText]:
                long_local_text.indexOf(common.locale) !== -1,
            },
          ]"
        >
          <ul :class="[$style.nav]">
            <el-menu class="elMenuDemo" mode="horizontal" menu-trigger>
              <el-menu-item index="1" class="menuItem" :class="[$style.navEf]">
                <a href="https://cocobnk.com/home" class="navTitle">
                  {{ $t('private.direct_market') }}
                </a>
              </el-menu-item>
              <el-menu-item index="2" class="menuItem">
                <router-link
                  class="navTitle"
                  :to="{ name: 'create-ads', params: { offer_type: 'buy' } }"
                  :class="{ [$style.active]: $route.name === 'create-ads' }"
                  >{{ $t('header.c2c_enroll') }}</router-link
                >
              </el-menu-item>
              <el-submenu v-if="loggedIn" class="menuItem welletMenu" index="3">
                <span
                  slot="title"
                  class="navTitle"
                  :class="[
                    $style.navTitle,
                    {
                      [$style.active]:
                        $route.name === 'wallet' ||
                        $route.name === 'account-transfer' ||
                        $route.name === 'privateDeal' ||
                        $route.name === 'transfer-list' ||
                        $route.name === 'Deposit' ||
                        $route.name === 'account-transfer-list',
                    },
                  ]"
                  >{{ $t('header.wallet_list') }}</span
                >
                <el-menu-item index="3-1" class="walletMenuItem">
                  <router-link :to="{ name: 'wallet' }">
                    {{ $t('header.wallet') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item index="3-2" class="walletMenuItem">
                  <router-link
                    :to="{
                      name: 'account-transfer',
                    }"
                  >
                    {{ $t('account_transfer.transfer') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item index="3-3" class="walletMenuItem">
                  <router-link :to="{ name: 'privateDeal' }">
                    {{ $t('header.c2c_list') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item index="3-4" class="walletMenuItem">
                  <router-link :to="{ name: 'transfer-list' }">
                    {{ $t('header_sub.exchange_list') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item index="3-5" class="walletMenuItem">
                  <router-link :to="{ name: 'Deposit' }">
                    {{ $t('header.withdrawal_list') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item index="3-6" class="walletMenuItem">
                  <router-link :to="{ name: 'account-transfer-list' }">
                    {{ $t('header_sub.transfer_list') }}
                  </router-link>
                </el-menu-item>
              </el-submenu>

              <el-menu-item v-if="loggedIn" index="4" class="menuItem">
                <router-link
                  class="navTitle"
                  :to="{ name: 'myprofile' }"
                  :class="{ [$style.active]: $route.name === 'myprofile' }"
                >
                  {{ $t('header.my_info') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="5" class="menuItem">
                <a
                  href="https://cocofx.com/about_platform"
                  class="navTitle"
                  :class="[{ [$style.active]: $route.name === '' }]"
                  target="_blank"
                  >{{ $t('header.manual') }}
                </a>
              </el-menu-item>
            </el-menu>
          </ul>
          <ul
            :class="[$style.loginBox, $style.c2cLoginBox]"
            style="display:none"
          >
            <li :class="[$style.locale]">
              <LocaleSelect></LocaleSelect>
            </li>
            <li v-if="!loggedIn">
              <router-link
                :to="{ name: 'register' }"
                :class="[$style.loginButton, $style.signUp]"
                >{{ $t('register') }}</router-link
              >
            </li>
            <li v-if="!loggedIn">
              <router-link
                :to="{ name: 'login-me' }"
                :class="[$style.loginButton, $style.login]"
                >{{ $t('login') }}</router-link
              >
            </li>
            <li v-if="loggedIn">
              <router-link
                :to="{ name: 'logout' }"
                :class="[$style.loginButton, $style.logout]"
                >{{ $t('logout') }}</router-link
              >
            </li>
          </ul>
        </div>
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
          style="position:absolute;top:0;right:10px;color:black"
          @click="drawer = true"
        >
          <i class="fas fa-bars"></i>
        </el-button>
      </div>
    </header>

    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :append-to-body="true"
      :destroy-on-close="true"
      class="mobileDrawer"
    >
      <span>
        <div :class="[$style.loginBox, $style.clear]" class="loginBox">
          <ul>
            <li v-if="!loggedIn">
              <router-link
                :to="{ name: 'register' }"
                :class="[$style.loginButton, $style.signUp]"
                >{{ $t('register') }}</router-link
              >
            </li>
            <li v-if="!loggedIn">
              <router-link
                :to="{ name: 'login-me' }"
                :class="[$style.loginButton, $style.login]"
                class="loginButton"
                >{{ $t('login') }}</router-link
              >
            </li>
            <li v-if="loggedIn">
              <router-link
                :to="{ name: 'logout' }"
                :class="[$style.loginButton, $style.logout]"
                >{{ $t('logout') }}</router-link
              >
            </li>
          </ul>
          <LocaleSelect class="selectLocale"></LocaleSelect>
        </div>
        <el-row :class="$style.tac">
          <el-col :span="4">
            <el-menu>
              <el-menu-item index="1">
                <span>
                  <a
                    href="https://cocobnk.com/home"
                    class="navTitle"
                    :class="[{ [$style.active]: $route.name === 'home' }]"
                  >
                    {{ $t('private.direct_market') }}
                  </a>
                </span>
              </el-menu-item>
              <el-menu-item index="2">
                <span
                  ><router-link
                    class="navTitle"
                    :to="{ name: 'create-ads', params: { offer_type: 'buy' } }"
                    :class="{ [$style.active]: $route.name === 'create-ads' }"
                    >{{ $t('header.c2c_enroll') }}</router-link
                  ></span
                >
              </el-menu-item>
              <el-submenu v-if="loggedIn" class="walletMenu" index="3">
                <span slot="title">{{ $t('header.wallet_list') }}</span>
                <el-menu-item class="walletMenuItem">
                  <router-link :to="{ name: 'wallet' }">
                    {{ $t('header.wallet') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item class="walletMenuItem">
                  <router-link
                    :to="{
                      name: 'account-transfer',
                    }"
                  >
                    {{ $t('account_transfer.transfer') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item class="walletMenuItem">
                  <router-link :to="{ name: 'privateDeal' }">
                    {{ $t('header.c2c_list') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item class="walletMenuItem">
                  <router-link :to="{ name: 'transfer-list' }">
                    {{ $t('header_sub.exchange_list') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item class="walletMenuItem">
                  <router-link :to="{ name: 'Deposit' }">
                    {{ $t('header.withdrawal_list') }}
                  </router-link>
                </el-menu-item>
                <el-menu-item class="walletMenuItem">
                  <router-link :to="{ name: 'account-transfer-list' }">
                    {{ $t('header_sub.transfer_list') }}
                  </router-link>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-if="loggedIn" index="4">
                <span
                  ><router-link
                    class="navTitle"
                    :to="{ name: 'myprofile' }"
                    :class="{ [$style.active]: $route.name === 'myprofile' }"
                  >
                    {{ $t('header.my_info') }}
                  </router-link></span
                >
              </el-menu-item>
              <el-menu-item index="5">
                <span>
                  <a href="https://cocofx.com/about_platform" target="_blank">
                    {{ $t('header.manual') }}
                  </a>
                </span>
              </el-menu-item>
              <el-menu-item v-if="loggedIn" index="6">
                <router-link :to="{ name: 'pg-xptx' }">
                  간편 결제
                </router-link>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </span>
    </el-drawer>

    <!-- //header-mobile -->
    <!-- //gnb -->
  </div>
</template>

<style lang="scss" module>
@import '@src/design/common.scss';
@import '@src/design/c2c.scss';
.TopNav_container {
  width: 100%;
  max-width: 1320px;
}
.clearfix {
  *zoom: 1;
}

.clearfix::after {
  display: block;
  clear: both;
  content: '';
}

.header_notice {
  display: flex;
}

@media (max-width: 768px) {
  .header_notice {
    display: block;
  }
}
</style>
