import http from "@/core/request";
const userApi = {
    index: "/admin/index",
    info: "/admin/info",
    settings: "/admin/settings",
    update: "/admin/update",
    remove: "/admin/delete",
    add: "/admin/save",
    roles: "/admin/roles",
}

export function index(params){
    return http.request({
        url: userApi.index,
        method: 'get',
        params
    })
}

export function settings(data){
    return http.request({
        url: userApi.settings,
        method: 'post',
        data
    })
}

export function update(data)
{
    return http.request({
        url: userApi.update,
        method: 'post',
        data
    })
}

export function remove(data)
{
    return http.request({
        url: userApi.remove,
        method: 'post',
        data
    })
}

export function add(data)
{
    return http.request({
        url: userApi.add,
        method: 'post',
        data
    })
}

export function roles()
{
    return http.request({
        url: userApi.roles,
        method: 'get',
    })
}
