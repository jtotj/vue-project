<script>
import AccountTransferList from '@components/account-transfer-list'
import OtherWalletList from '@components/other-wallet-list'
import inquiryAccountList from '@components/account-inquiryable-list'
import AssetSelector from '@components/asset-selector'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'AccountTransferList',
    meta: [{ name: 'description', content: 'AccountTransferList' }],
  },
  components: {
    AccountTransferList,
    OtherWalletList,
    inquiryAccountList,
    AssetSelector,
  },
  data() {
    return {
      search_target_asset: 0,
      account_transfer_list: [],
      search_target_account: 0,

      account_list: [],
      input_target_asset: '',
      input_target_account: '',
      reset: false,
      favorite_assets: [],
      favorite_accounts: [],
      activeName: 'first',
      activeNames: '',
      show_list_modal: false,

      withdraw_list: [],
      input_target_withdraw: '',
      favorite_withdraw: [],
      show_withdraw_modal: false,
    }
  },

  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['currentUser']),

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
    c_active_accounts() {
      return filter(
        this.accounts,
        (account) =>
          account.asset_seq === this.search_target_asset &&
          !find(this.c_favorite_accounts, { seq: account.seq }) &&
          (!this.input_target_account ||
            account.title
              .toLowerCase()
              .includes(this.input_target_account.toLowerCase()) ||
            account.account_number.includes(this.input_target_account))
      )
    },
    c_favorite_assets() {
      const assets = filter(
        uniq(
          map(this.favorite_assets, (value) =>
            find(this.assets, { seq: value })
          )
        ),
        (asset_info) =>
          (!this.input_target_asset ||
            asset_info.code
              .toLowerCase()
              .includes(this.input_target_asset.toLowerCase()) ||
            asset_info.title.includes(this.input_target_asset)) &&
          asset_info.is_active === 'Y'
      )
      return assets
    },
    c_favorite_accounts() {
      const accounts = filter(
        uniq(
          map(this.favorite_accounts, (value) =>
            find(this.accounts, { seq: value })
          )
        ).filter(
          (favorite_account) =>
            favorite_account.asset_seq === this.search_target_asset
        ),
        (account) =>
          !this.input_target_account ||
          account.title
            .toLowerCase()
            .includes(this.input_target_account.toLowerCase()) ||
          account.account_number.includes(this.input_target_account)
      )
      return accounts
    },
    c_favorite_accounts_currentUser() {
      return `favorite_accounts_${this.currentUser.seq}`
    },
    c_favorite_withdraw_currentUser() {
      return `favorite_withdraw_${this.currentUser.seq}`
    },
    c_favorite_withdraw() {
      const accounts = uniq(
        map(this.favorite_withdraw, (value) =>
          find(this.accounts, { seq: value })
        )
      ).filter(
        (favorite_account) =>
          favorite_account.asset_seq === this.search_target_asset
      )
      return accounts
    },
    c_active_withdraw() {
      return filter(
        this.accounts,
        (account) =>
          account.asset_seq === this.search_target_asset &&
          !find(this.c_favorite_withdraw, { seq: account.seq }) &&
          (!this.input_target_withdraw ||
            account.title
              .toLowerCase()
              .includes(this.input_target_withdraw.toLowerCase()) ||
            account.account_number.includes(this.input_target_withdraw))
      )
    },
  },
  watch: {
    search_target_account() {
      this.page = 1
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
    if (localStorage.getItem(this.c_favorite_withdraw_currentUser)) {
      this.favorite_withdraw = JSON.parse(
        localStorage.getItem(this.c_favorite_withdraw_currentUser)
      )
    }
    this.account_list = this.accounts
  },
  methods: {
    filterAccountList(query) {
      if (query !== '') {
        this.account_list = this.accounts.filter(
          (data) =>
            data.account_number.includes(query) ||
            data.title.toLowerCase().includes(query.toLowerCase())
        )
      } else if (query === '') {
        this.account_list = this.accounts
      }
    },
    selecteAsset(seq) {
      this.search_target_asset = seq
      this.search_target_account = null
    },
    selecteAccount(type) {
      if (type === 'inner') this.show_list_modal = true
      else this.show_withdraw_modal = true
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
    toggleWithdrawFavorites(seq) {
      const index = this.favorite_withdraw.indexOf(seq)

      if (index !== -1) {
        this.favorite_withdraw.splice(index, 1)
        localStorage.setItem(
          this.c_favorite_withdraw_currentUser,
          JSON.stringify(this.favorite_withdraw)
        )
        return
      }
      this.favorite_withdraw.push(seq)
      localStorage.setItem(
        this.c_favorite_withdraw_currentUser,
        JSON.stringify(this.favorite_withdraw)
      )
    },
    selecteWithdraw(seq) {
      this.search_target_account = seq
      this.show_withdraw_modal = true
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 v-if="$route.query.active_tab === 'outer'" class="big-title">
          {{ $t('other_wallets_transfer_search') }}
        </h2>
        <h2 v-else class="big-title">
          {{ $t('account_transfer.transfer_list') }}
        </h2>
      </div>

      <div :class="[$style.tradesWrap]">
        <div :class="[$style.tradesBox]">
          <!-- 자산별 검색 -->
          <div class="asset-list">
            <h3>
              {{ $t('wallet_page.asset_list') }}
            </h3>
            <AssetSelector v-model="search_target_asset"></AssetSelector>
          </div>
          <!-- 계좌별 검색 -->
          <div class="account-list">
            <inquiryAccountList
              v-model="search_target_account"
              :search_target_asset="search_target_asset"
              @modal_open="selecteAccount"
            ></inquiryAccountList>
          </div>
        </div>
        <!-- 조회 -->
      </div>
    </div>
    <el-dialog
      :visible.sync="show_list_modal"
      :append-to-body="true"
      width="50%"
      :title="$t('account_transfer.transfer_list_detail')"
    >
      <AccountTransferList
        v-if="show_list_modal"
        :asset_seq="search_target_asset"
        :account_seq="search_target_account"
      >
      </AccountTransferList>
    </el-dialog>
    <el-dialog
      :visible.sync="show_withdraw_modal"
      :append-to-body="true"
      width="50%"
      :title="$t('account_transfer.transfer_list_detail')"
    >
      <OtherWalletList
        v-if="show_withdraw_modal"
        :asset_seq="search_target_asset"
        :account_seq="search_target_account"
      >
      </OtherWalletList>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
@import '@src/design/account-transfer-list.scss';
</style>
