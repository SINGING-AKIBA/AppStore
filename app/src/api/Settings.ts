import request from "@/smile/service/request"

export const settingsApi = {
  appStoreLogo: "/settings/app-store-logo",
  appStoreBranding: "/settings/app-store-branding",
}

export function getAppStoreLogo() {
  return request.get(settingsApi.appStoreLogo)
}

export function getAppStoreBranding() {
  return request.get(settingsApi.appStoreBranding)
}
