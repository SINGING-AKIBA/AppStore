import http from '@/core/request'

export const environment = {
  index: '/environment/index',
}
export function index () {
    return http.request({
      url: environment.index,
      method: 'post',
    })
}

