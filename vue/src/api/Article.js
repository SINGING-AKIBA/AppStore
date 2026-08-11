import http from "@/core/request";

export const articleApi = {
  index: "/article/index",
  add: "/article/add",
  remove: "/article/delete",
  update: "/article/update",
  detail: "/article/detail",
  select: "/article/select",
};

export function index(params) {
  return http.request({
    url: articleApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: articleApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: articleApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: articleApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: articleApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: articleApi.select,
    method: "get",
    params,
  });
}
