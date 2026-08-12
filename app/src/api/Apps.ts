import request from "@/smile/service/request"

export const userApi = {
  info: "/appInfo/detail",
};
export function info(params:any) {
  return request.get(userApi.info, params)
}