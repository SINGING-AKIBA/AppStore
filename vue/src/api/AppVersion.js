import http from "@/core/request";

export const appversionApi = {
  index: "/appversion/index",
  add: "/appversion/add",
  remove: "/appversion/delete",
  update: "/appversion/update",
  detail: "/appversion/detail",
  select: "/appversion/select",
};

export function index(params) {
  return http.request({
    url: appversionApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: appversionApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: appversionApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: appversionApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: appversionApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: appversionApi.select,
    method: "get",
    params,
  });
}
