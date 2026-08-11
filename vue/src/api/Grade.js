import http from "@/core/request";

export const gradeApi = {
  index: "/grade/index",
  add: "/grade/add",
  remove: "/grade/delete",
  update: "/grade/update",
  detail: "/grade/detail",
  select: "/grade/select",
};

export function index(params) {
  return http.request({
    url: gradeApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: gradeApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: gradeApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: gradeApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: gradeApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: gradeApi.select,
    method: "get",
    params,
  });
}
