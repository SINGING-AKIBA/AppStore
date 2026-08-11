import http from "@/core/request";

export const indexApi = {
    index: '/index/index',
    history: '/index/history',
    statistics: '/statistics/index',
    detail: '/statistics/detail',
    exportData: '/statistics/exportData',
    getAll: '/statistics/getAll',
    exportPdfFromXls:'/statistics/exportPdfFromXls'
}
export function index(params) {
    return http.request({
        url: indexApi.index,
        method: 'get',
        params
    })
}

export function history(params) {
    return http.request({
        url: indexApi.history,
        method: 'get',
        params
    })
}

export function statistics(params) {
    return http.request({
        url: indexApi.statistics,
        method: 'get',
        params
    })
}

export function detail(params) {
    return http.request({
        url: indexApi.detail,
        method: 'get',
        params
    })
}

export function exportData(params) {
    return http.request({
        url: indexApi.exportData,
        method: 'get',
        params
    })
}

export function getAll(params) {
    return http.request({
        url: indexApi.getAll,
        method: 'get',
        params
    })
}
export function exportPdfFromXls(formData){
    return http.request({
        url: indexApi.exportPdfFromXls,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}