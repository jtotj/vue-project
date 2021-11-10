<script>
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import { mapState } from 'vuex'

export default {
  props: {
    search_target_asset: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      active_tab:
        this.$route.query.active_tab !== undefined
          ? this.$route.query.active_tab
          : 'inner',
      input_target_account: '',
      favorite_accounts: [],
      search_target_account: 0,
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
  },
  watch: {
    '$attrs.value'(to) {
      this.search_target_account = to
    },
  },
  mounted() {
    if (localStorage.getItem(this.c_favorite_accounts_currentUser)) {
      this.favorite_accounts = JSON.parse(
        localStorage.getItem(this.c_favorite_accounts_currentUser)
      )
    }
  },
  methods: {
    selecteAccount(seq) {
      this.search_target_account = seq
      this.handleValueChange()
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
    handleValueChange() {
      this.$emit('input', this.search_target_account)
      this.$emit('modal_open', this.active_tab)
    },
  },
}
</script>

<template>
  <el-tabs v-model="active_tab">
    <el-tab-pane
      :label="$t('account_transfer.transfer_list_title')"
      name="inner"
    >
      <div :class="[$style.accountList]">
        <div :class="[$style.account_search]">
          <el-input
            v-model="input_target_account"
            prefix-icon="el-icon-search"
            :placeholder="$t('account_transfer.pls_search_account')"
            :class="[$style.input_account_search]"
          />
        </div>
        <el-tabs type="card" class="tabs">
          <el-tab-pane :label="$t('account')">
            <PerfectScrollbar :class="[$style.dealList]">
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
                    >
                      <div
                        :class="[
                          $style.favorite,
                          {
                            [$style.active]:
                              favorite_accounts.indexOf(favorite.seq) !== -1,
                          },
                        ]"
                        @click.prevent="toggleAccountFavorites(favorite.seq)"
                      >
                      </div>
                      <div
                        :class="[$style.accountInfo]"
                        @click.prevent="selecteAccount(favorite.seq)"
                      >
                        <strong :class="[$style.info_title]">
                          {{ favorite.title || $t('no_alias') }}
                        </strong>
                        <button class="btn-regular-black transfer-btn">
                          <span>
                            {{ $t('look_up') }}
                          </span>
                          <div class="img-wrap">
                            <img
                              src="@assets/img/longarrow-right-black.svg"
                              alt="화살표"
                            />
                          </div>
                        </button>
                        <p :class="[$style.accountNumberWrap]">
                          <span :class="[$style.accountText]">
                            {{ $t('wallet_page.withdraw_bank_address') }}
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
                        [$style.active]: search_target_account === account.seq,
                      },
                    ]"
                  >
                    <div
                      :class="[
                        $style.favorite,
                        {
                          [$style.active]:
                            favorite_accounts.indexOf(account.seq) !== -1,
                        },
                      ]"
                      @click.prevent="toggleAccountFavorites(account.seq)"
                    >
                    </div>
                    <div
                      :class="[$style.accountInfo]"
                      @click.prevent="selecteAccount(account.seq)"
                    >
                      <strong :class="[$style.info_title]">
                        {{ account.title || $t('no_alias') }}
                      </strong>
                      <button class="btn-regular-black transfer-btn">
                        <span>
                          {{ $t('look_up') }}
                        </span>
                        <div class="img-wrap">
                          <img
                            src="@assets/img/longarrow-right-black.svg"
                            alt="화살표"
                          />
                        </div>
                      </button>
                      <p :class="[$style.accountNumberWrap]">
                        <span :class="[$style.accountText]">
                          {{ $t('wallet_page.withdraw_bank_address') }}
                        </span>
                        <span :class="[$style.account_number]">
                          {{ account.account_number }}
                        </span>
                      </p>
                    </div>
                  </li>
                  <!-- 자산을 선택해주세요. -->
                  <template v-if="!search_target_asset">
                    <div class="no-list">
                      <div class="img-wrap img-size">
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
                    <div class="no-list">
                      <div class="img-wrap">
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
                </template>
              </ul>
            </PerfectScrollbar>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <span class="favorite-length">
                {{ c_favorite_accounts.length }}
              </span>
              {{ $t('favorites') }}
            </span>
            <PerfectScrollbar :class="[$style.dealList]">
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
                    >
                      <div
                        :class="[
                          $style.favorite,
                          {
                            [$style.active]:
                              favorite_accounts.indexOf(favorite.seq) !== -1,
                          },
                        ]"
                        @click.prevent="toggleAccountFavorites(favorite.seq)"
                      >
                      </div>
                      <div
                        :class="[$style.accountInfo]"
                        @click.prevent="selecteAccount(favorite.seq)"
                      >
                        <strong :class="[$style.info_title]">
                          {{ favorite.title || $t('no_alias') }}
                        </strong>
                        <button class="btn-regular-black transfer-btn">
                          <span>
                            {{ $t('look_up') }}
                          </span>
                          <div class="img-wrap">
                            <img
                              src="@assets/img/longarrow-right-black.svg"
                              alt="화살표"
                            />
                          </div>
                        </button>
                        <p :class="[$style.accountNumberWrap]">
                          <span :class="[$style.accountText]">
                            {{ $t('wallet_page.withdraw_bank_address') }}
                          </span>
                          <span :class="[$style.account_number]">
                            {{ favorite.account_number }}
                          </span>
                        </p>
                      </div>
                    </li>
                  </div>
                </template>
                <template v-else>
                  <template v-if="!search_target_asset">
                    <div class="no-list">
                      <div class="img-wrap img-size">
                        <img
                          src="@assets/img/please-select-icon.png"
                          alt="손가락 아이콘"
                        />
                      </div>
                      <p>
                        {{ $t('private.please_select_asset') }}
                      </p>
                    </div>
                  </template>
                  <template
                    v-if="
                      c_favorite_accounts.length === 0 && search_target_asset
                    "
                  >
                    <div class="no-list">
                      <div class="img-wrap">
                        <img
                          src="@assets/img/no-list.png"
                          alt="목록 없음 아이콘"
                        />
                      </div>
                      <p>
                        {{ $t('wallet_page.no_favorite_account_list') }}
                      </p>
                    </div>
                  </template>
                </template>
              </ul>
            </PerfectScrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>

    <el-tab-pane
      :label="$t('account_transfer.transfer_list_wallet')"
      name="outer"
    >
      <div :class="[$style.accountList]">
        <div :class="[$style.account_search]">
          <el-input
            v-model="input_target_account"
            prefix-icon="el-icon-search"
            :placeholder="$t('account_transfer.pls_search_account')"
            :class="[$style.input_account_search]"
          />
        </div>
        <el-tabs type="card" :class="[$style.tabs]" class="tabs">
          <el-tab-pane :label="$t('account')">
            <PerfectScrollbar :class="[$style.dealList]">
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
                    >
                      <div
                        :class="[
                          $style.favorite,
                          {
                            [$style.active]:
                              favorite_accounts.indexOf(favorite.seq) !== -1,
                          },
                        ]"
                        @click.prevent="toggleAccountFavorites(favorite.seq)"
                      >
                      </div>
                      <div
                        :class="[$style.accountInfo]"
                        @click.prevent="selecteAccount(favorite.seq)"
                      >
                        <strong :class="[$style.info_title]">
                          {{ favorite.title || $t('no_alias') }}
                        </strong>
                        <button class="btn-regular-black transfer-btn">
                          <span>
                            {{ $t('look_up') }}
                          </span>
                          <div class="img-wrap">
                            <img
                              src="@assets/img/longarrow-right-black.svg"
                              alt="화살표"
                            />
                          </div>
                        </button>
                        <p :class="[$style.accountNumberWrap]">
                          <span :class="[$style.accountText]">
                            {{ $t('wallet_page.withdraw_bank_address') }}
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
                        [$style.active]: search_target_account === account.seq,
                      },
                    ]"
                  >
                    <div
                      :class="[
                        $style.favorite,
                        {
                          [$style.active]:
                            favorite_accounts.indexOf(account.seq) !== -1,
                        },
                      ]"
                      @click.prevent="toggleAccountFavorites(account.seq)"
                    >
                    </div>
                    <div
                      :class="[$style.accountInfo]"
                      @click.prevent="selecteAccount(account.seq)"
                    >
                      <strong :class="[$style.info_title]">
                        {{ account.title || $t('no_alias') }}
                      </strong>
                      <button class="btn-regular-black transfer-btn">
                        <span>
                          {{ $t('look_up') }}
                        </span>
                        <div class="img-wrap">
                          <img
                            src="@assets/img/longarrow-right-black.svg"
                            alt="화살표"
                          />
                        </div>
                      </button>
                      <p :class="[$style.accountNumberWrap]">
                        <span :class="[$style.accountText]">
                          {{ $t('wallet_page.withdraw_bank_address') }}
                        </span>
                        <span :class="[$style.account_number]">
                          {{ account.account_number }}
                        </span>
                      </p>
                    </div>
                  </li>
                  <!-- 자산을 선택해주세요. -->
                  <template v-if="!search_target_asset">
                    <div class="no-list">
                      <div class="img-wrap img-size">
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
                    <div class="no-list">
                      <div class="img-wrap">
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
                </template>
              </ul>
            </PerfectScrollbar>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">
              <span class="favorite-length">
                {{ c_favorite_accounts.length }}
              </span>
              {{ $t('favorites') }}
            </span>
            <PerfectScrollbar :class="[$style.dealList]">
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
                    >
                      <div
                        :class="[
                          $style.favorite,
                          {
                            [$style.active]:
                              favorite_accounts.indexOf(favorite.seq) !== -1,
                          },
                        ]"
                        @click.prevent="toggleAccountFavorites(favorite.seq)"
                      >
                      </div>
                      <div
                        :class="[$style.accountInfo]"
                        @click.prevent="selecteAccount(favorite.seq)"
                      >
                        <strong :class="[$style.info_title]">
                          {{ favorite.title || $t('no_alias') }}
                        </strong>
                        <button class="btn-regular-black transfer-btn">
                          <span>
                            {{ $t('look_up') }}
                          </span>
                          <div class="img-wrap">
                            <img
                              src="@assets/img/longarrow-right-black.svg"
                              alt="화살표"
                            />
                          </div>
                        </button>
                        <p :class="[$style.accountNumberWrap]">
                          <span :class="[$style.accountText]">
                            {{ $t('wallet_page.withdraw_bank_address') }}
                          </span>
                          <span :class="[$style.account_number]">
                            {{ favorite.account_number }}
                          </span>
                        </p>
                      </div>
                    </li>
                  </div>
                </template>
                <template v-else>
                  <!-- 자산을 선택해주세요. -->
                  <template v-if="!search_target_asset">
                    <div class="no-list">
                      <div class="img-wrap img-size">
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
                  <template
                    v-if="
                      search_target_asset && c_favorite_accounts.length === 0
                    "
                  >
                    <div class="no-list">
                      <div class="img-wrap">
                        <img
                          src="@assets/img/no-list.png"
                          alt="목록 없음 아이콘"
                        />
                      </div>
                      <p>
                        {{ $t('wallet_page.no_favorite_account_list') }}
                      </p>
                    </div>
                  </template>
                </template>
              </ul>
            </PerfectScrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
@import '@src/design/account-transfer-list.scss';
</style>

<style scoped>
.tabs {
  margin-top: 20px;
}

strong,
span {
  cursor: pointer;
}

.no-list .img-wrap.img-size img {
  width: 70%;
}

/* 조회 버튼 css */
.tabs .transfer-btn {
  float: right;
  margin-left: 5px;
}

.tabs .transfer-btn span {
  padding-right: 5px;
}

.tabs .transfer-btn .img-wrap {
  float: right;
  width: 10px;
  transition: 0.2s;
}
</style>
