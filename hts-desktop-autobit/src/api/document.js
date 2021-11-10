import request from '@/utils/request';

export function fetchList(mid, params) {
  return request({
    url: `/api/document/${mid}`,
    method: 'get',
    params,
  });
}

export function fetchNoticeList(mid) {
  return request({
    url: `/api/document/${mid}/notice`,
    method: 'get',
  });
}

export function fetchCategoryList(mid, params) {
  return request({
    url: `/api/document/${mid}/category`,
    method: 'get',
  });
}

export function fetchCommentList(mid, document_srl) {
  return request({
    url: `/api/document/${mid}/${document_srl}/comment`,
    method: 'get',
  });
}

export function fetchDocument(mid, document_srl) {
  return request({
    url: `/api/document/${mid}/${document_srl}`,
    method: 'get',
  });
}

export function createDocument(mid, data) {
  return request({
    url: `/api/document/${mid}`,
    method: 'post',
    data,
  });
}
