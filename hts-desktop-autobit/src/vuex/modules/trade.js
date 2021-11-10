import _ from 'lodash';
const state = {
  unclosed_trades: [],
}

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const mutations = {
  unclosed_trades(state, unclosed_trades) {

    state.unclosed_trades = unclosed_trades;
  },

  close_trades(state, trade_srls) {

    state.unclosed_trades = _.remove([].concat(state.unclosed_trades), (trade) => { return !~trade_srls.indexOf(trade.trade_srl) });
  },

  set_linked_trades(state, trade_srls) {
    state.unclosed_trades = _.map(state.unclosed_trades, (trade) => {
      if(!~trade_srls.indexOf(trade.trade_srl)) return trade;

      trade.status = 'LINKED';

      return trade;
    });
  },

  update_trade(state, { trade_srl, data }) {
    var trade_info = _.find(state.unclosed_trades, { trade_srl });

    _.extend(trade_info, data);
  },

  add_trades(state, trades) {

    state.unclosed_trades = state.unclosed_trades.concat(trades);
  }
}

export default {
  state,
  mutations
}
