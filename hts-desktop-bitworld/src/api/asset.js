import request from '@/utils/request';

export function fetchStatistic() {
  return request({
    url: '/api/asset/statistic',
    method: 'get',
  });
}

export function fetchAssetStatistic(asset) {
  return request({
    url: `/api/asset/${asset}/statistic`,
    method: 'get',
  });
}

export function fetchPremium() {
  return request({
    url: '/api/asset/last',
    method: 'get',
  });
}

export function fetchAssetPremium(asset) {
  return request({
    url: `/api/asset/${asset}/last`,
    method: 'get',
  });
}

export function fetchOrderbook(asset) {
  return request({
    url: `/api/asset/${asset}/orderbook`,
    method: 'get',
  });
}

export function fetchLinkbook(asset) {
  return request({
    url: `/api/asset/${asset}/linkbook`,
    method: 'get',
  });
}

export function fetchOhlcList(asset, { interval, from, to, limit }) {
  return request({
    url: `/api/asset/${asset}/log`,
    method: 'get',
    params: { interval, from, to, limit },
  })
}
