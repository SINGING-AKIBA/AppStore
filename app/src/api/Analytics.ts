import request from "@/smile/service/request"

export function collectAnalytics(data: Record<string, any>) {
  return request.request({
    url: "/analytics/collect",
    method: "POST",
    data,
  })
}
