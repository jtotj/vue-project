import request from '@/utils/request';

export function fetchSetting(target) {
  return request({
    url: `/api/setting/${target}`,
    method: 'get',
  });
}
