<script>
import {
  fetchMerchantAccountList,
  createMerchantAccount,
  deleteMerchantAccount,
  fetchMerchant,
} from '@apis/pg'
import { mapState } from 'vuex'
import each from 'lodash/each'
import omit from 'lodash/omit'
import find from 'lodash/find'
import reject from 'lodash/reject'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'MerchantAccountList',
    meta: [
      {
        name: 'description',
        content: 'MerchantAccountList',
      },
    ],
  },
  data() {
    return {
      account_list: null,
      create_account: false,
      merchant_create_account_seq: null,
      merchant: null,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    c_merchant_account_info() {
      const accounts = []
      each(this.account_list, (data) => {
        let account = find(this.accounts, {
          seq: data.account_seq,
        })
        if (account) {
          account = {
            ...omit(data),
            merchant_info: account,
          }
          accounts.push(account)
        }
      })
      return accounts
    },
    c_available_create_account() {
      var account = this.accounts
      each(this.account_list, (data) => {
        account = reject(account, (n) => {
          return n.asset_seq === data.asset_seq
        })
      })
      return account
    },
  },
  mounted() {
    Promise.all([this.getMerchantAccountList(), this.getMerchantInfo()]).catch(
      (e) => this.$toasted.error(e.message)
    )
  },

  methods: {
    date,
    async getMerchantAccountList() {
      const { data } = await fetchMerchantAccountList(
        this.$route.params.merchant_seq
      ).catch((e) => this.$toasted.error(e.message))
      this.account_list = data
    },
    async getMerchantInfo() {
      const { merchant_info } = await fetchMerchant(
        this.$route.params.merchant_seq
      ).catch((e) => e.message)
      this.merchant = merchant_info
    },
    handleDeleteAccount(p) {
      deleteMerchantAccount({
        merchant_seq: this.$route.params.merchant_seq,
        merchant_account_seq: p,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.delete'))
          this.getMerchantAccountList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleCreateAccount() {
      createMerchantAccount({
        merchant_seq: this.$route.params.merchant_seq,
        account_seq: this.merchant_create_account_seq,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.register'))
          this.create_account = false
          this.merchant_create_account_seq = null
          this.getMerchantAccountList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('shop.shop_settlement') }}</h2>
        <div class="btn-wrap">
          <a class="btn-grey" @click="create_account = true">
            <i class="fas fa-plus-circle"></i>
            {{ $t('merchant_account.create_account') }}
          </a>
        </div>
      </div>
      <div v-if="merchant" class="merchant-account-list">
        <div class="merchant-info box-skyblue">
          <span class="merchant-name">
            {{ merchant.merchant_name }}
          </span>
          <span class="merchant-title">
            {{ merchant.merchant_id }}
          </span>
        </div>
        <ul>
          <li
            v-for="account in c_merchant_account_info"
            :key="account.seq"
            class="account-list"
          >
            <div class="img-wrap">
              <div
                :class="[`merchant-img ${account.merchant_info.asset_code}`]"
              />
            </div>
            <div class="account-info">
              <ul>
                <li class="sale">
                  {{ account.merchant_info.asset_title }}
                </li>
                <li class="term">
                  {{ account.account_number }}
                </li>
                <li class="regdate">
                  {{ date('Y-m-d H:i:s', new Date(account.regdate)) }}
                </li>
              </ul>
            </div>
            <div class="btn-wrap">
              <button
                class="btn-black"
                @click="handleDeleteAccount(account.seq)"
              >
                <i class="far fa-trash-alt"></i>
                {{ $t('pay_login.deleting') }}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <el-dialog
      :visible.sync="create_account"
      :append-to-body="true"
      :title="$t('merchant_account.enroll_account')"
      class="merchant-account-create-modal"
    >
      <el-select
        v-model="merchant_create_account_seq"
        :placeholder="$t('merchant_account.pls_select_account')"
      >
        <el-option
          v-for="account in c_available_create_account"
          :key="account.seq"
          :label="account.title"
          :value="account.seq"
        >
          <span>{{ account.title || $t('no_alias') }}&ensp;</span>
          <span>{{ account.asset_title }}&ensp;|&ensp;</span>
          <span>
            {{ account.account_number }}
          </span>
        </el-option>
      </el-select>
      <div class="btn-wrap">
        <button class="btn" @click="handleCreateAccount">
          {{ $t('wallet_page.account_enroll') }}
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.big-title-wrap {
  overflow: hidden;
}
.big-title-wrap .big-title {
  float: left;
}
.big-title-wrap .btn-wrap {
  float: right;
}

.merchant-account-list .merchant-info {
  margin-bottom: 20px;
}

.merchant-account-list .account-list {
  box-sizing: border-box;
  float: left;
  width: 32%;
  padding: 20px;
  margin-right: 2%;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}

.merchant-account-list .account-list:nth-child(3n) {
  margin-right: 0;
}

.merchant-account-list .account-list .account-info {
  padding: 10px 0;
}

.merchant-account-list .account-list .merchant-img {
  width: 24px;
  height: 24px;
  margin: 0 auto;
  background-size: 100%;
}

@media (max-width: 768px) {
  .merchant-account-list .account-list {
    width: 100%;
    margin-right: 0;
  }
}
</style>
