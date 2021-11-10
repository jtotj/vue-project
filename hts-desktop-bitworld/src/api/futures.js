import request from '@/utils/request';

export function fetchFutures(params) {
    return request({
        url: '/api/future',
        method: 'get',
        params
    });
}
export function fetchFutureBalance(params) {
  return request({
    url: '/api/future/balance',
    method: 'get',
    params
  })
}
