import request from '@utils/request'

export function fetchServiceConfig() {
  return request.get(`/config/service`)
}

export function fetchMemberConfig() {
  return request.get(`/config/member`)
}

export function fetchKycConfig() {
  return request.get(`/config/kyc`)
}

export function fetchOtpConfig() {
  return request.get(`/config/otp`)
}
