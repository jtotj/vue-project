<script>
import CoinList from '@components/b2c/b2c-coin-list'
import { mapGetters } from 'vuex'
export default {
  components: { CoinList },
  props: {
    chart_type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      search_coin: '',
      change_asset_title: false,
      sort_order: '',
      order_type: 'DESC',
      s_target_asset: 'ALL',
    }
  },
  computed: {
    ...mapGetters('marketPublic', ['s_market_info', 'target_assets']),
    c_filters() {
      const obj = {}

      if (this.s_target_asset !== 'ALL') {
        obj.target_asset_seq = this.s_target_asset * 1
      }

      return obj
    },
  },
  methods: {
    changeSort(sort_order) {
      if (sort_order !== this.sort_order) {
        this.order_type = 'DESC'
      } else {
        this.order_type = this.order_type === 'DESC' ? 'ASC' : 'DESC'
      }

      this.sort_order = sort_order
    },
  },
}
</script>
<template>
  <div>
    <div :class="$style.favoriteCoin">
      <div :class="[$style.searchArea]">
        <form :class="[$style.inputBox]">
          <input
            v-model="search_coin"
            type="text"
            :placeholder="$t('b2c_exchange.coin_name_and_symbol_search')"
          />
          <img src="@src/assets/img/b2c/search.png" alt="search" />
        </form>
      </div>
      <!-- //검색 -->
      <el-tabs v-model="s_target_asset" :stretch="true">
        <el-tab-pane name="ALL" :label="$t('b2c_exchange.event')">
        </el-tab-pane>
        <el-tab-pane
          v-for="target_asset in target_assets"
          :key="target_asset.asset_seq"
          :name="target_asset.asset_seq"
          :label="target_asset.asset_code"
        >
        </el-tab-pane>
      </el-tabs>
      <div
        :class="[
          chart_type === 'basicChart' ? $style.favoriteCoinBodyLonger : '',
          $style.favoriteCoinBody,
        ]"
      >
        <table>
          <colgroup>
            <col width="10%" />
            <col width="21%" />
            <col width="23%" />
            <col width="23%" />
            <col width="23%" />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th
                :class="$style.textL"
                @click="change_asset_title = !change_asset_title"
              >
                {{
                  change_asset_title
                    ? $t('Coin_name')
                    : $t('b2c_exchange.market_name')
                }}
                <img
                  src="@src/assets/img/b2c/icon_change_language.svg"
                  alt="change language"
                />
              </th>
              <th
                :data-sort="sort_order === 'price' ? order_type : ''"
                @click="changeSort('price')"
              >
                {{ $t('b2c_exchange.present_price') }}
                <div
                  :class="[
                    $style.upDownButton,
                    {
                      [$style.activeUp]:
                        sort_order === 'price' && order_type === 'DESC',
                    },
                    {
                      [$style.activeDown]:
                        sort_order === 'price' && order_type === 'ASC',
                    },
                  ]"
                >
                  <div :class="[$style.upBtn]"></div>
                  <div :class="[$style.downBtn]"></div>
                </div>
              </th>
              <th
                :data-sort="
                  sort_order === 'yesterday_vs_updown' ? order_type : ''
                "
                @click="changeSort('yesterday_vs_updown')"
              >
                {{ $t('b2c_exchange.compared_to_the_previous_day') }}
                <div
                  :class="[
                    $style.upDownButton,
                    {
                      [$style.activeUp]:
                        sort_order === 'yesterday_vs_updown' &&
                        order_type === 'DESC',
                    },
                    {
                      [$style.activeDown]:
                        sort_order === 'yesterday_vs_updown' &&
                        order_type === 'ASC',
                    },
                  ]"
                >
                  <div :class="[$style.upBtn]"></div>
                  <div :class="[$style.downBtn]"></div>
                </div>
              </th>
              <th
                :data-sort="sort_order === 'today_volume' ? order_type : ''"
                @click="changeSort('today_volume')"
              >
                {{ $t('b2c_exchange.volume') }}
                <div
                  :class="[
                    $style.upDownButton,
                    {
                      [$style.activeUp]:
                        sort_order === 'today_volume' && order_type === 'DESC',
                    },
                    {
                      [$style.activeDown]:
                        sort_order === 'today_volume' && order_type === 'ASC',
                    },
                  ]"
                >
                  <div :class="[$style.upBtn]"></div>
                  <div :class="[$style.downBtn]"></div>
                </div>
              </th>
            </tr>
          </thead>
        </table>
        <CoinList
          :search_coin="search_coin"
          :change_asset_title="change_asset_title"
          :sort_order="sort_order"
          :order_type="order_type"
          :filters="c_filters"
        />
      </div>
    </div>
    <!-- //코인 심볼 검색 -->
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/b2c-exchange.scss';
@import '@src/design/b2c/common.scss';
</style>
