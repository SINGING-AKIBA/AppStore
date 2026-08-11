import http from "@/core/request";

export const oauthApi = {
  index: "/oauth/index",
  add: "/oauth/add",
  remove: "/oauth/delete",
  update: "/oauth/update",
  detail: "/oauth/detail",
  select: "/oauth/select",
};

export function index(params) {
  return http.request({
    url: oauthApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: oauthApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: oauthApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: oauthApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: oauthApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: oauthApi.select,
    method: "get",
    params,
  });
}
