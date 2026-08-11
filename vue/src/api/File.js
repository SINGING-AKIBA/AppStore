import request from '@/core/request'
export const fileApi = {
    index: '/file/index',
    group: '/file/group',
    addGroup: '/file/add_group',
    delGroup: '/file/del_group',
    delFile: '/file/del_file',
    moveFile: '/file/move_file',
    editFile: '/file/edit_file',
}


export function index(params) {
    return request.get(fileApi.index,params);
}

export function group(params){
    return request.get(fileApi.group,params);
}

export function addGroup(data){
    return request.post(fileApi.addGroup,data);
}

export function delGroup(data){
    return request.post(fileApi.delGroup,data);
}

export function remove(data){
    return request.post(fileApi.delFile,data)
}

//移动文件
export function moveFile(data){
    return request.post(fileApi.moveFile,data);
}

export function editFile(data){
    return request.post(fileApi.editFile,data)
}