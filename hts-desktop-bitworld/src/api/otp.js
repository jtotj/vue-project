import request from '@/utils/request';

export function fetchOtps() {
  return request({
    url: '/api/otp',
    method: 'get',
  });
}

export function createOtp(token, secret) {
  return request({
    url: `/api/otp`,
    method: 'post',
    data: {
      token,
      secret,
    }
  });
}

export function deleteOtp(otp_srl, token) {
  return request({
    url: `/api/otp/${otp_srl}`,
    method: 'delete',
    data: {
      token,
    }
  });
}
