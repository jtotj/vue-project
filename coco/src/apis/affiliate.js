import request from '@utils/request'

export function fetchAffiliateLog(params) {
  return request({
    url: '/affiliate/log',
    method: 'get',
    params,
  })
}

export function fetchAffiliateBalance(params) {
  return request({
    url: '/affiliate/balance',
    method: 'get',
    params,
  })
}

export function fetchAffiliateAdjust(params) {
  return request({
    url: '/affiliate/adjust',
    method: 'get',
    params,
  })
}

export function createAdjust(data) {
  return request.post('/affiliate/adjust', data)
}
