<script>
import { createAccountTransfer, fetchAccount } from '@apis/account'
import { mapState } from 'vuex'
import find from 'lodash/find'
import assetDecimal from '@utils/asset-decimal'

export default {
  page: {
    title: 'AccountTransfer',
    meta: [{ name: 'description', content: 'AccountTransfer' }],
  },
  data() {
    return {
      params: {
        amount: '',
      },
      find_account: null,
      step: null,
      success_seq: null,
      loading: false,
      error_message: null,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    c_select_from_account_info() {
      return find(this.accounts, { seq: this.params.from_seq })
    },
    c_available_transfer_balance() {
      return assetDecimal(
        this.c_select_from_account_info.asset_seq,
        this.c_select_from_account_info.balance
      )
        .minus(this.c_select_from_account_info.holding_balance)
        .toString()
    },
  },
  methods: {
    async findAccountInfo() {
      await fetchAccount({
        account_seq_or_number: this.params.to_account,
        for_transfer: 1,
      })
        .then((result) => {
          if (result.account_info) {
            this.find_account = result.account_info
          } else {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account')
            )
          }
        })
        .catch((e) => {
          if (e.httpStatusCode === 403) {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account')
            )
          } else {
            this.$toasted.error(e.message)
          }
          this.find_account = null
        })
    },
    handleAccountTransfer() {
      this.loading = true
      createAccountTransfer({
        from_seq: this.params.from_seq,
        to_seq: this.find_account.seq,
        amount: this.params.amount,
        description: this.params.description,
      })
        .then((result) => {
          this.step = 'success'
          this.success_seq = result.seq
          this.params = {}
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => {
          this.step = 'fail'
          this.error_message = e.message
        })
        .finally(() => {
          this.loading = false
        })
    },
    checkStep() {
      if (
        this.step === null &&
        this.params.from_seq &&
        this.find_account &&
        this.params.amount
      ) {
        this.step = 'check'
      } else {
        this.$toasted.error(this.$t('account_transfer.msg_required_data'))
      }
    },
    totalAvailableBalance() {
      if (this.c_select_from_account_info)
        this.params.amount = this.c_available_transfer_balance
      else
        this.$toasted.error(
          this.$t('account_transfer.msg_not_select_withdraw_account')
        )
    },
    goBack() {
      this.step = null
    },
    goAccountDetail() {
      if (this.$route.path.indexOf('bank') !== -1) {
        this.$router.push({
          name: 'account-transfer-detail',
          params: { transfer_seq: this.success_seq },
        })
      } else {
        this.$router.push({
          name: 'account-transfer-detail',
          params: { transfer_seq: this.success_seq },
        })
      }
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-title-wrap">
      <div class="container">
        <span class="big-title">{{
          $t('account_transfer.create_transfer_title')
        }}</span>
      </div>
    </div>
    <div class="container">
      <div v-if="step === null" class="account-transfer-wrap">
        <div class="form-group">
          <label>{{ $t('account_transfer.from_account_select') }}</label>
          <div>
            <el-select
              v-model="params.from_seq"
              class="coin-selector"
              :placeholder="
                $t('account_transfer.msg_not_select_withdraw_account')
              "
            >
              <el-option value>({{ $t('no_select') }})</el-option>
              <el-option
                v-for="account in accounts"
                :key="account.seq"
                :label="account.account_number"
                :value="account.seq"
              >
                {{ account.title }} {{ account.account_number }} :
                {{ account.asset_title }}
                {{ account.balance | codeDecimal(account.asset_code) }}
              </el-option>
            </el-select>
          </div>
          <div v-if="c_select_from_account_info" class="small-text">
            {{ $t('balance') }}:
            {{
              c_select_from_account_info.balance
                | codeDecimal(c_select_from_account_info.asset_code)
            }}
            / {{ $t('account_transfer.available_transfer') }}:
            {{
              c_available_transfer_balance
                | codeDecimal(c_select_from_account_info.asset_code)
            }}
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('account_transfer.to_account_input') }}</label>
          <div class="form-wrap transfer-account-number">
            <el-input v-model="params.to_account"></el-input>
            <div class="btn-wrap">
              <el-button class="confirm_btn" @click="findAccountInfo">{{
                $t('account_transfer.to_account_confirm')
              }}</el-button>
            </div>
          </div>
        </div>
        <div v-if="find_account" class="form-group">
          <label>{{ $t('account_transfer.to_account_user_name') }}</label>

          <div class="form-wrap">
            <div class="text-label">
              {{
                find_account.user_name ||
                  $t('account_transfer.not_search_user_name')
              }}
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('account_transfer.transfer_amount') }}</label>

          <div class="form-wrap transfer-amount">
            <el-input
              slot="append"
              v-model="params.amount"
              :placeholder="$t('account_transfer.placeholder_amount')"
            >
            </el-input>
            <div class="btn-wrap">
              <el-button
                slot="append"
                class="delete_btn"
                @click="params.amount = ''"
              >
                <i class="fas fa-sync"></i>
                {{ $t('account_transfer.delete_amount') }}
              </el-button>
              <el-button
                slot="append"
                class="all_btn"
                @click="totalAvailableBalance"
              >
                <i class="fas fa-coins"></i>
                {{ $t('account_transfer.all_amount') }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('account_transfer.description') }}</label>

          <div class="form-wrap">
            <input v-model="params.description" class="text-label" />
          </div>
        </div>
        <div class="form-group big-btn">
          <a class="btn btn-default btn-save-offer" @click="checkStep">
            <i class="fas fa-check"></i>
            {{ $t('account_transfer.transfer_btn') }}</a
          >
        </div>
      </div>
      <div
        v-else-if="step === 'check'"
        v-loading="loading"
        class="account-transfer-wrap"
      >
        <h3 class="transfer-info-check">
          {{ $t('account_transfer.transfer_info_check') }}
        </h3>
        <div class="container">
          <div class="form-group">
            <label>{{ $t('account_transfer.from_account_number') }}</label>
            <div class="form-wrap">
              <div class="text-label">
                {{ c_select_from_account_info.account_number }}
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>{{ $t('account_transfer.from_asset_title') }}</label>
            <div class="form-wrap">
              <div class="text-label">
                {{ c_select_from_account_info.asset_title }}
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>{{ $t('account_transfer.to_account_number') }}</label>
            <div class="form-wrap">
              <div class="text-label">{{ find_account.account_number }}</div>
            </div>
          </div>
          <div v-if="find_account" class="form-group">
            <label>{{ $t('account_transfer.to_account_user_name') }}</label>

            <div class="form-wrap">
              <div class="text-label">{{ find_account.user_name }}</div>
            </div>
          </div>
          <div class="form-group">
            <label>{{ $t('account_transfer.transfer_amount') }}</label>

            <div class="form-wrap">
              <div class="text-label">{{ params.amount }}</div>
            </div>
          </div>
          <div class="form-group">
            <label>{{ $t('account_transfer.description') }}</label>

            <div class="form-wrap">
              <div class="text-label">{{ params.description }}</div>
            </div>
          </div>
          <div class="form-group big-btn">
            <a
              class="btn btn-default btn-save-offer"
              @click="handleAccountTransfer"
            >
              {{ $t('account_transfer.transfer_btn') }}</a
            >
          </div>
        </div>
      </div>
      <div v-else-if="step === 'success'" class="account-transfer-wrap">
        <div class="click-img" style="text-align:center;">
          <img style="width:auto;" src="@assets/img/click.png" alt />
        </div>
        <h1 class="text-center">{{
          $t('account_transfer.success_transfer')
        }}</h1>

        <div class="form-group big-btn">
          <a class="btn btn-default btn-save-offer" @click="goAccountDetail">{{
            $t('account_transfer.transfer_list_detail')
          }}</a>
        </div>
      </div>
      <div v-else-if="step === 'fail'" class="account-transfer-wrap">
        <div class="fail-img">
          <img src="@assets/img/fail-icon.png" alt="실패 아이콘" />
        </div>
        <h1 class="text-center">
          {{ $t('account_transfer.success_fail') }}
        </h1>
        <p class="error-message">{{ error_message }}</p>

        <div class="form-group big-btn text-center">
          <button class="btn-go-back" @click="goBack">
            {{ $t('before') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
