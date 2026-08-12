import request from "@/smile/service/request"

export const userApi = {
  info: "/apps/info",
};
export function info(params:any) {
  return request.get(userApi.info, params)
}