import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/dataEntity',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/dataEntity/' + id,
    method: 'delete'
  })
}
export function delAll(ids) {
  return request({
    url: 'api/dataEntity/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dataEntity',
    method: 'put',
    data
  })
}

export function syncDatabase(data) {
  return request({
    url: 'api/dataEntity/syncDatabase',
    method: 'put',
    data
  })
}

export function queryData(data) {
  return request({
    url: 'api/dataEntity/queryData',
    method: 'put',
    data
  })
}

export function queryTableList() {
  return request({
    url: 'api/dataEntity/queryTableList/',
    method: 'get'
  })
}

export default { add, edit, del, delAll, queryData }
