<script>
import '@assets/css/lookup/transfer-list.css'
import AssetSelector from '@components/asset-selector'
import ExchangeList from '@components/lookup/exchange-list'

export default {
  page: {
    title: 'TransferList',
    meta: [{ name: 'description', content: 'TransferList' }],
  },
  components: {
    AssetSelector,
    ExchangeList,
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
        <h2 class="big-title">{{ $t('exchange_details_check') }}</h2>
      </div>
      <div class="transfer-list">
        <div class="asset-list">
          <h3>
            {{ $t('wallet_page.asset_list') }}
          </h3>
          <AssetSelector v-model="search_target_asset"></AssetSelector>
        </div>
        <div class="account-list">
          <h3>
            {{ $t('cryptocurrency_exchange_history') }}
          </h3>
          <ExchangeList :asset_seq="search_target_asset"></ExchangeList>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/deal-list.scss';
</style>
