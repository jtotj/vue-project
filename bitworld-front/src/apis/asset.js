import request from '@utils/request'

export function fetchAssets() {
  return request({
    url: `/asset`,
    method: 'get',
  })
}

export function fetchAsset(asset_seq) {
  return request({
    url: `/asset/${asset_seq || 0}`,
    method: 'get',
  })
}

export function fetchAssetWithdrawFees(asset_seq) {
  return request({
    url: `/asset/${asset_seq || 0}/withdraw-fee`,
    method: 'get',
  })
}
