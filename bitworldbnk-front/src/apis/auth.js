import request from '@utils/request'

export function createToken(user_id, password, otp_token) {
  return request.post('/auth/token', {
    user_id,
    password,
    otp_token,
  })
}

export function refreshToken() {
  return request.post('/auth/token/refresh')
}
