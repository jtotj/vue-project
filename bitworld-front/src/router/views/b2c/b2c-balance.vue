<script>
import {
  createPublicBalanceTransfer,
  fetchPublicBalanceList,
} from '@apis/market'
import '@assets/css/b2c/b2c-balance.css'
import find from 'lodash/find'
import filter from 'lodash/filter'
import { mapState } from 'vuex'
export default {
  page: {
    title: 'b2c-balance',
    meta: [{ name: 'description', content: 'b2c-balance' }],
  },
  data() {
    return {
      active_tab: 'deposit',
      options: [
        {
          value: 'Top ethereum 20200423-1-2-66503',
          label: 'Top ethereum 20200423-1-2-66503',
        },
        {
          value: 'Top ethereum 20200423-1-2-66506',
          label: 'Top ethereum 20200423-1-2-66506',
        },
        {
          value: 'BTC/CCF',
          label: 'BTC/CCF',
        },
        {
          value: 'USDT/CCF',
          label: 'USDT/CCF',
        },
        {
          value: 'ETH/CCF',
          label: 'ETH/CCF',
        },
        {
          value: 'EOS/CCF',
          label: 'EOS/CCF',
        },
        {
          value: 'USDK/CCF',
          label: 'USDK/CCF',
        },
      ],
      params: {},
      balance_list: [],
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('marketPublic', ['markets']),
    c_selected_account_info() {
      if (!this.params.account_seq) return null
      return find(this.accounts, { seq: this.params.account_seq })
    },
    c_selected_market_info() {
      if (!this.params.market_seq) return null
      return find(this.markets, { seq: this.params.market_seq })
    },
    c_selected_market_balance_info() {
      if (!this.params.market_seq) return null
      return find(this.balance_list, { market_seq: this.params.market_seq })
    },
    c_available_market_list() {
      if (!this.params.account_seq) return this.c_active_market_list
      return filter(this.c_active_market_list, {
        source_asset_seq: this.c_selected_account_info.asset_seq,
      })
    },
    c_available_account_list() {
      if (!this.params.market_seq) return this.accounts
      return filter(this.accounts, {
        asset_seq: this.c_selected_market_info.source_asset_seq,
      })
    },
    c_active_market_list() {
      if (!this.markets.length) return []
      return filter(this.markets, { is_active: 'Y' })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([this.loadPublicBalanceList()]).catch((e) =>
        this.$toasted.error(e.message)
      )
    },
    async loadPublicBalanceList() {
      const { data } = await fetchPublicBalanceList()
      this.balance_list = data
    },
    handleCreateBalanceTransfer() {
      this.active_tab === 'deposit'
        ? (this.params.transfer_type = 'DEPOSIT')
        : (this.params.transfer_type = 'WITHDRAW')
      createPublicBalanceTransfer(this.params)
        .then(() => {
          this.$toasted.success(
            this.active_tab === 'deposit'
              ? this.$t('market_balance.deposit_successful')
              : this.$t('market_balance.wthdrawal_successful')
          )
        })
        .then(() => Promise.all([this.init(), this.resetParams()]))
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => this.$toasted.error(e.message))
    },
    resetParams() {
      this.params = {}
    },
  },
}
</script>

<template>
  <div>
    <section :class="[$style.balanceMain]" class="balance-main">
      <div :class="[$style.transferBox]">
        <h3 class="title">{{ $t('market_balance_transfer') }}</h3>
        <el-tabs v-model="active_tab" type="card" @tab-click="resetParams">
          <el-tab-pane :label="$t('market_balance.deposit')" name="deposit">
            <el-select
              v-model="params.account_seq"
              filterable
              :placeholder="$t('market_balance.select_account')"
            >
              <el-option
                v-for="account in accounts"
                :key="account.seq"
                :label="account.title || account.account_number"
                :value="account.seq"
              >
                {{ account.title || account.account_number }}
                {{ account.asset_title }}
              </el-option>
            </el-select>
            <div
              v-if="params.account_seq"
              class="select-account-wrap"
              :class="$style.clear"
            >
              <p :class="$style.floatL">{{ $t('market_balance.assets') }}</p>
              <p :class="$style.floatR">{{
                c_selected_account_info.balance
              }}</p>
            </div>
            <p><img src="@assets/img/b2c/down_arrow.svg" alt="down arrow"/></p>
            <el-select
              v-model="params.market_seq"
              :disabled="c_selected_account_info === null"
              :placeholder="
                !c_selected_account_info
                  ? $t('account_transfer.select_account_first')
                  : $t('market_balance.select_market')
              "
            >
              <el-option
                v-for="market in c_available_market_list"
                :key="market.seq"
                :label="market.title"
                :value="market.seq"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="params.amount"
              :placeholder="$t('market_balance.quantity')"
            ></el-input>
            <el-button
              style="margin-top:10px;"
              @click.prevent="handleCreateBalanceTransfer"
              >{{ $t('market_balance.confirm') }}</el-button
            >
          </el-tab-pane>
          <el-tab-pane :label="$t('market_balance.withdrawal')" name="withdraw">
            <el-select
              v-model="params.market_seq"
              filterable
              :placeholder="$t('market_balance.select_market')"
            >
              <el-option
                v-for="market in c_active_market_list"
                :key="market.seq"
                :label="market.title"
                :value="market.seq"
              >
              </el-option>
            </el-select>
            <p
              v-if="c_selected_market_balance_info && active_tab === 'withdraw'"
              >{{ c_selected_market_balance_info.amount }}</p
            >
            <p><img src="@assets/img/b2c/down_arrow.svg" alt="down arrow"/></p>
            <el-select
              v-model="params.account_seq"
              :disabled="c_selected_market_info === null"
              :placeholder="
                !c_selected_market_info
                  ? $t('account_transfer.select_market_first')
                  : $t('market_balance.select_account')
              "
            >
              <el-option
                v-for="account in c_available_account_list"
                :key="account.seq"
                :label="account.title || account.account_number"
                :value="account.seq"
              >
                {{ account.title || account.account_number }}
                {{ account.asset_title }}
              </el-option>
            </el-select>
            <el-input
              v-model="params.amount"
              :placeholder="$t('market_balance.quantity')"
            ></el-input>
            <el-button
              style="margin-top:10px;"
              @click.prevent="handleCreateBalanceTransfer"
              >{{ $t('market_balance.confirm') }}</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/common.scss';
@import '@src/design/b2c/b2c.scss';
</style>
