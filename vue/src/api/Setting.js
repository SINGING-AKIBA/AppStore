import http from "@/core/request";

export const settingsApi = {
    getSettings: '/settings/detail',
    setSettings: '/settings/save',
}

export function getSettings(data) {
    return http.request({
        url: settingsApi.getSettings,
        method: 'post',
        data
    })
}

export function setSettings(data) {
    return http.request({
        url: settingsApi.setSettings,
        method: 'post',
        data
    })
}

