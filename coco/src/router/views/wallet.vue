<script>
import AccountList from '@components/account-list'
import AssetSelector from '@components/asset-selector'
import { mapState } from 'vuex'
import find from 'lodash/find'
import { createAccount } from '@apis/account'

export default {
  page: {
    title: 'Wallet',
    meta: [
      {
        name: 'description',
        content: 'Wallet',
      },
    ],
  },
  components: {
    AssetSelector,
    AccountList,
  },
  data() {
    return {
      search_target_asset: 0,
      account_create_modal: false,
      account_title: null,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),

    c_selected_asset() {
      if (this.search_target_asset) {
        return find(this.assets, {
          seq: this.search_target_asset,
        })
      } else {
        return null
      }
    },
  },
  methods: {
    showAccountCeateModal() {
      this.account_create_modal = true
      this.account_title = null
    },
    handleCreate() {
      createAccount({
        asset_seq: this.c_selected_asset.seq,
        title: this.account_title,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.create_account'))
          this.account_title = null
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => (e ? this.$toasted.error(e.message) : null))
        .finally(() => {
          this.loading = false
          this.account_create_modal = false
        })
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('wallet_page.have_asset') }}
        </h2>
      </div>
      <div :class="[$style.walletsWrap]">
        <div :class="[$style.walletBox]">
          <div class="asset-list">
            <h3>
              {{ $t('wallet_page.asset_list') }}
            </h3>
            <AssetSelector v-model="search_target_asset"></AssetSelector>
          </div>
          <div class="account-list">
            <h3>
              {{ $t('wallet_page.account_list') }}
            </h3>
            <AccountList :asset_seq="search_target_asset"></AccountList>
          </div>
        </div>
      </div>
    </div>

    <!-- 계좌생성 모달창 -->
    <el-dialog
      :class="[$style.accountRegistrationModal]"
      :visible.sync="account_create_modal"
      width="60%"
      :append-to-body="true"
      :title="$t('wallet_page.account_enroll')"
    >
      <div :class="[$style.elRow]">
        <div :class="[$style.tableHead]">
          {{ $t('wallet_page.account_seq') }}
        </div>
        <div :class="[$style.tableBody]">
          {{ $t('auto_input') }}
        </div>
      </div>
      <div :class="[$style.elRow]">
        <div :class="[$style.tableHead]">
          {{ $t('wallet_page.withdraw_bank_address') }}
        </div>
        <div :class="[$style.tableBody]">
          {{ $t('auto_input') }}
        </div>
      </div>
      <div :class="([$style.elRow], [$style.inputRow])">
        <div :class="[$style.tableHead]">
          {{ $t('wallet_page.account_title') }}
        </div>
        <div :class="[$style.tableBody]">
          <el-input v-model="account_title"></el-input>
        </div>
      </div>
      <div :class="[$style.elRow]">
        <div :class="[$style.tableHead]">
          {{ $t('wallet_page.regdate') }}
        </div>
        <div :class="[$style.tableBody]">
          {{ $t('wallet_page.before_regdate') }}
        </div>
      </div>
      <div v-if="search_target_asset !== null" :class="[$style.elRow]">
        <div :class="[$style.tableHead]">
          {{ $t('wallet_page.holding_balance') }}
        </div>
        <div :class="[$style.tableBody]">
          {{ $t('auto_input') }}
        </div>
      </div>
      <div :class="[$style.elRow]">
        <div :class="[$style.tableHead]">
          {{ $t('status') }}
        </div>
        <div :class="[$style.tableBody]">
          {{ $t('auto_input') }}
        </div>
      </div>
      <div v-if="c_selected_asset !== null" :class="[$style.elRow]">
        <div :class="[$style.tableHead]">
          {{ $t('wallet_page.select_asset') }}
        </div>
        <div :class="[$style.tableBody]">{{ c_selected_asset.code }}</div>
      </div>
      <div :class="[$style.btnWrap]">
        <el-button
          :class="[$style.createBtn]"
          :disabled="search_target_asset === 0"
          @click="handleCreate"
          >{{ $t('wallet_page.create') }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/wallet.scss';
</style>
