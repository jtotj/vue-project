const state = {
  open: false,
  type: 'alert',
  message: '',
  closed_by_user: false,
  callback: function() {}
}

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const mutations = {
  modal(state, payload) {
    state.open = payload.open;
    state.type = payload.type || 'alert';
    state.message = payload.message || '';
    state.closed_by_user = payload.closed_by_user || false;
    state.callback = payload.callback || function() {};
  }
}

export default {
  state,
  mutations
}
