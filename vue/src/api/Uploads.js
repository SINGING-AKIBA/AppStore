import http from "@/core/request";

export const uploadsApi = {
  index: "/uploads/index",
  add: "/uploads/add",
  remove: "/uploads/delete",
  update: "/uploads/update",
  detail: "/uploads/detail",
  select: "/uploads/select",
};

export function index(params) {
  return http.request({
    url: uploadsApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: uploadsApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: uploadsApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: uploadsApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: uploadsApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: uploadsApi.select,
    method: "get",
    params,
  });
}
