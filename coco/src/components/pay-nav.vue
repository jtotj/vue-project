<script>
import '@assets/css/icon.css'
import LocaleSelect from '@components/LocaleSelect'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PayNav',
  components: {
    LocaleSelect,
  },
  data() {
    return {
      hamberger_menu: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapState(['common']),
  },
  methods: {
    customerClickMobile(state) {
      switch (state) {
        case 'INDIVIDUAL':
          this.$store.dispatch('common/setCustomerExchange', 'INDIVIDUAL')
          break
        case 'COMPANY':
          this.$store.dispatch('common/setCustomerExchange', 'COMPANY')
      }
    },
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
  },
}
</script>

<template>
  <nav id="pay-nav nav">
    <div class="nav-line"></div>
    <div class="nav-wrap">
      <div class="container">
        <div class="logo-wrap">
          <h1 class="logo">
            <router-link :to="{ name: 'PayMain' }">
              <img src="@assets/img/cocopay-logo.svg" />
            </router-link>
          </h1>
        </div>
        <div class="corporation-text">
          <p
            :class="[
              {
                active: common.customer_exchange === 'INDIVIDUAL',
              },
            ]"
            @click="customerClickMobile('INDIVIDUAL')"
          >
            <router-link
              :to="{ name: 'home' }"
              :class="{
                'active-menu': $route.path.indexOf('INDIVIDUAL') !== -1,
              }"
            >
              {{ $t('individual') }}
            </router-link>
          </p>
          <p
            :class="[
              {
                active: common.customer_exchange === 'COMPANY',
              },
            ]"
            @click="customerClickMobile('COMPANY')"
          >
            <router-link
              :to="{ name: 'PayMain' }"
              :class="{
                'active-menu': $route.path.indexOf('company') !== -1,
              }"
            >
              {{ $t('company') }}
            </router-link>
          </p>
        </div>
        <div class="nav-secondary">
          <p class="com-name">(주)코코엔터테인먼트</p>
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
              <el-menu-item index="logout" class="log-out">
                <a href="#">
                  {{ $t('pay_head_foot.out') }}
                </a>
              </el-menu-item>
            </template>
            <template v-else>
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
        <!-- 모바일 햄버거 메뉴 -->
        <div class="hamberger-btn-wrap mobile">
          <div class="hamberger-btn" @click="hamberger_menu = true">
            <img src="@assets/img/hamberger-btn.svg" alt="햄버거 버튼" />
          </div>
          <el-drawer
            :visible.sync="hamberger_menu"
            :append-to-body="true"
            :direction="direction"
            size="90%"
            class="hamberger-drawer pay-m"
          >
            <div class="pro-wrap">
              <p class="com-name">(주)코코엔터테인먼트</p>
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
            </div>
            <el-menu>
              <el-menu-item index="1">
                <router-link :to="{ name: 'ShopInfo' }">
                  {{ $t('header.shop_info') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="2">
                <router-link :to="{ name: 'Paymerchant' }">
                  {{ $t('shop.shop_history') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="3">
                <router-link :to="{ name: 'Paymerchantaccount' }">
                  {{ $t('header.calculation_account_list') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="4">
                <router-link :to="{ name: 'Csnotice' }">
                  {{ $t('customer_service') }}
                </router-link>
              </el-menu-item>
              <el-menu-item index="5">
                <router-link :to="{ name: 'Certikyc' }">
                  {{ $t('header.certification_management') }}
                </router-link>
              </el-menu-item>
            </el-menu>
            <LocaleSelect></LocaleSelect>
          </el-drawer>
        </div>
      </div>
    </div>
    <div class="container pc-gnb">
      <div class="individual">
        <ul>
          <li class="droppable">
            <router-link :to="{ name: 'ShopInfo' }">
              {{ $t('header.shop_info') }}
            </router-link>
          </li>
          <li class="droppable">
            <router-link :to="{ name: 'Paymerchant' }">
              {{ $t('shop.shop_history') }}
            </router-link>
          </li>
          <li class="droppable">
            <router-link :to="{ name: 'Paymerchantaccount' }">
              {{ $t('header.calculation_account_list') }}
            </router-link>
          </li>
          <li class="droppable">
            <router-link
              :to="{ name: 'Csnotice' }"
              :class="{
                'active-menu': $route.path.indexOf('pay-cs') !== -1,
              }"
            >
              {{ $t('customer_service') }}
            </router-link>
          </li>
          <li class="droppable">
            <router-link
              :to="{ name: 'Certikyc', params: { type_seq: 1 } }"
              :class="{
                'active-menu': $route.path.indexOf('pay-certi-manage') !== -1,
              }"
            >
              {{ $t('header.certification_management') }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
#header .nav-wrap .logo-wrap {
  width: 146px;
}

#header .nav-wrap .nav-secondary .lang-wrap {
  position: relative;
  float: right;
  padding: 16.5px 0;
  margin-left: 15px;
}

#header .nav-wrap .nav-secondary .lang-wrap::before {
  position: absolute;
  top: 50%;
  left: -15px;
  width: 1px;
  height: 22px;
  content: '';
  background: #dadada;
  transform: translateY(-50%);
}

#header .nav-wrap .lang .title-img {
  height: 24px;
}

.hamberger-drawer.pay-m .lang-wrap .lang-dropbox {
  bottom: 45px;
}

.hamberger-drawer .el-drawer__header {
  float: right;
  padding: 0;
  margin: 0;
}

.el-drawer__close-btn {
  padding: 20px;
}

.hamberger-drawer .lang-wrap .lang .title-img {
  height: 24px;
}
</style>

<style scoped>
h1 {
  margin: 0.5em 0;
}

.container {
  width: auto;
  max-width: 1100px;
}

.nav-line {
  width: 100%;
  height: 4px;
  background: #0068c1;
}

.nav-wrap {
  background: #fafafa;
}

.lang .title-img {
  height: 24px;
}

.corporation-text p {
  margin: 16px 0;
}

.com-name {
  position: relative;
  float: left;
  margin-right: 15px;
  line-height: 60px;
  color: #707071;
}

.com-name::before {
  position: absolute;
  top: 50%;
  right: -15px;
  width: 1px;
  height: 22px;
  content: '';
  background: #dadada;
  transform: translateY(-50%);
}

.nav-secondary ul li {
  padding: 0 15px 0 !important;
  line-height: 56px;
}

.individual {
  display: block;
}

.droppable {
  display: inline-block;
}

#header .individual ul li a {
  padding: 19px 0;
}

#header .individual ul li a.router-link-exact-active {
  font-weight: 700;
}

@media (max-width: 1024px) {
  h1 {
    margin: 0.54em 0;
  }

  #header .container {
    padding: 0 20px !important;
  }

  #header .nav-wrap .logo-wrap {
    width: 122px;
  }

  #header .nav-secondary {
    display: none;
  }

  #header .container.pc-gnb {
    display: none;
  }

  .mobile {
    display: block;
  }

  .hamberger-btn-wrap .hamberger-btn {
    padding: 18px 0;
  }

  .hamberger-drawer .login-menu {
    padding: 0;
  }

  .hamberger-drawer .login-menu li {
    box-sizing: border-box;
    float: left;
    width: 48%;
    padding: 10px;
    color: #fff;
    text-align: center;
    background: #5b5b5b;
  }

  .hamberger-drawer .login-menu li:last-child {
    margin-left: 4%;
  }

  .el-menu.el-menu--horizontal {
    border-bottom: 0;
  }

  .hamberger-drawer .login-menu li a {
    color: #fff;
  }

  .hamberger-drawer .pro-wrap {
    padding: 25px 20px;
    background: #f3f3f3;
  }

  .hamberger-drawer .com-name {
    float: none;
    margin: 0 0 20px 0;
    font-size: 14px;
    line-height: 1.15;
  }

  .hamberger-drawer .com-name::before {
    display: none;
  }

  .el-menu-item {
    text-indent: 20px;
    border-bottom: 1px solid #dadada;
  }

  .hamberger-drawer .lang-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 20px;
    background: #f3f3f3;
  }
}
</style>
