<script>
import date from 'locutus/php/datetime/date'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import { mapState } from 'vuex'
import { fetchList, createAccount, updateAccount } from '@apis/account'
import AccountDepositList from '@components/account-deposit-list'
import AccountWithdrawList from '@components/account-withdraw-list'
import DepositForm from '@components/deposit-form'
import WithdrawForm from '@components/withdraw-form'
import Decimal from 'decimal.js'

export default {
  components: {
    AccountDepositList,
    AccountWithdrawList,
    DepositForm,
    WithdrawForm,
  },
  props: {
    asset_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      account_title: null,
      account_list: [],
      account: [],
      favorite_accounts: [],
      input_search_account: '',
      target_account_seq: null,
      deposit_modal: false,
      withdraw_modal: false,
      modify_modal: false,
      deposit_inquiry_modal: false,
      withdraw_inquiry_modal: false,

      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['currentUser']),

    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_selected_asset() {
      if (this.asset_seq) {
        return find(this.assets, {
          seq: this.asset_seq,
        })
      } else {
        return null
      }
    },
    c_active_accounts() {
      return filter(
        this.accounts,
        (account) =>
          account.asset_seq === this.asset_seq &&
          !find(this.c_favorite_accounts, { seq: account.seq }) &&
          (!this.input_search_account ||
            account.title
              .toLowerCase()
              .includes(this.input_search_account.toLowerCase()) ||
            account.account_number.includes(this.input_search_account))
      )
    },
    c_favorite_accounts() {
      const accounts = filter(
        uniq(
          map(this.favorite_accounts, (value) =>
            find(this.accounts, { seq: value })
          )
        ).filter(
          (favorite_account) => favorite_account.asset_seq === this.asset_seq
        ),
        (account) =>
          !this.input_search_account ||
          account.title
            .toLowerCase()
            .includes(this.input_search_account.toLowerCase()) ||
          account.account_number.includes(this.input_search_account)
      )
      return accounts
    },
    c_favorite_accounts_currentUser() {
      return `favorite_accounts_${this.currentUser.seq}`
    },

    c_target_account_info() {
      return find(this.accounts, {
        seq: this.target_account_seq,
      })
    },
  },
  watch: {
    // 라우트가 변경되면
    $route(to, from) {
      this.page = this.$route.query.page || 1
      this.getAccountList()
    },
  },
  mounted() {
    // if (this.$route.query.search_account) this.getAccountList()
    this.getAccountList()
    if (localStorage.getItem(this.c_favorite_accounts_currentUser))
      this.favorite_accounts = JSON.parse(
        localStorage.getItem(this.c_favorite_accounts_currentUser)
      )
  },
  methods: {
    date,
    async getAccountList() {
      const ret_obj = await fetchList({
        ...this.$route.query,
        list_count: 4,
        asset_seq: this.asset_seq,
      }).catch((e) => this.$toasted.error(e.message))
      this.account_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
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
    modifyModal(seq) {
      this.modify_modal = true
      this.target_account_seq = seq
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
          this.show_account = false
          this.account_create_modal = false
        })
    },
    handleUpdate() {
      updateAccount({
        account_seq: this.target_account_seq,
        title: this.account_title,
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.modify'))
          this.account_title = null
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => (e ? this.$toasted.error(e.message) : null))
        .finally(() => {
          this.loading = false
          this.modify_modal = false
        })
    },
    depositHistoryModal(seq) {
      this.deposit_inquiry_modal = true
      this.target_account_seq = seq
    },
    withdrawHistoryModal(seq) {
      this.withdraw_inquiry_modal = true
      this.target_account_seq = seq
    },
    showDepositModal(seq) {
      this.deposit_modal = true
      this.target_account_seq = seq
      Promise.all([])
    },
    showWithdrawModal(seq) {
      this.withdraw_modal = true
      this.target_account_seq = seq
    },
    onCopy(data) {
      this.$copyText(data).then(
        this.$toasted.success(this.$t('toasted_msg.copy'))
      )
    },
    Decimal,
  },
}
</script>

<template>
  <div :class="[$style.accountList]">
    <!-- 계좌 검색 -->
    <div :class="[$style.account_search]">
      <el-input
        v-model="input_search_account"
        prefix-icon="el-icon-search"
        :placeholder="$t('account_transfer.pls_search_account')"
        :class="[$style.input_account_search]"
      />
    </div>
    <div :class="[$style.mainDeal]">
      <!-- 계좌 목록 -->
      <el-tabs type="card" :class="[$style.tabs]">
        <el-tab-pane :label="$t('account')">
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul :class="[$style.dealList]">
              <div :class="[$style.favoriteAsset]">
                <li
                  v-for="favorite in c_favorite_accounts"
                  :key="favorite.seq"
                  :class="[$style.deal_act]"
                >
                  <template>
                    <div :class="[$style.accountInfo]">
                      <div
                        :class="[
                          {
                            [$style.active]:
                              favorite_accounts.indexOf(favorite.seq) !== -1,
                          },
                          $style['favorite'],
                        ]"
                        @click.prevent.stop="
                          toggleAccountFavorites(favorite.seq)
                        "
                      ></div>
                      <strong :class="[$style.info_title]">
                        {{ favorite.title || $t('no_alias') }}
                      </strong>
                      <p :class="[$style.accountNumberWrap]">
                        <span :class="[$style.accountText]">
                          {{ $t('wallet_page.withdraw_bank_address') }}
                        </span>
                        <span :class="[$style.account_number]">
                          {{ favorite.account_number }}
                        </span>
                        <button
                          class="oncopy marginL-10"
                          @click.prevent.stop="onCopy(favorite.account_number)"
                          >{{ $t('copy') }}</button
                        >
                      </p>
                    </div>
                    <div :class="[$style.money]">
                      <strong :class="[$style.bold]">
                        {{
                          Decimal(favorite.balance).minus(
                            favorite.holding_balance
                          ) | codeDecimal(favorite.asset_code)
                        }}
                      </strong>
                    </div>
                  </template>
                  <div :class="[$style.linksWrap]">
                    <div :class="[$style.links_wrap]">
                      <!-- 입금 -->
                      <a
                        v-if="c_selected_asset.allow_deposit === 'Y'"
                        :class="[$style.deposit_links]"
                        class="background-green"
                        @click="showDepositModal(favorite.seq)"
                      >
                        <div :class="[$style.imgWrap]">
                          <img src="@assets/img/plus_btn.png" />
                        </div>
                        {{ $t('wallet_page.deposit') }}
                      </a>
                      <!-- 출금 -->
                      <a
                        v-if="c_selected_asset.allow_withdraw === 'Y'"
                        :class="[$style.withdraw_links]"
                        class="background-red"
                        @click="showWithdrawModal(favorite.seq)"
                      >
                        <div :class="[$style.imgWrap]">
                          <img src="@assets/img/minus_btn.png" />
                        </div>
                        {{ $t('wallet_page.withdraw') }}
                      </a>
                    </div>
                    <div :class="[$style.accoContent]">
                      <ul>
                        <li>
                          <!-- 입금내역 조회 -->
                          <strong>
                            <a
                              class="links"
                              @click="depositHistoryModal(favorite.seq)"
                              >{{ $t('wallet_page.deposit_list_look') }}</a
                            >
                          </strong>
                        </li>
                        <li>
                          <!-- 출금내역 조회 -->
                          <strong>
                            <a
                              class="links"
                              @click="withdrawHistoryModal(favorite.seq)"
                              >{{ $t('wallet_page.withdraw_list_look') }}</a
                            >
                          </strong>
                        </li>
                        <li>
                          <!-- 계좌 수정 -->
                          <strong>
                            <a
                              class="links"
                              @click="modifyModal(favorite.seq)"
                              >{{ $t('wallet_page.account_modify') }}</a
                            >
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li
                  v-for="active_account in c_active_accounts"
                  :key="active_account.seq"
                  :class="[$style.deal_act]"
                >
                  <template>
                    <div :class="[$style.accountInfo]">
                      <div
                        :class="[
                          {
                            [$style.active]:
                              favorite_accounts.indexOf(active_account.seq) !==
                              -1,
                          },
                          $style['favorite'],
                        ]"
                        @click.prevent.stop="
                          toggleAccountFavorites(active_account.seq)
                        "
                      ></div>
                      <strong :class="[$style.info_title]">
                        {{ active_account.title || $t('no_alias') }}
                      </strong>
                      <p :class="[$style.accountNumberWrap]">
                        <span :class="[$style.accountText]">
                          {{ $t('wallet_page.withdraw_bank_address') }}
                        </span>
                        <span :class="[$style.account_number]">
                          {{ active_account.account_number }}
                        </span>
                        <button
                          class="oncopy marginL-10"
                          @click.prevent.stop="
                            onCopy(active_account.account_number)
                          "
                          >{{ $t('copy') }}</button
                        >
                      </p>
                    </div>
                    <div :class="[$style.money]">
                      <strong :class="[$style.bold]">
                        {{
                          Decimal(active_account.balance).minus(
                            active_account.holding_balance
                          ) | codeDecimal(active_account.asset_code)
                        }}
                      </strong>
                    </div>
                  </template>
                  <div :class="[$style.linksWrap]">
                    <div :class="[$style.links_wrap]">
                      <!-- 입금 -->
                      <a
                        v-if="c_selected_asset.allow_deposit === 'Y'"
                        :class="[$style.deposit_links]"
                        class="background-green"
                        @click="showDepositModal(active_account.seq)"
                      >
                        <div :class="[$style.imgWrap]">
                          <img src="@assets/img/plus_btn.png" />
                        </div>
                        {{ $t('wallet_page.deposit') }}
                      </a>
                      <!-- 출금 -->
                      <a
                        v-if="c_selected_asset.allow_withdraw === 'Y'"
                        :class="[$style.withdraw_links]"
                        class="background-red"
                        @click="showWithdrawModal(active_account.seq)"
                      >
                        <div :class="[$style.imgWrap]">
                          <img src="@assets/img/minus_btn.png" />
                        </div>
                        {{ $t('wallet_page.withdraw') }}
                      </a>
                    </div>
                    <div :class="[$style.accoContent]">
                      <ul>
                        <li>
                          <!-- 입금내역 조회 -->
                          <strong>
                            <a
                              class="links"
                              @click="depositHistoryModal(active_account.seq)"
                              >{{ $t('wallet_page.deposit_list_look') }}</a
                            >
                          </strong>
                        </li>
                        <li>
                          <!-- 출금내역 조회 -->
                          <strong>
                            <a
                              class="links"
                              @click="withdrawHistoryModal(active_account.seq)"
                              >{{ $t('wallet_page.withdraw_list_look') }}</a
                            >
                          </strong>
                        </li>
                        <li>
                          <!-- 계좌 수정 -->
                          <strong>
                            <a
                              class="links"
                              size="mini"
                              @click="modifyModal(active_account.seq)"
                              >{{ $t('wallet_page.account_modify') }}</a
                            >
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <template v-if="asset_seq === 0 || asset_seq === null">
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
                <div
                  v-if="
                    c_active_accounts.length === 0 &&
                      c_favorite_accounts.length === 0 &&
                      c_selected_asset
                  "
                  :class="[$style.dealList]"
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
                </div>
              </div>
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
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul :class="[$style.dealList]">
              <template v-if="c_favorite_accounts.length">
                <div :class="[$style.favoriteAsset]">
                  <li
                    v-for="favorite in c_favorite_accounts"
                    :key="favorite.seq"
                    :class="[$style.deal_act]"
                  >
                    <template>
                      <div :class="[$style.accountInfo]">
                        <div
                          :class="[
                            {
                              [$style.active]:
                                favorite_accounts.indexOf(favorite.seq) !== -1,
                            },
                            $style['favorite'],
                          ]"
                          @click.prevent.stop="
                            toggleAccountFavorites(favorite.seq)
                          "
                        ></div>
                        <strong :class="[$style.info_title]">
                          {{ favorite.title || $t('no_alias') }}
                        </strong>
                        <p :class="[$style.accountNumberWrap]">
                          <span :class="[$style.accountText]">
                            {{ $t('wallet_page.withdraw_bank_address') }}
                          </span>
                          <span :class="[$style.account_number]">
                            {{ favorite.account_number }}
                          </span>
                          <button
                            class="oncopy marginL-10"
                            @click.prevent.stop="
                              onCopy(favorite.account_number)
                            "
                            >{{ $t('copy') }}</button
                          >
                        </p>
                      </div>
                      <div :class="[$style.money]">
                        <strong :class="[$style.bold]">
                          {{
                            Decimal(favorite.balance).minus(
                              favorite.holding_balance
                            ) | codeDecimal(favorite.asset_code)
                          }}
                        </strong>
                      </div>
                    </template>
                    <div :class="[$style.linksWrap]">
                      <div :class="[$style.links_wrap]">
                        <!-- 입금 -->
                        <a
                          v-if="c_selected_asset.allow_deposit === 'Y'"
                          :class="[$style.deposit_links]"
                          class="background-green"
                          @click="showDepositModal(favorite.seq)"
                        >
                          <div :class="[$style.imgWrap]">
                            <img src="@assets/img/plus_btn.png" />
                          </div>
                          {{ $t('wallet_page.deposit') }}</a
                        >
                        <!-- 출금 -->
                        <a
                          v-if="c_selected_asset.allow_withdraw === 'Y'"
                          :class="[$style.withdraw_links]"
                          class="background-red"
                          @click="showWithdrawModal(favorite.seq)"
                        >
                          <div :class="[$style.imgWrap]">
                            <img src="@assets/img/minus_btn.png" />
                          </div>
                          {{ $t('wallet_page.withdraw') }}
                        </a>
                      </div>
                      <div :class="[$style.accoContent]">
                        <ul>
                          <li>
                            <!-- 입금내역 조회 -->
                            <strong>
                              <a
                                class="links"
                                @click="depositHistoryModal(favorite.seq)"
                                >{{ $t('wallet_page.deposit_list_look') }}</a
                              >
                            </strong>
                          </li>
                          <li>
                            <!-- 출금내역 조회 -->
                            <strong>
                              <a
                                class="links"
                                @click="withdrawHistoryModal(favorite.seq)"
                                >{{ $t('wallet_page.withdraw_list_look') }}</a
                              >
                            </strong>
                          </li>
                          <li>
                            <!-- 계좌 수정 -->
                            <strong>
                              <a
                                class="links"
                                size="mini"
                                @click="modifyModal(favorite.seq)"
                                >{{ $t('wallet_page.account_modify') }}</a
                              >
                            </strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </div>
              </template>
              <template v-else>
                <template v-if="asset_seq === 0 || asset_seq === null">
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
                  v-if="c_favorite_accounts.length === 0 && c_selected_asset"
                  :class="[$style.dealList]"
                >
                  <div class="no-list">
                    <div class="img-wrap">
                      <img
                        src="@assets/img/no-list.png"
                        alt="목록 없음 아이콘"
                      />
                    </div>
                    <p :class="[$style.textWrap]">
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

    <!-- 입금 모달창 -->
    <el-dialog
      v-if="c_selected_asset"
      :title="$t('wallet_page.deposit_apply')"
      :class="[$style.depositModal]"
      :visible.sync="deposit_modal"
      :append-to-body="true"
      @close="deposit_modal = null"
    >
      <DepositForm
        v-if="deposit_modal"
        :account_seq="target_account_seq"
        :asset_seq="asset_seq"
        @modal_close="deposit_modal = null"
      ></DepositForm>
    </el-dialog>

    <!-- 출금 모달창 -->
    <el-dialog
      v-if="c_selected_asset"
      :title="$t('wallet_page.withdraw')"
      :class="[$style.withdrawModal]"
      :visible.sync="withdraw_modal"
      :append-to-body="true"
      @close="withdraw_modal = null"
    >
      <WithdrawForm
        v-if="withdraw_modal"
        :account_seq="target_account_seq"
        :asset_seq="asset_seq"
        @modal_close="withdraw_modal = null"
      ></WithdrawForm>
    </el-dialog>

    <!-- 입금내역 조회 -->
    <el-dialog
      :title="$t('wallet_page.deposit_list_look')"
      :visible.sync="deposit_inquiry_modal"
      width="50%"
      :append-to-body="true"
      :class="([$style.depositInquiryModal], [$style.modal])"
    >
      <AccountDepositList
        v-if="deposit_inquiry_modal"
        :deposit_seq="target_account_seq"
      >
      </AccountDepositList>
    </el-dialog>

    <!-- 출금내역 조회 -->
    <el-dialog
      :title="$t('wallet_page.withdraw_list_look')"
      :visible.sync="withdraw_inquiry_modal"
      width="50%"
      :append-to-body="true"
      :class="([$style.withdrawInquiryModal], [$style.modal])"
    >
      <AccountWithdrawList
        v-if="withdraw_inquiry_modal"
        :withdraw_seq="target_account_seq"
      >
      </AccountWithdrawList>
    </el-dialog>

    <!-- 계좌 수정 -->
    <el-dialog
      :title="$t('wallet_page.account_modify')"
      :visible.sync="modify_modal"
      width="50%"
      :append-to-body="true"
      :class="([$style.modifyModal], [$style.modal])"
    >
      <div :class="[$style.tableWrap]">
        <div :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.account_seq') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? c_target_account_info.address_seq
                : $t('auto_input')
            }}
          </div>
        </div>
        <div :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.withdraw_bank_address') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? c_target_account_info.account_number
                : $t('auto_input')
            }}
          </div>
        </div>
        <div :class="([$style.row], [$style.inputRow])">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.account_title') }}
          </div>
          <div :class="[$style.tableBody]">
            <el-input
              v-model="account_title"
              :placeholder="$t('wallet_page.input_account')"
            />
          </div>
        </div>
        <div :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.regdate') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? date('Y-m-d H:i:s', new Date(c_target_account_info.regdate))
                : $t('wallet_page.before_regdate')
            }}
          </div>
        </div>
        <div v-if="target_account_seq !== null" :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.holding_balance') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? c_target_account_info.holding_balance
                : $t('auto_input')
            }}
          </div>
        </div>
        <div :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('status') }}
          </div>
          <div :class="[$style.tableBody]">
            {{
              c_target_account_info
                ? c_target_account_info.status
                : $t('auto_input')
            }}
          </div>
        </div>
        <div v-if="c_selected_asset !== null" :class="[$style.row]">
          <div :class="[$style.tableHead]">
            {{ $t('wallet_page.select_asset') }}
          </div>
          <div :class="[$style.tableBody]">{{ c_selected_asset.code }}</div>
        </div>

        <div class="btn-wrap btn-right">
          <button
            v-if="target_account_seq === null"
            :class="[$style.createBtn]"
            @click="handleCreate"
            >{{ $t('wallet_page.create') }}</button
          >
          <button v-else :disabled="!account_title" @click="handleUpdate">
            {{ $t('modify') }}
          </button>
          <a class="btn-grey marginL-10" @click="modify_modal = false">{{
            $t('cancel')
          }}</a>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
@import '@src/design/account-list.scss';
@import '@src/design/modal.scss';
</style>

<style scoped>
.no-list .img-wrap.img-size img {
  width: 70%;
}

.btn-wrap a.btn-grey {
  padding: 5.6px 20px;
}
</style>
