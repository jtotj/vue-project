import { fetchFinanceFundList } from '@apis/finance'

export const state = {
  funds: [],
}
export const mutations = {
  SET_FUND_LIST(state, newValue) {
    state.funds = newValue
  },
}

export const actions = {
  async getFunds({ commit }) {
    const { data } = await fetchFinanceFundList({
      no_paging: 1,
    })
    commit('SET_FUND_LIST', data)
    return data
  },
}
