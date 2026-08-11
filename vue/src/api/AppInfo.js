import http from "@/core/request";

export const appinfoApi = {
  index: "/appinfo/index",
  add: "/appinfo/add",
  remove: "/appinfo/delete",
  update: "/appinfo/update",
  detail: "/appinfo/detail",
  select: "/appinfo/select",
};

export function index(params) {
  return http.request({
    url: appinfoApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: appinfoApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: appinfoApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: appinfoApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: appinfoApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: appinfoApi.select,
    method: "get",
    params,
  });
}
