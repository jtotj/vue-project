import request from '@utils/request'

export function fetchDepositList(params) {
  return request({
    url: '/deposit',
    method: 'get',
    params,
  })
}

export function fetchDeposit(deposit_seq) {
  return request.get(`/deposit/${deposit_seq || 0}`)
}

export function createDeposit(data) {
  return request({
    url: `/deposit`,
    method: 'post',
    data,
  })
}

export function cancelDeposit(deposit_seq) {
  return request({
    url: `/deposit/${deposit_seq}`,
    method: 'patch',
    data: {
      type: 'SET_CANCELED',
    },
  })
}
