<script>
import AssetSelector from '@components/asset-selector'

import FavoriteAddressBank from '@components/favorite-address-bank'
import FavoriteAddressOther from '@components/favorite-address-other'

export default {
  page: {
    title: 'FavoriteAddressList',
    meta: [{ name: 'description', content: 'FavoriteAddressList' }],
  },
  components: {
    AssetSelector,
    FavoriteAddressBank,
    FavoriteAddressOther,
  },
  data() {
    return {
      selected_asset_seq: 0,
      active_tab: 'inner',
    }
  },
  watch: {
    active_tab() {
      this.selected_asset_seq = 0
    },
  },
}
</script>
<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('frequently_used_accounts') }}
        </h2>
      </div>
      <div :class="[$style.tradesWrap]">
        <div :class="[$style.tradesBox]">
          <!-- 자산별 검색 -->
          <article :class="[$style.tradesLeft]">
            <p :class="[$style.tradesHead]">
              {{ $t('wallet_page.asset_list') }}</p
            >
            <AssetSelector v-model="selected_asset_seq" />
          </article>
          <article :class="[$style.tradesRight]">
            <el-tabs v-model="active_tab">
              <el-tab-pane label="비트월드 계좌이체" name="inner">
                <FavoriteAddressBank :selected_asset_seq="selected_asset_seq" />
              </el-tab-pane>
              <el-tab-pane label="타 지갑 이체" name="outer">
                <FavoriteAddressOther
                  :selected_asset_seq="selected_asset_seq"
                />
              </el-tab-pane>
            </el-tabs>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
</style>

<style scoped>
.tabContent {
  height: 400px;
}
.tabContent .perfectScrollbar {
  height: 80%;
  margin-bottom: 20px;
}
.tabContent .perfectScrollbar .el-icon-arrow-right {
  float: right;
}

/* 그룹 목록 modal */
.group-modal .group-perfcet-scroll {
  height: 200px;
}
</style>
