import request from '@/utils/request';

export function fetchLogList(params) {
  return request({
    url: '/api/coupon/log',
    method: 'get',
    params,
  });
}

export function applyCouponCode(data) {
  return request({
    url: `/api/coupon`,
    method: 'post',
    data,
  });
}
