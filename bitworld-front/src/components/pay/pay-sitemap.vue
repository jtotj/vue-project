<script>
import { fetchMerchantList } from '@apis/pg'
import { fetchPrivateMarkets } from '@apis/market'
import { fetchCertificationTypes } from '@apis/kyc'
import { mapGetters } from 'vuex'
import filter from 'lodash/filter'
import nth from 'lodash/nth'

export default {
  data() {
    return {
      merchant_list: [],
      market_list: [],
      kyc_type_list: [],
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),

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
          query: { redirectFrom: 'pay' },
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
    alertPrepare() {
      this.$toasted.info(this.$t('help.prepare'))
    },
  },
}
</script>

<template>
  <section id="learn-more" class="section">
    <div class="contents">
      <h2 class="text-left">{{ $t('pay_head_foot.site_map') }}</h2>
      <div class="box-wrap">
        <ul>
          <li>
            <router-link
              :to="{
                name: 'bank-wallet',
              }"
              tag="span"
              style="cursor:pointer;"
              >{{ $t('header.look_up') }}</router-link
            >
            <ul>
              <li class="sub-title"
                ><!--지갑-->
                {{ $t('header.wallet') }}
              </li>
              <li
                ><!--보유자산-->
                <router-link :to="{ name: 'bank-wallet' }">{{
                  $t('wallet_page.have_asset')
                }}</router-link>
              </li>
              <li
                ><!--전 계좌 조회-->
                <router-link :to="{ name: 'money' }">{{
                  $t('pay_head_foot.view_your_account')
                }}</router-link>
              </li>
              <li
                ><!--요약 계좌 조회-->
                <router-link :to="{ name: 'dashboard' }">
                  {{ $t('pay_head_foot.account_summary_views') }}
                </router-link>
              </li>
            </ul>
            <ul>
              <li class="sub-title"
                ><!--내역-->
                {{ $t('header.history') }}
              </li>
              <li
                ><!--환전 내역-->
                <router-link :to="{ name: 'bank-transfer-list' }">
                  {{ $t('header.transfer_list') }}
                </router-link>
              </li>
              <li
                ><!-- 입/출금 내역-->
                <router-link :to="{ name: 'bank-deposit' }">
                  {{ $t('header.withdrawal_list') }}
                </router-link>
              </li>
              <li
                ><!-- 결제 내역-->
                <router-link :to="{ name: 'bank-transaction-list' }">
                  {{ $t('header.payment_history') }}
                </router-link>
              </li>
            </ul>
          </li>
          <!--이체-->
          <li>
            <router-link
              :to="{
                name: 'bank-account-transfer',
              }"
              tag="span"
              style="cursor:pointer;"
              >{{ $t('header.transfer') }}</router-link
            >
            <ul>
              <li class="sub-title"
                ><!--이체-->
                {{ $t('header.transfer') }}
              </li>
              <li
                ><!--계좌 이체-->
                <router-link :to="{ name: 'bank-account-transfer' }">{{
                  $t('header.account_transfer')
                }}</router-link>
              </li>
              <li
                ><!--이체 내역-->
                <router-link :to="{ name: 'bank-account-transfer-list' }">{{
                  $t('header.transfer_history')
                }}</router-link>
              </li>
              <li
                ><!--자주 사용하는 계좌 등록-->
                <a @click="alertPrepare">{{
                  $t('header.register_used_account')
                }}</a>
              </li>
            </ul>
          </li>
          <!--환전-->
          <li>
            <router-link
              :to="{ name: 'bank-direct-market' }"
              tag="span"
              style="cursor:pointer;"
              >{{ $t('header.exchange') }}</router-link
            >
            <!--<ul>
              <template v-if="loggedIn">
                <li v-for="merchant in merchant_list" :key="merchant.key">
                  <router-link
                    :to="{
                      name: 'merchant-account-list',
                      params: { merchant_seq: merchant.seq },
                    }"
                  >
                    {{ merchant.merchant_name }}
                    {{ $t('pay_head_foot.settlement_account_list') }}
                  </router-link>
                </li>
                <li v-for="merchant in merchant_list" :key="merchant.key">
                  <router-link
                    :to="{
                      name: 'merchant-transaction-list',
                      params: { merchant_seq: merchant.seq },
                    }"
                  >
                    {{ merchant.merchant_name }}
                    {{ $t('pay_head_foot.history') }}
                  </router-link>
                </li>
              </template>
              <li>
                <router-link :to="{ name: 'merchant-create' }">
                  {{ $t('merchant.create') }}
                </router-link>
              </li>
            </ul>-->
            <ul>
              <li class="sub-title"
                ><!--환전-->
                {{ $t('header.exchange') }}
              </li>
              <li
                ><!--환전 하기-->
                <router-link :to="{ name: 'bank-direct-market' }">{{
                  $t('header.do_exchange')
                }}</router-link>
              </li>
              <li
                ><!--환전 내역-->
                <router-link :to="{ name: 'bank-transfer-list' }">{{
                  $t('header.exchange_list')
                }}</router-link>
              </li>
            </ul>
          </li>

          <!--뱅킹관리-->
          <li>
            <router-link
              v-if="c_kyc_type_list_first"
              :to="{
                name: 'bank-kyc',
                params: { type_seq: c_kyc_type_list_first.seq },
              }"
              tag="span"
              style="cursor:pointer;"
              >{{ $t('header.account_management') }}</router-link
            >
            <ul>
              <li class="sub-title"
                ><!--보안인증-->
                {{ $t('header.security_certification') }}
              </li>
              <li v-for="kyc in kyc_type_list" :key="kyc.seq"
                ><!--기본-->
                <router-link
                  :to="{ name: 'bank-kyc', params: { type_seq: kyc.seq } }"
                  >{{ kyc.title }}</router-link
                >
              </li>
              <li
                ><!--이메일 인증-->
                <router-link :to="{ name: 'bank-mail-verification' }">{{
                  $t('header.email_auth')
                }}</router-link>
              </li>
              <li
                ><!--otp인증-->
                <router-link :to="{ name: 'bank-otp' }">
                  {{ $t('my_page.otp_auth') }}
                </router-link>
              </li>
            </ul>
            <ul>
              <li class="sub-title"
                ><!--내역-->
                {{ $t('header.history') }}
              </li>
              <li
                ><!--등급보기-->
                <router-link :to="{ name: 'bank-security' }">{{
                  $t('my_page.show_security')
                }}</router-link>
              </li>
              <li
                ><!--기본-->
                <router-link
                  :to="{ name: 'bank-kyc-list' }"
                  class="list-item"
                  >{{ $t('kyc.kyc_cert_list') }}</router-link
                >
              </li>
              <li
                ><!--이메일-->
                <router-link :to="{ name: 'mail-verification-list' }">{{
                  $t('header.email')
                }}</router-link>
              </li>
            </ul>
          </li>

          <!--기업-->
          <li>
            <router-link
              :to="{ name: 'shop' }"
              tag="span"
              style="cursor:pointer;"
              >{{ $t('header.company') }}</router-link
            >

            <ul>
              <li class="sub-title"
                ><!--정산용-->
                {{ $t('header.exact_calculation') }}
              </li>
              <li
                ><!--계좌등록하기-->
                <router-link :to="{ name: 'shop' }">{{
                  $t('shop.shop_list')
                }}</router-link>
              </li>
              <li
                ><!--정산계좌목록-->
                <a @click="alertPrepare">
                  {{ $t('header.calculation_account_list') }}
                </a>
              </li>
            </ul>
            <ul>
              <li class="sub-title"
                ><!--내역-->
                {{ $t('header.history') }}
              </li>
              <li
                ><!--COCO 오픈마켓-->
                <a href="https://market.cocofx.com/" target="_blank">{{
                  $t('header.coco_open_market')
                }}</a>
              </li>
            </ul>
          </li>
          <!--회원정보-->
          <li>
            <router-link
              :to="{ name: 'bank-myprofile' }"
              tag="span"
              style="cursor:pointer;"
              >{{ $t('header.profile') }}</router-link
            >

            <ul>
              <li class="sub-title"
                ><!--정보-->
                {{ $t('header.information') }}
              </li>
              <li
                ><!--내 정보-->
                <router-link :to="{ name: 'bank-myprofile' }">{{
                  $t('header.my_profile')
                }}</router-link>
              </li>
              <li
                ><!--이메일 수정-->
                <router-link
                  :to="{
                    name: 'bank-myprofile',
                    query: { update_seq: 'email' },
                  }"
                  >{{ $t('header.email_modify') }}</router-link
                >
              </li>
              <li
                ><!--비밀번호 수정-->
                <router-link
                  :to="{
                    name: 'bank-myprofile',
                    query: { update_seq: 'password' },
                  }"
                  >{{ $t('header.password_modify') }}</router-link
                >
              </li>
            </ul>
          </li>
          <!--고객센터-->
          <li>
            <span>
              <a href="https://cocofx.com/notice" target="_blank">{{
                $t('header.service_center')
              }}</a>
            </span>
            <ul>
              <li class="sub-title"
                ><!--문의-->
                {{ $t('header.inquiry') }}
              </li>
              <li
                ><!--1:1문의-->
                <router-link :to="{ name: 'pay-one-inquiry' }">{{
                  $t('header.one_on_one_inquiry')
                }}</router-link>
              </li>
              <li
                ><!--faq-->
                <router-link :to="{ name: 'pay-contact-history' }">{{
                  $t('header.inquiry_history')
                }}</router-link>
              </li>
              <li
                ><!--이메일 문의-->
                <router-link :to="{ name: 'pay-faq' }">{{
                  $t('header.frequently_asked_questions')
                }}</router-link>
              </li>
            </ul>
            <ul>
              <li class="sub-title"
                ><!--공지-->
                {{ $t('header.announcement') }}
              </li>
              <li
                ><!--서버-->
                <a href="https://cocofx.com/server_notice" target="_blank">{{
                  $t('header.server')
                }}</a>
              </li>
              <li
                ><!--공지사항-->
                <a href="https://cocofx.com/notice" target="_blank">{{
                  $t('header.notice')
                }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scpoed>
#learn-more {
  background-color: white;
}

#learn-more .box-wrap {
  padding: 40px;
  border: 1px solid #eee;
}

#learn-more .box-wrap > ul {
  overflow: hidden;
}

#learn-more .box-wrap > ul > li {
  box-sizing: border-box;
  display: inline-block;
  float: left;
  width: 14%;
  padding: 0 20px;
  font-size: 18px;
}

#learn-more .box-wrap ul li:first-child {
  padding-left: 0;
}

#learn-more .box-wrap ul li:last-child {
  padding-right: 0;
}

#learn-more .box-wrap ul li ul {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

#learn-more .box-wrap ul li ul:last-child {
  border-bottom: none;
}

#learn-more .box-wrap > ul li ul li {
  padding-bottom: 10px;
}

#learn-more .box-wrap > ul li ul .sub-title {
  font-size: 14px;
  font-weight: normal;
  color: #ccc;
}

@media (max-width: 768px) {
  #learn-more .box-wrap {
    padding: 20px;
  }
  #learn-more .box-wrap > ul > li {
    width: 100%;
    padding: 0;
  }
}
</style>
