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
      mid: 'news',
      list_count: 8,
      news: [],
      hamberger_menu: false,
      direction: 'rtl',
      merchant_list: [],
      market_list: [],
      kyc_type_list: [],
      customer_list: [
        { state: 'INDIVIDUAL', title: this.$t('individual') },
        { state: 'COMPANY', title: this.$t('company') },
      ],
      longtext_locales: ['fr-FR', 'es-ES', 'en-US', 'de-DE'],

      wW: window.innerWidth,
      isMo: false,
      slideMenuShow: false,
    }
  },
  watch: {
    wW(newWidth, oldWidth) {
      if (newWidth > 1000) {
        this.onDomClassReset()
        this.isMo = false
      } else {
        this.isMo = true
      }
    },
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
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
    window.innerWidth > 1000 ? (this.isMo = false) : (this.isMo = true)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    toggle(e) {
      e.target.classList.toggle('isActive')
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
        })
      }
    },
    async loadDocumentList() {
      /* const { document_list } = await fetchDocumentList({ mid: this.mid })

      this.news = document_list.slice(0, this.list_count).map((val) => ({
        title: htmlspecialchars_decode(val.title),
        link: `https://cocofx.com/${this.mid}/${val.document_srl}`,
      })) */
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
    onResize() {
      this.wW = window.innerWidth
    },
    onDomClassReset() {
      this.isMo = false
      this.slideMenuShow = false
      const header = document.getElementById('header')
      const wrap = document.getElementById('container')
      wrap.style.position = 'relative'
      header.classList.remove('isTransform')
    },
    hambergerClick(e) {
      this.slideMenuShow = !this.slideMenuShow
      const header = document.getElementById('header')
      const wrap = document.getElementById('container')
      let stylePos
      wrap.style.position === 'relative'
        ? (stylePos = 'fixed')
        : (stylePos = 'relative')
      console.log(stylePos)
      wrap.style.position = stylePos
      header.classList.add('isTransform')
    },
  },
}
</script>

<template>
  <nav id="nav" :class="{ mo: isMo, menuOpen: slideMenuShow }">
    <div class="nav-wrap">
      <div class="nav__inner-wrap">
        <div class="left-box" :class="{ scrollbar: isMo }">
          <div class="logo-wrap">
            <h1 class="logo">
              <router-link :to="{ name: 'home' }">
                <img src="@assets/images/t_logo.svg" />
              </router-link>
            </h1>
          </div>
          <div class="menu-wrap">
            <ul class="one-depth">
              <li>
                <div
                  v-if="isMo"
                  class="mo-link"
                  :class="{
                    'active-menu': $route.path.indexOf('exchange') !== -1,
                  }"
                  @click="toggle"
                  >자산
                </div>
                <router-link
                  v-else
                  :to="{
                    name: 'direct-exchange',
                  }"
                  :class="{
                    'active-menu': $route.path.indexOf('exchange') !== -1,
                  }"
                >
                  자산
                  <!-- 환전/시세 -->
                </router-link>
                <ul class="two-depth">
                  <li>
                    <router-link :to="{ name: 'direct-exchange' }">
                      환전
                    </router-link>
                  </li>
                  <li>
                    <!-- 전 계좌 조회 -->
                    <router-link :to="{ name: 'money' }">
                      계좌/지갑 조회
                    </router-link>
                  </li>
                  <!-- 환전내역조회 -->
                  <li>
                    <router-link :to="{ name: 'transfer-list' }">
                      이체 계좌/지갑 내역 조회
                    </router-link>
                  </li>

                  <li>
                    <router-link :to="{ name: 'deposit' }">{{
                      '계좌 입금내역 조회'
                    }}</router-link>
                  </li>

                  <li>
                    <router-link :to="{ name: 'withdraw' }">{{
                      '계좌 출금내역 조회'
                    }}</router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'create-address' }">{{
                      '계좌 및 지갑 생성'
                    }}</router-link>
                  </li>
                </ul>
              </li>
              <li>
                <div v-if="isMo" class="mo-link" @click="toggle">거래 </div>
                <a v-else href="//c2c.bit-world.co.uk/b2c">
                  거래
                  <!-- 환전/시세 -->
                </a>
                <ul class="two-depth">
                  <li>
                    <a href="//c2c.bit-world.co.uk/b2c">
                      고급거래
                    </a>
                  </li>
                  <li>
                    <a href="//c2c.bit-world.co.uk/">
                      전문장외거래
                    </a>
                  </li>
                  <li>
                    <a href="//c2c.bit-world.co.uk/">
                      P2P
                    </a>
                  </li>
                  <li>
                    <a href="//exchange.bit-world.co.uk/">
                      마진거래 - BIW
                    </a>
                  </li>
                  <li>
                    <a href="//cceexchange.bit-world.co.uk/">
                      마진거래 - CCE
                    </a>
                  </li>
                  <li>
                    <a href="//exchange.bit-world.co.uk/">
                      선물거래
                    </a>
                  </li>
                  <li>
                    <a href="//binary.bit-world.co.uk/">
                      바이너리옵션 - BIW
                    </a>
                  </li>
                  <li>
                    <a href="//ccebinary.bit-world.co.uk/">
                      바이너리옵션 - CCE
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <div v-if="isMo" class="mo-link" @click="toggle">상품 </div>
                <a v-else href="//mlm.bit-world.co.uk/">
                  상품
                </a>
                <ul class="two-depth">
                  <li>
                    <a href="http://expandbinary.net">
                      EB Package
                    </a>
                  </li>
                  <li>
                    <a href="http://entrystaking.net">
                      Entry Staking
                    </a>
                  </li>
                  <li>
                    <a href="http://gift-fly.net">
                      Gift fly
                    </a>
                  </li>
                  <li>
                    <a href="http://pctstaking.net">
                      PCT Staking
                    </a>
                  </li>
                  <li>
                    <a href="http://4-clover.net">
                      4clover
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <div v-if="isMo" class="mo-link" @click="toggle">밈식 </div>
                <a v-else href="//bit-world.co.uk/product/search">
                  밈식
                </a>
                <ul class="two-depth">
                  <li>
                    <a href="//bit-world.co.uk/product/search">
                      배당상품
                    </a>
                  </li>
                  <li>
                    <a @click="alertPrepare">
                      Staking
                    </a>
                  </li>
                </ul>
              </li>
              <li style="display:none;">
                <div v-if="isMo" class="mo-link" @click="toggle">메타버스 </div>
                <a v-else @click="alertPrepare">
                  메타버스
                </a>
                <ul class="two-depth">
                  <li><a @click="alertPrepare">KIOSK</a></li>
                </ul>
              </li>
              <li>
                <div v-if="isMo" class="mo-link" @click="toggle">D-NFT </div>
                <a v-else href="//d-nft.net/">
                  D-NFT
                </a>
                <ul class="two-depth">
                  <li>
                    <a href="//d-nft.net/about_new">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="//d-nft.net/vote">
                      코인투표
                    </a>
                  </li>
                  <li>
                    <a href="//d-nft.net/coin">
                      투표된 정책 안건
                    </a>
                  </li>
                  <li>
                    <a href="//d-nft.net/board_AwvH93">
                      투표내역
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <div v-if="isMo" class="mo-link" @click="toggle">이벤트</div>
                <a v-else href="//flex.bit-world.co.uk/promotion">
                  이벤트
                </a>
                <ul class="two-depth">
                  <li
                    ><a href="//flex.bit-world.co.uk/promotion">프로모션</a></li
                  >
                  <li><a href="//flex.bit-world.co.uk/list">당첨리스트</a></li>
                  <li><a href="//flex.bit-world.co.uk/coinad">코인광고</a></li>
                  <li
                    ><a href="//flex.bit-world.co.uk/board_mHAe68"
                      >증가량 인증</a
                    ></li
                  >
                  <li
                    ><a href="//flex.bit-world.co.uk/board_feyQ96">순위</a></li
                  >
                </ul>
              </li>
              <li>
                <div v-if="isMo" class="mo-link" @click="toggle">고객센터</div>
                <a v-else href="//flex.bit-world.co.uk/notice">
                  고객센터
                </a>
                <ul class="two-depth">
                  <li><a href="//flex.bit-world.co.uk/notice">공지사항</a></li>
                  <li><a href="//flex.bit-world.co.uk/vs11">1:1 문의</a></li>
                  <li
                    ><a href="//flex.bit-world.co.uk/faq">자주묻는 질문</a></li
                  >
                  <li
                    ><a
                      href="//flex.bit-world.co.uk/index.php?mid=index&act=dispPointchargeMyWithdrawalList"
                      >CCE 계좌이동</a
                    ></li
                  >
                  <li
                    ><a
                      href="//flex.bit-world.co.uk/index.php?mid=index&act=dispPointchargePayMoney"
                      >CCE 충전</a
                    ></li
                  >
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="utill-wrap">
          <div class="go-home">
            <div class="only-mo">
              <router-link :to="{ name: 'home' }">
                Home
              </router-link>
            </div>
            <LocaleSelect></LocaleSelect>
          </div>
          <ul v-if="loggedIn" class="menu-item">
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
          </ul>
          <ul v-else class="menu-item">
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
          </ul>
        </div>
      </div>
    </div>
    <div class="mo-logo">
      <h1 class="logo">
        <router-link :to="{ name: 'home' }">
          <img src="@assets/images/t_logo.svg" />
        </router-link>
      </h1>
    </div>
    <button
      class="hamberger-button only-mo"
      :class="{ isOpen: slideMenuShow }"
      @click="hambergerClick"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="mo-deem"></div>
  </nav>
</template>
<style lang="scss">
@import '@src/design/header.scss';
</style>
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
    width: 70% !important;
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
