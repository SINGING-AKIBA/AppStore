import http from "@/core/request";

export const settingsApi = {
  index: "/settings/index",
  add: "/settings/add",
  remove: "/settings/delete",
  update: "/settings/update",
  detail: "/settings/detail",
  select: "/settings/select",
};

export function index(params) {
  return http.request({
    url: settingsApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: settingsApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: settingsApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: settingsApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: settingsApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: settingsApi.select,
    method: "get",
    params,
  });
}
