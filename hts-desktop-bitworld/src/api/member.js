import request from '@/utils/request';

export function fetchConfig() {
  return request({
    url: `/api/member/config`,
    method: 'get',
  });
}

export function fetchInviteeList(params) {
  return request({
    url: '/api/member/invitee',
    method: 'get',
    params,
  });
}

export function createMember(data) {
  return request({
    url: `/api/member`,
    method: 'post',
    data,
  });
}

export function updateMemberPassword(data) {
  return request({
    url: `/api/member`,
    method: 'put',
    data: {
      ...data,
      type: 'CHANGE_PASSWORD',
    }
  });
}
