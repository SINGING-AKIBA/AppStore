import http from "@/core/request";

export const smsrecordsApi = {
  index: "/smsrecords/index",
  add: "/smsrecords/add",
  remove: "/smsrecords/delete",
  update: "/smsrecords/update",
  detail: "/smsrecords/detail",
  select: "/smsrecords/select",
};

export function index(params) {
  return http.request({
    url: smsrecordsApi.index,
    method: "get",
    params,
  });
}

export function detail(params) {
  return http.request({
    url: smsrecordsApi.detail,
    method: "get",
    params,
  });
}
export function add(data) {
  return http.request({
    url: smsrecordsApi.add,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: smsrecordsApi.remove,
    method: "post",
    data,
  });
}
export function update(data) {
  return http.request({
    url: smsrecordsApi.update,
    method: "post",
    data,
  });
}

export function select(params) {
  return http.request({
    url: smsrecordsApi.select,
    method: "get",
    params,
  });
}
