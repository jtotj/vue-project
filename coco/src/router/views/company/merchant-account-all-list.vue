<script>
import { mapState } from 'vuex'
import {
  fetchMerchantList,
  fetchMerchantAccountList,
  createMerchantAccount,
  deleteMerchantAccount,
} from '@apis/pg'
import map from 'lodash/map'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import each from 'lodash/each'
import reject from 'lodash/reject'
import find from 'lodash/find'

export default {
  data() {
    return {
      merchant_account_list: [],
      create_account_modal: false,
      merchant_create_account_seq: null,
      merchant_seq: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_available_create_account() {
      var account = this.accounts
      let account_list = find(this.merchant_account_list, {
        merchant_seq: this.merchant_seq,
      })
      if (account_list) {
        each(account_list.merchant_accounts, (data) => {
          account = reject(account, (n) => {
            return n.asset_seq === data.asset_seq
          })
        })
        return account
      } else return null
    },
  },
  mounted() {
    Promise.all([this.loadMerchantList()]).catch((e) =>
      this.$toasted.error(e.message)
    )
  },
  created() {
    this.init()
  },
  methods: {
    date,
    fromPairs,
    init() {
      this.loading = true
      Promise.all([this.loadMerchantList()]).finally(() => {
        this.loading = false
      })
    },
    async loadMerchantList() {
      const { data } = await fetchMerchantList({
        no_paging: 1,
      })

      const list = await Promise.all(
        map(data, async ({ seq, merchant_id, merchant_name, status }) => {
          const {
            data: [...merchant_account_info],
          } = await fetchMerchantAccountList(seq)
          return {
            merchant_seq: seq,
            merchant_id,
            merchant_name,
            status,
            merchant_accounts: merchant_account_info,
          }
        })
      )
      this.merchant_account_list = list
    },
    handleCreateMerchantAccount() {
      createMerchantAccount({
        merchant_seq: this.merchant_seq,
        account_seq: this.merchant_create_account_seq,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.register'))
          this.create_account_modal = false
          this.merchant_create_account_seq = null
          this.loadMerchantList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleDeleteAccount(merchant_seq, merchant_account_seq) {
      deleteMerchantAccount({
        merchant_seq: merchant_seq,
        merchant_account_seq: merchant_account_seq,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.delete'))
          this.loadMerchantList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    createMerchantAccountModal(seq) {
      this.create_account_modal = true
      this.merchant_seq = seq
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('header.calculation_account_list') }}</h2>
      </div>

      <div v-loading="loading" :class="[$style.merchantAccountAllList]">
        <ul v-if="merchant_account_list.length">
          <PerfectScrollbar :class="[$style.merchantScroll]">
            <li
              v-for="merchant in merchant_account_list"
              :key="merchant.merchant_seq"
              :class="[$style.merchantAccountList]"
            >
              <div :class="[$style.leftBox]">
                <div :class="[$style.box]">
                  <p>
                    <span>{{ $t('shop.shop_title') }}</span>
                    {{ merchant.merchant_name }}
                  </p>
                  <p>
                    <span>{{ $t('shop.shop_id') }}</span>
                    {{ merchant.merchant_id }}
                  </p>
                  <p>
                    <span>{{ $t('shop.shop_state') }}</span>
                    {{
                      fromPairs(constants.pg.merchant.status)[merchant.status]
                    }}
                  </p>
                </div>
                <div :class="[$style.btnWrap]">
                  <a
                    :class="[$style.createMerchantBtn]"
                    @click="createMerchantAccountModal(merchant.merchant_seq)"
                  >
                    <i class="fas fa-plus-circle"></i>
                    {{ $t('merchant_account.create_account') }}
                  </a>
                </div>
              </div>
              <div :class="[$style.merchantAccountInfo]">
                <PerfectScrollbar :class="[$style.merchantAccountScroll]">
                  <ul>
                    <li
                      v-for="merchant_account in merchant.merchant_accounts"
                      :key="merchant_account.seq"
                    >
                      <div :class="[$style.coinWrap]">
                        <span
                          :class="`coin-item ${merchant_account.asset_code}`"
                        ></span>
                        <span :class="[$style.assetTitle]">
                          {{ merchant_account.asset_title }}
                        </span>
                      </div>
                      <div :class="[$style.info]">
                        <span>{{ merchant_account.account_number }}</span>
                        <span>{{
                          date(
                            'Y-m-d H:i:s',
                            new Date(merchant_account.regdate)
                          )
                        }}</span>
                      </div>
                      <div :class="[$style.btnWrap]">
                        <button
                          :class="[$style.deleteBtn]"
                          @click="
                            handleDeleteAccount(
                              merchant.merchant_seq,
                              merchant_account.seq
                            )
                          "
                        >
                          <i class="far fa-trash-alt"></i>
                          {{ $t('pay_login.deleting') }}
                        </button>
                      </div>
                    </li>
                  </ul>
                </PerfectScrollbar>
              </div>
            </li>
          </PerfectScrollbar>
        </ul>

        <div v-else class="no-list">
          <div class="img-wrap">
            <img src="@assets/img/no-list.png" />
          </div>
          <p>{{ $t('shop.no_shop_list') }}</p>
        </div>
      </div>
    </div>
    <!-- 정산계좌 생성 모달창 -->
    <el-dialog
      :visible.sync="create_account_modal"
      :append-to-body="true"
      :title="$t('merchant_account.enroll_account')"
      :class="[$style.createAccountModal]"
    >
      <el-select
        v-model="merchant_create_account_seq"
        :placeholder="$t('merchant_account.pls_select_account')"
        :class="[$style.select]"
      >
        <el-option
          v-for="account in c_available_create_account"
          :key="account.seq"
          :label="account.title || account.account_number"
          :value="account.seq"
          :class="[$style.option]"
        >
          <span class="badge">{{ account.asset_title }}</span>
          <span>{{ account.title }}</span>
          <span>
            {{ account.account_number }}
          </span>
        </el-option>
      </el-select>
      <div :class="[$style.btnWrap]">
        <button :class="[$style.btn]" @click="handleCreateMerchantAccount">
          {{ $t('wallet_page.account_enroll') }}
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/merchant-account-all-list.scss';
</style>
