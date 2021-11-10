import request from '@utils/request'

export function fetchCertificationTypes() {
  return request({
    url: `/kyc/certification/type`,
    method: 'get',
  })
}

export function fetchCertificationType(seq) {
  return request({
    url: `/kyc/certification/type/${seq || 0}`,
    method: 'get',
  })
}

export function fetchCertificationList(params) {
  return request({
    url: '/kyc/certification',
    method: 'get',
    params,
  })
}

export function fetchCertification(certification_seq) {
  return request.get(`/kyc/certification/${certification_seq || 0}`)
}

export function createCertification(data) {
  return request({
    url: `/kyc/certification`,
    method: 'post',
    data,
  })
}

export function cancelCertification(certification_seq) {
  return request({
    url: `/kyc/certification/${certification_seq}`,
    method: 'patch',
    data: {
      type: 'SET_CANCELED',
    },
  })
}

export function fetchRealnameList(params) {
  return request({
    url: '/kyc/realname',
    method: 'get',
    params,
  })
}

export function fetchRealname(realname_seq) {
  return request.get(`/kyc/realname/${realname_seq || 0}`)
}

export function realnamePrepare() {
  return request({
    url: `/kyc/realname/process/prepare`,
    method: 'post',
  })
}

export function createRealname(data) {
  return request({
    url: '/kyc/realname',
    method: 'post',
    data,
  })
}

export function fetchWithdrawAddressList(params) {
  return request({
    url: `/kyc/asset/withdraw/address/certification`,
    method: 'get',
    params,
  })
}
export function createWithdrawAddress(data) {
  return request({
    url: '/kyc/asset/withdraw/address/certification',
    method: 'post',
    data,
  })
}
export function fetchWithdrawAddress(certification_seq) {
  return request.get(
    `/kyc/asset/withdraw/address/certification/${certification_seq || 0}`
  )
}
export function deleteWithdrawAddress(certification_seq) {
  return request.delete(
    `/kyc/asset/withdraw/address/certification/${certification_seq || 0}`
  )
}
