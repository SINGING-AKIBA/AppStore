import http from "@/core/request";

export const rulesApi = {
  index: "/rules/index",
  add: "/rules/add",
  remove: "/rules/delete",
  update: "/rules/update",
  detail: "/rules/detail",
  select: "/rules/select",
};

export function index(params) {
  return http.request({
    url: rulesApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: rulesApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: rulesApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: rulesApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: rulesApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: rulesApi.select,
    method: "get",
    params,
  });
}
