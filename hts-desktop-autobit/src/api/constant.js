import request from '@/utils/request';

export function fetch() {
  return request({
    url: `/api/constant`,
    method: 'get',
  });
}
