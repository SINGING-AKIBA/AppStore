import http from "@/core/request";

export const userApi = {
  index: "/user/index",
  add: "/user/add",
  remove: "/user/delete",
  update: "/user/update",
  detail: "/user/detail",
  select: "/user/select",
};

export function index(params) {
  return http.request({
    url: userApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: userApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: userApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: userApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: userApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: userApi.select,
    method: "get",
    params,
  });
}
