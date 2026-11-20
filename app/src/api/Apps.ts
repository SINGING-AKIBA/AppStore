import request from "@/smile/service/request"

export const appApi = {
  index: "/appinfo/index",
  info: "/appinfo/detail",
};

export function list(params: any = {}) {
  return request.get(appApi.index, params)
}

export function info(params: any) {
  return request.get(appApi.info, params)
}
