import { createToken, refreshToken } from '@apis/auth'
import { fetchSelf } from '@apis/member'
import * as auth from '@utils/auth'
import { fetchOtps } from '@apis/otp'
import Vue from 'vue'
import sio from '@src/sio'
import dispatchActionForAllModules from '@utils/dispatch-action-for-all-modules'

export const state = {
  currentUser: getSavedState('currentUser'),
  access_token: auth.getToken(),
  otps: [],
}

sio.on('connect', () => {
  const token = auth.getToken()

  if (token) sio.emit('authenticate', { token })
})

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('currentUser', newValue)
  },
  SET_ACCESS_TOKEN(state, newValue) {
    state.access_token = newValue
    auth.setToken(newValue)
  },
  SET_OTPS(state, newValue) {
    state.otps = newValue
  },
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  async init({ state, dispatch, getters }) {
    // setDefaultAuthHeaders(state)
    await dispatch('validate')
    if (!getters['loggedIn']) return

    dispatchActionForAllModules('loggedInInit')

    await Promise.all([
      dispatch('getOtps').catch((e) => Vue.toasted.error(e.message)),
      dispatch('account/getAccounts', null, { root: true }).catch((e) =>
        Vue.toasted.error(e.message)
      ),
      dispatch('finance/getFunds', null, { root: true }).catch((e) =>
        Vue.toasted.error(e.message)
      ),
    ])
  },

  // Logs in the current user.
  async logIn({ commit, dispatch }, { username, password, otp_token } = {}) {
    const { token, otp_token_required } = await createToken(
      username,
      password,
      otp_token
    )

    if (otp_token_required)
      return {
        otp_token_required,
      }

    commit('SET_ACCESS_TOKEN', token)

    // 소켓 인증
    sio.emit('authenticate', { token })

    dispatchActionForAllModules('loggedInInit')

    Promise.all([
      dispatch('getOtps'),
      dispatch('account/getAccounts', null, {
        root: true,
      }),
      dispatch('finance/getFunds', null, { root: true }).then(() =>
        dispatch('getUserInfo')
      ),
    ]).catch((e) => Vue.toasted.error(e.message))
  },
  async getOtps({ commit }) {
    const { data } = await fetchOtps()
    commit('SET_OTPS', data)
  },

  // Logs out the current user.
  async logOut({ commit }) {
    auth.removeToken()
    commit('SET_CURRENT_USER', null)
    commit(
      'account/SET_ACCOUNT_LIST',
      {},
      {
        root: true,
      }
    )
    commit('SET_OTPS', [])
  },

  async refreshToken({ commit, dispatch }) {
    try {
      const { token } = await refreshToken()

      commit('SET_ACCESS_TOKEN', token)

      return dispatch('getUserInfo')
    } catch (e) {
      await dispatch('logOut')

      throw e
    }
  },

  async getUserInfo({ commit }) {
    const { member_info } = await fetchSelf()

    commit('SET_CURRENT_USER', member_info)

    return member_info
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  async validate({ commit, state }) {
    if (!state.currentUser) return Promise.resolve(null)

    try {
      const { member_info } = await fetchSelf()
      commit('SET_CURRENT_USER', member_info)
      return member_info
    } catch (e) {
      commit('SET_CURRENT_USER', null)
      return null
    }
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}
