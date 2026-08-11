import http from '@/core/request'

const userApi = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  UserInfo: '/auth/info',
  UserMenu: '/auth/nav'
}

export function login (parameter) {
  return http.request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return http.request({
    url: userApi.UserInfo,
    method: 'get',
  })
}

export function getCurrentUserNav () {
  return http.request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return http.request({
    url: userApi.Logout,
    method: 'post',
  })
}

