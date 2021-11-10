import { fetchList } from '@apis/account'
import findIndex from 'lodash/findIndex'
import pick from 'lodash/pick'
import extend from 'lodash/extend'

export const state = {
  accounts: [],
}
export const mutations = {
  SET_ACCOUNT_LIST(state, newValue) {
    state.accounts = newValue
  },

  SET_ACCOUNT(state, data) {
    const idx = findIndex(state.accounts, { seq: data.seq })

    extend(state.accounts[idx], data)
  },
}

export const actions = {
  async getAccounts({ commit }) {
    const { data } = await fetchList({
      no_paging: 1,
    })
    commit('SET_ACCOUNT_LIST', data)
    return data
  },

  async socket_accountBalanceUpdate({ commit }, data) {
    commit('SET_ACCOUNT', pick(data, 'seq', 'balance'))
  },
}
