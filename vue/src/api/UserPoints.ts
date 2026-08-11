import http from "@/core/request";

export const userpointsApi = {
  index: "/userpoints/index",
  add: "/userpoints/add",
  remove: "/userpoints/delete",
  update: "/userpoints/update",
  detail: "/userpoints/detail",
  select: "/userpoints/select",
};

export function index(params) {
  return http.request({
    url: userpointsApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: userpointsApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: userpointsApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: userpointsApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: userpointsApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: userpointsApi.select,
    method: "get",
    params,
  });
}
