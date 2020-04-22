import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/genModuleConfig',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/genModuleConfig/' + id,
    method: 'delete'
  })
}
export function delAll(ids) {
  return request({
    url: 'api/genModuleConfig/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/genModuleConfig',
    method: 'put',
    data
  })
}

export default { add, edit, del, delAll }
