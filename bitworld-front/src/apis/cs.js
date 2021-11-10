import request from '@utils/request'

// CS 문의 유형 목록
export function fetchTicketTypes() {
  return request({
    url: `/cs/ticket/type`,
    method: 'get',
  })
}

// CS 문의 유형 정보 조회
export function fetchTicketType(type_seq) {
  return request({
    url: `/cs/ticket/type/${type_seq || 0}`,
    method: 'get',
  })
}

// 회원 자신의 CS문의 요청 목록
export function fetchTicketList(params) {
  return request({
    url: '/cs/ticket',
    method: 'get',
    params,
  })
}

// CS 문의 요청 등록
export function createTicket(data) {
  return request({
    url: `/cs/ticket`,
    method: 'post',
    data,
  })
}

// CS 문의 요청 정보 조회
export function fetchTicket(ticket_seq, ticket_token) {
  return request({
    url: `/cs/ticket/${ticket_seq}`,
    method: 'get',
    params: {
      ticket_token,
    },
  })
}

// CS 문의 요청 기타 정보 수정
export function closedTicket(ticket_seq, ticket_token) {
  return request({
    url: `/cs/ticket/${ticket_seq}`,
    method: 'patch',
    params: {
      ticket_token,
    },
    data: {
      type: 'SET_CLOSED',
    },
  })
}

// CS 문의 비회원 인증 토큰 발급
export function createTicketToken(data) {
  return request({
    url: `/cs/ticket/auth/token`,
    method: 'post',
    data,
  })
}

// CS FAQ 유형 목록
export function fetchFaqTypes() {
  return request({
    url: `/cs/faq/type`,
    method: 'get',
  })
}

// CS FAQ 유형 정보 조회
export function fetchFaqType(faq_seq) {
  return request({
    url: `/cs/faq/type/${faq_seq || 0}`,
    method: 'get',
  })
}

// CS FAQ 목록
export function fetchFaqList(params) {
  return request({
    url: '/cs/faq',
    method: 'get',
    params,
  })
}

// CS FAQ 요청 정보 조회
export function fetchFaq(faq_seq) {
  return request({
    url: `/cs/faq/${faq_seq}`,
    method: 'get',
  })
}
