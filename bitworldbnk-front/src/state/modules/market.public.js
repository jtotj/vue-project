import {
  fetchPublicMarkets,
  fetchPublicMarket,
  fetchPublicOpenOrders,
  fetchPublicAggtrades,
  fetchPublicKlines,
} from '@apis/market'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import extend from 'lodash/extend'
import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'
import map from 'lodash/map'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
// import Vue from 'vue'
import Decimal from 'decimal.js'

export const state = {
  markets: [],
  open_orders: [],
  balances: [],
  s_market_seq: null,
}

async function arrangeMarketInfo(market_info) {
  let ret_obj = { ...market_info }

  const [{ data: aggtrades }, { data: klines }] = await Promise.all([
    fetchPublicAggtrades({ market_seq: market_info.seq, limit: 1 }),
    fetchPublicKlines({
      market_seq: market_info.seq,
      interval_type: '1D',
      limit: 2,
    }),
  ])

  let [yesterday, today] = klines

  if (today && new Date(today.close_time).getTime() < Date.now()) {
    yesterday = today
    today = null
  }

  const last_aggtrade = aggtrades.pop()

  ret_obj.ticker = {
    price: last_aggtrade ? last_aggtrade.price : null,
    today_high: today ? today.high : null,
    today_low: today ? today.low : null,
    today_open: today ? today.open : null,
    today_close: today ? today.close : null,
    today_volume: today ? today.volume : null,
    today_target_volume: today ? today.target_volume : null,
    yesterday_high: yesterday ? yesterday.high : null,
    yesterday_low: yesterday ? yesterday.low : null,
    yesterday_open: yesterday ? yesterday.open : null,
    yesterday_close: yesterday ? yesterday.close : null,
  }

  if (ret_obj.ticker.price && ret_obj.ticker.yesterday_close) {
    ret_obj.ticker.yesterday_vs = new Decimal(ret_obj.ticker.price)
      .minus(ret_obj.ticker.yesterday_close)
      .toString()
    ret_obj.ticker.yesterday_vs_rate = new Decimal(ret_obj.ticker.yesterday_vs)
      .div(ret_obj.ticker.yesterday_close)
      .mul(100)
      .abs()
      .toString()
    ret_obj.ticker.yesterday_vs_sign = new Decimal(
      ret_obj.ticker.yesterday_vs
    ).eq(0)
      ? ''
      : new Decimal(ret_obj.ticker.yesterday_vs).lt(0)
      ? '-'
      : '+'
    ret_obj.ticker.yesterday_vs_updown = new Decimal(
      ret_obj.ticker.yesterday_vs
    ).eq(0)
      ? ''
      : new Decimal(ret_obj.ticker.yesterday_vs).lt(0)
      ? 'down'
      : 'up'
    ret_obj.ticker.yesterday_vs = Decimal.abs(
      ret_obj.ticker.yesterday_vs
    ).toString()
  } else {
    ret_obj.ticker.yesterday_vs = '0'
    ret_obj.ticker.yesterday_vs_rate = ''
    ret_obj.ticker.yesterday_vs_updown = ''
  }

  return ret_obj
}

export const mutations = {
  SET_MARKETS(state, newValue) {
    state.markets = newValue
  },
  SET_MARKET(state, newValue) {
    if (!newValue) return

    const index = findIndex(state.markets, { seq: newValue.seq })
    if (!index) return

    state.markets[index] = newValue
  },
  ADD_OPEN_ORDER(state, data) {
    state.open_orders.push(data)
  },
  SET_OPEN_ORDERS(state, newValue) {
    state.open_orders = newValue
  },
  REMOVE_OPEN_ORDER(state, seq) {
    const idx = findIndex(state.open_orders, { seq })

    state.open_orders.splice(idx, 1)
  },
  SET_OPEN_ORDER(state, data) {
    const idx = findIndex(state.open_orders, { seq: data.seq })

    extend(state.open_orders[idx], data)
  },
  SET_BALANCES(state, newValue) {
    state.balances = newValue
  },
  SET_BALANCE(state, newValue) {
    if (!newValue) return

    const index = findIndex(state.balances, { seq: newValue.seq })
    if (!index) return

    state.balances[index] = newValue
  },
  SET_S_MARKET_SEQ(state, newValue) {
    state.s_market_seq = newValue
  },
}

export const getters = {
  s_market_info({ markets, s_market_seq }) {
    if (!markets.length) return null

    return find(markets, { seq: s_market_seq }) || markets[0]
  },
  s_open_orders({ s_market_seq }, { open_orders, s_market_info }) {
    if (!s_market_info) return []

    return filter(open_orders, {
      market_seq: s_market_info.seq,
    }).reverse()
  },
  open_orders({ open_orders, markets }) {
    return open_orders.map((val) => {
      const market_info = defaults(find(markets, { seq: val.market_seq }), {
        code: '',
        title: null,
      })
      return {
        ...val,
        market_code: market_info.code,
        market_title: market_info.title,
      }
    })
  },
  target_assets({ markets }) {
    return map(
      uniqBy(markets, 'target_asset_seq'),
      ({
        target_asset_seq: asset_seq,
        target_asset_title: asset_title,
        target_asset_code: asset_code,
      }) => ({ asset_seq, asset_title, asset_code })
    )
  },
}

export const actions = {
  init({ dispatch }) {
    // dispatch('getMarkets').catch((e) => Vue.toasted.error(e.message))
  },
  loggedInInit({ dispatch }) {
    // dispatch('getOpenOrders').catch((e) => Vue.toasted.error(e.message))
  },
  async getOpenOrders({ commit }) {
    const { data } = await fetchPublicOpenOrders()

    commit('SET_OPEN_ORDERS', data)
    return data
  },
  async getMarkets({ commit }) {
    const { data } = await fetchPublicMarkets()
    const markets = await Promise.all(
      map(data, async (market) => arrangeMarketInfo(market))
    )

    commit('SET_MARKETS', markets)
    return markets
  },
  async getMarket({ commit }, seq) {
    const { market_info } = await fetchPublicMarket(seq)

    commit('SET_MARKET', await arrangeMarketInfo(market_info))
    return market_info
  },
  async socket_publicMarketOrder({ commit }, data) {
    commit('ADD_OPEN_ORDER', data)
  },
  async socket_publicMarketOrderStatusUpdate({ commit }, data) {
    if (['CANCELED', 'FILLED'].indexOf(data.status) !== -1) {
      return commit('REMOVE_OPEN_ORDER', data.seq)
    }

    commit('SET_OPEN_ORDER', pick(data, 'seq', 'status'))
  },
  async socket_publicMarketBalanceUpdate({ commit }, data) {
    commit('SET_BALANCE', pick(data, 'seq', 'amount'))
  },
  async selectMarket({ commit }, market_seq) {
    commit('SET_S_MARKET_SEQ', market_seq)
  },
}
