import http from "@/core/request";

export const statsApi = {
  index: "/stats/index",
  roseChart: "/stats/roseChart",
  lineChart: "/stats/lineChart",
  metrics: "/stats/metrics",
  detail: "/stats/detail",
  select: "/stats/select",
};

export function index(params) {
  return http.request({
    url: statsApi.index,
    method: "get",
    params,
  });
}

export function roseChart(params) {
  return http.request({
    url: statsApi.roseChart,
    method: "get",
    params,
  });
}

export function lineChart(params) {
  return http.request({
    url: statsApi.lineChart,
    method: "get",
    params,
  });
}

export function metrics(params) {
  return http.request({
    url: statsApi.metrics,
    method: "get",
    params,
  });
}