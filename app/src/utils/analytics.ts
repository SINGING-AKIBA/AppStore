import { collectAnalytics } from "@/api/Analytics"

type AnalyticsEventType = "page_view" | "app_detail_view" | "app_search" | "app_download_click"

type AnalyticsInput = {
  event_type: AnalyticsEventType
  app_info_id?: number
  keyword?: string
  result_count?: number
  page_path?: string
}

const VISITOR_KEY = "appstore_analytics_visitor_id"
const SESSION_KEY = "appstore_analytics_session_id"
const SESSION_ACTIVITY_KEY = "appstore_analytics_session_activity"
const SESSION_TIMEOUT = 30 * 60 * 1000

function createId(prefix: string) {
  return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 14)
}

function readStorage(key: string) {
  try {
    return uni.getStorageSync(key)
  } catch {
    return ""
  }
}

function writeStorage(key: string, value: string | number) {
  try {
    uni.setStorageSync(key, value)
  } catch {
    // Analytics is best-effort and must never block app navigation.
  }
}

function getIdentity() {
  let visitorId = String(readStorage(VISITOR_KEY) || "")
  if (!visitorId) {
    visitorId = createId("visitor")
    writeStorage(VISITOR_KEY, visitorId)
  }

  const now = Date.now()
  const lastActivity = Number(readStorage(SESSION_ACTIVITY_KEY) || 0)
  let sessionId = String(readStorage(SESSION_KEY) || "")
  if (!sessionId || !lastActivity || now - lastActivity > SESSION_TIMEOUT) {
    sessionId = createId("session")
    writeStorage(SESSION_KEY, sessionId)
  }
  writeStorage(SESSION_ACTIVITY_KEY, now)

  return { visitorId, sessionId }
}

function getReferrerHost() {
  // #ifdef H5
  try {
    if (typeof document !== "undefined" && document.referrer) {
      return new URL(document.referrer).hostname.slice(0, 255)
    }
  } catch {
    return ""
  }
  // #endif
  return ""
}

function getSource(referrer: string) {
  let launchQuery: Record<string, any> = {}
  try {
    launchQuery = uni.getLaunchOptionsSync?.()?.query || {}
  } catch {
    launchQuery = {}
  }

  const from = String(launchQuery.from || launchQuery.utm_source || "").toLowerCase()
  if (["share", "friend", "qr", "wechat"].includes(from)) return "share"
  if (!referrer) return "direct"
  if (/(baidu|google|bing|yahoo|duckduckgo|yandex)\./i.test(referrer)) return "search"
  return "external"
}

export function trackAnalytics(input: AnalyticsInput) {
  try {
    const identity = getIdentity()
    const system = uni.getSystemInfoSync()
    const referrer = getReferrerHost()
    const appId = Number(input.app_info_id)
    const payload: Record<string, any> = {
      event_id: createId("evt"),
      event_type: input.event_type,
      visitor_id: identity.visitorId,
      session_id: identity.sessionId,
      platform: String(system.uniPlatform || system.platform || "unknown").toLowerCase().slice(0, 32),
      device_type: String(system.platform || system.deviceType || "unknown").toLowerCase().slice(0, 32),
      source: getSource(referrer),
      page_path: input.page_path || "",
      referrer,
    }

    if (Number.isInteger(appId) && appId > 0) payload.app_info_id = appId
    if (input.keyword) payload.keyword = input.keyword.slice(0, 200)
    if (Number.isInteger(input.result_count) && Number(input.result_count) >= 0) {
      payload.result_count = Number(input.result_count)
    }

    collectAnalytics(payload).catch((error) => {
      console.debug("[AppStore Analytics] 事件上报失败:", error)
    })
  } catch (error) {
    console.debug("[AppStore Analytics] 事件采集不可用:", error)
  }
}
