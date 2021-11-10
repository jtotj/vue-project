import request from '@utils/request'

export function fetchPrivateApplications(params) {
  return request({
    url: `/market/private/application`,
    method: 'get',
    params,
  })
}

export function createPrivateApplication(data) {
  return request({
    url: `/market/private/application`,
    method: 'post',
    data,
  })
}

export function fetchPrivateApplication(seq) {
  return request({
    url: `/market/private/application/${seq}`,
    method: 'get',
  })
}

export function confirmPrivateApplication(seq) {
  return request({
    url: `/market/private/application/${seq}`,
    method: 'patch',
    data: {
      type: 'SET_CONFIRMED',
    },
  })
}
export function rejectPrivateApplication(seq) {
  return request({
    url: `/market/private/application/${seq}`,
    method: 'patch',
    data: {
      type: 'SET_REJECTED',
    },
  })
}

export function cancelPrivateApplication(seq) {
  return request({
    url: `/market/private/application/${seq}`,
    method: 'patch',
    data: {
      type: 'SET_CANCELED',
    },
  })
}

export function payPrivateApplication(seq) {
  return request({
    url: `/market/private/application/${seq}`,
    method: 'patch',
    data: {
      type: 'SET_PAYED',
    },
  })
}
