import request from '@utils/request'

export function fetchPrivateDeals(params) {
  return request({
    url: `/market/private/deal`,
    method: 'get',
    params,
  })
}

export function createPrivateDeal(data) {
  return request({
    url: `/market/private/deal`,
    method: 'post',
    data,
  })
}

export function fetchPrivateDeal(seq) {
  return request({
    url: `/market/private/deal/${seq}`,
    method: 'get',
  })
}

export function cancelPrivateDeal(seq) {
  return request({
    url: `/market/private/deal/${seq}`,
    method: 'patch',
    data: {
      type: 'SET_CANCELED',
    },
  })
}
