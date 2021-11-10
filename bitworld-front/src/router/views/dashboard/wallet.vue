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
      if (this.search_target_asset !== 0) {
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
  <div class="main tabs-wrap">
    <div class="foreground-container">
      <div class="contents">
        <div class="big-tit-wrap">
          <div class="container">
            <span class="big-tit">{{ $t('wallet_page.have_asset') }}</span>
          </div>
        </div>
        <div :class="[$style.walletsWrap]">
          <div class="container">
            <div :class="[$style.walletBox]">
              <div :class="[$style.walletLeft]">
                <div :class="[$style.walletHead]">{{
                  $t('wallet_page.asset_list')
                }}</div>
                <AssetSelector
                  v-model="search_target_asset"
                  :class="$style.walletAssetWrap"
                ></AssetSelector>
              </div>
              <div :class="[$style.walletRight]">
                <div :class="[$style.walletHead]">
                  {{ $t('wallet_page.account_list') }}
                </div>
                <div :class="[$style.btnWrap]">
                  <button
                    :class="[$style.accountCreate]"
                    :disabled="search_target_asset === 0"
                    @click="showAccountCeateModal"
                  >
                    {{ $t('wallet_page.account_create') }}
                  </button>
                </div>
                <AccountList :asset_seq="search_target_asset"></AccountList>
              </div>
            </div>
          </div>
        </div>
        <!-- 계좌생성 모달창 -->
        <el-dialog
          class="account-registration-modal"
          :visible.sync="account_create_modal"
          width="60%"
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
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/wallet.scss';
</style>
