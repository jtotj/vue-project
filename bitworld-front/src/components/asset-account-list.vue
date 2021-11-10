<script>
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import assetSelector from '@components/asset-selector'

export default {
  components: {
    assetSelector,
  },
  data() {
    return {
      asset_menu: false,
      search_target_asset: 0,
      search_target_account: null,
      input_target_account: '',
    }
  },

  computed: {
    ...mapState('account', ['accounts']),

    filterAccounts() {
      return filter(
        this.accounts,
        (account) =>
          account.asset_seq === this.search_target_asset &&
          (!this.input_target_account ||
            account.title
              .toLowerCase()
              .includes(this.input_target_account.toLowerCase()) ||
            account.account_number.includes(this.input_target_account))
      )
    },
  },
  watch: {
    search_target_account() {
      this.handleValueChange()
    },
  },
  methods: {
    selecteAccount(seq) {
      this.search_target_account = seq
      this.handleValueChange()
      this.$router.push({
        query: {
          account_seq: seq,
        },
      })
    },
    assetMenu() {
      this.asset_menu = !this.asset_menu
      this.search_target_account = null
    },
    handleValueChange() {
      this.$emit('input', this.search_target_account)
    },
    resetBtn() {
      this.$router.replace({ query: null })
    },
    leaveCancelled(el) {
      el.style.height = 1000 + 'px'
    },
  },
}
</script>

<template>
  <div>
    <div :class="[$style.tradesWrap]">
      <div :class="[$style.searchButtonWrap]">
        <el-button
          v-if="this.$route.query.account_seq !== undefined"
          @click="resetBtn"
        >
          {{ $t('account_transfer.reset') }}
        </el-button>
        <el-button @click="assetMenu">{{ $t('detail_search') }}</el-button>
      </div>

      <transition name="slide" @leave-cancelled="leaveCancelled">
        <div v-if="asset_menu" :class="[$style.tradesBox]">
          <!-- 자산별 검색 -->
          <div :class="[$style.tradesLeft]">
            <p :class="[$style.tradesHead]">
              {{ $t('account_transfer.search_transfer_asset') }}
            </p>
            <assetSelector v-model="search_target_asset" />
          </div>
          <div :class="[$style.tradesRight]">
            <p :class="[$style.tradesHead]">
              {{ $t('account_transfer.search_transfer_account') }}
            </p>
            <div :class="[$style.accountList]">
              <div :class="[$style.account_search]">
                <input
                  v-model="input_target_account"
                  type="text"
                  :placeholder="$t('account_transfer.pls_search_account')"
                  :class="[$style.input_account_search]"
                />
              </div>
              <PerfectScrollbar>
                <ul :class="[$style.dealList]">
                  <template>
                    <div :class="[$style.favoriteAccount]">
                      <li
                        v-for="account in filterAccounts"
                        :key="account.seq"
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
                          <strong :class="[$style.info_title]">
                            {{ account.title }}
                          </strong>
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
                    </div>
                  </template>
                  <template
                    v-if="search_target_asset && filterAccounts.length === 0"
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
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/asset-account-list.scss';
</style>
<style scoped>
.slide-enter-active {
  transition: all 0.5s ease;
}
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
