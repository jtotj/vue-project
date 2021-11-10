import request from '@utils/request'

export function fetchVerificationList(params) {
  return request({
    url: '/mail/verification',
    method: 'get',
    params,
  })
}

export function fetchVerification(verification_seq) {
  return request.get(`/mail/verification/${verification_seq || 0}`)
}

export function createVerification(data) {
  return request({
    url: `/mail/verification`,
    method: 'post',
    data,
  })
}

export function createVerificationToken(data) {
  return request({
    url: `/mail/verification/token`,
    method: 'post',
    data,
  })
}
