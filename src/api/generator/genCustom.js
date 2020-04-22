import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/genCustom',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/genCustom/' + id,
    method: 'delete'
  })
}
export function get(id) {
  return request({
    url: 'api/genCustom/get/' + id,
    method: 'get'
  })
}
export function delAll(ids) {
  return request({
    url: 'api/genCustom/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/genCustom',
    method: 'put',
    data
  })
}

export function queryData(data) {
  return request({
    url: 'api/genCustom/queryData',
    method: 'put',
    data
  })
}

export function delData(data) {
  return request({
    url: 'api/genCustom/delData',
    method: 'put',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/genCustom/save',
    method: 'put',
    data
  })
}

export function generate(data) {
  return request({
    url: 'api/genCustom/generate',
    method: 'put',
    data
  })
}

export default { add, edit, del, delAll }
