import http from "@/core/request";

export const appscreenshotApi = {
  index: "/appscreenshot/index",
  add: "/appscreenshot/add",
  remove: "/appscreenshot/delete",
  update: "/appscreenshot/update",
  detail: "/appscreenshot/detail",
  select: "/appscreenshot/select",
};

export function index(params) {
  return http.request({
    url: appscreenshotApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: appscreenshotApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: appscreenshotApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: appscreenshotApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: appscreenshotApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: appscreenshotApi.select,
    method: "get",
    params,
  });
}
