import _ from 'lodash';
const state = {
  future_balances: [],
}

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const mutations = {
  future_balances(state, future_balances) {

    state.future_balances = future_balances;
  },

  set_member_future_balances(state, { member_srl, future_balances }) {

    state.future_balances = _.remove([].concat(state.future_balances), (future) => { return future.member_srl != member_srl });
    state.future_balances = state.future_balances.concat(future_balances);
  },
}

export default {
  state,
  mutations
}
