<script>
import '@assets/css/icon.css'
import Decimal from 'decimal.js'
import assetDecimal from '@utils/asset-decimal'
import date from 'locutus/php/datetime/date'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'
import { fetchDirectMarkets, createDirectTransfer } from '@apis/market'

export default {
  data() {
    return {
      selected_asset_seq: Number(this.$route.query.asset_seq) || null,
      search_keyword_asset: '',
      favorite_assets: [],
      market_modal: false,
      account_modal: false,
      account_title: '',
      direct_market_list: [],

      select_market_source_asset: null,
      params: {},
      market_trade_modal: false,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    ...mapState('auth', ['otps']),
    ...mapState('auth', ['currentUser']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    cs_market() {
      if (!this.params.market_seq) return null

      return find(this.c_active_market, {
        seq: this.params.market_seq,
      })
    },
    c_select_source_account() {
      return find(this.accounts, { seq: this.params.source_account_seq })
    },
    c_select_target_account() {
      return find(this.accounts, { seq: this.params.target_account_seq })
    },
    c_exchange_rate() {
      if (!this.cs_market) return 0

      return this.calcSpread(this.cs_market, this.params.transfer_type)
    },

    c_target_accounts() {
      if (!this.cs_market) return []

      return filter(this.accounts, {
        asset_seq: this.cs_market.target_asset_seq,
      })
    },

    c_source_accounts() {
      if (!this.cs_market) return []

      return filter(this.accounts, {
        asset_seq: this.cs_market.source_asset_seq,
      })
    },
    c_target_amount() {
      if (!this.params.source_amount) return null

      return assetDecimal(this.cs_market.target_asset_seq, this.c_exchange_rate)
        .mul(this.params.source_amount)
        .toString()
    },
    c_active_asset() {
      return filter(
        this.assets,
        (asset_info) =>
          asset_info.asset_seq === this.asset_seq &&
          !find(this.c_favorite_assets, { seq: asset_info.seq }) &&
          (!this.search_keyword_asset ||
            asset_info.code
              .toLowerCase()
              .includes(this.search_keyword_asset.toLowerCase()) ||
            asset_info.title.includes(this.search_keyword_asset)) &&
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
      const assets = filter(
        uniq(
          map(this.favorite_assets, (value) =>
            find(this.assets, { seq: value })
          )
        ).filter(
          (favorite_assets) => favorite_assets.asset_seq === this.asset_seq
        ),
        (asset_info) =>
          !this.search_keyword_asset ||
          asset_info.code
            .toLowerCase()
            .includes(this.search_keyword_asset.toLowerCase()) ||
          (asset_info.title.includes(this.search_keyword_asset) &&
            asset_info.is_active === 'Y')
      )
      return assets
    },
    c_source_selected_market() {
      return filter(this.c_active_market, {
        source_asset_seq: this.select_market_source_asset,
      })
    },
    c_active_market() {
      return filter(this.direct_market_list, { is_active: 'Y' })
    },
  },
  watch: {
    '$attrs.value'(to) {
      this.selected_asset_seq = to
    },
  },
  mounted() {
    this.loadDirectMarketList()

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
    async loadDirectMarketList() {
      const { data } = await fetchDirectMarkets().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.direct_market_list = data
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
    goDepositList(p) {
      if (this.$route.path.indexOf('bank') !== -1) {
        this.$router.push({
          name: 'deposit',
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
          name: 'withdraw',
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
    openMarketModal(seq) {
      this.select_market_source_asset = seq
      if (this.c_source_selected_market.length) this.market_modal = true
      else this.$toasted.show(this.$t('business.no_trade'))
    },

    handleSubmitTransfer() {
      createDirectTransfer(this.params)
        .then(() => {
          this.$notify({
            title: this.$t('toasted_msg.title'),
            message: this.$t('toasted_msg.exchange'),
            type: 'success',
          })
          this.market_trade_modal = false
        })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.$router.push({
            name: 'exchange-success',
          })
        })
    },
    onCopy() {
      this.$toasted.info(this.$t('toasted_msg.copy'))
    },
    assetDecimal,
    Decimal,
    handleCreateTransfer(market_seq, transfer_type) {
      this.resetParams()
      this.params.market_seq = market_seq
      this.params.transfer_type = transfer_type
      this.market_trade_modal = true
    },
    resetParams() {
      this.params = {
        market_seq: null,
        source_account_seq: null,
        target_account_seq: null,
        source_amount: 0,
        transfer_type: null,
      }
    },
    calcSpread(market, type) {
      const basic_rate = assetDecimal(
        market.target_asset_seq,
        market.basic_rate
      )
      const bid_spread_rate = new Decimal(market.bid_spread_rate)
      const ask_spread_rate = new Decimal(market.ask_spread_rate)

      switch (type) {
        case 'BID':
          return basic_rate.mul(bid_spread_rate.div(100).plus(1))
        case 'ASK':
          return basic_rate.mul(ask_spread_rate.div(-100).plus(1))
        default:
          break
      }
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
        <div class="fixedValue">
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul>
              <template v-for="favorite in c_favorite_assets">
                <li
                  :key="favorite.seq"
                  :class="[
                    {
                      [$style.selected]: selected_asset_seq === favorite.seq,
                    },
                    $style.coinList,
                  ]"
                  @click="selectAsset(favorite.seq)"
                >
                  <p :class="`${favorite.code}`"></p>
                  <span>{{ favorite.code }}</span>
                  <!-- 환전 버튼 -->
                  <div class="exchange">
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
                    <button
                      v-if="$route.name === 'money'"
                      class="btn-small-common"
                      @click="openMarketModal(favorite.seq)"
                    >
                      {{ $t('exchange') }}
                    </button>
                  </div>
                </li>
              </template>
              <template v-for="asset in c_active_asset">
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
                  <!-- 환전 버튼 -->
                  <div class="exchange">
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
                    <button
                      v-if="$route.name === 'money'"
                      class="btn-small-common"
                      @click="openMarketModal(asset.seq)"
                    >
                      {{ $t('exchange') }}
                    </button>
                  </div>
                </li>
              </template>
            </ul>
          </PerfectScrollbar>
        </div>
        <div
          v-if="c_active_asset.length === 0 && c_favorite_assets.length === 0"
          class="no-list"
        >
          <div class="img-wrap">
            <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
          </div>
          <p>
            {{ $t('no_list') }}
          </p>
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

    <!-- 환전 모달창 -->
    <el-dialog
      :title="$t('exchange')"
      :visible.sync="market_modal"
      :append-to-body="true"
      class="exchange-modal"
    >
      <ul>
        <li
          v-for="market in c_source_selected_market"
          :key="market.seq"
          class="exchange-list"
        >
          <div :class="[$style.infoWrap]">
            <div :class="[$style.title]">
              <div :class="[$style.coinItem]">
                <span
                  :class="`img-wrap coin-item ${market.source_asset_code}`"
                ></span>
              </div>
              <span :class="[$style.code]"
                >{{ market.source_asset_code }}/{{
                  market.target_asset_code
                }}</span
              >
            </div>
            <div :class="[$style.exchangeRate]">
              <ul>
                <li :class="[$style.shortList]">
                  <span>{{ $t('private.buy_calc_spread') }}</span>
                  {{
                    calcSpread(market, 'BID')
                      | codeDecimal(market.target_asset_code)
                  }}
                  {{ market.target_asset_code }}</li
                >
                <li>
                  <span>{{ $t('private.sell_calc_spread') }}</span>
                  {{
                    calcSpread(market, 'ASK')
                      | codeDecimal(market.target_asset_code)
                  }}
                  {{ market.target_asset_code }}</li
                >
              </ul>
            </div>
            <div :class="[$style.exchangeBox]">
              <div :class="[$style.amountWrap]">
                <strong :class="[$style.amount]"
                  >{{
                    assetDecimal(market.target_asset_seq, market.basic_rate)
                      | codeDecimal(market.target_asset_code)
                  }}
                  {{ market.target_asset_code }}</strong
                >
              </div>
              <div class="btn-wrap">
                <button
                  v-if="market.allow_bid === 'Y'"
                  class="btn-green"
                  @click="handleCreateTransfer(market.seq, 'BID')"
                  >{{ $t('buy') }}</button
                >
                <button
                  v-else
                  class="btn-green"
                  @click="$toasted.error($t('toasted_msg.not_allow_trade'))"
                  >{{ $t('buy') }}</button
                >
                <button
                  v-if="market.allow_ask === 'Y'"
                  class="btn-red marginL-10"
                  @click="handleCreateTransfer(market.seq, 'ASK')"
                  >{{ $t('sell') }}</button
                >
                <button
                  v-else
                  class="btn-red marginL-10"
                  @click="$toasted.error($t('toasted_msg.not_allow_trade'))"
                  >{{ $t('sell') }}</button
                >
              </div>
            </div>
          </div>
        </li>
      </ul>
    </el-dialog>

    <el-dialog
      :visible.sync="market_trade_modal"
      :title="$t('private.direct_market')"
      :append-to-body="true"
    >
      <el-form v-if="cs_market" @submit.prevent="handleSubmitTransfer">
        <el-form-item :label="$t('private.cs_market_asset')">
          {{ cs_market.source_asset_code }}/{{ cs_market.target_asset_code }}
        </el-form-item>
        <el-form-item :label="$t('private.cs_market_basic_rate')">
          1 {{ cs_market.source_asset_code }} =
          {{
            assetDecimal(cs_market.target_asset_seq, cs_market.basic_rate)
              | codeDecimal(cs_market.target_asset_code)
          }}
          {{ cs_market.target_asset_code }}
        </el-form-item>
        <el-form-item :label="$t('private.transfer_type')">
          <el-radio-group v-model="params.transfer_type">
            <ElRadioButton
              v-for="val in constants.market.direct_transfer.transfer_type"
              :key="val[0]"
              :label="val[0]"
            >
              {{ val[1] }}</ElRadioButton
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('private.exchange_rate')">
          {{ c_exchange_rate | codeDecimal(cs_market.target_asset_code) }}
        </el-form-item>
        <el-form-item
          :label="`${cs_market.target_asset_code} ${$t('account')}`"
        >
          <el-select
            v-model="params.target_account_seq"
            :placeholder="$t('select')"
          >
            <el-option
              v-for="account in c_target_accounts"
              :key="account.seq"
              :value="account.seq"
              :label="
                account.title.length ? account.title : account.account_number
              "
            ></el-option>
          </el-select>
          <p v-if="c_select_target_account" class="s_balance"
            >{{ c_select_target_account.code }} {{ $t('balance') }}:
            {{
              Decimal(c_select_target_account.balance).minus(
                c_select_target_account.holding_balance
              ) | codeDecimal(c_select_target_account.code)
            }}</p
          >
        </el-form-item>
        <el-form-item
          :label="`${cs_market.source_asset_code} ${$t('account')}`"
        >
          <el-select
            v-model="params.source_account_seq"
            :placeholder="$t('select')"
          >
            <el-option
              v-for="account in c_source_accounts"
              :key="account.seq"
              :value="account.seq"
              :label="
                account.title.length ? account.title : account.account_number
              "
            ></el-option>
          </el-select>
          <p v-if="c_select_source_account" class="s_balance"
            >{{ c_select_source_account.code }} {{ $t('balance') }}:
            {{
              Decimal(c_select_source_account.balance).minus(
                c_select_source_account.holding_balance
              ) | codeDecimal(c_select_source_account.code)
            }}</p
          >
        </el-form-item>
        <el-form-item :label="$t('private.direct_source_amount')">
          <el-input v-model="params.source_amount">
            <template slot="prepend">
              <i
                v-if="params.transfer_type === 'ASK'"
                class="el-icon-minus"
              ></i>
              <i v-else class="el-icon-plus"></i>
            </template>
            <template slot="append">
              {{ cs_market.source_asset_code }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('private.direct_target_amount')">
          <el-input disabled :value="c_target_amount">
            <template slot="prepend">
              <i
                v-if="params.transfer_type === 'BID'"
                class="el-icon-minus"
              ></i>
              <i v-else class="el-icon-plus"></i>
            </template>
            <template slot="append">
              {{ cs_market.target_asset_code }}
            </template>
          </el-input>
        </el-form-item>
        <div class="btn-wrap btn-right">
          <button @click="handleSubmitTransfer">{{
            $t('private.submit_transfer')
          }}</button>
          <a class="btn-grey marginL-10" @click="market_trade_modal = false">{{
            $t('cancel')
          }}</a>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
@import '@src/design/asset-selector.scss';
</style>

<style scoped>
.exchange-modal ul li.exchange-list {
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 10px;
  border: 1px solid #e5e5e5;
}
.fixedValue .exchange {
  float: right;
}

.btn-grey {
  padding: 5.6px 20px;
}
</style>
