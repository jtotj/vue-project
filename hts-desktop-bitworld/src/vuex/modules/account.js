
const state = {
  setting: {},
  accounts: [],
  s_account_srl: null,
}

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const mutations = {
  accounts(state, accounts) {

    state.accounts = accounts;
  },

  set_account_srl(state, account_srl) {
    state.s_account_srl = account_srl;
  },
  SET_ACCOUNT_SETTING(state, setting) {
    state.setting = setting;
  }
}

export default {
  state,
  mutations
}
