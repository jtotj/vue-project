import request from '@utils/request'

export function fetchWithdrawList(params) {
  return request({
    url: '/withdraw',
    method: 'get',
    params,
  })
}

export function fetchWithdraw(withdraw_seq) {
  return request.get(`/withdraw/${withdraw_seq || 0}`)
}

export function createWithdraw(data) {
  return request({
    url: `/withdraw`,
    method: 'post',
    data,
  })
}

export function cancelWithdraw(withdraw_seq) {
  return request({
    url: `/withdraw/${withdraw_seq}`,
    method: 'patch',
    data: {
      type: 'SET_CANCELED',
    },
  })
}
