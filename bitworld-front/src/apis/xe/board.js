import request from '@utils/xerequest'
import { ztime } from '@utils/xe-func'

export function fetchDocumentList(data) {
  return request('board.dispBoardContentList', { data }).then((ret_obj) => {
    ret_obj.document_list = ret_obj.document_list.map((val) => ({
      ...val,
      last_update: new Date(ztime(val.last_update) * 1000),
      regdate: new Date(ztime(val.regdate) * 1000),
    }))

    return ret_obj
  })
}

export function fetchCocofxDocumentList(data) {
  return request({
    url: 'board.dispBoardContentList',
    baseURL: 'https://cocofx.com',
    data: data,
  }).then((ret_obj) => {
    ret_obj.document_list = ret_obj.document_list.map((val) => ({
      ...val,
      last_update: new Date(ztime(val.last_update) * 1000),
      regdate: new Date(ztime(val.regdate) * 1000),
    }))

    return ret_obj
  })
}
