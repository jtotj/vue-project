<script>
import { fetchMerchantList } from '@apis/pg'
import { fetchPrivateMarkets } from '@apis/market'
import { fetchCertificationTypes } from '@apis/kyc'
import { mapState, mapGetters } from 'vuex'
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
    ...mapState('common', ['customer_exchange']),
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
        this.$router.push({ name: 'home' })
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

    alertPrepare() {
      return this.$alert(this.$t('service_prepare'))
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
  },
}
</script>

<template>
  <div class="sitemap">
    <div class="box-wrap pc">
      <ul>
        <!-- 환전/시세 -->
        <li class="clear">
          <h4> {{ $t('exchange_price') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'direct-exchange' }">{{
                $t('header.exchange')
              }}</router-link>
            </li>
            <li>
              <a @click="alertPrepare">{{ $t('market_price_check') }}</a>
            </li>
          </ul>
        </li>
        <!-- 전 계좌 조회 -->
        <li class="clear">
          <h4>{{ $t('full_account_inquiry') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'money' }">
                {{ $t('full_account_inquiry') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'transfer-list' }">{{
                $t('exchange_details_check')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'account-balance' }">{{
                $t('deposit_account_inquiry')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'account-transfer-list' }">{{
                $t('transfer_result_check')
              }}</router-link>
            </li>
          </ul>
          <ul class="contents-area">
            <!-- <li>
              <a @click="alertPrepare">{{ $t('dormant_account_check') }}</a>
            </li>
            <li>
              <router-link :to="{ name: 'wallet-reference' }">{{
                $t('account_and_other_case_status')
              }}</router-link>
            </li> -->
          </ul>
          <!-- <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'remittance-transfer' }">{{
                $t('error_remittance')
              }}</router-link>
            </li>
          </ul> -->
        </li>
        <!-- 이체 -->
        <li class="clear">
          <h4>{{ $t('transfer') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'account-transfer' }">{{
                $t('transfer')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'account-transfer-list' }">{{
                $t('transfer_result_check')
              }}</router-link>
            </li>
            <li>
              <router-link
                :to="{
                  name: 'account-transfer-list',
                  query: { active_tab: 'outer' },
                }"
                >{{ $t('other_wallets_transfer') }}</router-link
              >
            </li>
          </ul>
          <!-- <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'favorite-address' }">{{
                $t('frequently_used_accounts')
              }}</router-link>
            </li>
          </ul> -->
        </li>
        <!-- 계좌 신규 -->
        <li class="clear">
          <h4>{{ $t('new_account') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'create-address' }">{{
                $t('new_demand_account')
              }}</router-link>
            </li>
            <!-- <li>
              <router-link :to="{ name: 'svings-account' }">{{
                $t('new_installment_savings_account')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'term-deposit' }">{{
                $t('new_deposit_account')
              }}</router-link>
            </li> -->
          </ul>
          <ul class="contents-area">
            <!-- <li>
              <router-link :to="{ name: 'svings-term-list' }">{{
                $t('check_account_progress_account')
              }}</router-link>
            </li> -->
          </ul>
        </li>
        <!-- 출금 -->
        <!-- <li class="clear">
          <h4>{{ $t('withdrawal') }}</h4>
          <ul class="contents-area">
            <li>
              <a @click="alertPrepare">{{ $t('Smart_window_withdrawal') }}</a>
            </li>
            <li>
              <a @click="alertPrepare">{{ $t('smart_ATM_withdrawal') }} </a>
            </li>
          </ul>
        </li> -->
        <!-- 고객센터 -->
        <li class="clear">
          <h4>{{ $t('customer_service') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'contact-notice' }">{{
                $t('notice')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'one-inquiry' }">{{
                $t('one_one_inquiry')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'contact-history' }">{{
                $t('inquiry_details')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'faq' }">{{
                $t('frequently_asked_questions')
              }}</router-link>
            </li>
          </ul>
        </li>
        <!-- 관리 -->
        <li class="clear">
          <h4>{{ $t('management') }}</h4>
          <ul class="contents-area">
            <li class="droppable">
              <router-link :to="{ name: 'auth-management' }">
                {{ $t('secure_management') }}
              </router-link>
            </li>
            <li class="droppable">
              <router-link :to="{ name: 'kyc', params: { type_seq: 1 } }">
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
              <router-link :to="{ name: 'clap-intro' }">
                CLAP
              </router-link>
            </li>
            <!-- <li>
              <a @click="alertPrepare">{{ $t('fund_limit_management') }}</a>
            </li>
            <li>
              <a @click="alertPrepare">{{ $t('issue_details_check') }}</a>
            </li> -->
          </ul>
          <!-- <ul v-if="customer_exchange !== 'COMPANY'" class="contents-area">
            <li>
              <a href="#"></a>
            </li>
            <li>
              <a href="#"></a>
            </li>
            <li>
              <a href="#"></a>
            </li>
          </ul> -->
        </li>
        <!-- 기업 -->
        <li v-if="customer_exchange === 'COMPANY'" class="clear">
          <h4>{{ $t('company') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'merchant-transaction-list' }">
                {{ $t('shop.shop_history') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'shop' }">
                {{ $t('shop.shop_list') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'merchant-create' }">
                {{ $t('merchant.create') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'merchant-account-all-list' }">
                {{ $t('header.calculation_account_list') }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="box-wrap mobile">
      <ul>
        <li class="clear">
          <h4> {{ $t('exchange_price') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'direct-exchange' }">{{
                $t('header.exchange')
              }}</router-link>
            </li>
            <li>
              <a @click="alertPrepare">{{ $t('market_price_check') }}</a>
            </li>
          </ul>
        </li>
        <li class="clear">
          <h4>{{ $t('full_account_inquiry') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'transfer-list' }">{{
                $t('exchange_details_check')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'account-balance' }">{{
                $t('deposit_account_inquiry')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'account-transfer-list' }">{{
                $t('transfer_result_check')
              }}</router-link>
            </li>
            <li>
              <a @click="alertPrepare">{{ $t('dormant_account_check') }}</a>
            </li>
            <li>
              <router-link :to="{ name: 'wallet-reference' }">{{
                $t('account_and_other_case_status')
              }}</router-link>
            </li>
            <!-- <li>
              <router-link :to="{ name: 'remittance-transfer' }">{{
                $t('error_remittance')
              }}</router-link>
            </li> -->
          </ul>
        </li>
        <li class="clear">
          <h4>{{ $t('transfer') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'account-transfer' }">{{
                $t('transfer')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'account-transfer-list' }">{{
                $t('transfer_result_check')
              }}</router-link>
            </li>
            <li>
              <router-link
                :to="{
                  name: 'account-transfer-list',
                  query: { active_tab: 'outer' },
                }"
                >{{ $t('other_wallets_transfer') }}</router-link
              >
            </li>
            <!-- <li>
              <router-link :to="{ name: 'favorite-address' }">{{
                $t('frequently_used_accounts')
              }}</router-link>
            </li> -->
          </ul>
        </li>
        <li class="clear">
          <h4>{{ $t('new_account') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'create-address' }">{{
                $t('new_demand_account')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'svings-account' }">{{
                $t('new_installment_savings_account')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'term-deposit' }">{{
                $t('new_deposit_account')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'svings-term-list' }">{{
                $t('check_account_progress_account')
              }}</router-link>
            </li>
          </ul>
        </li>
        <li class="clear">
          <h4>{{ $t('withdrawal') }}</h4>
          <ul class="contents-area">
            <li>
              <a @click="alertPrepare">{{ $t('Smart_window_withdrawal') }}</a>
            </li>
            <li>
              <a @click="alertPrepare">{{ $t('smart_ATM_withdrawal') }} </a>
            </li>
          </ul>
        </li>
        <li class="clear">
          <h4>{{ $t('customer_service') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'contact-notice' }">{{
                $t('notice')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'one-inquiry' }">{{
                $t('one_one_inquiry')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'contact-history' }">{{
                $t('inquiry_details')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'faq' }">{{
                $t('frequently_asked_questions')
              }}</router-link>
            </li>
          </ul>
        </li>
        <!-- 관리 -->
        <li class="clear">
          <h4>{{ $t('management') }}</h4>
          <ul class="contents-area">
            <li class="droppable">
              <router-link :to="{ name: 'auth-management' }">
                {{ $t('secure_management') }}
              </router-link>
            </li>
            <li class="droppable">
              <router-link :to="{ name: 'kyc', params: { type_seq: 1 } }">
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
              <router-link :to="{ name: 'clap-intro' }">
                CLAP
              </router-link>
            </li>
          </ul>
        </li>
        <!-- 기업 -->
        <li v-if="customer_exchange === 'COMPANY'" class="clear">
          <h4>{{ $t('company') }}</h4>
          <ul class="contents-area">
            <li>
              <router-link :to="{ name: 'merchant-transaction-list' }">
                {{ $t('shop.shop_history') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'shop' }">
                {{ $t('shop.shop_list') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'merchant-create' }">
                {{ $t('merchant.create') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'merchant-account-all-list' }">
                {{ $t('header.calculation_account_list') }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scpoed>
.sitemap .box-wrap > ul {
  overflow: hidden;
}

.sitemap .box-wrap > ul > li {
  box-sizing: border-box;
  display: inline-block;
  float: left;
  width: 14%;
  padding-right: 2%;
}

.sitemap .box-wrap ul li:last-child {
  padding-right: 0;
}

.sitemap .box-wrap ul li ul {
  padding: 20px 0;
}

.sitemap .box-wrap > ul li ul li {
  padding-bottom: 10px;
  font-size: 15px;
}

.sitemap .box-wrap > ul li ul li:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .sitemap .box-wrap > ul > li {
    width: 100%;
    padding: 0;
  }
}
</style>
