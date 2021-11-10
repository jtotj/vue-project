import request from '@utils/request'

export function fetchMerchantList(params) {
  return request({
    url: `/pg/merchant`,
    methods: 'get',
    params,
  })
}

export function createMerchant(data) {
  return request.post('/pg/merchant', data)
}

export function authenticateTransaction(data) {
  return request.post('/pg/transaction/authenticate', data)
}

export function fetchMerchant(merchant_seq_or_id) {
  return request.get(`/pg/merchant/${merchant_seq_or_id || 0}`)
}

export function updateMerchant({ merchant_seq, ...data }) {
  return request.put(`/pg/merchant/${merchant_seq || 0}`, data)
}

export function fetchMerchantAccountList(merchant_seq) {
  return request({
    url: `/pg/merchant/${merchant_seq}/account`,
    methods: 'get',
  })
}

export function createMerchantAccount({ merchant_seq, ...data }) {
  return request.post(`/pg/merchant/${merchant_seq}/account`, data)
}

export function deleteMerchantAccount({ merchant_seq, merchant_account_seq }) {
  return request.delete(
    `/pg/merchant/${merchant_seq}/account/${merchant_account_seq}`
  )
}

export function fetchMerchantTransactionList(merchant_seq, params) {
  return request({
    url: `/pg/merchant/${merchant_seq || 0}/transaction`,
    method: 'get',
    params,
  })
}
export function fetchTransactionList() {
  return request.get(`/pg/transaction`)
}
export function approveTransaction(data) {
  return request({
    url: `/pg/transaction`,
    method: 'post',
    data,
  })
}

export function fetchXptxToken(seq) {
  return request({
    url: `/pg/xptx/token/${seq}`,
    method: 'get',
  })
}

export function createXptxToken(data) {
  return request({
    url: `/pg/xptx/token`,
    method: 'post',
    data,
  })
}
