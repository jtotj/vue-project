<script>
import '@assets/css/icon.css'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      selected_asset_seq: this.$route.query.asset_seq || null,
      search_keyword_asset: '',
      favorite_assets: [],
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    c_is_active_asset() {
      return filter(
        this.assets,
        (asset_info) =>
          (!this.search_keyword_asset ||
            asset_info.code
              .toLowerCase()
              .includes(this.search_keyword_asset.toLowerCase()) ||
            asset_info.title.includes(this.search_keyword_asset)) &&
          asset_info.is_active === 'Y'
      )
    },
    c_favorite_assets() {
      const assets = uniq(
        map(this.favorite_assets, (value) => find(this.assets, { seq: value }))
      )
      return assets
    },
  },
  mounted() {
    if (localStorage.favorite_assets) {
      this.favorite_assets = JSON.parse(localStorage.getItem('favorite_assets'))
    }
  },
  methods: {
    selectTargetAsset(seq) {
      if (this.$route.query.asset_seq === seq) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, { asset_seq: undefined }),
        })
      } else if (this.$route.query !== undefined) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, { asset_seq: seq }),
        })
      } else {
        this.$router.push({
          query: { asset_seq: seq },
        })
      }
    },
    selectAsset(seq) {
      if (seq === this.selected_asset_seq) {
        this.selected_asset_seq = null
        this.handleValueChange()
      } else {
        this.selected_asset_seq = seq
        this.handleValueChange()
      }
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
    handleValueChange() {
      this.$emit('input', this.selected_asset_seq)
    },
  },
}
</script>

<template>
  <div :class="[$style.assetList]">
    <!-- 자산 검색 -->
    <div :class="[$style.assetSearch]">
      <el-input
        v-model="search_keyword_asset"
        prefix-icon="el-icon-search"
        :placeholder="$t('account_transfer.pls_search_asset')"
        :class="[$style.inputAssetSearch]"
      />
    </div>
    <el-tabs type="card" :class="[$style.tabs]">
      <!-- 자산 -->
      <el-tab-pane :label="$t('asset')">
        <div v-if="c_is_active_asset.length === 0" class="no-list">
          <div class="img-wrap">
            <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
          </div>
          <p>
            {{ $t('no_list') }}
          </p>
        </div>
        <div v-else class="fixedValue">
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul>
              <template v-for="asset in c_is_active_asset">
                <li
                  :key="asset.seq"
                  :class="[
                    {
                      [$style.selected]: selected_asset_seq === asset.seq,
                    },
                    $style.coinList,
                  ]"
                  @click="selectTargetAsset(asset.seq)"
                >
                  <p :class="`${asset.code}`"></p>
                  <span>{{ asset.code }}</span>
                  <div class="favorite-click">
                    <div
                      :class="[
                        {
                          active: favorite_assets.indexOf(asset.seq) !== -1,
                        },
                        'favorite',
                      ]"
                      @click.prevent.stop="toggleAssetFavorites(asset.seq)"
                    >
                    </div>
                  </div>
                </li>
              </template>
            </ul>
          </PerfectScrollbar>
        </div>
      </el-tab-pane>
      <!-- 즐겨찾기 -->
      <el-tab-pane>
        <span slot="label">
          <span class="favorite-length">
            {{ c_favorite_assets.length }}
          </span>
          {{ $t('favorites') }}
        </span>
        <div v-if="c_favorite_assets.length === 0" class="no-list">
          <div class="img-wrap">
            <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
          </div>
          <p>
            {{ $t('no_favorite_list') }}
          </p>
        </div>
        <div v-else class="fixedValue">
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul>
              <li
                v-for="favorite in c_favorite_assets"
                :key="favorite.seq"
                :class="[
                  $style.coinList,
                  {
                    [$style.selected]: selected_asset_seq === favorite.seq,
                  },
                ]"
                @click.prevent.stop="selectAsset(favorite.seq)"
              >
                <p :class="`${favorite.code}`"></p>
                <div
                  :class="[
                    {
                      active: favorite_assets.indexOf(favorite.seq) !== -1,
                    },
                    'favorite',
                  ]"
                  @click.prevent.stop="toggleAssetFavorites(favorite.seq)"
                >
                </div>
                <span>
                  {{ favorite.code }}
                </span>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
@import '@src/design/affiliate-selector.scss';
</style>

<style scoped>
.exchange-modal ul li.exchange-list {
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 10px;
  border: 1px solid #e5e5e5;
}
.favorite-click .favorite {
  float: right;
  margin-top: -23px;
}
</style>
