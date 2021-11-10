<script>
import { fetchAccountTransferList } from '@apis/account'
import PageNavigation from '@components/modal-page-navigation'
import AccountTransferInfo from '@components/account-transfer-info'
import AssetSelector from '@components/asset-selector'
import date from 'locutus/php/datetime/date'
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
    PageNavigation,
    AccountTransferInfo,
    AssetSelector,
  },
  data() {
    return {
      search_target_asset: 0,
      account_transfer_list: [],
      search_target_account: 0,
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      account_list: [],
      input_target_account: '',
      reset: false,
      favorite_accounts: [],
      transfer_info_modal: false,
      transfer_seq: null,
      account_tab_value: '',
    }
  },

  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['currentUser']),

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
    c_favorite_accounts() {
      const accounts = uniq(
        map(this.favorite_accounts, (value) =>
          find(this.accounts, { seq: value })
        )
      ).filter(
        (favorite_account) =>
          favorite_account.asset_seq === this.search_target_asset
      )
      return accounts
    },
    c_favorite_accounts_currentUser() {
      return `favorite_accounts_${this.currentUser.seq}`
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
    this.account_list = this.accounts
    this.getAccountTransfers()
  },
  methods: {
    async getAccountTransfers() {
      const ret_obj = await fetchAccountTransferList({
        ...this.$route.query,
        list_count: 6,
        page: this.page,
        asset_seq: this.returnZeroToNull(this.search_target_asset),
        account_seq: this.returnZeroToNull(this.search_target_account),
      }).catch((e) => this.$toasted.error(e.message))
      this.account_transfer_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation

      if (this.search_target_asset || this.search_target_account) {
        this.reset = true
      } else {
        this.reset = false
      }
    },
    returnZeroToNull(val) {
      if (val === 0) return null
      else return val
    },
    date,
    handleClick(p) {
      this.transfer_info_modal = true
      this.transfer_seq = p
    },

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
    selecteAccount(seq) {
      this.search_target_account = seq
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
    handlePageChange(data) {
      this.page = data
      this.getAccountTransfers()
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
            <span class="big-tit">
              {{ $t('account_transfer.transfer_list') }}
            </span>
          </div>
        </div>
        <div :class="[$style.tradesWrap]">
          <div class="container">
            <div :class="[$style.tradesBox]">
              <!-- 자산별 검색 -->
              <div :class="[$style.tradesLeft]">
                <p :class="[$style.tradesHead]">
                  {{ $t('account_transfer.search_transfer_asset') }}
                </p>
                <AssetSelector
                  v-model="search_target_asset"
                  :class="$style.assetListWrap"
                />
              </div>
              <!-- 계좌별 검색 -->
              <div :class="[$style.tradesRight]">
                <p :class="[$style.tradesHead]">
                  {{ $t('account_transfer.search_transfer_account') }}
                </p>

                <div :class="[$style.accountList]">
                  <div :class="[$style.account_search]">
                    <el-input
                      v-model="input_target_account"
                      prefix-icon="el-icon-search"
                      type="text"
                      :placeholder="$t('account_transfer.pls_search_account')"
                      :class="[$style.input_account_search]"
                    />
                  </div>
                  <el-tabs type="card" :class="[$style.dealList]">
                    <el-tab-pane :label="$t('account')">
                      <PerfectScrollbar :class="[$style.perfectScrollbar]">
                        <ul>
                          <template v-if="c_favorite_accounts.length">
                            <div :class="[$style.favoriteAccount]">
                              <li
                                v-for="favorite in c_favorite_accounts"
                                :key="favorite.seq"
                                :class="[
                                  $style.dealAct,
                                  {
                                    [$style.active]:
                                      search_target_account === favorite.seq,
                                  },
                                ]"
                                @click.prevent="selecteAccount(favorite.seq)"
                              >
                                <div :class="[$style.accountInfo]">
                                  <div
                                    :class="[
                                      $style.favorite,
                                      {
                                        [$style.active]:
                                          favorite_accounts.indexOf(
                                            favorite.seq
                                          ) !== -1,
                                      },
                                    ]"
                                    @click.prevent="
                                      toggleAccountFavorites(favorite.seq)
                                    "
                                  >
                                  </div>
                                  <strong :class="[$style.info_title]">
                                    {{ favorite.title }}
                                  </strong>
                                  <p :class="[$style.accountNumberWrap]">
                                    <span :class="[$style.accountText]">
                                      {{
                                        $t('wallet_page.withdraw_bank_address')
                                      }}
                                    </span>
                                    <span :class="[$style.account_number]">
                                      {{ favorite.account_number }}
                                    </span>
                                  </p>
                                </div>
                              </li>
                            </div>
                          </template>
                          <template>
                            <li
                              v-for="account in c_active_accounts"
                              :key="account.seq"
                              :label="account.account_number"
                              :value="account.seq"
                              :class="[
                                $style.dealAct,
                                {
                                  [$style.active]:
                                    search_target_account === account.seq,
                                },
                              ]"
                              @click.prevent="selecteAccount(account.seq)"
                            >
                              <div :class="[$style.accountInfo]">
                                <div
                                  :class="[
                                    $style.favorite,
                                    {
                                      [$style.active]:
                                        favorite_accounts.indexOf(
                                          account.seq
                                        ) !== -1,
                                    },
                                  ]"
                                  @click.prevent="
                                    toggleAccountFavorites(account.seq)
                                  "
                                >
                                </div>
                                <strong :class="[$style.info_title]">
                                  {{ account.title }}
                                </strong>
                                <p :class="[$style.accountNumberWrap]">
                                  <span :class="[$style.accountText]">
                                    {{
                                      $t('wallet_page.withdraw_bank_address')
                                    }}
                                  </span>
                                  <span :class="[$style.account_number]">
                                    {{ account.account_number }}
                                  </span>
                                </p>
                              </div>
                            </li>
                          </template>

                          <!-- 자산을 선택해주세요. -->
                          <template v-if="!search_target_asset">
                            <div :class="[$style.noSelectAsset]">
                              <div :class="[$style.imgWrap]">
                                <img
                                  src="@assets/img/please-select-icon.png"
                                  alt="손가락 아이콘"
                                />
                              </div>
                              <p :class="[$style.textWrap]">
                                {{ $t('private.please_select_asset') }}
                              </p>
                            </div>
                          </template>
                          <!-- 계좌가 없을 떄 -->
                          <template
                            v-if="
                              search_target_asset &&
                                c_active_accounts.length === 0 &&
                                c_favorite_accounts.length === 0
                            "
                          >
                            <div :class="[$style.noDealList]">
                              <div :class="[$style.imgWrap]">
                                <img
                                  src="@assets/img/no-list.png"
                                  alt="목록 없음 아이콘"
                                />
                              </div>
                              <p :class="[$style.textWrap]">{{
                                $t('wallet_page.no_account_list')
                              }}</p>
                            </div>
                          </template>
                        </ul>
                      </PerfectScrollbar>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('account_transfer.favorites')">
                      <PerfectScrollbar :class="[$style.perfectScrollbar]">
                        <ul>
                          <template v-if="c_favorite_accounts.length">
                            <div :class="[$style.favoriteAccount]">
                              <li
                                v-for="favorite in c_favorite_accounts"
                                :key="favorite.seq"
                                :class="[
                                  $style.dealAct,
                                  {
                                    [$style.active]:
                                      search_target_account === favorite.seq,
                                  },
                                ]"
                                @click.prevent="selecteAccount(favorite.seq)"
                              >
                                <div :class="[$style.accountInfo]">
                                  <div
                                    :class="[
                                      $style.favorite,
                                      {
                                        [$style.active]:
                                          favorite_accounts.indexOf(
                                            favorite.seq
                                          ) !== -1,
                                      },
                                    ]"
                                    @click.prevent="
                                      toggleAccountFavorites(favorite.seq)
                                    "
                                  >
                                  </div>
                                  <strong :class="[$style.info_title]">
                                    {{ favorite.title }}
                                  </strong>
                                  <p :class="[$style.accountNumberWrap]">
                                    <span :class="[$style.accountText]">
                                      {{
                                        $t('wallet_page.withdraw_bank_address')
                                      }}
                                    </span>
                                    <span :class="[$style.account_number]">
                                      {{ favorite.account_number }}
                                    </span>
                                  </p>
                                </div>
                              </li>
                            </div>
                          </template>
                        </ul>
                      </PerfectScrollbar>
                    </el-tab-pane>
                  </el-tabs>
                </div>

                <div :class="[$style.searchButtonWrap]">
                  <el-button
                    :class="[$style.lookUpButton]"
                    :disabled="!search_target_asset || !search_target_account"
                    @click="getAccountTransfers"
                    >{{ $t('look_up') }}</el-button
                  >
                </div>
              </div>
            </div>

            <!-- 조회 -->
            <template>
              <div
                v-if="account_transfer_list.length"
                :class="[$style.reference]"
              >
                <ul>
                  <template v-for="list in account_transfer_list">
                    <li :key="list.seq" :class="[$style.referenceList]">
                      <div :class="[$style.infoWrap]">
                        <div :class="[$style.leftInfo]">
                          <strong
                            v-if="list.from_member_seq === list.to_member_seq"
                            :class="[$style.title]"
                          >
                            {{ $t('account_transfer.my_account_transfer') }}
                            {{ list.asset_code }}
                          </strong>
                          <strong
                            v-else-if="list.from_member_seq === currentUser.seq"
                            :class="[$style.title]"
                          >
                            {{ $t('wallet_page.withdraw') }}
                            {{ list.asset_code }}
                          </strong>
                          <strong
                            v-else-if="list.to_member_seq === currentUser.seq"
                            :class="[$style.title]"
                          >
                            {{ $t('wallet_page.deposit') }}
                            {{ list.asset_code }}
                          </strong>
                          <div :class="[$style.accountInfo]">
                            <span :class="[$style.accountText]">
                              {{ $t('wallet_page.regdate') }}
                            </span>
                            <span :class="[$style.accountRegdate]">
                              {{ date('Y-m-d H:i:s', new Date(list.regdate)) }}
                            </span>
                          </div>
                          <div :class="[$style.accountInfo]">
                            <span :class="[$style.accountText]">
                              {{ $t('wallet_page.withdraw_bank_address') }}
                            </span>
                            <span :class="[$style.accountNumber]">{{
                              list.from_account_number
                            }}</span>
                          </div>
                          <div :class="[$style.accountInfo]">
                            <span :class="[$style.accountText]">
                              {{ $t('account_transfer.from_user_name') }}
                            </span>
                            <span :class="[$style.accountNumber]">{{
                              list.from_user_name
                            }}</span>
                          </div>
                        </div>
                        <div :class="[$style.rightInfo]">
                          <span :class="[$style.transferAmount]">
                            {{ list.amount | codeDecimal(list.asset_code) }}
                          </span>
                          <div :class="[$style.linkWrap]">
                            <a
                              :class="[$style.lookupLink]"
                              @click="handleClick(list.seq)"
                            >
                              {{ $t('look_up') }}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div :class="[$style.accountContent]">
                        <ul>
                          <li>
                            <span :class="[$style.accountText]">
                              {{ $t('account_transfer.to_account_number') }}
                            </span>
                            <span>{{ list.to_account_number }}</span>
                          </li>
                          <li>
                            <span :class="[$style.accountText]">
                              {{ $t('account_transfer.to_account_user_name') }}
                            </span>
                            <span>{{ list.to_user_name }}</span>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </template>
                </ul>
                <PageNavigation
                  class="page-navigation"
                  :total_count="total_count"
                  :total_page="page_navigation.total_page"
                  :cur_page="page"
                  :page_count="page_navigation.page_count"
                  @change="handlePageChange"
                ></PageNavigation>
              </div>

              <div
                v-if="reset && account_transfer_list.length === 0"
                :class="[$style.noDealList]"
              >
                <div :class="[$style.imgWrap]">
                  <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
                </div>
                <p :class="[$style.textWrap]">{{
                  $t('account_transfer.no_inquiry_history')
                }}</p>
              </div>
            </template>
          </div>
        </div>
        <el-dialog
          :title="$t('account_transfer.transfer_list_detail_tit')"
          :visible.sync="transfer_info_modal"
          width="50%"
          :append-to-body="true"
          class="transfer-info-modal"
        >
          <AccountTransferInfo
            v-if="transfer_info_modal"
            :transfer_seq="transfer_seq"
          >
          </AccountTransferInfo>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/account-transfer-list.scss';
@import '@src/design/favorite.scss';
</style>
