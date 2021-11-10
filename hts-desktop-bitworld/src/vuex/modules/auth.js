const state = {
  logged_info: {},
  otps: 0,
}

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const mutations = {
  logged_info(state, logged_info) {

    state.logged_info = logged_info;
  },
  SET_LOGGED_INFO(state, logged_info) {

    state.logged_info = logged_info;
  },
  SET_OTPS(state, otps) {
    state.otps = otps;
  }
}

export default {
  state,
  mutations
}
