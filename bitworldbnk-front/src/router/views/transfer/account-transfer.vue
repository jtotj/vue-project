<script>
import '@assets/css/transfer/account-transfer.css'
import AssetSelector from '@components/asset-selector'
import AccountList from '@components/transfer/account-list'

export default {
  page: {
    title: 'AccountTransfer',
    meta: [{ name: 'description', content: 'AccountTransfer' }],
  },
  components: {
    AssetSelector,
    AccountList,
  },
  data() {
    return {
      search_target_asset: 0,
    }
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('transfer') }}</h2>
      </div>
      <div class="account-transfer">
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
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/account-transfer.scss';
</style>
