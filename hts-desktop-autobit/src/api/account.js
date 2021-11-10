import request from '@/utils/request';

export function fetchAccounts() {
  return request({
    url: '/api/account',
    method: 'get',
  });
}

export function updateAccountLeverage(account_srl, leverage) {
  return request({
    url: `/api/account/${account_srl}`,
    method: 'put',
    data: {
      type: 'SET_LEVERAGE',
      leverage,
    }
  });
}
