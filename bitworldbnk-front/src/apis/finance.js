import request from '@utils/request'

export function fetchFinanceInstrumentList(params) {
  return request({
    url: '/finance/instrument',
    method: 'get',
    params,
  })
}

export function fetchFinanceBalance(params) {
  return request({
    url: '/finance/balance',
    method: 'get',
    params,
  })
}

export function fetchFinanceAdjust(params) {
  return request({
    url: `/finance/adjust`,
    method: 'get',
    params,
  })
}

export function createFinanceAdjust(data) {
  return request({
    url: '/finance/adjust',
    method: 'post',
    data,
  })
}

export function fetchFinanceInstrument(instrument_seq) {
  return request({
    url: `/finance/instrument/${instrument_seq}`,
    method: 'get',
  })
}

export function fetchFinanceInstrumentContractDocumentList(instrument_seq) {
  return request({
    url: `/finance/instrument/${instrument_seq}/contract-document`,
    method: 'get',
  })
}
export function fetchFinanceInstrumentDivearnList(instrument_seq) {
  return request({
    url: `/finance/instrument/${instrument_seq}/divearn`,
    method: 'get',
  })
}

export function createFinanceFund(data) {
  return request({
    url: '/finance/fund',
    method: 'post',
    data,
  })
}

export function fetchFinanceFundList(params) {
  return request({
    url: '/finance/fund',
    method: 'get',
    params,
  })
}

export function fetchFinanceFund(fund_seq) {
  return request({
    url: `/finance/fund/${fund_seq}`,
    method: 'get',
  })
}

export function createFinanceReturn(data) {
  return request({
    url: '/finance/return',
    method: 'post',
    data,
  })
}

export function fetchFinanceReturnList(params) {
  return request({
    url: '/finance/return',
    method: 'get',
    params,
  })
}

export function fetchFinanceReturn(return_seq) {
  return request({
    url: `/finance/return/${return_seq}`,
    method: 'get',
  })
}

export function createFinanceDividend(data) {
  return request({
    url: '/finance/dividend',
    method: 'post',
    data,
  })
}

export function fetchFinanceDividendList(params) {
  return request({
    url: '/finance/dividend',
    method: 'get',
    params,
  })
}

export function fetchFinanceDividend(dividend_seq) {
  return request({
    url: `/finance/dividend/${dividend_seq}`,
    method: 'get',
  })
}
