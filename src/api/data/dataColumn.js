import request from '@/utils/request'
import qs from 'qs'

export function getColumns(params) {
  return request({
    url: 'api/dataColumn' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/dataColumn',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'api/dataColumn/',
    method: 'delete',
    data
  })
}
export function delAll(ids) {
  return request({
    url: 'api/dataColumn/deleteAll/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dataColumn',
    method: 'put',
    data
  })
}

export default { getColumns, add, edit, del, delAll }
