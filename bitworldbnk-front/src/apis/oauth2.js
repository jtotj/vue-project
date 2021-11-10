import request from '@utils/request'

export function fetchClient(seq) {
  return request({
    url: `/oauth2/client/${seq || 0}`,
    method: 'get',
  })
}

export function createAuthorization(data) {
  return request.post('/oauth2/authorize', data)
}
