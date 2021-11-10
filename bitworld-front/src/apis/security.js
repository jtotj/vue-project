import request from '@utils/request'

export function fetchLevels(params) {
  return request({
    url: `/security/level`,
    params,
  })
}

export function fetchLevel(seq) {
  return request({
    url: `/security/level/${seq || 0}`,
    method: 'get',
  })
}

export function fetchLevelConditions(level_seq) {
  return request({
    url: `/security/level/${level_seq || 0}/condition`,
  })
}

export function fetchLevelCondition(level_seq, seq) {
  return request({
    url: `/security/level/${level_seq || 0}/condition/${seq || 0}`,
    method: 'get',
  })
}

export function fetchRestrictions(params) {
  return request({
    url: `/security/restriction`,
    params,
  })
}

export function fetchRestriction(seq) {
  return request({
    url: `/security/restriction/${seq || 0}`,
    method: 'get',
  })
}

export function fetchRestrictionTargets(restriction_seq) {
  return request({
    url: `/security/restriction/${restriction_seq || 0}/target`,
  })
}

export function fetchRestrictionTarget(restriction_seq, seq) {
  return request({
    url: `/security/restriction/${restriction_seq || 0}/target/${seq || 0}`,
    method: 'get',
  })
}
