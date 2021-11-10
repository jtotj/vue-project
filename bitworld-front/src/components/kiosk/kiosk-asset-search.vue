<script>
import '@assets/css/kiosk/kiosk-search.css'
import { mapState } from 'vuex'
import uniq from 'lodash/uniq'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'

export default {
  data() {
    return {
      assets_search: '',
      favorite_search_asset: '',

      assets_search_visible: false,

      favorite_assets: [],
      selected_asset_seq: 0,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),

    c_filter_asset() {
      return filter(
        this.assets,
        (asset_info) =>
          !this.assets_search ||
          asset_info.code
            .toLowerCase()
            .includes(this.assets_search.toLowerCase()) ||
          asset_info.title.includes(this.assets_search)
      )
    },
    c_favorite_assets() {
      const assets = uniq(
        map(this.favorite_assets, (value) => find(this.assets, { seq: value }))
      ).filter(
        (asset) =>
          !this.favorite_search_asset ||
          asset.code
            .toLowerCase()
            .includes(this.favorite_search_asset.toLowerCase()) ||
          asset.title.includes(this.favorite_search_asset)
      )

      return assets
    },
    c_s_asset_info() {
      if (this.selected_asset_seq === 0) return null

      return find(this.assets, { seq: this.selected_asset_seq })
    },
  },
  mounted() {
    if (localStorage.favorite_assets) {
      this.favorite_assets = JSON.parse(localStorage.getItem('favorite_assets'))
    }
  },
  methods: {
    selectAsset(seq) {
      this.selected_asset_seq = seq
      this.handleSelectAssetChange()
      this.assets_search_visible = false
    },

    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-img/coin-' + code + '.svg')
      } catch (e) {
        return default_img
      }
    },
    handleSelectAssetChange() {
      this.$emit('input', this.selected_asset_seq)
    },

    toggleAssetFavorites(seq) {
      const index = this.favorite_assets.indexOf(seq)
      if (index !== -1) {
        this.favorite_assets.splice(index, 1)
        localStorage.setItem(
          'favorite_assets',
          JSON.stringify(this.favorite_assets)
        )
        return
      }
      this.favorite_assets.push(seq)
      localStorage.setItem(
        'favorite_assets',
        JSON.stringify(this.favorite_assets)
      )
    },
  },
}
</script>

<template>
  <div :class="$style.kioskSearch" class="kiosk-search">
    <div :class="[$style.container, $style.innerContainer]">
      <div class="kiosk-select-box">
        <h2>{{ $t('kiosk.search_assets') }}</h2>
        <el-button
          class="kiosk-select-asset"
          @click="assets_search_visible = !assets_search_visible"
        >
          <template v-if="!c_s_asset_info">
            <span>
              {{ $t('kiosk.select_assets_txt') }}
              <img
                v-if="!assets_search_visible"
                src="@assets/kiosk-img/icon-next.svg"
                alt="next-btn"
              />
            </span>
          </template>
          <template v-else>
            <div :class="$style.selectedAssetWrap">
              <div :class="[$style.selectedAssetsTit]">
                <img :src="getAssetSrc(c_s_asset_info.code)" />
                <div>
                  <strong>{{ c_s_asset_info.code }}</strong>
                  <span>{{ c_s_asset_info.title }}</span>
                </div>
              </div>
              <div
                :class="[$style.selectedCancel]"
                @click="selected_asset_seq = 0"
              >
                <img src="@assets/kiosk-img/icon-select-cancel.svg" />
              </div>
            </div>
          </template>
        </el-button>
        <div
          v-if="assets_search_visible"
          :class="$style.assetsSearch"
          class="assets-search"
        >
          <el-tabs type="card">
            <el-tab-pane :label="$t('kiosk.assets')">
              <el-input
                v-model="assets_search"
                :placeholder="$t('kiosk.search_assets_txt')"
                prefix-icon="el-icon-search"
              >
              </el-input>
              <PerfectScrollbar :class="[$style.perfectScrollbar]">
                <div :class="$style.searchList">
                  <div
                    v-for="asset in c_filter_asset"
                    :key="asset.seq"
                    @click="selectAsset(asset.seq)"
                  >
                    <div
                      :class="$style.assetFavorit"
                      @click.prevent.stop="toggleAssetFavorites(asset.seq)"
                    >
                      <img
                        v-if="favorite_assets.indexOf(asset.seq) === -1"
                        src="@assets/kiosk-img/icon-star.svg"
                        alt="star"
                        class="star"
                      />
                      <img
                        v-else
                        src="@assets/kiosk-img/icon-star-yellow.svg"
                        alt="star"
                        class="star_yellow"
                      />
                    </div>
                    <div :class="[$style.assetsTit]">
                      <img :src="getAssetSrc(asset.code)" />
                      <div>
                        <strong>{{ asset.code }}</strong>
                        <span>{{ asset.title }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </PerfectScrollbar>
            </el-tab-pane>
            <el-tab-pane :label="$t('kiosk.favorite')">
              <el-input
                v-model="favorite_search_asset"
                :placeholder="$t('kiosk.search_assets_txt')"
                prefix-icon="el-icon-search"
              >
              </el-input>
              <PerfectScrollbar :class="[$style.perfectScrollbar]">
                <div :class="$style.searchList">
                  <div
                    v-for="favorite in c_favorite_assets"
                    :key="favorite.seq"
                    @click="selectAsset(favorite.seq)"
                  >
                    <div
                      :class="$style.assetFavorit"
                      @click.prevent.stop="toggleAssetFavorites(favorite.seq)"
                    >
                      <img
                        v-if="favorite_assets.indexOf(favorite.seq) === -1"
                        src="@assets/kiosk-img/icon-star.svg"
                        alt="star"
                        class="star"
                      />
                      <img
                        v-else
                        src="@assets/kiosk-img/icon-star-yellow.svg"
                        alt="star"
                        class="star_yellow"
                      />
                    </div>
                    <div :class="[$style.assetsTit]">
                      <img :src="getAssetSrc(favorite.code)" />
                      <div>
                        <strong>{{ favorite.code }}</strong>
                        <span>{{ favorite.title }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </PerfectScrollbar>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 검색 확인 버튼 -->
      <template v-if="!assets_search_visible">
        <div
          :class="$style.check"
          class="kiosk-select-box check"
          style="margin-top: 1100px;"
        >
          <el-button @click="$emit('close')">{{
            $t('kiosk.confirm')
          }}</el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-search.scss';
</style>
