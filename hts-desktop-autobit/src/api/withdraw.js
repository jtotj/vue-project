import request from '@/utils/request';
import _ from 'lodash';

export function fetchList(params) {
  return request({
    url: '/api/withdraw',
    method: 'get',
    params,
  });
}

export function fetchWithdraw(withdraw_srl) {
  return request({
    url: `/api/withdraw/${withdraw_srl}`,
    method: 'get',
  });
}

export function cancelWithdraw(withdraw_srl) {
  return request({
    url: `/api/withdraw/${withdraw_srl}`,
    method: 'put',
    data: {
        type: 'CANCEL',
    },
  });
}

export function createWithdraw(data) {
  data = _.extend({}, data, {
    bank: '이더리움',
  });

  return request({
    url: '/api/withdraw',
    method: 'post',
    data
  })
}
