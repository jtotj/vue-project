import { fetchAssets } from '@apis/asset'
import reject from 'lodash/reject'
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
    let pull_data = reject(data, (asset) => {
      return asset.code === 'GCC' || asset.code === 'XRPP'
    })

    commit('SET_ASSET_LIST', pull_data)
    return data
  },
}
