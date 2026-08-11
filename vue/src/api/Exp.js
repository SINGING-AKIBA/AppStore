import http from "@/core/request";

export const expApi = {
  index: "/exp/index",
  add: "/exp/add",
  remove: "/exp/delete",
  update: "/exp/update",
  detail: "/exp/detail",
  select: "/exp/select",
};

export function index(params) {
  return http.request({
    url: expApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: expApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: expApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: expApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: expApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: expApi.select,
    method: "get",
    params,
  });
}

export function importData(data) {
  return http.request({
    url: "/exp/import",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
