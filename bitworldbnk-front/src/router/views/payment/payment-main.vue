<script>
import '@assets/css/payment.css'
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import { fetchMerchant, authenticateTransaction } from '@apis/pg'
import fromPairs from 'lodash/fromPairs'
import URI from 'urijs'
import LocaleSelect from '@components/LocaleSelect'

export default {
  page: {
    title: 'PaymentMain',
    meta: [{ name: 'description', content: 'PaymentMain' }],
  },
  components: {
    LocaleSelect,
  },

  data() {
    return {
      input: '',
      drawer: false,
      loading: false,
      show: false,
      first_name: '',
      second_name: '',
      card_number: '',
      expiry_date: '',
      cvv: '',
      billing_address: '',
      address_list: [
        {
          value: '경기도 부천시 땡땡땡',
        },
        {
          value: '서울 특별시 종로구 땡떙땡',
        },
      ],
      walletManageModal: false,
      walletUpdateModal: false,
      disabled: 'disabled',
      errorClass: 'text-danger',
      card_checked: null,

      token: null,
      merchant: null,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('common', { constants: (state) => state.constants }),
    ...mapState('common', { config: (state) => state.config }),
    c_pay_available_accounts() {
      return filter(this.accounts, { asset_code: this.token.tx.asset_code })
    },
    c_display_terms() {
      return filter(this.config.terms, { display: 'Y' })
    },
  },
  mounted() {
    Promise.all([this.tokenDecode(), this.getMerchantInfo()]).catch((e) =>
      this.$toasted.error(e.message)
    )
  },

  methods: {
    tokenDecode() {
      this.token = this.$jwt.decode(this.$route.query.token)
    },
    async getMerchantInfo() {
      const { merchant_info } = await fetchMerchant(
        this.token.tx.merchant_id
      ).catch((e) => e.message)
      this.merchant = merchant_info
    },
    async handleSubmit() {
      this.loading = true
      let ret_obj = null

      if (this.c_pay_available_accounts.length === 0)
        return this.$toasted.error(
          this.$t('account_transfer.not_exist_account')
        )
      if (!this.card_checked)
        return this.$toasted.error(
          this.$t('account_transfer.msg_not_select_withdraw_account')
        )

      try {
        ret_obj = await authenticateTransaction({
          ...this.$route.query,
          account_seq: this.card_checked,
        })
      } catch (e) {
        ret_obj = e
      }

      location.href = new URI(this.$route.query.return_url)
        .addQuery('error', ret_obj.error)
        .addQuery('message', ret_obj.message)
        .addQuery('nonce', ret_obj.nonce)
    },
    fromPairs,
  },
}
</script>

<template>
  <div class="payment">
    <div class="layout">
      <!-- <LocaleSelect
        style="position:absolute; top:10px; right:10px; z-index:200;"
      ></LocaleSelect> -->
      <div class="content">
        <div class="left-content">
          <div class="top-bar">
            <div class="logo-wrap">
              <h1 class="logo">
                <img
                  src="@assets/img/cocopay-logo-colored.png"
                  alt="코코페이 로고"
                />
              </h1>
            </div>
            <LocaleSelect
              style="position:absolute; top:35px; right:10px; z-index:200;"
            ></LocaleSelect>
            <div v-if="token" class="total">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-shopping-bag-2"></i>
                  {{ token.tx.amount }} {{ token.tx.asset_code }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span class="fleft">{{ token.tx.title }}</span>
                    <span class="dollar"
                      >{{ token.tx.amount }} {{ token.tx.asset_code }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span class="fleft">{{
                      $t('pay_main.total_product')
                    }}</span>
                    <span class="dollar"
                      >{{ token.tx.amount }} {{ token.tx.asset_code }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span class="fleft">{{ $t('pay_main.total_sum') }}</span>
                    <span class="dollar"
                      >{{ token.tx.amount }} {{ token.tx.asset_code }}</span
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <form class="payment-method" @submit.prevent="handleSubmit">
            <div>
              <span>
                {{ $t('shop.shop_title') }}
              </span>

              <span class="manage">
                <a v-if="merchant" href="#">
                  {{ merchant.merchant_name }}
                </a>
              </span>
            </div>
            <PerfectScrollbar class="card-wrap">
              <ul v-if="token" class="card-list">
                <li
                  v-for="(account, index) in c_pay_available_accounts"
                  :key="index"
                >
                  <div class="img-wrap">
                    <div :class="[`payment-img ${token.tx.asset_code}`]"> </div>
                  </div>
                  <span class="card-type">{{
                    account.title || account.account_number
                  }}</span>
                  <span class="card-balance">
                    {{ account.balance }}
                  </span>
                  <div class="radio-wrap">
                    <el-radio v-model="card_checked" :label="account.seq">{{
                      $t('pay_main.pay_this_account')
                    }}</el-radio>
                  </div>
                </li>
              </ul>
              <div
                v-if="c_pay_available_accounts.length === 0"
                class="no-card-list"
              >
                <p>{{ $t('account_transfer.not_exist_account') }}</p>
              </div>
            </PerfectScrollbar>
            <div class="btn-wrap">
              <input
                class="payment-btn btn"
                type="submit"
                :value="$t('pay_main.footer_8')"
              />
            </div>
            <p class="addition"> {{ $t('pay_main.bill_show') }} BITWORLD </p>
          </form>
          <!-- 트랜지션  -->
          <!--<div v-if="show" class="add-card">
            <div class="add-card-header">
              <div class="img-wrap" @click="show = !show">
                <img src="@assets/img/arrow-left.png" alt="" />
              </div>
              <span>신용카드 또는 직불카드 추가</span>
            </div>
            <div class="add-card-content">
              <el-input
                v-model="first_name"
                placeholder="성"
                class="name"
              ></el-input>
              <el-input
                v-model="second_name"
                placeholder="이름"
                class="name second-name"
              ></el-input>
              <ul class="card-list">
                <li>
                  <span class="img-wrap">
                    <img
                      src="@assets/img/mastercard-logo.svg"
                      alt="마스터카드 로고"
                    />
                  </span>
                </li>
                <li>
                  <span class="img-wrap">
                    <img src="@assets/img/visa-logo.png" alt="비자 로고" />
                  </span>
                </li>
                <li>
                  <span class="img-wrap">
                    <img
                      src="@assets/img/discover-logo.png"
                      alt="디스커버 로고"
                    />
                  </span>
                </li>
                <li>
                  <span class="img-wrap">
                    <img
                      src="@assets/img/amex-logo.png"
                      alt="아메리칸 익스프레스 로고"
                    />
                  </span>
                </li>
                <li>
                  <span class="img-wrap">
                    <img
                      src="@assets/img/unionpay-logo.png"
                      alt="유니온페이 로고"
                    />
                  </span>
                </li>
              </ul>
              <el-input
                v-model="card_number"
                placeholder="카드 번호"
              ></el-input>
              <div class="expire-date-wrap">
                <p class="demo-input-label">만료일</p>
                <el-input
                  v-model="expiry_date"
                  placeholder="MM/YY"
                  class="expire-date"
                ></el-input>
              </div>
              <div class="cvv-wrap">
                <p class="demo-input-label">CVV</p>
                <el-input
                  v-model="cvv"
                  placeholder="3자리"
                  class="cvv"
                ></el-input>
              </div>
              <div class="bulling_address-wrap">
                <span class="demo-input-label">청구 주소</span>

                <el-select
                  v-model="billing_address"
                  placeholder="청구 주소"
                  class="builling-address"
                >
                  <el-option
                    v-for="item in address_list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="btn-wrap">
                <input class="payment-btn btn" type="button" value="추가" />
              </div>
            </div>

          </div>
          -->
        </div>

        <div class="right-content">
          <div class="img-wrap">
            <img
              src="@assets/img/payment-security.png"
              alt="결제 보안 이미지"
            />
          </div>
          <h2
            >{{ $t('pay_main.banner_text') }}<br />{{
              $t('pay_main.banner_text2')
            }}</h2
          >
          <p>{{ $t('pay_main.banner_text3') }}</p>
        </div>
      </div>
      <div class="footer">
        <template v-for="data in c_display_terms">
          <router-link
            :key="data.type"
            :to="{
              name: 'policy',
              params: { type: data.type.toLowerCase() },
            }"
            class="color-footer policy-text"
          >
            {{ fromPairs(constants.service.term_types)[data.type] }}
          </router-link>
        </template>
        <div class="footer-list">
          <ul>
            <!--<li>
              <router-link :to="{ name: 'legal' }">{{
                $t('pay_main.footer_1')
              }}</router-link>
            </li>
            <li>{{ $t('pay_main.footer_2') }}</li>
            <li>
              <router-link :to="{ name: 'privacy' }">{{
                $t('pay_main.footer_3')
              }}</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'feedback' }">{{
                $t('pay_main.footer_4')
              }}</router-link>
            </li>-->
            <li
              >ⓒ Cocofx Pty Ltd
              <i class="el-icon-lock"></i>
            </li>
          </ul>
        </div>
        <p>
          {{ $t('pay_main.footer_5') }}
          <router-link :to="{ name: 'legal' }">{{
            $t('pay_main.footer_6')
          }}</router-link
          >{{ $t('pay_main.footer_7') }}
        </p>
      </div>
    </div>
    <el-dialog
      :title="$t('pay_main.wallet')"
      :visible.sync="walletManageModal"
      width="30%"
      class="wallet-manage-modal"
    >
      <ul>
        <li :class="{ disabled }">
          <span class="img-wrap">
            <img src="@assets/img/mastercard-logo.svg" alt="마스터카드 로고" />
          </span>
          <span>Mastercard</span>
          <span>x-6500</span>
          <span class="icon-wrap">
            <i class="el-icon-warning"></i>
          </span>
        </li>
        <li>
          <span class="img-wrap">
            <img src="@assets/img/mastercard-logo.svg" alt="마스터카드 로고" />
          </span>
          <span>Mastercard</span>
          <span>x-6500</span>
          <div class="additional-setting">
            <span class="wallet-update" @click="walletUpdateModal = true">{{
              $t('pay_login.update')
            }}</span>
            <span @click="walletManageModal = false">삭제</span>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <input
          type="button"
          class="btn"
          :value="$t('verify')"
          @click="walletManageModal = false"
        />
      </span>
      <el-dialog
        title="업데이트"
        :visible.sync="walletUpdateModal"
        width="30%"
        class="wallet-update-modal"
        append-to-body="true"
      >
        <div class="add-card-content">
          <el-input
            v-model="first_name"
            :placeholder="$t('pay_main.last_name')"
            class="name"
          ></el-input>
          <el-input
            v-model="second_name"
            :placeholder="$t('pay_main.name')"
            class="name second-name"
          ></el-input>
          <el-input
            v-model="card_number"
            :placeholder="$t('pay_main.card_number')"
          ></el-input>
          <div class="expire-date-wrap">
            <p class="demo-input-label">{{ $t('my_page.expdate') }}</p>
            <el-input
              v-model="expiry_date"
              placeholder="MM/YY"
              class="expire-date"
            ></el-input>
          </div>
          <div class="cvv-wrap">
            <p class="demo-input-label">CVV</p>
            <el-input
              v-model="cvv"
              :placeholder="$t('pay_main.three_number')"
              class="cvv"
            ></el-input>
          </div>
          <div class="bulling_address-wrap">
            <span class="demo-input-label">{{
              $t('business.card_adress')
            }}</span>

            <el-select
              v-model="billing_address"
              :placeholder="$t('business.card_adress')"
              class="builling-address"
            >
              <el-option
                v-for="item in address_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="btn-wrap">
            <input
              class="payment-btn btn"
              type="button"
              :value="$t('pay_login.update')"
              @click="walletUpdateModal = false"
            />
          </div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
