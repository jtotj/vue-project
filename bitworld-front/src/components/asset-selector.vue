<script>
import date from 'locutus/php/datetime/date'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      selected_asset_seq: this.$route.query.asset_seq || null,
      input_target_asset: '',
      favorite_assets: [],
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('auth', ['otps']),
    ...mapState('auth', ['currentUser']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_is_active_asset() {
      return filter(
        this.assets,
        (asset_info) =>
          (!this.input_target_asset ||
            asset_info.code
              .toLowerCase()
              .includes(this.input_target_asset.toLowerCase()) ||
            asset_info.title.includes(this.input_target_asset)) &&
          asset_info.is_active === 'Y'
      )
    },
    c_selected_asset() {
      if (this.selected_asset_seq !== null) {
        return find(this.assets, {
          seq: this.selected_asset_seq,
        })
      } else {
        return null
      }
    },
    c_favorite_assets() {
      const assets = uniq(
        map(this.favorite_assets, (value) => find(this.assets, { seq: value }))
      )
      return assets
    },
  },
  watch: {
    '$attrs.value'(to) {
      this.selected_asset_seq = to
    },
  },
  mounted() {
    if (localStorage.favorite_assets) {
      this.favorite_assets = JSON.parse(localStorage.getItem('favorite_assets'))
    }
    if (localStorage.getItem(this.c_favorite_accounts_currentUser)) {
      this.favorite_accounts = JSON.parse(
        localStorage.getItem(this.c_favorite_accounts_currentUser)
      )
    }
    this.page = this.$route.query.page || 1
    this.account_list = this.accounts
  },
  methods: {
    selectAsset(seq) {
      this.selected_asset_seq = seq
      this.selected_asset_seq = seq
      this.handleValueChange()
    },
    goDepositList(p) {
      if (this.$route.path.indexOf('bank') !== -1) {
        this.$router.push({
          name: 'bank-deposit',
          query: {
            account_seq: p,
          },
        })
      } else {
        this.$router.push({
          name: 'Deposit',
          query: {
            account_seq: p,
          },
        })
      }
    },
    goWithdrawList(p) {
      if (this.$route.path.indexOf('bank') !== -1) {
        this.$router.push({
          name: 'bank-withdraw',
          query: {
            account_seq: p,
          },
        })
      } else {
        this.$router.push({
          name: 'Withdraw',
          query: {
            account_seq: p,
          },
        })
      }
    },
    date,
    fromPairs,
    onCopy() {
      this.$toasted.success(this.$t('toasted_msg.copy'))
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
  <div id="coin-asset-list" :class="[$style.assetList]">
    <!-- 자산 검색 -->
    <div :class="[$style.assetSearch]">
      <el-input
        v-model="input_target_asset"
        prefix-icon="el-icon-search"
        :placeholder="$t('account_transfer.pls_search_asset')"
        :class="[$style.inputAssetSearch]"
      />
    </div>
    <el-tabs type="card" :class="[$style.tabs]">
      <!-- 자산 -->
      <el-tab-pane :label="$t('asset')">
        <div class="fixedValue">
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
                  @click="selectAsset(asset.seq)"
                >
                  <p :class="`${asset.code}`"></p>
                  <span>{{ asset.code }}</span>
                  <div
                    :class="[
                      {
                        [$style.active]:
                          favorite_assets.indexOf(asset.seq) !== -1,
                      },
                      $style.favorite,
                    ]"
                    @click.prevent.stop="toggleAssetFavorites(asset.seq)"
                  >
                  </div>
                </li>
              </template>
            </ul>
          </PerfectScrollbar>
        </div>
      </el-tab-pane>
      <!-- 즐겨찾기 -->
      <el-tab-pane :label="$t('account_transfer.favorites')">
        <div class="fixedValue">
          <PerfectScrollbar>
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
                      [$style.active]:
                        favorite_assets.indexOf(favorite.seq) !== -1,
                    },
                    $style.favorite,
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
@import '@src/design/asset-selector.scss';
</style>
