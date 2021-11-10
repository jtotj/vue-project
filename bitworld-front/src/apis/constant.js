import request from '@utils/request'

export function fetchConstants() {
  return request.get('/constant')
}
