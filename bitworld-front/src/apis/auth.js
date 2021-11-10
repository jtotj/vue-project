import request from '@utils/request'

export function createToken(login_type, user_id, password, otp_token) {
  return request.post('/auth/token', {
    login_type,
    user_id,
    password,
    otp_token,
  })
}

export function refreshToken() {
  return request.post('/auth/token/refresh')
}
