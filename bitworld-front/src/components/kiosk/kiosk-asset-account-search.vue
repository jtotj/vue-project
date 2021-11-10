<script>
import '@assets/css/kiosk/kiosk-search.css'
import { mapState } from 'vuex'
import uniq from 'lodash/uniq'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'

export default {
  props: {
    kiosk_type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      assets_search: '',
      account_search: '',
      favorite_search_account: '',
      favorite_search_asset: '',

      assets_search_visible: false,
      account_search_visible: false,

      favorite_assets: [],
      selected_asset_seq: 0,
      favorite_accounts: [],
      selected_account_seq: 0,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['currentUser']),

    c_filter_asset() {
      return filter(
        this.assets,
        (asset_info) =>
          !this.assets_search ||
          asset_info.code
            .toLowerCase()
            .includes(this.assets_search.toLowerCase()) ||
          asset_info.title.includes(this.assets_search)
      ).filter((info) =>
        this.kiosk_type === 'bank' ? info.code === 'KRW' : info
      )
    },
    c_favorite_assets() {
      const assets = uniq(
        map(this.favorite_assets, (value) => find(this.assets, { seq: value }))
      )
        .filter(
          (asset) =>
            !this.favorite_search_asset ||
            asset.code
              .toLowerCase()
              .includes(this.favorite_search_asset.toLowerCase()) ||
            asset.title.includes(this.favorite_search_asset)
        )
        .filter((info) =>
          this.kiosk_type === 'bank' ? info.code === 'KRW' : info
        )
      return assets
    },
    c_s_asset_info() {
      if (this.selected_asset_seq === 0) return null

      return find(this.assets, { seq: this.selected_asset_seq })
    },
    c_accounts() {
      if (this.selected_asset_seq === 0) return []

      return filter(
        this.accounts,
        (account) =>
          account.asset_seq === this.selected_asset_seq &&
          (!this.account_search ||
            account.title
              .toLowerCase()
              .includes(this.account_search.toLowerCase()) ||
            account.account_number.includes(this.account_search))
      )
    },
    c_favorite_accounts() {
      const accounts = uniq(
        map(this.favorite_accounts, (value) =>
          find(this.accounts, { seq: value })
        )
      ).filter(
        (favorite_account) =>
          favorite_account.asset_seq === this.selected_asset_seq &&
          (!this.favorite_search_account ||
            favorite_account.title
              .toLowerCase()
              .includes(this.favorite_search_account.toLowerCase()) ||
            favorite_account.account_number.includes(
              this.favorite_search_account
            ))
      )
      return accounts
    },
    c_favorite_accounts_currentUser() {
      return `favorite_accounts_${this.currentUser.seq}`
    },
    c_s_account_info() {
      if (this.selected_account_seq === 0) return null

      return find(this.accounts, { seq: this.selected_account_seq })
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
  },
  methods: {
    selectAsset(seq) {
      this.selected_asset_seq = seq
      this.assets_search_visible = false
    },
    selectAccount(seq) {
      this.selected_account_seq = seq
      this.handleSelectAccountChange()
      this.account_search_visible = false
    },
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-img/coin-' + code + '.svg')
      } catch (e) {
        return default_img
      }
    },
    handleSelectAccountChange() {
      this.$emit('input', this.selected_account_seq)
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
    toggleAccountFavorites(seq) {
      const index = this.favorite_accounts.indexOf(seq)

      if (index !== -1) {
        this.favorite_accounts.splice(index, 1)
        localStorage.setItem(
          this.c_favorite_accounts_currentUser,
          JSON.stringify(this.favorite_accounts)
        )
        return
      }
      this.favorite_accounts.push(seq)
      localStorage.setItem(
        this.c_favorite_accounts_currentUser,
        JSON.stringify(this.favorite_accounts)
      )
    },
  },
}
</script>

<template>
  <div :class="$style.kioskSearch" class="kiosk-search">
    <div :class="[$style.container, $style.innerContainer]">
      <template v-if="!account_search_visible">
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
      </template>

      <!-- 계좌검색 -->
      <template v-if="!assets_search_visible">
        <div class="kiosk-select-box">
          <h2>{{ $t('kiosk.search_account') }}</h2>
          <el-button
            class="kiosk-select-asset"
            @click="account_search_visible = !account_search_visible"
          >
            <template v-if="!c_s_account_info">
              <span>
                {{ $t('kiosk.select_account_txt') }}
                <img
                  v-if="!account_search_visible"
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
                    <strong>{{
                      c_s_account_info.title || $t('kiosk.no_account_alias')
                    }}</strong>
                    <span>{{ c_s_account_info.account_number }}</span>
                  </div>
                </div>
                <div
                  :class="[$style.selectedCancel]"
                  @click="selected_account_seq = 0"
                >
                  <strong>{{ c_s_account_info.balance }}</strong>
                  <img src="@assets/kiosk-img/icon-select-cancel.svg" />
                </div>
              </div>
            </template>
          </el-button>
          <div
            v-if="account_search_visible"
            :class="$style.assetsSearch"
            class="assets-search"
          >
            <el-tabs type="card">
              <el-tab-pane :label="$t('account')">
                <el-input
                  v-model="account_search"
                  :placeholder="$t('kiosk.search_account_txt')"
                  prefix-icon="el-icon-search"
                >
                </el-input>
                <PerfectScrollbar :class="[$style.perfectScrollbar]">
                  <div :class="$style.searchList">
                    <div
                      v-for="account in c_accounts"
                      :key="account.seq"
                      @click="selectAccount(account.seq)"
                    >
                      <div
                        :class="$style.assetFavorit"
                        @click.prevent.stop="
                          toggleAccountFavorites(account.seq)
                        "
                      >
                        <img
                          v-if="favorite_accounts.indexOf(account.seq) === -1"
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
                        <img :src="getAssetSrc(account.asset_code)" />
                        <div>
                          <strong :class="$style.acoountName">{{
                            account.title || $t('kiosk.no_account_alias')
                          }}</strong>
                          <span>{{ account.account_number }}</span>
                        </div>
                        <span>{{ account.balance }}</span>
                      </div>
                    </div>
                  </div>
                </PerfectScrollbar>
              </el-tab-pane>
              <el-tab-pane :label="$t('kiosk.favorite')">
                <el-input
                  v-model="favorite_search_account"
                  :placeholder="$t('kiosk.search_account_txt')"
                  prefix-icon="el-icon-search"
                >
                </el-input>
                <PerfectScrollbar :class="[$style.perfectScrollbar]">
                  <div :class="$style.searchList">
                    <div
                      v-for="favorite_account in c_favorite_accounts"
                      :key="favorite_account.seq"
                      @click="selectAccount(favorite_account.seq)"
                    >
                      <div
                        :class="$style.assetFavorit"
                        @click.prevent.stop="
                          toggleAccountFavorites(favorite_account.seq)
                        "
                      >
                        <img
                          v-if="
                            favorite_accounts.indexOf(favorite_account.seq) ===
                              -1
                          "
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
                        <img :src="getAssetSrc(favorite_account.asset_code)" />
                        <div>
                          <strong :class="$style.acoountName">{{
                            favorite_account.title ||
                              $t('kiosk.no_account_alias')
                          }}</strong>
                          <span>{{ favorite_account.account_number }}</span>
                        </div>
                        <span>{{ favorite_account.balance }}</span>
                      </div>
                    </div>
                  </div>
                </PerfectScrollbar>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </template>

      <!-- 검색 확인 버튼 -->
      <template v-if="!account_search_visible && !assets_search_visible">
        <div :class="$style.check" class="kiosk-select-box check">
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
