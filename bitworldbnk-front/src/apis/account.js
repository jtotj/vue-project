import request from '@utils/request'

export function fetchList(params) {
  return request({
    url: '/account',
    method: 'get',
    params,
  })
}

export function fetchAccount(params) {
  return request({
    url: `/account/${params.account_seq_or_number || 0}`,
    method: 'get',
    params,
  })
}

export function createAccount(data) {
  return request.post('/account', data)
}

export function updateAccount({ account_seq, ...data }) {
  return request.put(`/account/${account_seq || 0}`, data)
}

export function deleteAccount(account_seq) {
  return request.delete(`/account/${account_seq || 0}`)
}

export function fetchAccountTransferList(params) {
  return request({
    url: '/account/transfer',
    method: 'get',
    params,
  })
}

export function createAccountTransfer(data) {
  return request.post('/account/transfer', data)
}

export function fetchAccountTransfer(transfer_seq) {
  return request.get(`/account/transfer/${transfer_seq || 0}`)
}

export function fetchAccountBalanceLogList(params) {
  return request({
    url: `/account/${params.account_seq || 0}/balance-log`,
    method: 'get',
    params,
  })
}
