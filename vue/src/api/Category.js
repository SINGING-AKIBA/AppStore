import http from "@/core/request";

export const categoryApi = {
  index: "/category/index",
  add: "/category/add",
  remove: "/category/delete",
  update: "/category/update",
  detail: "/category/detail",
  select: "/category/select",
};

export function index(params) {
  return http.request({
    url: categoryApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: categoryApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: categoryApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: categoryApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: categoryApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: categoryApi.select,
    method: "get",
    params,
  });
}
