declare namespace Req {
    export interface RequestConfig {
        url: string
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
        data?: any
        params?: Record<string, any>
        headers?: Record<string, string>
        timeout?: number
        baseURL?: string
        dataType?: string
        responseType?: string
        [key: string]: any;
    }

    // 上传文件配置接口
    export interface UploadConfig {
        url: string
        filePath: string
        name: string
        header?: Record<string, any>
        formData?: Record<string, any>
        timeout?: number
        [key: string]: any;
    }

    // 下载文件配置接口
    export interface DownloadConfig {
        url: string
        header?: Record<string, any>
        timeout?: number
        [key: string]: any;
    }

    // 响应数据接口
    export interface ResponseData<T = any> {
        code: number
        msg: string
        data: T
        [key: string]: any
    }
    export interface pageData<T = any> {
        total: number
        list: T[]
        current_page: number
        last_page: number
        per_page: number
        total: number
        [key: string]: any
    }

    export interface StreamConfig {
        url: string
        data?: any
        headers?: Record<string, string>
        timeout?: number
        baseURL?: string
        onChunk: (chunk: string) => void
        onDone?: () => void
        onError?: (error: any) => void
        onCancel?: () => void
    }
}