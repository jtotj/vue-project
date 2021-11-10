import request from '@utils/request'

export function fetchAddressList(params) {
  return request({
    url: '/account/address',
    method: 'get',
    params,
  })
}

export function createAddress(data) {
  return request({
    url: '/account/address',
    method: 'post',
    data,
  })
}
export function fetchAddress(address_seq) {
  return request({
    url: `/account/address/${address_seq}`,
    method: 'get',
  })
}
