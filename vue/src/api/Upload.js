import http from '@/core/request'
import axios from 'axios'
export const uploadApi = {
    getConfig: '/upload/get_config',
    image: 'upload/image',
    params: 'upload/params',
    callback: 'upload/callback'
}

export function image(data) {
    return http.request({
        url: uploadApi.image,
        method: 'post',
        data
    })
}


export function getConfig() {
    return http.request({
        url: uploadApi.getConfig,
        method: "get"
    })
}

export function getParams(params) {
    return http.request({
        url: uploadApi.params,
        method: 'get',
        params
    })
}
export function UploadCallback(data) {
    return http.request({
        url: uploadApi.callback,
        method: 'post',
        data
    })
}

/**
 * 七牛文件上传
 * @param {*} data 文件信息
 * @param {*} conifg 七牛相关配置
 */
export function qiniu(data, config) {
    return new Promise(async (resolve, reject) => {
        let params = await getParams(config);
        data.append('key', params.data.key);
        data.append('token', params.data.token);
        const file = data.get('file');
        data.append('fileName', file.name);
        let res = await axios.request({
            url: config.url,
            method: 'post',
            data,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        if (!res.data) {
            reject(file.name + '上传失败');
        }
        let addData = {
            savename: res.data.key,
            sha1: res.data.hash,
            name: file.name,
            size: file.size,
            storage: config.gateways,
            group_id: data.get('group_id')
        }
        resolve(UploadCallback(addData));
    })
}

export function aliyun(data, config) {
    return new Promise(async (resolve, reject) => {

        const file = data.get('file');
        const group_id = data.get('group_id');
        const reader = new FileReader();
        const contentType = file.type || 'multipart/form-data';
        const params = await getParams({ ...config, contentType });
        reader.readAsArrayBuffer(file)
        reader.onload = async function (e) {
            let fileData = e.target.result
            let res = await axios.put(params.data.url, fileData, {
                headers: {
                    "Content-Type": contentType,
                    "Content-Length": file.size
                }
            })
            if (res.status !== 200) {
                reject(file.name + '上传失败');
            }
            let addData = {
                savename: params.data.key,
                sha1: '',
                name: file.name,
                size: file.size,
                storage: config.gateways,
                group_id
            }
            resolve(UploadCallback(addData));
        }
        reader.onerror = () => {
            reject(file.name + '文件读取失败');
        }
    })

}

export function qcloud(data, config) {
    return new Promise(async (resolve, reject) => {
        const file = data.get('file');
        const group_id = data.get('group_id');
        const reader = new FileReader();
        const contentType = file.type || 'multipart/form-data';
        const params = await getParams({ ...config, contentType });
        reader.readAsArrayBuffer(file)
        reader.onload = async function (e) {
            let fileData = e.target.result
            let res = await axios.put(params.data.url, fileData,{
                headers: {
                    "Content-Type": contentType
                }
            })
            if (res.status !== 200) {
                reject(file.name + '上传失败')
            }
            let addData = {
                savename: params.data.key,
                sha1: '',
                name: file.name,
                size: file.size,
                storage: config.gateways,
                group_id
            }
            resolve(UploadCallback(addData));
        }
        reader.onerror = () => {
            reject(file.name + '文件读取失败');
        }
    })
}

/**
 * 统一上传接口
 * data 文件上传信息
 * config 
 */
export function upload(data, config) {
    if (config.gateways == 'local') {
        return image(data);
    }

    if (config.gateways == 'qiniu') {
        return qiniu(data, config);
    }

    if (config.gateways == 'aliyun') {
        return aliyun(data, config);
    }

    if (config.gateways == 'qcloud') {
        return qcloud(data, config);
    }
}

