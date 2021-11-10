<script>
import AccountBalanceLog from '@components/account-balance-log'
import AssetSelector from '@components/asset-selector'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'AccountBalanceLog',
    meta: [
      {
        name: 'description',
        content: 'AccountBalanceLog',
      },
    ],
  },
  components: {
    AssetSelector,
    AccountBalanceLog,
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
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('deposit_account_inquiry') }}
        </h2>
      </div>
      <div class="account-balance-log">
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
          <AccountBalanceLog
            :asset_seq="search_target_asset"
          ></AccountBalanceLog>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/wallet.scss';
</style>
