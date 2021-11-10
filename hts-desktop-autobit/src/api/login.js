import request from '@/utils/request';

export function loginByUserId(user_id, password, otp_token, loginkey) {
  return request({
    url: '/api/session',
    method: 'post',
    data: { user_id, password, otp_token, loginkey },
  });
}

export function getUserInfo() {
  return request({
    url: '/api/session',
    method: 'get',
  });
}

export function logout() {
  return request({
    url: '/api/session',
    method: 'delete',
  });
}
