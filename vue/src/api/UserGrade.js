import http from "@/core/request";

export const usergradeApi = {
  index: "/usergrade/index",
  add: "/usergrade/add",
  remove: "/usergrade/delete",
  update: "/usergrade/update",
  detail: "/usergrade/detail",
  select: "/usergrade/select",
};

export function index(params) {
  return http.request({
    url: usergradeApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: usergradeApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: usergradeApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: usergradeApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: usergradeApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: usergradeApi.select,
    method: "get",
    params,
  });
}
