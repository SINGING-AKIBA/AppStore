import http from "@/core/request";
const api = {
    index: '/roles/get_all_roles',
    add: '/roles/add',
    edit: '/roles/edit',
    del: '/roles/delete',
    permissions: '/roles/get_permissions_for_user',
}

export function index (params) {
    return http.request({
        url: api.index,
        method: 'get',
        params
    })
}

export function add (data) {
    return http.request({
        url: api.add,
        method: 'post',
        data
    })
}

export function remove (name) {
    return http.request({
        url: api.del,
        method: 'post',
        data: {
            name
        }
    })
} 

export function edit (data) {
    return http.request({
        url: api.edit,
        method: 'post',
        data
    })
}

export function permissions (data) {
    return http.request({
        url: api.permissions,
        method: 'post',
        data
    })
}