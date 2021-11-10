import request from '@/utils/request';

export function fetchList(params) {
  return request({
    url: '/api/deposit',
    method: 'get',
    params,
  });
}

export function fetchDeposit(deposit_srl) {
  return request({
    url: `/api/deposit/${deposit_srl}`,
    method: 'get',
  });
}

export function setTxid(deposit_srl, txid) {
  return request({
    url: `/api/deposit/${deposit_srl}`,
    method: 'put',
    data: {
        type: 'UPDATE',
        txid,
    },
  });
}

export function cancelDeposit(deposit_srl) {
  return request({
    url: `/api/deposit/${deposit_srl}`,
    method: 'put',
    data: {
        type: 'CANCEL',
    },
  });
}

export function createDeposit(data) {

  return request({
    url: '/api/deposit',
    method: 'post',
    data
  })
}

export function createDepositPgCocofx(data) {

  return request({
    url: '/api/deposit/pg/cocofx',
    method: 'post',
    data
  })
}

export function approveDepositPgCocofx(deposit_srl, data) {

  return request({
    url: `/api/deposit/${deposit_srl}/pg/cocofx`,
    method: 'patch',
    data
  })

}
