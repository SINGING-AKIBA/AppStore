import request from "@/smile/service/request"

export const settingsApi = {
  appStoreLogo: "/settings/app-store-logo",
}

export function getAppStoreLogo() {
  return request.get(settingsApi.appStoreLogo)
}
