import request from '@/utils/request';
import _ from 'lodash';
import store from '@/vuex/store'

export function fetchUnclosedTrades() {
  return request({
    url: '/api/trade',
    method: 'get',
    params: {
      no_paging: 1,
    },
  });
}

export function fetchHistory(params) {
  if(store.state.common.trade_method === 'MARGIN') {
    params = _.chain(params).defaults({ page: 1 }).extend({ status: ['CLEARED', 'CANCELD'] }).value();

  }else if(store.state.common.trade_method === 'FUTURES') {
    params = _.chain(params).defaults({ page: 1 }).extend({ status: ['CLEARED', 'CANCELD', 'LINKED'] }).value();
  }

  return request({
    url: '/api/trade',
    method: 'get',
    params
  })
}

export function createTrade(data) {
  return request({
    url: '/api/trade',
    method: 'post',
    data: data,
  });
}

export function cancelTrade(trade_srl) {
  return request({
    url: `/api/trade/${trade_srl}`,
    method: 'put',
    data: { type: 'CANCEL' },
  });
}

export function clearTrade(trade_srl) {
  return request({
    url: `/api/trade/${trade_srl}`,
    method: 'put',
    data: { type: 'CLEAR' },
  });
}

export function setAutoClear(trade_srl, auto_clear_tick) {
  return request({
    url: `/api/trade/${trade_srl}`,
    method: 'put',
    data: { type: 'AUTO_CLEAR', use_auto_clear: 'Y', trade_srl, auto_clear_tick },
  });
}

export function unsetAutoClear(trade_srl) {
  return request({
    url: `/api/trade/${trade_srl}`,
    method: 'put',
    data: { type: 'AUTO_CLEAR', use_auto_clear: 'N', trade_srl },
  });
}
export function clearFutureBalance(data) {
  return request({
    url: '/api/trade',
    method: 'post',
    data
  })
}
