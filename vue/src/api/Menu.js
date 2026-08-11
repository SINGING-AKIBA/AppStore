import http from '@/core/request'

export const api = {
  'index': 'menu/index',
  'add': 'menu/save',
  'edit': 'menu/update',
  'del': 'menu/delete',
  'detail': 'menu/detail',
  'remove': 'menu/delete'
}
export function list () {
    return http.request({
      url: api.index,
      method: 'get',
    })
}

export function index() {
  return http.request({
      url: api.index,
      method: 'get',
      params:{list:true}
  })
}

export function add(data) {
  return http.request({
      url: api.add,
      method: 'post',
      data
  })
}

export function edit(data) {
  return http.request({
      url: api.edit,
      method: 'post',
      data
  })
}

export function del(data) {
  return http.request({
      url: api.del,
      method: 'post',
      data
  })
}

export function detail(params) {
  return http.request({
      url: api.detail,
      method: 'get',
      params
  })
}
export function remove(data){
  return http.request({
      url: api.remove,
      method: 'post',
      data
  })
}
