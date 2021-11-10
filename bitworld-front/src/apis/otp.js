import request from '@utils/request'

export function fetchOtps() {
  return request({
    url: '/otp',
    method: 'get',
  })
}

export function createOtp(token, secret) {
  return request({
    url: `/otp`,
    method: 'post',
    data: {
      token,
      secret,
    },
  })
}
export function fetchOtp(otp_seq) {
  return request({
    url: `/otp/${otp_seq}`,
    method: 'get',
  })
}

export function deleteOtp(otp_seq, token) {
  return request({
    url: `/otp/${otp_seq}`,
    method: 'delete',
    data: {
      token,
    },
  })
}
