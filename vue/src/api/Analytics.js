import http from "@/core/request";

const baseUrl = "/analytics";

function get(url, params) {
  return http.request({
    url: baseUrl + url,
    method: "get",
    params,
  });
}

export function overview(params) {
  return get("/overview", params);
}

export function trend(params) {
  return get("/trend", params);
}

export function appRanking(params) {
  return get("/app-ranking", params);
}

export function searchKeywords(params) {
  return get("/search-keywords", params);
}

export function sourceStats(params) {
  return get("/source-stats", params);
}
