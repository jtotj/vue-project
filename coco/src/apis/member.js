import request from '@utils/request'

export function createMember(data) {
  return request.post('/member', data)
}

export function fetchMember(member_seq) {
  return request.get(`/member/${member_seq}`)
}

export function fetchSelf() {
  return request.get('/member/me')
}
export function updateMember(data) {
  return request.put(`/member/me`, data)
}

export function deleteMember(data) {
  return request({
    url: `/member/me`,
    method: 'delete',
    data,
  })
}

export function updateMemberPassword(data) {
  return request({
    url: `/member/me`,
    method: 'patch',
    data: {
      ...data,
      type: 'UPDATE_PASSWORD',
    },
  })
}

export function updateMemberEmail(data) {
  return request({
    url: `/member/me`,
    method: 'patch',
    data: {
      ...data,
      type: 'UPDATE_EMAIL_ADDRESS',
    },
  })
}

export function findMemberId(data) {
  return request({
    url: `/member/find/id`,
    method: 'post',
    data,
  })
}

export function findMemberPassword(data) {
  return request({
    url: '/member/find/password',
    method: 'post',
    data,
  })
}
export function findMemberPasswordToken(data) {
  return request({
    url: '/member/find/password/token',
    method: 'post',
    data,
  })
}
export function validateMemberParameter(params) {
  return request({
    url: '/member/parameter/validation',
    method: 'get',
    params,
  })
}

export function fetchInviteRelation(params) {
  return request({
    url: '/member/me/invite-relation',
    method: 'get',
    params,
  })
}
export function fetchXploginToken(seq) {
  return request({
    url: `/member/xplogin/token/${seq}`,
    method: 'get',
  })
}

export function createXploginToken() {
  return request({
    url: '/member/xplogin/token',
    method: 'post',
  })
}
