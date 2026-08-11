import http from "@/core/request";

export const uploadsgroupApi = {
  index: "/uploadsgroup/index",
  add: "/uploadsgroup/add",
  remove: "/uploadsgroup/delete",
  update: "/uploadsgroup/update",
  detail: "/uploadsgroup/detail",
  select: "/uploadsgroup/select",
};

export function index(params) {
  return http.request({
    url: uploadsgroupApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: uploadsgroupApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: uploadsgroupApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: uploadsgroupApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: uploadsgroupApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: uploadsgroupApi.select,
    method: "get",
    params,
  });
}
