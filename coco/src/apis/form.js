import request from '@utils/request'

export function fetchPrivateDealForm(params) {
  return request({
    url: `/market/private/${params.market_seq}/form`,
    method: 'get',
    params,
  })
}

export function fetchAssetForm(params) {
  return request({
    url: `/asset/${params.asset_seq}/form`,
    method: 'get',
    params,
  })
}

// CS 관련 추가 입력 양식
export function fetchCsTicketTypeForm(params) {
  return request({
    url: `/kyc/certification/type/${params.type_seq}/form`,
    method: 'get',
    params,
  })
}

export function fetchKycCertificationTypeForm(params) {
  return request({
    url: `/kyc/certification/type/${params.type_seq}/form`,
    method: 'get',
    params,
  })
}

export function deleteFormFieldFile(data) {
  return request({
    url: `/form/field/file/${data.file_seq}`,
    method: 'delete',
    data,
  })
}
