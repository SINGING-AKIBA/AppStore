import http from "@/core/request";

export const queueApi = {
  index: "/queue/index",
  jobs: "/queue/jobs",
  add: "/queue/add",
  update: "/queue/update",
  remove: "/queue/remove",
  pause: "/queue/pause",
  resume: "/queue/resume",
  clean: "/queue/clean",
  retry: "/queue/retry",
  progress: "/queue/progress",
};

export function index(params) {
  return http.request({
    url: queueApi.index,
    method: "get",
    params,
  });
}

export function jobs(params) {
  return http.request({
    url: queueApi.jobs,
    method: "get",
    params,
  });
}

export function add(data) {
  return http.request({
    url: queueApi.add,
    method: "post",
    data,
  });
}

export function update(data) {
  return http.request({
    url: queueApi.update,
    method: "post",
    data,
  });
}

export function remove(data) {
  return http.request({
    url: queueApi.remove,
    method: "post",
    data,
  });
}

export function pause(data) {
  return http.request({
    url: queueApi.pause,
    method: "post",
    data,
  });
}

export function resume(data) {
  return http.request({
    url: queueApi.resume,
    method: "post",
    data,
  });
}

export function clean(data) {
  return http.request({
    url: queueApi.clean,
    method: "post",
    data,
  });
}

export function retry(data) {
  return http.request({
    url: queueApi.retry,
    method: "post",
    data,
  });
}

export function progress(params) {
  return http.request({
    url: queueApi.progress,
    method: "get",
    params,
  });
}
