import request from '@utils/request'

export function fetchPrivateMarkets() {
  return request({
    url: '/market/private',
    method: 'get',
  })
}

export function fetchPrivateMarket(market_seq) {
  return request.get(`/market/private/${market_seq || 0}`)
}

export function fetchDirectMarkets() {
  return request({
    url: '/market/direct',
    method: 'get',
  })
}
export function fetchDirectTransfers(params) {
  return request({
    url: '/market/direct/transfer',
    method: 'get',
    params,
  })
}

export function createDirectTransfer(data) {
  return request({
    url: `/market/direct/transfer`,
    method: 'post',
    data,
  })
}

export function fetchDirectTransfer(transfer_seq) {
  return request({
    url: `/market/direct/transfer/${transfer_seq}`,
    method: 'get',
  })
}

export function fetchPublicMarket(market_seq) {
  return request.get(`/market/public/${market_seq || 0}`)
}

export function fetchPublicMarkets() {
  return request({
    url: '/market/public',
    method: 'get',
  })
}

export function fetchPublicTickers(params) {
  return request({
    url: '/market/public/ticker',
    method: 'get',
    params,
  })
}

export function createPublicOrder(data) {
  return request({
    url: `/market/public/order`,
    method: 'post',
    data,
  })
}

export function fetchPublicKlines(params) {
  return request({
    url: '/market/public/kline',
    method: 'get',
    params,
  })
}

export function fetchPublicAggtrades(params) {
  return request({
    url: '/market/public/aggtrade',
    method: 'get',
    params,
  })
}

export function fetchPublicOrderbooks(params) {
  return request({
    url: '/market/public/orderbook',
    method: 'get',
    params,
  })
}

export function fetchPublicOpenOrders(params) {
  return request({
    url: '/market/public/order',
    method: 'get',
    params,
  })
}
export function fetchPublicTradeList(params) {
  return request({
    url: '/market/public/trade',
    method: 'get',
    params,
  })
}
export function fetchPublicBalanceList(params) {
  return request({
    url: '/market/public/balance',
    method: 'get',
    params,
  })
}
export function fetchPublicBalanceTransferList(params) {
  return request({
    url: '/market/public/balance-transfer',
    method: 'get',
    params,
  })
}
export function fetchPublicBalanceTransfer(transfer_seq) {
  return request.get(`/market/public/balance-transfer/${transfer_seq || 0}`)
}

export function createPublicBalanceTransfer(data) {
  return request({
    url: `/market/public/balance-transfer`,
    method: 'post',
    data,
  })
}

export function cancelPublicMarketOrder(order_seq) {
  return request({
    url: `/market/public/order/${order_seq}`,
    method: 'patch',
    data: {
      type: 'SET_CANCELED',
    },
  })
}
