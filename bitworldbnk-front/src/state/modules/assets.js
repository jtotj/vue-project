import { fetchAssets } from '@apis/asset'
import Vue from 'vue'

export const state = {
  assets: {},
}
export const mutations = {
  SET_ASSET_LIST(state, newValue) {
    state.assets = newValue
  },
}

export const actions = {
  init({ dispatch }) {
    dispatch('getAssets').catch((e) => Vue.toasted.error(e.message))
  },
  async getAssets({ commit }) {
    const { data } = await fetchAssets()

    commit('SET_ASSET_LIST', data)
    return data
  },
}
